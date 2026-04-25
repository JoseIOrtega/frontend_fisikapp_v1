import AdminLayout from "../../layouts/AdminLayout";
import style from "./LabDetalle.module.css";
import { useParams } from "react-router-dom";

function LabDetalle() {
  const { id } = useParams();

  return (
    <AdminLayout>
      <div className={style.container}>
        <h2>Detalle del laboratorio</h2>
        <p>ID: {id}</p>
      </div>
    </AdminLayout>
  );
}

export default LabDetalle;