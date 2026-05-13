import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { getLaboratorios } from "../../services/admin/adminLab";
import style from './DashboardAdmin.module.css';

function DashboardAdmin() {
  const [laboratorios, setLaboratorios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        setLoading(true);
        const data = await getLaboratorios();
        // Solo mostramos los laboratorios activos para el Dashboard
        setLaboratorios(data ? data.filter(lab => lab.estado === "Activo") : []);
      } catch (error) {
        console.error("Error al cargar laboratorios en dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLabs();
  }, []);

  return (
    <AdminLayout>
      <div className={style["layout"]}>
        <h2 className={style.titulo_seccion}>Dashboard Admin</h2>
        
        {loading ? (
          <p className={style.loading}>Cargando laboratorios...</p>
        ) : (
          <div className={style.contenedor_burbujas}>
            {laboratorios.map((lab) => (
              <div key={lab.id} className={style.burbuja}>
                <div className={style.burbuja_contenido}>
                  <h3 className={style.lab_nombre}>{lab.nombre_de_laboratorio}</h3>
                  <p className={style.lab_categoria}>{lab.categoria}</p>
                  {/* Si el objeto lab tiene descripción la usas, sino una por defecto */}
                  <p className={style.lab_descripcion}>
                    {lab.descripcion || "Este laboratorio está disponible para realizar prácticas y experimentos técnicos."}
                  </p>
                </div>
                <button className={style.btn_unirse}>
                  Unirse
                </button>
              </div>
            ))}

            {laboratorios.length === 0 && (
              <p className={style.empty}>No hay laboratorios activos para mostrar.</p>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default DashboardAdmin;