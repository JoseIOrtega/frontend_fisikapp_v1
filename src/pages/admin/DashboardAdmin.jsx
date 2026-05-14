import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { getLaboratorios } from "../../services/admin/adminLab";
import style from './DashboardAdmin.module.css';

function DashboardAdmin() {
  const [laboratorios, setLaboratorios] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- Estados de Paginación ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Puedes ajustar este número

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        setLoading(true);
        const data = await getLaboratorios();
        setLaboratorios(data ? data.filter(lab => lab.estado === "Activo") : []);
      } catch (error) {
        console.error("Error al cargar laboratorios en dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLabs();
  }, []);

  // --- Lógica para calcular los elementos mostrados ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = laboratorios.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(laboratorios.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <AdminLayout>
      <div className={style["layout"]}>
        <h2 className={style.titulo_seccion}>Dashboard Admin</h2>
        
        {loading ? (
          <p className={style.loading}>Cargando laboratorios...</p>
        ) : (
          <>
            <div className={style.contenedor_burbujas}>
              {currentItems.map((lab) => (
                <div key={lab.id} className={style.burbuja}>
                  <div className={style.burbuja_contenido}>
                    <h3 className={style.lab_nombre}>{lab.nombre_de_laboratorio}</h3>
                    <p className={style.lab_categoria}>{lab.categoria}</p>
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

            {/* --- Controles de Paginación --- */}
            {laboratorios.length > itemsPerPage && (
              <div className={style.paginacion}>
                <button 
                  onClick={() => paginate(currentPage - 1)} 
                  disabled={currentPage === 1}
                  className={style.btn_paginacion}
                >
                  &laquo;
                </button>
                
                {[...Array(totalPages).keys()].map(number => (
                  <button
                    key={number + 1}
                    onClick={() => paginate(number + 1)}
                    className={`${style.btn_paginacion} ${currentPage === number + 1 ? style.active : ""}`}
                  >
                    {number + 1}
                  </button>
                ))}

                <button 
                  onClick={() => paginate(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                  className={style.btn_paginacion}
                >
                  &raquo;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export default DashboardAdmin;