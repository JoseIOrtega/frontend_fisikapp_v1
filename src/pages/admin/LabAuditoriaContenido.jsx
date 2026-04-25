import { useState, useEffect } from "react";
import { getLaboratorios } from "../../services/admin/LabAuditoriaContenidoService";
import AdminLayout from "../../layouts/AdminLayout"
import AdminCrateButton from "../../components/UI/admin/AdminCreateButton"
import AdminDataTable from "../../components/UI/admin/AdminDataTable"
import AdminIconButton from "../../components/UI/admin/AdminIconButton";
import { FlaskConical, Edit, Eye, UserX, UserCheck } from 'lucide-react';
import { getRelativeTime } from '../../utils/dateHelpers';
import style from './LabAuditoriaContenido.module.css'
import { useNavigate } from "react-router-dom";




function LabAuditoriaContenido() {
  const [laboratorios, setLaboratorios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const toggleEstadoLocal = (id) => {
  const nuevos = laboratorios.map((lab) =>
    lab.id === id ? { ...lab, estado: !lab.estado } : lab
  );

  setLaboratorios(nuevos);
};

  const columnas = [
    { label: "Nombre de Laboratorio" },
    { label: "Categoría" },
    { label: "Creador" },
    { label: "Estado" },
    { label: "Último ingreso" },
    { label: "Acciones", style: { textAlign: 'center' } }
  ];

    useEffect(() => {
      fetchLaboratorios();
    }, []);

  const fetchLaboratorios = async () => {
    try {
      const data = await getLaboratorios();
      setLaboratorios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setLaboratorios([]);
    }
  };



const filteredAdmins = Array.isArray(laboratorios)
  ? laboratorios.filter((lab) =>
      lab.titulo_lab?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : [];
  
  return (
    <AdminLayout onSearch={setSearchTerm}>
        <div className={style["layout"]}>
            <div className={style["seccion_del_header"]}>
              <h2 className={style.titulo_header_laboratorio}>Auditoría de contenido</h2>
              
            </div>

            <AdminDataTable
              columns={columnas}
              data={filteredAdmins}
              renderRow={(laboratorio) => (
                <tr key={laboratorio.id}>
                  
                  <td className={style.nombre_laboratorio}>
                    {laboratorio.titulo_lab}
                  </td>

                  <td>{laboratorio.categoria}</td>

                  <td>
                    <span className={style.creador}>
                      {laboratorio.creador}
                    </span>
                  </td>

                  <td>
                    <span className={laboratorio.estado ? style.statusActive : style.statusInactive}>
                      {laboratorio.estado ? "Activo" : "Inactivo"}
                    </span>
                  </td>

                  <td title={new Date(laboratorio.fecha_actualizacion).toLocaleString()}>
                    {getRelativeTime(laboratorio.fecha_actualizacion)}
                  </td>

                  <td className={style.actionsDetails}>
                    <AdminIconButton icon={Eye} title="ver" type="detail" onClick={()=> navigate(`/admin/laboratorios/${laboratorio.id}`)}/>
                   <AdminIconButton   icon={laboratorio.estado ? UserX : UserCheck}  type="delete"  onClick={() => toggleEstadoLocal(laboratorio.id)}/>

 
 

                  </td>

                </tr>
              )}
            />
        </div>
    </AdminLayout>
  )
}

export default LabAuditoriaContenido