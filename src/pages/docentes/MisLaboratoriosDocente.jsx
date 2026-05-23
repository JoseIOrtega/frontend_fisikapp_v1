import React, { useState, useEffect } from 'react';
import DocenteLayout from '../../layouts/DocenteLayout';
import LaboratorioCard from '../../components/UI/docente/LaboratorioCard';
import ModalCrearTarjetaLaboratorio from '../../components/modals/docente/ModalCrearTarjetaLaboratorio';
import { CrearTarjetaLaboratorio, EliminarLabService , ActualizarEstado } from '../../services/docente/CrearTarjetaLabService';
import { PlusCircle, FlaskConical, AlertTriangle, X } from 'lucide-react'; 
import { useModal } from '../../context/ModalContext';
import style from './MisLaboratoriosDocente.module.css';

function MisLaboratoriosDocente() {
  const [laboratorios, setLaboratorios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [plantillas, setPlantillas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showModal } = useModal(); 
  
  const [idLabAEliminar, setIdLabAEliminar] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

        setCategorias(Array.isArray(dataCategorias) ? dataCategorias : dataCategorias.results || []);
        setPlantillas(Array.isArray(dataPlantillas) ? dataPlantillas : dataPlantillas.results || []);
        setLaboratorios(Array.isArray(dataMisLabs) ? dataMisLabs : dataMisLabs.results || []);

      } catch (error) {
        showModal('error', 'Error al cargar datos del servidor.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleCrearLaboratorio = () => {
    setIsModalOpen(true);
  };

  // Extraemos la propiedad .data que responde Django
  const handleConfirmarCreacion = async (plantillaModificada) => {
    try {
      // Le enviamos a la función el ID de la plantilla y el título que incluye el [Grado - Jornada]
      const respuestaServidor = await CrearTarjetaLaboratorio.crearInstancia(
        plantillaModificada.id, 
        plantillaModificada.titulo_lab
      );
      
      // Atrapamos el objeto real del laboratorio dentro de respuestaServidor.data
      const nuevaTarjetaReal = respuestaServidor.data || respuestaServidor;

      // Añadimos el nuevo laboratorio devuelto por el servidor al estado local
      setLaboratorios(prevLabs => [...prevLabs, nuevaTarjetaReal]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al crear la instancia del laboratorio:", error);
      
      // 🚀 SOLUCIÓN: Cierra el modal de formulario inmediatamente para desbloquear la pantalla
      setIsModalOpen(false);
      
      // Ahora sí, muestra la alerta de error sobre la pantalla limpia
      showModal('error', 'No se pudo crear la copia del laboratorio. Verifica los parámetros del backend.');
    }
  };

  const handleIngresar = (id) => {
    console.log("Ingresando a configurar laboratorio:", id);
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

  const handleToggleEstado = async (id) => {
    // 1. Buscamos el laboratorio en el estado local para saber cómo está actualmente
    const laboratorioActual = laboratorios.find(lab => lab.id === id);
    if (!laboratorioActual) return;

    // 2. Evaluamos su estado actual y calculamos el nuevo valor
    const esActivoActualmente = laboratorioActual.estado === true || laboratorioActual.estado === 'activo';
    const nuevoEstadoBooleano = !esActivoActualmente;

    // PASO OPTIMISTA: Cambiamos la interfaz DE INMEDIATO con la animación suave
    // El usuario verá que el switch se mueve al instante y la tarjeta empieza a bajar
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

    // Aplicamos el cambio visual de inmediato para dar feedback instantáneo
    aplicarCambioVisual(nuevoEstadoBooleano);

    try {
      // 3. La petición viaja al backend en segundo plano mientras el usuario ya ve el cambio
      await ActualizarEstado(id, nuevoEstadoBooleano);
      // Si el servidor responde bien, no hacemos nada más porque la interfaz ya se actualizó.

    } catch (error) {
      console.error("No se pudo guardar el estado en el servidor:", error);
      
      // PLAN DE RESPALDO: Si el backend falla (ej. error 400, 500 o sin internet),
      // deshacemos el cambio visual de inmediato regresando el switch a como estaba antes
      aplicarCambioVisual(esActivoActualmente);
      
      // Le avisamos al docente lo que pasó
      showModal('error', 'No se pudo guardar el cambio de estado en el servidor. Intenta nuevamente.');
    }
  };

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
          {/* PRIMERA CONDICIÓN: Si sigue cargando, no mostramos nada de estados vacíos */}
          {loading ? (
            <div className={style.loadingState}>
              <p>Cargando tus laboratorios...</p>
            </div>
          ) : laboratorios.length > 0 ? (
            // SEGUNDA CONDICIÓN: Si ya no carga y sí hay tarjetas, las listamos
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
            // TERCERA CONDICIÓN: Si ya no carga y el array REALMENTE quedó vacío, mostramos el mensaje
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

        {/* MODAL DE CONFIRMACIÓN */}
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