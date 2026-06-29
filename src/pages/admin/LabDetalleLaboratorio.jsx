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
  const [objetivoGeneral, setObjetivoGeneral] = useState(null);
  const [objetivosEspecificos, setObjetivosEspecificos] = useState([]);

  useEffect(() => {
    const loadLaboratorio = async () => {
      setLoading(true);
      const data = await getLaboratorioById(Number(id));
      if (!data) {
        setError("No se encontró el laboratorio.");
      } else {
        setLaboratorio(data);
        console.log(data);
        
        // Extraemos los objetivos y palabras clave si vienen dentro del objeto o de rawData
        const datosAdicionales = data.rawData || {};
        setObjetivoGeneral(
            data.objetivo_general ||
            datosAdicionales.objetivo_general ||
            null
        );

        setObjetivosEspecificos(
            data.objetivo_general?.objetivos_especificos || []
        );
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
          <button
            type="button"
            className={style.backButton}
            onClick={handleBack}
          >
            <ArrowLeft size={18} /> Volver
          </button>
          <h2 className={style.titulo_header_laboratorio}>
            {laboratorio
              ? `Visualizando: ${laboratorio.nombre_de_laboratorio}`
              : "Detalle del Laboratorio"}
          </h2>
        </div>

        {loading && <p>Cargando detalles del laboratorio...</p>}
        {error && <p className={style.errorText}>{error}</p>}

        {laboratorio && (
          <AdminCardContainer>
            {laboratorio.imagen_portada && (
              <div className={style.portadaContainer}>
                <img
                  src={laboratorio.imagen_portada}
                  alt={laboratorio.nombre_de_laboratorio}
                />
              </div>
            )}

            <div className={style.form_container}>
              {/* PASO 1: INFORMACIÓN GENERAL Y CLASIFICACIÓN */}
              <section className={style.form_section}>
                <h4 className={style.subtitulo}>1. Información General</h4>
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
                    <input
                      type="text"
                      className={style.input_diseno}
                      value={laboratorio.categoria_nombre || ""}
                      readOnly
                    />
                  </div>

                  <div className={style.field}>
                    <label>Estado del Registro</label>
                    <div className={style.status_wrapper}>
                      <span
                        className={
                          laboratorio.estado === "Activo"
                            ? style.statusActive
                            : style.statusInactive
                        }
                      >
                        {laboratorio.estado}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECCIÓN 2: ESTRUCTURA PEDAGÓGICA (Campos mapeados del JSON anterior) */}
              <section className={style.form_section}>
                <h4 className={style.subtitulo}>2. Objetivos de Aprendizaje</h4>

                <div className={style.field}>
                  <label>Objetivo General</label>

                  <textarea
                    className={style.textarea_diseno}
                    value={
                      objetivoGeneral?.descripcion ||
                      "No hay objetivo general registrado."
                    }
                    readOnly
                  />
                </div>

                <div className={style.field}>
                  <label>Objetivos Específicos</label>

                  <div className={style.fake_input_con_tags}>
                    {objetivosEspecificos.length > 0 ? (
                      objetivosEspecificos.map((obj) => (
                        <span key={obj.id} className={style.tag_item}>
                          {obj.descripcion}
                        </span>
                      ))
                    ) : (
                      <span className={style.placeholder}>
                        No hay objetivos específicos registrados.
                      </span>
                    )}
                  </div>
                </div>
              </section>

              {/* PASO 3: CONTENIDO DETALLADO DEL LABORATORIO */}
              <section className={style.form_section}>
                <h4 className={style.subtitulo}>
                  3. Contenido del Laboratorio
                </h4>

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