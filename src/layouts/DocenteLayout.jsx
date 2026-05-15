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
          <div className={style['navbar-container']}>
            <DocenteNavbar pageTitle={currentTitle} onSearch={onSearch}/>
          </div>
    
           {/* Este es el espacio blanco de la derecha donde aparecerá la tabla */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <Outlet /> 
          </div>
        </div>

        
        {/* Contenedor con scroll inteligente para que Perfil no se corte */}
        <div className={style['info']}>
          {children}
        </div>
      
    </div>
  );
}

export default DocenteLayout;