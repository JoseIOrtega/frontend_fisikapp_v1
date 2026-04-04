import { useState, useEffect, useRef } from 'react'; // Importamos los hooks necesarios
import { UserCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import style from './AdminUserMenu.module.css';

function AdminUserMenu({ userName = "Usuario" }) {
  const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate();
  const handleCerrarSesionClick=()=>{
    navigate('/')
  }
  
  // 1. Creamos la referencia (como un ancla) para el menú
  const menuRef = useRef(null);
  // 2. Lógica para cerrar al hacer clic afuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Si el clic NO ocurrió dentro de nuestro menuRef, cerramos
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    // Si el menú está abierto, activamos el "escucha" de clics en toda la pantalla
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Limpieza: quitamos el evento cuando se cierra o se destruye el componente
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]); // Se vuelve a ejecutar cada vez que cambia el estado del menú

  return (
    /* 3. Le ponemos la referencia 'ref' al contenedor principal */
    <div className={style.profileContainer} ref={menuRef}>
      <UserCircle 
        size={36} 
        className={style.profileIcon} 
        onClick={() => setShowMenu(!showMenu)} 
      />

      {showMenu && (
        <div className={style.dropdown}>
          <div className={style.menuHeader}>
            Hola, {userName}
          </div>
          <div className={style.divider} />
          <button className={style.menuItem}>Perfil-configuración</button>
          <button className={`${style.menuItem} ${style.logout}`} onClick={handleCerrarSesionClick}>
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminUserMenu;