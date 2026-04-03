import AdminLayout from "../../layouts/AdminLayout"
import AdminCrateButton from "../../components/UI/AdminCreateButton"
import AdminDataTable from "../../components/UI/AdminDataTable"
import AdminIconButton from "../../components/UI/AdminIconButton";
import { FlaskConical, Edit, Eye, UserX, UserCheck } from 'lucide-react';
import style from './LaboratorioAdmin.module.css'

function LaboratorioAdmin() {
  const columnas = [
    { label: "Nombre de Laboratorio" },
    { label: "Categoria" },
    { label: "Creador" },
    { label: "Estado" },
    { label: "Último ingreso" },
    { label: "Acciones", style: { textAlign: 'center' } }
  ];

  const laboratorios = [
    { id: 1, nombre_de_laboratorio: "Lab. Caída Libre", categoria: "Cinemática", creador: "Jorge Guevara", estado: "Activo", ultimoingreso: "ayer" },
    { id: 2, nombre_de_laboratorio: "Lab. Mov. Rect. Uniforme", categoria: "Cinemática", creador: "Laura Pérez", estado: "Activo", ultimoingreso: "hoy" },
    { id: 3, nombre_de_laboratorio: "Lab. Tiro Parabólico", categoria: "Cinemática", creador: "Jorge Guevara", estado: "Inactivo", ultimoingreso: "hace 2 días" },
    { id: 4, nombre_de_laboratorio: "Lab. Leyes de Newton", categoria: "Mecánica", creador: "Andrés López", estado: "Activo", ultimoingreso: "hace 3 días" },
    { id: 5, nombre_de_laboratorio: "Lab. Energía Cinética y Potencial", categoria: "Mecánica", creador: "Sofía Ramírez", estado: "Activo", ultimoingreso: "hace 5 días" },
    { id: 6, nombre_de_laboratorio: "Lab. Ley de Ohm", categoria: "Circuitos", creador: "Carlos Méndez", estado: "Inactivo", ultimoingreso: "hace 1 semana" },
    { id: 7, nombre_de_laboratorio: "Lab. Circuitos en Serie", categoria: "Circuitos", creador: "Daniela Rojas", estado: "Activo", ultimoingreso: "hace 4 días" },
    { id: 8, nombre_de_laboratorio: "Lab. Campo Eléctrico", categoria: "Electromagnetismo", creador: "Felipe Gómez", estado: "Activo", ultimoingreso: "hace 2 días" },
    { id: 9, nombre_de_laboratorio: "Lab. Inducción Electromagnética", categoria: "Electromagnetismo", creador: "Camila Herrera", estado: "Activo", ultimoingreso: "hace 6 días" },
    { id: 10, nombre_de_laboratorio: "Lab. Ondas Mecánicas", categoria: "Ondas", creador: "Laura Pérez", estado: "Activo", ultimoingreso: "hace 3 días" }
  ];
  
  return (
    <AdminLayout>
        <div className={style["layout"]}>
            <div className={style["seccion_del_header"]}>
              <h2 className={style.titulo_header_laboratorio}>Laboratorios</h2>
              <AdminCrateButton icon={FlaskConical} text="Añadir Laboratorio"></AdminCrateButton>
            </div>

            <AdminDataTable
              columns={columnas}
              data={laboratorios}
              renderRow={(laboratorio) => (
                <tr key={laboratorio.id}>
                  <td className={style.nombre_laboratorio}>{laboratorio.nombre_de_laboratorio}</td>
                  <td>{laboratorio.categoria}</td>
                  <td>
                    <span className={style.creador}>{laboratorio.creador}</span>
                  </td>
                  <td>
                    <span className={
                      laboratorio.estado === "Activo"
                      ? style.statusActive
                      : style.statusInactive
                    }>{laboratorio.estado}</span>
                  </td>
                  <td>{laboratorio.ultimoingreso}</td>
                  <td className={style.actionsDetails}>
                    <AdminIconButton icon={Edit} title="editar" type="edit" />
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

export default LaboratorioAdmin