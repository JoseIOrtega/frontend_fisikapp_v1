import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { ArrowLeft } from 'lucide-react';
import { getLaboratorioById } from '../../services/admin/labData';
import style from './LabDetalleLaboratorio.module.css';

function LabDetalleLaboratorio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [laboratorio, setLaboratorio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLaboratorio = async () => {
      setLoading(true);
      const data = await getLaboratorioById(Number(id));
      if (!data) {
        setError("No se encontró el laboratorio.");
      } else {
        setLaboratorio(data);
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
          <h2 className={style.title}>Detalle del Laboratorio</h2>
        </div>

        {loading && <p>Cargando detalles del laboratorio...</p>}
        {error && <p className={style.errorText}>{error}</p>}

        {laboratorio && (
          <div className={style.card}>
            <div className={style.section}>
              <h3>Información General</h3>
              <div className={style.row}>
                <span className={style.label}>ID:</span>
                <span>{laboratorio.id}</span>
              </div>
              <div className={style.row}>
                <span className={style.label}>Nombre:</span>
                <span>{laboratorio.nombre_de_laboratorio}</span>
              </div>
              <div className={style.row}>
                <span className={style.label}>Categoría:</span>
                <span>{laboratorio.categoria}</span>
              </div>
              <div className={style.row}>
                <span className={style.label}>Estado:</span>
                <span className={laboratorio.estado === "Activo" ? style.statusActive : style.statusInactive}>{laboratorio.estado}</span>
              </div>
              <div className={style.row}>
                <span className={style.label}>Creado:</span>
                <span>{new Date(laboratorio.fechacreacion).toLocaleString()}</span>
              </div>
            </div>

            <div className={style.section}>
              <h3>Contenido del Laboratorio</h3>
              <div className={style.field}>
                <span className={style.label}>Resumen</span>
                <p>{laboratorio.resumen || 'No disponible'}</p>
              </div>
              <div className={style.field}>
                <span className={style.label}>Introducción</span>
                <p>{laboratorio.introduccion || 'No disponible'}</p>
              </div>
              <div className={style.field}>
                <span className={style.label}>Marco Teórico</span>
                <p>{laboratorio.marco_teorico || 'No disponible'}</p>
              </div>
            </div>

            {laboratorio.rawData && (
              <div className={style.section}>
                <h3>Información adicional</h3>
                <pre className={style.rawData}>{JSON.stringify(laboratorio.rawData, null, 2)}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default LabDetalleLaboratorio;
