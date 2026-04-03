import AdminLayout from "../../layouts/AdminLayout"
import style from './PerfilAdmin.module.css'
import AuthInput from "../../components/UI/AuthInput"
function PerfilAdmin() {
  return (
    <AdminLayout>
        <div className={style["layout"]}>
            <h2>Perfil Admin</h2>
            <div style={{ textAlign: "center", marginBottom: "15px" }}>
  <img
    src="https://i.pravatar.cc/100"
    alt="avatar"
    style={{ borderRadius: "50%" }}
  />
  <h3  className={style["name"]}>DANIELA</h3>
  <p style={{ color: "#070808", fontSize: "14px" }}>Administrador</p>
</div>
          <div className={style["card"]}>
       <div>
    <AuthInput label="Nombre" type="text" placeholder="Diana" />
  </div>

  <div>
    <AuthInput label="Correo electrónico" type="email" placeholder="correo@ejemplo.com" />
  </div>

  <div>
    <AuthInput label="Contraseña" type="password" placeholder="********" />
  </div>

  <div>
    <AuthInput label="Rol" type="text" placeholder="Administrador" />
  </div>

  <div>
    <AuthInput label="Laboratorios Creados" type="number" placeholder="8" />
  </div>

  <div>
    <AuthInput label="Última Actividad" type="text" placeholder="Hoy" />
  </div>

          <button className={style["btnGuardar"]}>
             Guardar Cambios
         </button>
         </div>
        </div>
    </AdminLayout>
  )
}

export default PerfilAdmin