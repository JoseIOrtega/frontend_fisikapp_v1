import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import style from './AdminLayout.module.css'; // Usamos este mientras tanto
import DocenteSidebar from './DocenteSidebar';
import AdminNavbar from './AdminNavbar'; // El Navbar sí lo podemos reutilizar directo
import { Menu, X } from 'lucide-react';

function DocenteLayout({ children, onSearch }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const routeNames = {
    "/docente/dashboard": "Dashboard",
    "/docente/mis-laboratorios": "Mis Laboratorios",
    "/docente/mis-estudiantes": "Gestión de Estudiantes",
    "/docente/perfil": "Mi Perfil",
    "/docente/configuracion": "Configuración"
  };

  const currentTitle = routeNames[location.pathname] || "Panel Docente";

  return (
    <div className={style['admin-layout']}>
      {/* Botón móvil */}
      <button 
        className={style.mobileBtn} 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar del Docente */}
      <div className={`${style.sidebarWrapper} ${isSidebarOpen ? style.show : ''}`}>
        <DocenteSidebar />
      </div>

      <div className={style['main-content']}>
        {/* Reutilizamos el Navbar del Admin, solo cambia el título */}
        <AdminNavbar pageTitle={currentTitle} onSearch={onSearch}/>
        <div className={style['info']}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default DocenteLayout;