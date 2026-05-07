import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import style from './AdminLayout.module.css';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';
import { Menu, X } from 'lucide-react';

function AdminLayout({ children, onSearch }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Diccionario de rutas
  const routeNames = {
    "/admin/dashboard": "Dashboard",
    "/admin/laboratorio/auditoria_contenido": "Gestión de Laboratorios",
    "/admin/laboratorio/repositorio_labs": "Gestión de Laboratorios",
    "/admin/laboratorio/configurar_labs": "Gestión de Laboratorios",
    "/admin/usuarios": "Gestión de Usuarios",
    "/admin/perfil": "Mi Perfil",
    "/admin/gestionadmin": "Gestión de Admins",
    "/admin/configuracion":"Panel de Control",
  };

  const currentTitle = routeNames[location.pathname] || "Panel de Control";

  return (
    <div className={style['admin-layout']}>
      {/* Botón móvil */}
      <button 
        className={style.mobileBtn} 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay móvil */}
      {isSidebarOpen && (
        <div className={style.overlay} onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`${style.sidebarWrapper} ${isSidebarOpen ? style.show : ''}`}>
        {/* Aquí puedes pasar el rol directo del localStorage si el Sidebar lo necesita */}
        <AdminSidebar esSuperAdmin={localStorage.getItem('user_role') === 'superadmin'}/>
      </div>

      <div className={style['main-content']}>
        <div className={style['navbar-container']}>
          <AdminNavbar pageTitle={currentTitle} onSearch={onSearch}/>
        </div>
        <div className={style['info']}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;