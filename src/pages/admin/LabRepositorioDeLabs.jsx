import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout"
import AdminDataTable from "../../components/UI/AdminDataTable"
import AdminIconButton from "../../components/UI/AdminIconButton";
import { Edit, Eye, Trash2, UserX, UserCheck } from 'lucide-react';
import { getRelativeTime } from '../../utils/dateHelpers';
import { getLaboratorios } from '../../services/admin/labData';
import style from './LabRepositorioDeLabs.module.css'

function LabRepositorioDeLabs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [laboratorios, setLaboratorios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadLaboratorios = async () => {
      const data = await getLaboratorios();
      setLaboratorios(data);
    };
    loadLaboratorios();
  }, []);

  const columnas = [
    { label: "Nombre de Laboratorio" },
    { label: "Categoría" },
    { label: "Estado" },
    { label: "Creado" },
    { label: "Acciones", style: { textAlign: 'center' } }
  ];

  const filteredAdmins = laboratorios.filter((laboratorio) =>
    laboratorio.nombre_de_laboratorio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    laboratorio.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    laboratorio.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
    laboratorio.fechacreacion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (laboratorio) => {
    navigate("/admin/laboratorio/configurar_labs", {
      state: { laboratorio }
    });
  };

  const handleView = (laboratorio) => {
    navigate(`/admin/laboratorio/repositorio_labs/${laboratorio.id}`);
  };

  return (
    <AdminLayout onSearch={setSearchTerm}>
      <div className={style["layout"]}>
        <div className={style["seccion_del_header"]}>
          <h2 className={style.titulo_header_laboratorio}>Repositorio de Laboratorios</h2>
        </div>

        <AdminDataTable
          columns={columnas}
          data={filteredAdmins}
          renderRow={(laboratorio) => (
            <tr key={laboratorio.id}>
              <td className={style.nombre_laboratorio}>{laboratorio.nombre_de_laboratorio}</td>
              <td>{laboratorio.categoria}</td>
              <td><span className={laboratorio.estado === "Activo" ? style.statusActive : style.statusInactive}>{laboratorio.estado}</span></td>
              <td title={new Date(laboratorio.fechacreacion).toLocaleString()} style={{ cursor: 'help' }}>{getRelativeTime(laboratorio.fechacreacion)}</td>
              <td className={style.actionsDetails}>
                <AdminIconButton icon={Edit} title="editar" type="edit" onClick={() => handleEdit(laboratorio)} />
                <AdminIconButton icon={Eye} title="ver" type="detail" onClick={() => handleView(laboratorio)} />
                <AdminIconButton icon={laboratorio.estado === "Activo" ? UserX : UserCheck} title="bloquear" type="delete" />
                <AdminIconButton icon={Trash2} title="Eliminar" type="delete" />
              </td>
            </tr>
          )}
        ></AdminDataTable>
      </div>
    </AdminLayout>
  )
}

export default LabRepositorioDeLabs
