import { useState, useEffect } from "react";

import AdminLayout from "../../layouts/AdminLayout"
import AdminCrateButton from "../../components/UI/admin/AdminCreateButton"
import AdminDataTable from "../../components/UI/admin/AdminDataTable"
import AdminIconButton from "../../components/UI/admin/AdminIconButton";
import { FlaskConical, Edit, Eye, UserX, UserCheck } from 'lucide-react';
import { getRelativeTime } from '../../utils/dateHelpers';
import style from './LabAuditoriaContenido.module.css'


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

const [laboratorios, setLaboratorios] = useState([]);

useEffect(() => {
  const fetchLaboratorios = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/laboratorios/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzc3MTM5NzU2LCJpYXQiOjE3NzcxMzI1NTYsImp0aSI6IjE4NWNjYjVjNDI1OTRhZWM5ZTAwZjg2ZDAwYjg2Nzg0IiwidXNlcl9pZCI6IjYifQ.6lco2uH0xL2-EyLdvwNSRBwDubyfvpX6LSmmaO-ZxMA`
        }
      });

      const data = await response.json();
      console.log("DATA:", data);

      if (Array.isArray(data)) {
        setLaboratorios(data);
      } else {
        console.error("No es array:", data);
        setLaboratorios([]);
      }

    } catch (error) {
      console.error("Error:", error);
      setLaboratorios([]);
    }
  };

  fetchLaboratorios();
}, []);

const filteredAdmins = Array.isArray(laboratorios)
  ? laboratorios.filter((lab) => {
      const search = searchTerm.toLowerCase();

      return (
        (lab.titulo_lab || "").toLowerCase().includes(search) ||
        (String(lab.categoria || "")).toLowerCase().includes(search) ||
        (String(lab.creador || "")).toLowerCase().includes(search) ||
        (lab.estado ? "activo" : "inactivo").includes(search)
      );
    })
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
                  <td className={style.nombre_laboratorio}>{laboratorio.titulo_lab}</td>
                  <td>{laboratorio.categoria}</td>
                  <td><span className={style.creador}>{laboratorio.creador}</span></td>
                  <td><span className={laboratorio.estado ? style.statusActive : style.statusInactive}>{laboratorio.estado ? "Activo" : "Inactivo"}</span></td>
                  <td title={new Date(laboratorio.fecha_actualizacion).toLocaleString()} style={{ cursor: 'help' }}>{getRelativeTime(laboratorio.fecha_actualizacion)}</td>
                  <td className={style.actionsDetails}>
                    <AdminIconButton icon={Eye} title="ver" type="detail"/>
                    <AdminIconButton icon={laboratorio.estado ? UserX : UserCheck} type="delete"/>
                  </td>
                </tr>
              )}
            ></AdminDataTable>
        </div>
    </AdminLayout>
  )
}

export default LabAuditoriaContenido