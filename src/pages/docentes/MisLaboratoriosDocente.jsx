import React, { useState, useEffect } from 'react';
import DocenteLayout from '../../layouts/DocenteLayout';
import LaboratorioCard from '../../components/UI/docente/LaboratorioCard';
import ModalCrearTarjetaLaboratorio from '../../components/modals/docente/ModalCrearTarjetaLaboratorio';
import { CrearTarjetaLaboratorio, EliminarLabService , ActualizarEstado } from '../../services/docente/CrearTarjetaLabService';
import { PlusCircle, FlaskConical, AlertTriangle, X } from 'lucide-react'; 
import { useModal } from '../../context/ModalContext';
import style from './MisLaboratoriosDocente.module.css';

import { useNavigate } from 'react-router-dom';

function MisLaboratoriosDocente() {
  const [laboratorios, setLaboratorios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [plantillas, setPlantillas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showModal } = useModal(); 
  
  const [idLabAEliminar, setIdLabAEliminar] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate(); // 2. Inicializa el navegador

  // 1. Carga de datos iniciales desde el servidor
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [dataCategorias, dataPlantillas, dataMisLabs] = await Promise.all([
          CrearTarjetaLaboratorio.obtenerCategorias(),
          CrearTarjetaLaboratorio.obtenerPlantillasBase(),
          CrearTarjetaLaboratorio.obtenerMisLaboratorios()
        ]);

        // PASO 1: Llenamos los estados de los selectores primero
        setCategorias(Array.isArray(dataCategorias) ? dataCategorias : dataCategorias.results || []);
        setPlantillas(Array.isArray(dataPlantillas) ? dataPlantillas : dataPlantillas.results || []);
        
        // PASO 2: Inyectamos los laboratorios del docente
        const labsFinales = Array.isArray(dataMisLabs) ? dataMisLabs : dataMisLabs.results || [];
        setLaboratorios(labsFinales);

      } catch (error) {
        showModal('error', 'Error al cargar datos del servidor.');
      } finally {
        // PASO 3: Apagamos el loading al final de todo
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleCrearLaboratorio = () => {
    setIsModalOpen(true);
  };

  // 2. Creación del laboratorio adaptada a los nuevos campos de la base de datos
  const handleConfirmarCreacion = async (plantillaModificada) => {
    try {
      // Extraemos de forma limpia los campos que envía el formulario del modal
      const { id, titulo_lab, grado, jornada } = plantillaModificada;

      // Enviamos las 4 variables estructuradas al servicio unificado con fetch
      const respuestaServidor = await CrearTarjetaLaboratorio.crearInstancia(
        id, 
        titulo_lab,
        grado,
        jornada
      );
      
      const nuevaTarjetaReal = respuestaServidor.data || respuestaServidor;

      // Añadimos el nuevo laboratorio al estado local para pintarlo de inmediato
      setLaboratorios(prevLabs => [...prevLabs, nuevaTarjetaReal]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al crear la instancia del laboratorio:", error);
      
      // Cierra el modal inmediatamente para desbloquear la pantalla
      setIsModalOpen(false);
      
      // Muestra la alerta de error sobre la interfaz limpia
      showModal('error', 'No se pudo crear la copia del laboratorio. Verifica los parámetros del backend.');
    }
  };

  const handleIngresar = (id) => {
    navigate(`/profesor/mis-laboratorios/configurar/${id}`);
  };

  const handleEliminar = (id) => {
    setIdLabAEliminar(id);
  };

  const confirmarEliminacionReal = async () => {
    if (!idLabAEliminar || isDeleting) return;

    try {
      setIsDeleting(true); 
      await EliminarLabService.eliminarInstancia(idLabAEliminar);
      setLaboratorios((prevLabs) => prevLabs.filter((lab) => lab.id !== idLabAEliminar));
      
      setIdLabAEliminar(null);
      showModal('success', `¡Laboratorio eliminado correctamente!`);
    } catch (error) {
      showModal('error', 'Hubo un error al intentar eliminar el laboratorio. Inténtalo de nuevo');
      setIdLabAEliminar(null); 
    } finally {
      setIsDeleting(false); 
    }
  };

  // 3. Cambio de estado con Actualización Optimista y Animación Nativa
  const handleToggleEstado = async (id) => {
    const laboratorioActual = laboratorios.find(lab => lab.id === id);
    if (!laboratorioActual) return;

    const esActivoActualmente = laboratorioActual.estado === true || laboratorioActual.estado === 'activo';
    const nuevoEstadoBooleano = !esActivoActualmente;

    // Cambia la interfaz al milisegundo de presionar el switch
    const aplicarCambioVisual = (estadoAAsignar) => {
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          setLaboratorios(prevLabs => prevLabs.map(lab => 
            lab.id === id ? { ...lab, estado: estadoAAsignar } : lab
          ));
        });
      } else {
        setLaboratorios(prevLabs => prevLabs.map(lab => 
          lab.id === id ? { ...lab, estado: estadoAAsignar } : lab
        ));
      }
    };

    aplicarCambioVisual(nuevoEstadoBooleano);

    try {
      // Petición en segundo plano enviando el booleano que Django espera
      await ActualizarEstado(id, nuevoEstadoBooleano);
    } catch (error) {
      console.error("No se pudo guardar el estado en el servidor:", error);
      
      // Si la red falla, revertimos el switch de inmediato a su posición original
      aplicarCambioVisual(esActivoActualmente);
      showModal('error', 'No se pudo guardar el cambio de estado en el servidor. Intenta nuevamente.');
    }
  };

  // Renderizado del layout base durante la carga inicial
  if (loading) {
    return (
      <DocenteLayout>
        <div className={style.pageContainer}>
          <p>Cargando laboratorios...</p>
        </div>
      </DocenteLayout>
    );
  }

  return (
    <DocenteLayout>
      <div className={style.pageContainer}>
        
        <header className={style.header}>
          <h2 className={style.pageTitle}>Mis Laboratorios</h2>
          <button 
            className={style.createButton}
            onClick={handleCrearLaboratorio}
          >
            <PlusCircle size={20} />
            Crear Laboratorio
          </button>
        </header>

        <main className={laboratorios.length > 0 ? style.gridContainer : style.emptyContainer}>
          {laboratorios.length > 0 ? (
            // Si el array ya tiene las tarjetas guardadas, las lista ordenadas de inmediato
            [...laboratorios]
              .sort((a, b) => {
                const aActivo = a.estado === true || a.estado === 'activo';
                const bActivo = b.estado === true || b.estado === 'activo';

                if (aActivo && !bActivo) return -1;
                if (!aActivo && bActivo) return 1;

                return b.id - a.id; 
              })
              .map((lab) => (
                <div key={lab.id} style={{ viewTransitionName: `card-${lab.id}` }}>
                  <LaboratorioCard 
                    laboratorio={lab} 
                    onIngresar={handleIngresar}
                    onEliminar={handleEliminar}
                    onToggleEstado={handleToggleEstado}
                    esArchivado={false}
                  />
                </div>
              ))
          ) : (
            // ÚNICAMENTE si loading ya es false Y el array está en cero, se muestra este mensaje
            <div className={style.emptyStateCard}>
              <div className={style.emptyIconBadge}>
                <FlaskConical size={40} />
              </div>
              <h3>¡Comienza tu primera aventura científica!</h3>
              <p>Aún no has diseñado laboratorios para tus alumnos. Crea un experimento web interactivo usando el botón superior.</p>
            </div>
          )}
        </main>

        <ModalCrearTarjetaLaboratorio 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmarCreacion}
          categorias={categorias}
          plantillasRaw={plantillas}
        />

        {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
        {idLabAEliminar && (
          <div className={style.overlay} onClick={!isDeleting ? () => setIdLabAEliminar(null) : undefined}>
            <div className={style.modalConfirm} onClick={(e) => e.stopPropagation()}>
              
              <button 
                className={style.closeBtn} 
                onClick={() => setIdLabAEliminar(null)}
                disabled={isDeleting}
              >
                <X size={20} />
              </button>

              <div className={style.iconContainerWarning}>
                <AlertTriangle color="#FFBC11" size={50} />
              </div>
              
              <h3 className={style.modalTitle}>¿Estás completamente seguro?</h3>
              <p className={style.modalMessage}>
                Esta acción eliminará el laboratorio por completo del sistema y no se puede deshacer.
              </p>
              
              <div className={style.modalActions}>
                <button 
                  className={style.cancelBtn} 
                  onClick={() => setIdLabAEliminar(null)}
                  disabled={isDeleting}
                >
                  Cancelar
                </button>
                <button 
                  className={style.deleteConfirmBtn} 
                  onClick={confirmarEliminacionReal}
                  disabled={isDeleting}
                  style={{ 
                    opacity: isDeleting ? 0.6 : 1, 
                    cursor: isDeleting ? 'not-allowed' : 'pointer' 
                  }}
                >
                  {isDeleting ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </DocenteLayout>
  );
}

export default MisLaboratoriosDocente;