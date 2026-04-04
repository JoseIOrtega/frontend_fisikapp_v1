import { NavLink } from 'react-router-dom';
import imgLogo from "../assets/images/Logo.png";
import style from './AdminSidebar.module.css';
// Puedes usar librerías como lucide-react para los iconos
import { Home, FlaskConical, Users, UserPen, Lock, Unlock, Settings } from 'lucide-react'; 

function Sidebar({ esSuperAdmin }) {

    esSuperAdmin=true;  // QUITAR ESTA LINEA SOLO ES DE PRUEBA

  return (
    <aside className={style.sidebar}>

        <div className={style.brandContainer}>
            <div className={style.logoWrapper}>
                <img src={imgLogo} alt="Fisikapp Logo" className={style.logoImg} />
            </div>
        </div>
        <nav className={style.navigation}>
            <NavLink to="/admin/dashboard" end className={({isActive}) => isActive ? style.activeLink : style.link}>
                <Home size={20} /> <span>Dashboard</span>
            </NavLink>

            <NavLink to="/admin/laboratorio" end className={({isActive}) => isActive ? style.activeLink : style.link}>
                <FlaskConical size={20} /> <span>Laboratorios</span>
            </NavLink>

            <NavLink to="/admin/usuarios" end className={({isActive}) => isActive ? style.activeLink : style.link}>
                <Users  size={20} /> <span>Usuarios</span>
            </NavLink>

            <NavLink to="/admin/perfil" end className={({isActive}) => isActive ? style.activeLink : style.link}>
                <UserPen  size={20} /> <span>Perfil</span>
            </NavLink>

            <NavLink 
                to={esSuperAdmin ? "/admin/gestionadmin" : "#"} 
                end
                onClick={(e) => !esSuperAdmin && e.preventDefault()} 
                className={({ isActive }) => (isActive && esSuperAdmin) ? style.activeLink : style.link}
                // Cambiamos el ! aquí. Queremos bloqueo si NO es superAdmin
                style={!esSuperAdmin ? { cursor: 'not-allowed', opacity: 0.6 } : {}}
            >
                {/* Cambiamos el ! aquí. Unlock para el que SI es, Lock para el que NO */}
                {esSuperAdmin ? (
                    <Unlock size={20}/>
                ) : (
                    <Lock size={20} color="#A3AED0" />
                )}
                <span>Gestión Admins</span>
            </NavLink>

        </nav>

        <div className={style.footer}>
            <NavLink to="/admin/configuracion" end className={style.link}>
                <Settings size={20} /> <span>Configuración</span>
            </NavLink>
        </div>
    </aside>
  );
}

export default Sidebar;