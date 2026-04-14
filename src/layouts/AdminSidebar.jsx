import { useState } from 'react'; // Importante para el submenú
import { NavLink, useLocation } from 'react-router-dom';
import imgLogo from "../assets/images/Logo.png";
import style from './AdminSidebar.module.css';
import { 
  Home, FlaskConical, Users, UserPen, 
  Lock, Unlock, Settings, ChevronDown 
} from 'lucide-react'; 

function Sidebar({ esSuperAdmin }) {
    const location = useLocation();
    // Estado para abrir/cerrar el submenú de laboratorios
    const [labMenuOpen, setLabMenuOpen] = useState(location.pathname.includes('/admin/laboratorio'));
    
    esSuperAdmin = true;

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

                {/* --- SECCIÓN LABORATORIOS CON SUBMENÚ --- */}
                <div className={style.subMenuContainer}>
                    <div 
                        className={`${style.link} ${location.pathname.includes('/admin/laboratorio') ? style.activeParent : ''}`} 
                        onClick={() => setLabMenuOpen(!labMenuOpen)}
                    >
                        <div className={style.linkContent}>
                            <FlaskConical size={20} /> 
                            <span>Laboratorios</span>
                        </div>
                        <ChevronDown 
                            size={16} 
                            className={`${style.arrow} ${labMenuOpen ? style.arrowRotate : ''}`} 
                        />
                    </div>

                    {/* Los hijos del menú */}
                    <div className={`${style.subMenuItems} ${labMenuOpen ? style.show : ''}`}>
                        <NavLink to="/admin/laboratorio/auditoria_contenido" end className={({isActive}) => isActive ? style.activeSubLink : style.subLink}>
                            <span>Auditoría de Contenido</span>
                        </NavLink>
                        <NavLink to="/admin/laboratorio/configurar_labs" className={({isActive}) => isActive ? style.activeSubLink : style.subLink}>
                            <span>Configurar Laboratorios</span>
                        </NavLink>
                        <NavLink to="/admin/laboratorio/repositorio_labs" className={({isActive}) => isActive ? style.activeSubLink : style.subLink}>
                            <span>Repositorio de Laboratorios</span>
                        </NavLink>
                    </div>
                </div>
                {/* --------------------------------------- */}

                <NavLink to="/admin/usuarios" end className={({isActive}) => isActive ? style.activeLink : style.link}>
                    <Users size={20} /> <span>Usuarios</span>
                </NavLink>

                <NavLink to="/admin/perfil" end className={({isActive}) => isActive ? style.activeLink : style.link}>
                    <UserPen size={20} /> <span>Perfil</span>
                </NavLink>

                <NavLink 
                    to={esSuperAdmin ? "/admin/gestionadmin" : "#"} 
                    end
                    onClick={(e) => !esSuperAdmin && e.preventDefault()} 
                    className={({ isActive }) => (isActive && esSuperAdmin) ? style.activeLink : style.link}
                    style={!esSuperAdmin ? { cursor: 'not-allowed', opacity: 0.6 } : {}}
                >
                    {esSuperAdmin ? <Unlock size={20}/> : <Lock size={20} color="#A3AED0" />}
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