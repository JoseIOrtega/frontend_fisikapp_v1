import { NavLink } from 'react-router-dom';
import imgLogo from "../assets/images/Logo.png";
import style from './AdminSidebar.module.css';
// Puedes usar librerías como lucide-react para los iconos
import { Home, FlaskConical, Users, UserPen, Lock, Settings } from 'lucide-react'; 

function Sidebar({ esSuperAdmin }) {
  return (
    <aside className={style.sidebar}>

        <div className={style.brandContainer}>
            <div className={style.logoWrapper}>
                <img src={imgLogo} alt="Fisikapp Logo" className={style.logoImg} />
            </div>
        </div>
        <nav className={style.navigation}>
            <NavLink to="/admin/dashboard" className={({isActive}) => isActive ? style.activeLink : style.link}>
                <Home size={20} /> <span>Dashboard</span>
            </NavLink>

            <NavLink to="/admin/laboratorio" className={({isActive}) => isActive ? style.activeLink : style.link}>
                <FlaskConical size={20} /> <span>Laboratorios</span>
            </NavLink>

            <NavLink to="/admin/usuarios" className={({isActive}) => isActive ? style.activeLink : style.link}>
                <Users  size={20} /> <span>Usuarios</span>
            </NavLink>

            <NavLink to="/admin/perfil" className={({isActive}) => isActive ? style.activeLink : style.link}>
                <UserPen  size={20} /> <span>Perfil</span>
            </NavLink>

            {/* --- SECCIÓN EXCLUSIVA SUPERADMIN --- */}
            {esSuperAdmin && (
                <>
                    <div className={style.sectionTitle}>ADMINISTRACIÓN</div>
                    <NavLink to="/admin/gestionadmin" className={({isActive}) => isActive ? style.activeLink : style.link}>
                        <Lock size={20} /> <span>Gestión Admins</span>
                    </NavLink>
                </>
            )}
        </nav>

        <div className={style.footer}>
            <NavLink to="/admin/configuracion" className={style.link}>
                <Settings size={20} /> <span>Configuración</span>
            </NavLink>
        </div>
    </aside>
  );
}

export default Sidebar;