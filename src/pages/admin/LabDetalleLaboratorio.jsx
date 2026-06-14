import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import AdminCardContainer from "../../components/UI/admin/AdminCardContainer"; // Reutilizamos tu contenedor para mantener el diseño
import { ArrowLeft } from 'lucide-react';
import { getLaboratorioById } from '../../services/admin/adminLab';
import style from './LabDetalleLaboratorio.module.css';

function LabDetalleLaboratorio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [laboratorio, setLaboratorio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados para organizar la información (general + lo que venga en rawData/adicional)
  const [objetivos, setObjetivos] = useState([]);
  const [palabrasClave, setPalabrasClave] = useState([]);

  useEffect(() => {
    const loadLaboratorio = async () => {
      setLoading(true);
      const data = await getLaboratorioById(Number(id));
      if (!data) {
        setError("No se encontró el laboratorio.");
      } else {
        setLaboratorio(data);
        
        // Extraemos los objetivos y palabras clave si vienen dentro del objeto o de rawData
        const datosAdicionales = data.rawData || {};
        setObjetivos(data.objetivos || datosAdicionales.objetivos || []);
        setPalabrasClave(data.palabrasClave || datosAdicionales.palabrasClave || datosAdicionales.palabras_clave || []);
      }
      setLoading(false);
    };

    loadLaboratorio();
  }, [id]);

  const handleBack = () => {
    navigate("/admin/laboratorio/repositorio_labs");
  };

  return (
    <AdminLayout>
      <div className={style.layout}>
        <div className={style.headerRow}>
          <button type="button" className={style.backButton} onClick={handleBack}>
            <ArrowLeft size={18} /> Volver
          </button>
          <h2 className={style.titulo_header_laboratorio}>
            {laboratorio ? `Visualizando: ${laboratorio.nombre_de_laboratorio}` : "Detalle del Laboratorio"}
          </h2>
        </div>

        {loading && <p>Cargando detalles del laboratorio...</p>}
        {error && <p className={style.errorText}>{error}</p>}

        {laboratorio && (
          <AdminCardContainer>
            <div className={style.form_container}>
              
              {/* PASO 1: INFORMACIÓN GENERAL Y CLASIFICACIÓN */}
              <section className={style.form_section}>
                <h4 className={style.subtitulo}>1. Clasificación e Información General</h4>
                <div className={style.grid_inputs_tres_columnas}>
                  
                  <div className={style.field}>
                    <label>Nombre del Laboratorio</label>
                    <input 
                      type="text" 
                      className={style.input_diseno} 
                      value={laboratorio.nombre_de_laboratorio || ""} 
                      readOnly 
                    />
                  </div>

                  <div className={style.field}>
                    <label>Categoría Seleccionada</label>
                    <select className={style.input_diseno} value={laboratorio.categoria || ""} disabled>
                      <option value={laboratorio.categoria}>{laboratorio.categoria || "Sin categoría"}</option>
                    </select>
                  </div>

                  <div className={style.field}>
                    <label>Estado del Registro</label>
                    <div className={style.status_wrapper}>
                      <span className={laboratorio.estado === "Activo" ? style.statusActive : style.statusInactive}>
                        {laboratorio.estado}
                      </span>
                    </div>
                  </div>

                </div>
              </section>

              {/* SECCIÓN 2: ESTRUCTURA PEDAGÓGICA (Campos mapeados del JSON anterior) */}
              <section className={style.form_section}>
                <h4 className={style.subtitulo}>2. Estructura Pedagógica</h4>
                <div className={style.grid_inputs}>
                    
                    {/* Gestión de Objetivos Extraídos */}
                    <div className={style.field}>
                        <label>Objetivos del Laboratorio</label>
                        <div className={style.fake_input_con_tags}>
                            {objetivos.length > 0 ? (
                                <div className={style.tags_container}>
                                    {objetivos.map((obj, index) => (
                                        <span key={index} className={style.tag_item}>{obj}</span>
                                    ))}
                                </div>
                            ) : (
                                <span className={style.placeholder}>No hay objetivos registrados para este laboratorio.</span>
                            )}
                        </div>
                    </div>

                    {/* Gestión de Palabras Clave Extraídas */}
                    <div className={style.field}>
                        <label>Palabras Clave</label>
                        <div className={style.fake_input_con_tags}>
                            {palabrasClave.length > 0 ? (
                                <div className={style.tags_container}>
                                    {palabrasClave.map((palabra, index) => (
                                        <span key={index} className={style.tag_item}>{palabra}</span>
                                    ))}
                                </div>
                            ) : (
                                <span className={style.placeholder}>No hay palabras clave registradas.</span>
                            )}
                        </div>
                    </div>
                </div>
              </section>

              {/* PASO 3: CONTENIDO DETALLADO DEL LABORATORIO */}
              <section className={style.form_section}>
                <h4 className={style.subtitulo}>3. Contenido del Laboratorio</h4>
                
                <div className={style.field}>
                    <label>Resumen</label>
                    <textarea 
                        className={style.textarea_diseno} 
                        value={laboratorio.resumen || "No disponible"} 
                        readOnly 
                    />
                </div>

                <div className={style.grid_inputs}>
                    <div className={style.field}>
                        <label>Introducción</label>
                        <textarea 
                            className={style.textarea_diseno} 
                            value={laboratorio.introduccion || "No disponible"} 
                            readOnly 
                        />
                    </div>
                    <div className={style.field}>
                        <label>Marco Teórico</label>
                        <textarea 
                            className={style.textarea_diseno} 
                            value={laboratorio.marco_teorico || "No disponible"} 
                            readOnly 
                        />
                    </div>
                </div>
              </section>

            </div>
          </AdminCardContainer>
        )}
      </div>
    </AdminLayout>
  );
}

export default LabDetalleLaboratorio;