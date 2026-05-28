import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import style from "./LabDetalleAuditoria.module.css";
// Asegúrate de que el nombre del archivo de servicio coincida exactamente con tu proyecto
import { getLaboratorioById } from "../../services/admin/LabAuditoriaContenidoService";

function LabDetalleAuditoria() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lab, setLab] = useState(null);

  useEffect(() => {
    fetchLab();
  }, [id]);

  const fetchLab = async () => {
    try {
      const data = await getLaboratorioById(id);
      console.log("DATA COMPLETA DE LA API EN DETALLE:", data);

      if (data && data.results && Array.isArray(data.results)) {
        // Por si el backend llega a paginar la respuesta de un solo objeto por ID
        setLab(data.results[0] || null);
      } else {
        // Respuesta limpia directa del objeto del laboratorio
        setLab(data);
      }
    } catch (error) {
      console.error("ERROR AL BUSCAR EL LAB:", error);
      setLab(null);
    }
  };

  if (!lab) return <div className={style.loading}>Cargando información del laboratorio...</div>;

  return (
    <AdminLayout>
      <div className={style.container}>

        {/* 🔙 BOTÓN VOLVER */}
        <button onClick={() => navigate(-1)} className={style.btnVolver}>
          ← Volver
        </button>

        {/* 🧪 CARD PRINCIPAL - DATOS GENERALES */}
        <div className={style.card}>
          {/* Cambiado de lab?.titulo_lab a lab?.titulo según el nuevo JSON */}
          <div className={style.titulo}>{lab?.titulo || "Sin título"}</div>
          
          <p>
            <span className={style.label}>Estado:</span>{" "}
            {lab?.estado ? "Activo" : "Inactivo"}
          </p>
          
          <p>
            <span className={style.label}>Categoría:</span>{" "}
            {lab?.categoria || "No asignada"}
          </p>
          
          <p>
            <span className={style.label}>Creador:</span>{" "}
            {lab?.creador || "Desconocido"}
          </p>

          {/* Nuevo campo mapeado de la API */}
          <p>
            <span className={style.label}>Último Ingreso:</span>{" "}
            {lab?.ultimo_ingreso ? new Date(lab.ultimo_ingreso).toLocaleString() : "Sin registros"}
          </p>
        </div>

        {/* 📄 CARD CONTENIDO - PROTEGIDO EN CASO DE QUE EL ENDPOINT NO LOS INCLUYA */}
        <div className={style.card}>
          <p>
            <span className={style.label}>Resumen:</span>{" "}
            {lab?.resumen || "No especificado en el registro de auditoría."}
          </p>
          <p>
            <span className={style.label}>Introducción:</span>{" "}
            {lab?.introduccion || "No especificada en el registro de auditoría."}
          </p>
          <p>
            <span className={style.label}>Marco Teórico:</span>{" "}
            {lab?.marco_teorico || "No especificado en el registro de auditoría."}
          </p>
        </div>

      </div>
    </AdminLayout>
  );
}

export default LabDetalleAuditoria;