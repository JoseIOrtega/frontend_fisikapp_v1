import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import style from './DocenteLayout.module.css'; 
import DocenteSidebar from './DocenteSidebar';
import AdminNavbar from './AdminNavbar'; 
import { Menu, X } from 'lucide-react';

function DocenteLayout({ children, onSearch }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Diccionario con el orden lógico y la nueva sección de reportes
  const routeNames = {
    "/profesor/dashboard": "Dashboard",
    "/profesor/mis-laboratorios": "Mis Laboratorios",
    "/profesor/mis-estudiantes": "Mis Estudiantes", // Solo habilitado al entrar a un lab
    "/profesor/reportes": "Historial de Reportes",   // Al final, como resultado del trabajo
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

      {/* Overlay para móvil */}
      {isSidebarOpen && (
        <div className={style.overlay} onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar del Profesor */}
      <div className={`${style.sidebarWrapper} ${isSidebarOpen ? style.show : ''}`}>
        <DocenteSidebar />
      </div>

      <div className={style['main-content']}>
        {/* Contenedor del Navbar: corregido para evitar anchos raros */}
        <div className={style['navbar-container']}>
          <AdminNavbar pageTitle={currentTitle} onSearch={onSearch}/>
        </div>
        
        {/* Contenedor con scroll inteligente para que Perfil no se corte */}
        <div className={style['info']}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default DocenteLayout;