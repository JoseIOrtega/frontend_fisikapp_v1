import { useState, useEffect, useRef } from 'react';
import { UserCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import style from './AdminUserMenu.module.css';

// 1. Agregamos 'userPhoto' a las props que recibe el componente
function AdminUserMenu({ userName = "Usuario", userPhoto = null }) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const handleCerrarSesionClick = () => {
    localStorage.clear(); 
    window.location.href = '/';
  };

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
      
      {/* 2. CAMBIO CLAVE: Si hay foto, mostramos <img>, si no, el ícono de siempre */}
      <div className={style.avatarWrapper} onClick={() => setShowMenu(!showMenu)}>
        {userPhoto ? (
          <img 
            src={userPhoto} 
            alt="Perfil" 
            className={style.profileImage} 
          />
        ) : (
          <UserCircle size={36} className={style.profileIcon} />
        )}
      </div>

      {showMenu && (
        <div className={style.dropdown}>
          <div className={style.menuHeader}>
            Hola, {userName}
          </div>
          <div className={style.divider} />
          
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