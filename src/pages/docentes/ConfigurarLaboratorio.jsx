import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  Sliders, 
  HelpCircle, 
  FileText, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import DocenteLayout from "../../layouts/DocenteLayout";
import style from './ConfigurarLaboratorio.module.css';

function ConfigurarLaboratorio() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [laboratorio, setLaboratorio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdatingEstado, setIsUpdatingEstado] = useState(false);

  // Carga simulada de datos (aquí conectarás tu endpoint de Django)
  useEffect(() => {
    const cargarDatos = () => {
      setLaboratorio({
        id: id,
        titulo_lab: "Tiro Parabólico",
        categoria_nombre: "Cinemática 2",
        grado: null, 
        jornada: null, 
        estado: false,
        etapas: [
          { id: 1, nombre: "Conceptos básicos", configurada: false, icono: <BookOpen size={18} /> },
          { id: 2, nombre: "Práctica de conceptos", configurada: false, icono: <Sliders size={18} /> },
          // { id: 3, nombre: "Informe de laboratorio", configurada: false, icono: <FileText size={18} /> },
        ]
      });
      setLoading(false);
    };
    cargarDatos();
  }, [id]);

  const handleToggleHabilitar = () => {
    if (isUpdatingEstado) return;
    setIsUpdatingEstado(true);
    setTimeout(() => {
      setLaboratorio(prev => ({ ...prev, estado: !prev.estado }));
      setIsUpdatingEstado(false);
    }, 600);
  };

  // Función vacía para el buscador del Navbar para evitar errores en el Layout
  const handleSearch = (query) => {
    console.log("Buscando en configuración:", query);
  };

  return (
    <DocenteLayout onSearch={handleSearch}>
      <div className={style.layout}>
        
        {loading ? (
          <div className={style.centerBox}>
            <Loader2 size={32} className={style.spinner} />
            <p>Cargando datos del laboratorio...</p>
          </div>
        ) : (
          <div className={style.panelContainer}>
            
            {/* 1. CABECERA CON EL BOTÓN REGRESAR */}
            <div className={style.headerCard}>
              <div className={style.titleArea}>
                <button 
                  className={style.backIconBtn} 
                  onClick={() => navigate('/profesor/mis-laboratorios')}
                  title="Volver a mis laboratorios"
                >
                  <ArrowLeft size={18} />
                </button>
                <div>
                  <h2 className={style.labTitle}>{laboratorio.titulo_lab}</h2>
                  <p className={style.labSubtitle}>
                    Categoría: <span>{laboratorio.categoria_nombre}</span>
                    {laboratorio.grado && <> • Grado: <span>{laboratorio.grado}</span></>}
                    {laboratorio.jornada && <> • Jornada: <span>{laboratorio.jornada}</span></>}
                  </p>
                </div>
              </div>

              <button 
                className={`${style.actionBtn} ${laboratorio.estado ? style.btnActivo : style.btnInactivo}`}
                onClick={handleToggleHabilitar}
                disabled={isUpdatingEstado}
              >
                {isUpdatingEstado ? "Procesando..." : "Habilitar laboratorio"}
              </button>
            </div>

            {/* 2. ALERTA O ESTADO ACTUAL */}
            <div className={style.statusBanner}>
              <div className={style.bannerText}>
                <AlertCircle size={18} className={style.statusIconPending} />
                <div>
                  <strong>Laboratorio no habilitado</strong>
                  <p>Debes configurar todas las etapas del laboratorio para habilitarlo.</p>
                </div>
              </div>
            </div>

            {/* 3. BLOQUE DE LAS ETAPAS EN FILAS */}
            <div className={style.etapasBlock}>
              <div className={style.blockTitleGroup}>
                <h3>Etapas del laboratorio</h3>
                <p>Las etapas siguen un orden pedagógico preestablecido.</p>
              </div>

              <div className={style.etapasList}>
                {laboratorio.etapas.map((etapa, idx) => (
                  <div key={etapa.id} className={style.etapaRow}>
                    <div className={style.etapaLeftLayout}>
                      <div className={style.verticalBar} />
                      <div className={style.etapaIconBox}>
                        {etapa.icono}
                      </div>
                      <div className={style.etapaDetails}>
                        <span className={style.etapaNumber}>Etapa {idx + 1}</span>
                        <h4>{etapa.nombre}</h4>
                        <span className={style.statusPendingTxt}>Pendiente por configurar</span>
                      </div>
                    </div>

                    <button 
                      className={style.rowConfigBtn}
                      onClick={() => navigate(`/profesor/mis-laboratorios/configurar/${id}/etapa/${etapa.id}`)}
                    >
                      Configurar
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </DocenteLayout>
  );
}

export default ConfigurarLaboratorio;