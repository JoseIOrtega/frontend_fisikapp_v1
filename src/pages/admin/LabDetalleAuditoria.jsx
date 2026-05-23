import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import style from "./LabDetalleAuditoria.module.css";
import { getLaboratorioById } from "../../services/admin/LabAuditoriaContenidoService";


function LabDetalleAuditoria(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [lab, setLab] = useState(null);

  useEffect(() => {
    fetchLab();
  }, [id]);

const fetchLab = async () => {
  try {
    const data = await getLaboratorioById(id);
    console.log("DATA COMPLETA DE LA API:", data); 
if (data && data.results && Array.isArray(data.results)) {
      // Si el backend cometió el error de paginar el detalle, tomamos el primer resultado
      setLab(data.results[0] || null);
    } else {
      // Si el backend responde correctamente con el objeto directo del laboratorio
      setLab(data);
    }
  } catch (error) {
    console.error("ERROR AL BUSCAR EL LAB:", error);
    setLab(null); // Evita quedarse trabado si da error, o puedes poner un mensaje en vez de "Cargando..."
  }
};

  if (!lab) return <div>Cargando...</div>;

  return (
    <AdminLayout>
      <div className={style.container}>

        {/* 🔙 BOTÓN */}
        <button onClick={() => navigate(-1)}>
          ← Volver
        </button>

        {/* 🧪 CARD PRINCIPAL */}
    <div className={style.card}>
  <div className={style.titulo}>{lab?.titulo_lab}</div>
  <p><span className={style.label}>Estado:</span> {lab?.estado ? "Activo" : "Inactivo"}</p>
  <p><span className={style.label}>Categoría:</span> {lab?.categoria}</p>
  <p><span className={style.label}>Creador:</span> {lab?.creador}</p>
</div>

        {/* 📄 CARD CONTENIDO */}
        <div className={style.card}>
          <p><span className={style.label}>Resumen:</span> {lab.resumen}</p>
          <p><span className={style.label}>Introducción:</span> {lab.introduccion}</p>
          <p><span className={style.label}>Marco Teórico:</span> {lab.marco_teorico}</p>
        </div>

      </div>
    </AdminLayout>
  );
}
export default LabDetalleAuditoria;