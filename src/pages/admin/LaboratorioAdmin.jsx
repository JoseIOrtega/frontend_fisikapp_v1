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
    { id: 1, nombre_de_laboratorio: "caida libre", categoria: "fisica", creador: "jorge guevara", estado: "Activo", ultimoingreso: "ayer" },
    { id: 2, nombre_de_laboratorio: "la iliada", categoria: "español", creador: "tilin tilin", estado: "Inactivo", ultimoingreso: "hoy" },
    { id: 3, nombre_de_laboratorio: "GABO", categoria: "literatura", creador: "adalberto martinez", estado: "Inactivo", ultimoingreso: "hace 2 dias" },
    { id: 4, nombre_de_laboratorio: "la libertad", categoria: "ADSO", creador: "juan diego murcia", estado: "Inactivo", ultimoingreso: "hace 3 dias" },
    { id: 5, nombre_de_laboratorio: "presente-simple", categoria: "ingles", creador: "pedro solarte", estado: "Activo", ultimoingreso: "hace 15 dias" }
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
                    <AdminIconButton icon={Edit} title="editar"  />
                    <AdminIconButton icon={Eye} title="ver" />
                    <AdminIconButton icon={laboratorio.estado === "Activo" ? UserX : UserCheck} />
                  </td>
                </tr>
              )}
            ></AdminDataTable>
        </div>
    </AdminLayout>
  )
}

export default LaboratorioAdmin