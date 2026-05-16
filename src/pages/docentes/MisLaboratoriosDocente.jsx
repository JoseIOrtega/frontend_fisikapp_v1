import React, { useState, useEffect } from 'react';
import DocenteLayout from '../../layouts/DocenteLayout';
import LaboratorioCard from '../../components/UI/docente/LaboratorioCard';
import ModalCrearTarjetaLaboratorio from '../../components/modals/docente/ModalCrearTarjetaLaboratorio';
import CrearTarjetaLaboratorio from '../../services/docente/CrearTarjetaLabService'; // Nombre actualizado
import { PlusCircle } from 'lucide-react';
import style from './MisLaboratoriosDocente.module.css';

function MisLaboratoriosDocente() {
  const [laboratorios, setLaboratorios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [plantillas, setPlantillas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Carga de datos iniciales desde el servidor
  useEffect(() => {
    // Dentro del useEffect de MisLaboratoriosDocente.jsx
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [dataCategorias, dataPlantillas, dataMisLabs] = await Promise.all([
          CrearTarjetaLaboratorio.obtenerCategorias(),
          CrearTarjetaLaboratorio.obtenerPlantillasBase(),
          CrearTarjetaLaboratorio.obtenerMisLaboratorios()
        ]);

        // IMPORTANTE: Si tu API usa paginación, accede a .results
        // Si no, déjalos como están. Aquí los protegemos:
        setCategorias(Array.isArray(dataCategorias) ? dataCategorias : dataCategorias.results || []);
        setPlantillas(Array.isArray(dataPlantillas) ? dataPlantillas : dataPlantillas.results || []);
        setLaboratorios(Array.isArray(dataMisLabs) ? dataMisLabs : dataMisLabs.results || []);

      } catch (error) {
        console.error("Error al cargar datos del servidor:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleCrearLaboratorio = () => {
    setIsModalOpen(true);
  };

  // 2. Confirmación del modal: Se envía el ID de la plantilla al servidor
  const handleConfirmarCreacion = async (plantilla) => {
    try {
      // Llamamos al servicio para crear la instancia en la DB
      const nuevaTarjetaServidor = await CrearTarjetaLaboratorio.crearInstancia(plantilla.id);
      
      // Actualizamos el estado local con la respuesta del servidor
      setLaboratorios(prevLabs => [...prevLabs, nuevaTarjetaServidor]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al crear el laboratorio en el servidor:", error);
      alert("No se pudo crear el laboratorio. Inténtalo de nuevo.");
    }
  };

  const handleIngresar = (id) => {
    // Aquí navegarás a la configuración de los 3 pasos
    console.log("Ingresando a configurar laboratorio:", id);
  };

  const handleEliminar = async (id) => {
    // Aquí podrías llamar a un servicio de eliminación si lo tienes
    setLaboratorios(prevLabs => prevLabs.filter(lab => lab.id !== id));
  };

  const handleToggleEstado = (id) => {
    // Lógica para activar/desactivar (conectar con servicio después)
    setLaboratorios(prevLabs => prevLabs.map(lab => 
      lab.id === id ? { ...lab, estado: lab.estado === 'activo' ? 'inactivo' : 'activo' } : lab
    ));
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

        <main className={style.gridContainer}>
          {laboratorios.length > 0 ? (
            laboratorios.map((lab) => (
              <LaboratorioCard 
                key={lab.id} 
                laboratorio={lab} 
                onIngresar={handleIngresar}
                onEliminar={handleEliminar}
                onToggleEstado={handleToggleEstado}
                esArchivado={false}
              />
            ))
          ) : (
            <p className={style.emptyMessage}>No tienes laboratorios creados. ¡Crea el primero!</p>
          )}
        </main>

        <ModalCrearTarjetaLaboratorio 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmarCreacion}
          categorias={categorias}
          plantillasRaw={plantillas}
        />

      </div>
    </DocenteLayout>
  );
}

export default MisLaboratoriosDocente;