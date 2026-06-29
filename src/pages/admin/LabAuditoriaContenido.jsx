import AdminLayout from "../../layouts/AdminLayout"
import AdminDataTable from "../../components/UI/admin/AdminDataTable"
import AdminIconButton from "../../components/UI/admin/AdminIconButton";
import { Eye } from 'lucide-react';
import { getRelativeTime } from '../../utils/dateHelpers';
import style from './LabAuditoriaContenido.module.css'
import { useState, useEffect } from "react";
import { getLaboratorios } from "../../services/admin/adminLab";

function LabAuditoriaContenido() {

  const [searchTerm, setSearchTerm] = useState("");
  const [laboratorios, setLaboratorios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await getLaboratorios();

        setLaboratorios(data.laboratorios || []);
      } catch (error) {
        console.error("Error cargando laboratorios:", error);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const columnas = [
    { label: "Nombre de Laboratorio" },
    { label: "Categoría" },
    { label: "Creador" },
    { label: "Estado" },
    { label: "Último ingreso" },
    { label: "Acciones", style: { textAlign: 'center' } }
  ];

  const filteredLabs = laboratorios.filter((lab) =>
    (lab.nombre_de_laboratorio || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lab.categoria || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lab.estado || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout onSearch={setSearchTerm}>
      <div className={style["layout"]}>
        <div className={style["seccion_del_header"]}>
          <h2 className={style.titulo_header_laboratorio}>Auditoría de contenido</h2>
        </div>

        {loading ? (
          <p>Cargando laboratorios...</p>
        ) : (
          <AdminDataTable
            columns={columnas}
            data={filteredLabs}
            renderRow={(lab) => (
              <tr key={lab.id}>
                <td className={style.nombre_laboratorio}>{lab.nombre_de_laboratorio}</td>
                <td>{lab.categoria}</td>
                <td><span className={style.creador}>{lab.creador || "—"}</span></td>
                <td>
                  <span className={lab.estado === "Activo" ? style.statusActive : style.statusInactive}>
                    {lab.estado}
                  </span>
                </td>
                <td>{lab.fecha_creacion ? getRelativeTime(lab.fecha_creacion) : "—"}</td>
                <td className={style.actionsDetails}>
                  <AdminIconButton icon={Eye} title="ver" type="detail"/>
                </td>
              </tr>
            )}
          />
        )}
      </div>
    </AdminLayout>
  );
}

export default LabAuditoriaContenido;