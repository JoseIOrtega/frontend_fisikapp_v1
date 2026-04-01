import style from './AdminNavbar.module.css';
import AdminUserMenu from '../components/UI/AdminUserMenu';
import AdminSearchBar from '../components/UI/AdminSearchBar';

function AdminNavbar({ pageTitle }) {
    return (
    <header className={style.navbar}>
      {/* Izquierda: Ruta y Título Dinámico */}
      <div className={style.leftSection}>
        <p className={style.breadcrumb}>Página</p>
        <h1 className={style.title}>{pageTitle}</h1>
      </div>

      {/* Derecha: Buscador y Acciones */}
      <div className={style.rightSection}>
        <AdminSearchBar></AdminSearchBar>
        <div className={style.actions}>
          <AdminUserMenu userName="Jose" /> 
        </div>
      </div>
    </header>
    );
}

export default AdminNavbar;