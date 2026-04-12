import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import style from './AdminLayout.module.css';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';
import { Menu, X } from 'lucide-react'; // Iconos para el botón móvil
// --- ESTA ES LA LÍNEA QUE DEBES AGREGAR ---
import { obtenerDatosPorId } from '../../src/services/admin/PerfilService';

function AdminLayout({ children, onSearch }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Diccionario de rutas para Fisikapp
  const routeNames = {
    "/admin/dashboard": "Dashboard",
    "/admin/laboratorio": "Gestión de Laboratorios",
    "/admin/usuarios": "Gestión de Usuarios",
    "/admin/perfil": "Mi Perfil",
    "/admin/gestionadmin": "Gestión de Admins",
    "/admin/configuracion":"Panel de Control",
  };
  // Buscamos el nombre basado en la ruta actual
  const currentTitle = routeNames[location.pathname] || "Panel de Control";

  // Dentro de AdminLayout.jsx o un componente que envuelva el Dashboard
  useEffect(() => {
      const sincronizarNombre = async () => {
          const id = localStorage.getItem('user_id');
          const nombreEnMochila = localStorage.getItem('user_name');

          // Si hay ID y el nombre es el provisional (el del correo o "Usuario")
          if (id && (!nombreEnMochila || nombreEnMochila.includes('@') || nombreEnMochila === "Usuario")) {
              try {
                  // Llamamos a la función que estandarizamos con la URL correcta
                  const usuario = await obtenerDatosPorId(id); 
                  
                  if (usuario && usuario.nombre) {
                      localStorage.setItem('user_name', usuario.nombre);
                      // Avisamos al Navbar para que cambie el nombre en tiempo real
                      window.dispatchEvent(new Event('storage'));
                  }
              } catch (e) {
                  console.error("Error al sincronizar el nombre real:", e);
              }
          }
      };
      sincronizarNombre();
  }, []);
  return (
    <div className={style['admin-layout']}>
      {/* 1. Botón Hamburguesa: Solo se verá en móviles */}
      <button 
        className={style.mobileBtn} 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* 2. Overlay: Oscurece el fondo al abrir el menú en móvil */}
      {isSidebarOpen && (
        <div className={style.overlay} onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* 3. Sidebar: Le pasamos una clase extra si está abierto */}
      <div className={`${style.sidebarWrapper} ${isSidebarOpen ? style.show : ''}`}>
        <AdminSidebar esSuperAdmin={true} />
      </div>

      <div className={style['main-content']}>
        {/* 4. Navbar: Ahora le pasamos el título */}
        <AdminNavbar pageTitle={currentTitle} onSearch={onSearch}/>
        <div className={style['info']}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;