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
    "/profesor/dashboard": "Dashboard",
    "/profesor/mis-laboratorios": "Mis Laboratorios",
    "/profesor/mis-estudiantes": "Gestión de Estudiantes",
    "/profesor/perfil": "Mi Perfil",
    "/profesor/configuracion": "Configuración"
  };

  const currentTitle = routeNames[location.pathname] || "Panel Profesor";

  return (
    <div className={style['admin-layout']}>
      {/* Botón móvil */}
      <button 
        className={style.mobileBtn} 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar del Profesor */}
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