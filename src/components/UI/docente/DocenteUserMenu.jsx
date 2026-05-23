import { useState, useEffect, useRef } from 'react';
import { LogOut } from 'lucide-react'; // Quitamos UserCircle porque ya no lo usaremos
import { useNavigate } from 'react-router-dom';
import style from './DocenteUserMenu.module.css';

function DocenteUserMenu({ userName = "Usuario", userPhoto = null }) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const [imgSrc, setImgSrc] = useState(userPhoto);

  useEffect(() => {
    setImgSrc(userPhoto);
  }, [userPhoto]);

  // 🚀 NUEVA FUNCIÓN: Extrae las iniciales del nombre del docente (Max 2 letras)
  const obtenerIniciales = (nombre) => {
    if (!nombre) return "U";
    const palabras = nombre.trim().split(/\s+/); // Divide por espacios
    if (palabras.length === 1) return palabras[0].charAt(0).toUpperCase();
    
    // Toma la primera letra del primer nombre y del primer apellido (o segundo nombre)
    return (palabras[0].charAt(0) + palabras[1].charAt(0)).toUpperCase();
  };

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
      
      <div className={style.avatarWrapper} onClick={() => setShowMenu(!showMenu)}>
        {imgSrc ? (
          <img 
            src={imgSrc} 
            alt="Perfil" 
            className={style.profileImage} 
            onError={() => {
              console.warn("La imagen de Cloudinary dio 404. Cambiando a iniciales.");
              setImgSrc(null); // Si falla Cloudinary, pasa a null y activa el bloque de abajo
            }}
          />
        ) : (
          // 🚀 MODIFICADO: Contenedor con las iniciales del docente
          <div className={style.initialsAvatar}>
            {obtenerIniciales(userName)}
          </div>
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
            onClick={() => { navigate('/profesor/perfil'); setShowMenu(false); }}
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

export default DocenteUserMenu;