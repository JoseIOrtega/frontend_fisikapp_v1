import AdminLayout from "../../layouts/AdminLayout"
import AdminDataTable from "../../components/UI/AdminDataTable"
import AdminIconButton from "../../components/UI/AdminIconButton";
import { Edit, Eye,Trash2, UserX, UserCheck } from 'lucide-react';
import { getRelativeTime } from '../../utils/dateHelpers';
import style from './LabRepositorioDeLabs.module.css'
import { useState } from "react";

function LabRepositorioDeLabs() {


  const [searchTerm, setSearchTerm] = useState("");

  const columnas = [
    { label: "Nombre de Laboratorio" },
    { label: "Categoría" },
    { label: "Estado" },
    { label: "Creado" },
    { label: "Acciones", style: { textAlign: 'center' } }
  ];

  const laboratorios = [
    { id: 1, nombre_de_laboratorio: "Lab. Caída Libre", categoria: "Cinemática", estado: "Activo", fechacreacion: "2026-04-03T15:30:00Z" },
    { id: 2, nombre_de_laboratorio: "Lab. Mov. Rect. Uniforme", categoria: "Cinemática", estado: "Activo", fechacreacion: new Date().toISOString() },
    { id: 3, nombre_de_laboratorio: "Lab. Tiro Parabólico", categoria: "Cinemática", estado: "Inactivo", fechacreacion: "2026-04-02T09:00:00Z" },
    { id: 4, nombre_de_laboratorio: "Lab. Leyes de Newton", categoria: "Mecánica", estado: "Activo", fechacreacion: "2026-04-01T11:20:00Z" },
    { id: 5, nombre_de_laboratorio: "Lab. Energía Cinética y Potencial", categoria: "Mecánica", estado: "Activo", fechacreacion: "2026-03-30T14:10:00Z" },
  ];

const filteredAdmins = laboratorios.filter((laboratorio) => 
laboratorio.nombre_de_laboratorio.toLowerCase().includes(searchTerm.toLowerCase()) || 
laboratorio.categoria.toLowerCase().includes(searchTerm.toLowerCase()) || 
laboratorio.estado.toLowerCase().includes(searchTerm.toLowerCase()) || 
laboratorio.fechacreacion.toLowerCase().includes(searchTerm.toLowerCase())  
); 
  
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
                  <td><span className={laboratorio.estado === "Activo"? style.statusActive: style.statusInactive}>{laboratorio.estado}</span></td>
                  <td title={new Date(laboratorio.fechacreacion).toLocaleString()} style={{ cursor: 'help' }}>{getRelativeTime(laboratorio.fechacreacion)}</td>
                  <td className={style.actionsDetails}>
                    <AdminIconButton icon={Edit} title="editar" type="edit" />
                    <AdminIconButton icon={Eye} title="ver" type="detail"/>
                    <AdminIconButton icon={laboratorio.estado === "Activo" ? UserX : UserCheck} type="delete"/>
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
