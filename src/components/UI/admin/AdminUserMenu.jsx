import { useState, useEffect, useRef } from 'react'; // Importamos los hooks necesarios
import { UserCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import style from './AdminUserMenu.module.css';

// ... tus imports actuales ...

function AdminUserMenu({ userName = "Usuario" }) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  // AJUSTE: Función de cerrar sesión completa
  const handleCerrarSesionClick = () => {
    // 1. Limpiamos TODA la mochila de datos
    localStorage.clear(); 
    
    // O si prefieren ser específicos:
    // localStorage.removeItem('token');
    // localStorage.removeItem('user_email');
    // localStorage.removeItem('user_name');

    // 2. Mandamos al usuario al Login
    navigate('/');
    
    // 3. Opcional: Forzar recarga para limpiar cualquier estado de React en memoria
    window.location.reload();
  };

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className={style.profileContainer} ref={menuRef}>
      <UserCircle 
        size={36} 
        className={style.profileIcon} 
        onClick={() => setShowMenu(!showMenu)} 
      />

      {showMenu && (
        <div className={style.dropdown}>
          <div className={style.menuHeader}>
            {/* Aquí se mostrará el nombre real que viene del Navbar */}
            Hola, {userName}
          </div>
          <div className={style.divider} />
          
          {/* Pueden redirigir a la página de perfil que ya creamos */}
          <button 
            className={style.menuItem} 
            onClick={() => { navigate('/admin/perfil'); setShowMenu(false); }}
          >
            Perfil-configuración
          </button>

          <button className={`${style.menuItem} ${style.logout}`} onClick={handleCerrarSesionClick}>
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminUserMenu;