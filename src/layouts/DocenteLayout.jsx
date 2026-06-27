import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import style from './DocenteLayout.module.css'; 
import DocenteSidebar from './DocenteSidebar';
import DocenteNavbar from './DocenteNavbar'; 
import { Menu, X } from 'lucide-react';
import HistorialReportes from "../pages/admin/HistorialReportesDocente";
import { Outlet } from 'react-router-dom';

function DocenteLayout({ children, onSearch }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Diccionario con las rutas estáticas
  const routeNames = {
    "/profesor/dashboard": "Dashboard",
    "/profesor/mis-laboratorios": "Laboratorios",
    "/profesor/archivados": "Laboratorios Archivados",
    "/profesor/sesiones-docente": "Sesiones", 
    "/profesor/mis-estudiantes": "Mis Estudiantes", 
    "/profesor/reportes": "Historial de Reportes",   
    "/profesor/perfil": "Mi Perfil",
    "/profesor/configuracion": "Configuración"
  };

  // Primero revisamos si la URL actual comienza con la ruta de configuración
  let currentTitle = "Panel Profesor";

  if (location.pathname.startsWith("/profesor/mis-laboratorios/configurar")) {
    currentTitle = "Configurar Laboratorio";
  } else if (routeNames[location.pathname]) {
    // Si no es la de configurar, la busca normalmente en tu diccionario
    currentTitle = routeNames[location.pathname];
  }

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

    {/* Contenido Principal */}
    <div className={style['main-content']}>
      {/* Contenedor del Navbar */}
      <div className={style['navbar-container']}>
        <DocenteNavbar pageTitle={currentTitle} onSearch={onSearch}/>
      </div>

        <div className={style['main-content']}>
          <div className={style['navbar-container']}>
            <DocenteNavbar pageTitle={currentTitle} onSearch={onSearch}/>
          </div>
    
           {/* Este es el espacio blanco de la derecha donde aparecerá la tabla */}
          <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '10px 30px 20px 30px' }}>
            <Outlet /> 
          </div>
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