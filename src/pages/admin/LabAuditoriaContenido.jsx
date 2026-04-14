import AdminLayout from "../../layouts/AdminLayout"
import AdminCrateButton from "../../components/UI/admin/AdminCreateButton"
import AdminDataTable from "../../components/UI/admin/AdminDataTable"
import AdminIconButton from "../../components/UI/admin/AdminIconButton";
import { FlaskConical, Edit, Eye, UserX, UserCheck } from 'lucide-react';
import { getRelativeTime } from '../../utils/dateHelpers';
import style from './LabAuditoriaContenido.module.css'
import { useState } from "react";

function LabAuditoriaContenido() {


  const [searchTerm, setSearchTerm] = useState("");

  const columnas = [
    { label: "Nombre de Laboratorio" },
    { label: "Categoría" },
    { label: "Creador" },
    { label: "Estado" },
    { label: "Último ingreso" },
    { label: "Acciones", style: { textAlign: 'center' } }
  ];

  const laboratorios = [
    { id: 1, nombre_de_laboratorio: "Lab. Caída Libre", categoria: "Cinemática", creador: "Jorge Guevara", estado: "Activo", ultimoIngreso: "2026-04-03T15:30:00Z" },
    { id: 2, nombre_de_laboratorio: "Lab. Mov. Rect. Uniforme", categoria: "Cinemática", creador: "Laura Pérez", estado: "Activo", ultimoIngreso: new Date().toISOString() },
    { id: 3, nombre_de_laboratorio: "Lab. Tiro Parabólico", categoria: "Cinemática", creador: "Jorge Guevara", estado: "Inactivo", ultimoIngreso: "2026-04-02T09:00:00Z" },
    { id: 4, nombre_de_laboratorio: "Lab. Leyes de Newton", categoria: "Mecánica", creador: "Andrés López", estado: "Activo", ultimoIngreso: "2026-04-01T11:20:00Z" },
    { id: 5, nombre_de_laboratorio: "Lab. Energía Cinética y Potencial", categoria: "Mecánica", creador: "Sofía Ramírez", estado: "Activo", ultimoIngreso: "2026-03-30T14:10:00Z" },
    { id: 6, nombre_de_laboratorio: "Lab. Ley de Ohm", categoria: "Circuitos", creador: "Carlos Méndez", estado: "Inactivo", ultimoIngreso: "2026-03-28T08:00:00Z" },
    { id: 7, nombre_de_laboratorio: "Lab. Circuitos en Serie", categoria: "Circuitos", creador: "Daniela Rojas", estado: "Activo", ultimoIngreso: "2026-03-31T17:45:00Z" },
    { id: 8, nombre_de_laboratorio: "Lab. Campo Eléctrico", categoria: "Electromagnetismo", creador: "Felipe Gómez", estado: "Activo", ultimoIngreso: "2026-04-02T13:15:00Z" },
    { id: 9, nombre_de_laboratorio: "Lab. Inducción Electromagnética", categoria: "Electromagnetismo", creador: "Camila Herrera", estado: "Activo", ultimoIngreso: "2026-03-29T10:30:00Z" },
    { id: 10, nombre_de_laboratorio: "Lab. Ondas Mecánicas", categoria: "Ondas", creador: "Laura Pérez", estado: "Activo", ultimoIngreso: "2026-04-01T16:00:00Z" }
  ];

const filteredAdmins = laboratorios.filter((laboratorio) => 
laboratorio.nombre_de_laboratorio.toLowerCase().includes(searchTerm.toLowerCase()) || 
laboratorio.categoria.toLowerCase().includes(searchTerm.toLowerCase()) || 
laboratorio.creador.toLowerCase().includes(searchTerm.toLowerCase()) || 
laboratorio.estado.toLowerCase().includes(searchTerm.toLowerCase()) || 
laboratorio.ultimoIngreso.toLowerCase().includes(searchTerm.toLowerCase())  
); 
  
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
                  <td className={style.nombre_laboratorio}>{laboratorio.nombre_de_laboratorio}</td>
                  <td>{laboratorio.categoria}</td>
                  <td><span className={style.creador}>{laboratorio.creador}</span></td>
                  <td><span className={laboratorio.estado === "Activo"? style.statusActive: style.statusInactive}>{laboratorio.estado}</span></td>
                  <td title={new Date(laboratorio.ultimoIngreso).toLocaleString()} style={{ cursor: 'help' }}>{getRelativeTime(laboratorio.ultimoIngreso)}</td>
                  <td className={style.actionsDetails}>
                    <AdminIconButton icon={Eye} title="ver" type="detail"/>
                    <AdminIconButton icon={laboratorio.estado === "Activo" ? UserX : UserCheck} type="delete"/>
                  </td>
                </tr>
              )}
            ></AdminDataTable>
        </div>
    </AdminLayout>
  )
}

export default LabAuditoriaContenido