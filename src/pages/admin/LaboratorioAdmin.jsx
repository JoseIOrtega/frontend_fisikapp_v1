import ExampleModal from "../../components/modals/AdminModalLaboratorio"
import AdminLayout from "../../layouts/AdminLayout"
import AdminCrateButton from "../../components/UI/AdminCreateButton"
import AdminDataTable from "../../components/UI/AdminDataTable"
import AdminIconButton from "../../components/UI/AdminIconButton";
import { FlaskConical, Edit, Eye, UserX, UserCheck } from 'lucide-react';
import { getRelativeTime } from '../../utils/dateHelpers';
import style from './LaboratorioAdmin.module.css'
import { useState } from "react";

function LaboratorioAdmin() {


  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  const columnas = [
    { label: "Nombre de Laboratorio" },
    { label: "Categor├¡a" },
    { label: "Creador" },
    { label: "Estado" },
    { label: "├Ültimo ingreso" },
    { label: "Acciones", style: { textAlign: 'center' } }
  ];

  const laboratorios = [
    { id: 1, nombre_de_laboratorio: "Lab. Ca├¡da Libre", categoria: "Cinem├ítica", creador: "Jorge Guevara", estado: "Activo", ultimoIngreso: "2026-04-03T15:30:00Z" },
    { id: 2, nombre_de_laboratorio: "Lab. Mov. Rect. Uniforme", categoria: "Cinem├ítica", creador: "Laura P├®rez", estado: "Activo", ultimoIngreso: new Date().toISOString() },
    { id: 3, nombre_de_laboratorio: "Lab. Tiro Parab├│lico", categoria: "Cinem├ítica", creador: "Jorge Guevara", estado: "Inactivo", ultimoIngreso: "2026-04-02T09:00:00Z" },
    { id: 4, nombre_de_laboratorio: "Lab. Leyes de Newton", categoria: "Mec├ínica", creador: "Andr├®s L├│pez", estado: "Activo", ultimoIngreso: "2026-04-01T11:20:00Z" },
    { id: 5, nombre_de_laboratorio: "Lab. Energ├¡a Cin├®tica y Potencial", categoria: "Mec├ínica", creador: "Sof├¡a Ram├¡rez", estado: "Activo", ultimoIngreso: "2026-03-30T14:10:00Z" },
    { id: 6, nombre_de_laboratorio: "Lab. Ley de Ohm", categoria: "Circuitos", creador: "Carlos M├®ndez", estado: "Inactivo", ultimoIngreso: "2026-03-28T08:00:00Z" },
    { id: 7, nombre_de_laboratorio: "Lab. Circuitos en Serie", categoria: "Circuitos", creador: "Daniela Rojas", estado: "Activo", ultimoIngreso: "2026-03-31T17:45:00Z" },
    { id: 8, nombre_de_laboratorio: "Lab. Campo El├®ctrico", categoria: "Electromagnetismo", creador: "Felipe G├│mez", estado: "Activo", ultimoIngreso: "2026-04-02T13:15:00Z" },
    { id: 9, nombre_de_laboratorio: "Lab. Inducci├│n Electromagn├®tica", categoria: "Electromagnetismo", creador: "Camila Herrera", estado: "Activo", ultimoIngreso: "2026-03-29T10:30:00Z" },
    { id: 10, nombre_de_laboratorio: "Lab. Ondas Mec├ínicas", categoria: "Ondas", creador: "Laura P├®rez", estado: "Activo", ultimoIngreso: "2026-04-01T16:00:00Z" }
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
              <h2 className={style.titulo_header_laboratorio}>Laboratorios</h2>
              <AdminCrateButton icon={FlaskConical} text="A├▒adir Laboratorio" onClick={() => setShowModal(true)} />
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
                    <AdminIconButton icon={Edit} title="editar" type="edit" />
                    <AdminIconButton icon={Eye} title="ver" type="detail"/>
                    <AdminIconButton icon={laboratorio.estado === "Activo" ? UserX : UserCheck} type="delete"/>
                  </td>
                </tr>
              )}
            ></AdminDataTable>
            <ExampleModal show={showModal} onHide={() => setShowModal(false)} />
        </div>
    </AdminLayout>
  )
}

export default LaboratorioAdmin;
