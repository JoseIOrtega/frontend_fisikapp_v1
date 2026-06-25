import React, { useState, useEffect } from 'react';
import DocenteLayout from '../../layouts/DocenteLayout';
import LaboratorioCard from '../../components/UI/docente/LaboratorioCard';
import ModalCrearTarjetaLaboratorio from '../../components/modals/docente/ModalCrearTarjetaLaboratorio';
import { CrearTarjetaLaboratorio, EliminarLabService, ActualizarEstado } from '../../services/docente/CrearTarjetaLabService';
import { PlusCircle, FlaskConical } from 'lucide-react'; 
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [dataCategorias, dataPlantillas, dataMisLabs] = await Promise.all([
          CrearTarjetaLaboratorio.obtenerCategorias(),
          CrearTarjetaLaboratorio.obtenerPlantillasBase(),
          CrearTarjetaLaboratorio.obtenerMisLaboratorios()
        ]);
        setCategorias(Array.isArray(dataCategorias) ? dataCategorias : []);
        setPlantillas(Array.isArray(dataPlantillas) ? dataPlantillas : []);
        setLaboratorios(Array.isArray(dataMisLabs) ? dataMisLabs : []);
      } catch (error) {
        showModal('error', 'Error al cargar datos.');
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleConfirmarCreacion = async (plantillaSeleccionada) => {
    setIsModalOpen(false);
    try {
        setLoading(true);
        const nuevoLab = await CrearTarjetaLaboratorio.crearInstancia(plantillaSeleccionada);
        setLaboratorios(prev => [nuevoLab, ...prev]);
        showModal('success', 'Laboratorio creado correctamente.');
    } catch (error) {
        console.error("Detalle del error:", error);
        showModal('error', 'Error al guardar en el servidor.');
    } finally {
        setLoading(false);
    }
  };

  const handleIngresar = (id) => navigate(`/profesor/mis-laboratorios/configurar/${id}`);
  const handleEliminar = (id) => setLaboratorios(prev => prev.filter(l => l.id !== id));
  
  const handleToggleEstado = async (id) => {
    const lab = laboratorios.find(l => l.id === id);
    const nuevoEstado = !(lab.estado === 'ACTIVO');
    setLaboratorios(prev => prev.map(l => l.id === id ? { ...l, estado: nuevoEstado ? 'ACTIVO' : 'borrador' } : l));
    try { await ActualizarEstado(id, nuevoEstado); } catch { showModal('error', 'Error al actualizar.'); }
  };

  if (loading) return <DocenteLayout><p>Cargando...</p></DocenteLayout>;

  return (
    <DocenteLayout>
      <div className={style.pageContainer}>
        <header className={style.header}>
          <h2 className={style.pageTitle}>Mis Laboratorios</h2>
          <button className={style.createButton} onClick={() => setIsModalOpen(true)}>
            <PlusCircle size={20} /> Crear Laboratorio
          </button>
        </header>

        <main className={laboratorios.length > 0 ? style.gridContainer : style.emptyContainer}>
          {laboratorios.length > 0 ? (
            laboratorios.map((lab) => {
              // --- Mapeo corregido según nombres de campos del servidor ---
              const labAdaptado = {
                id: lab.id,
                titulo_lab: lab.titulo_lab || lab.titulo || "Sin título",
                categoria_nombre: categorias.find(c => c.id === lab.categoria)?.nombre || "General",
                codigo_lab: lab.codigo_lab || "---",
                estado: lab.estado === 'ACTIVO',
                configurado_completo: lab.estado !== 'borrador',
                fecha_creacion: lab.fecha_creacion || new Date().toISOString(),
                grado: lab.grado || null,
                jornada: lab.jornada || null
              };
              return (
                <LaboratorioCard 
                  key={lab.id} 
                  laboratorio={labAdaptado} 
                  onIngresar={handleIngresar} 
                  onEliminar={handleEliminar} 
                  onToggleEstado={handleToggleEstado} 
                />
              );
            })
          ) : (
            <div className={style.emptyStateCard}>
              <div className={style.emptyIconBadge}>
                <FlaskConical size={40} />
              </div>
              <h3>¡Comienza tu primera aventura científica!</h3>
              <p>Aún no has diseñado laboratorios para tus alumnos.</p>
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
      </div>
    </DocenteLayout>
  );
}

export default MisLaboratoriosDocente;