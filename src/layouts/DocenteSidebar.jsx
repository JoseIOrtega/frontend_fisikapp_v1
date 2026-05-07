import { NavLink } from 'react-router-dom';
import imgLogo from "../assets/images/Logo.png";
import style from './AdminSidebar.module.css'; 
import { 
  Home, FlaskConical, Users, ClipboardList, UserPen, Settings 
} from 'lucide-react'; 

function DocenteSidebar() {
    return (
        <aside className={style.sidebar}>
            <div className={style.brandContainer}>
                <div className={style.logoWrapper}>
                    <img src={imgLogo} alt="Fisikapp Logo" className={style.logoImg} />
                </div>
            </div>

            <nav className={style.navigation}>
                {/* 1. DASHBOARD */}
                <NavLink to="/profesor/dashboard" end className={({isActive}) => isActive ? style.activeLink : style.link}>
                    <Home size={20} /> <span>Dashboard</span>
                </NavLink>

                {/* 2. MIS LABORATORIOS */}
                <NavLink to="/profesor/mis-laboratorios" className={({isActive}) => isActive ? style.activeLink : style.link}>
                    <FlaskConical size={20} /> <span>Mis Laboratorios</span>
                </NavLink>

                {/* 3. MIS ESTUDIANTES (Filtrados por laboratorio seleccionado) */}
                <NavLink to="/profesor/mis-estudiantes" className={({isActive}) => isActive ? style.activeLink : style.link}>
                    <Users size={20} /> <span>Mis Estudiantes</span>
                </NavLink>

                {/* 4. HISTORIAL DE REPORTES (Al final del flujo de trabajo) */}
                <NavLink to="/profesor/reportes" className={({isActive}) => isActive ? style.activeLink : style.link}>
                    <ClipboardList size={20} /> <span>Historial de Reportes</span>
                </NavLink>

                {/* PERFIL */}
                <NavLink to="/profesor/perfil" className={({isActive}) => isActive ? style.activeLink : style.link}>
                    <UserPen size={20} /> <span>Perfil</span>
                </NavLink>
            </nav>

            <div className={style.footer}>
                <NavLink to="/profesor/configuracion" className={style.link}>
                    <Settings size={20} /> <span>Configuración</span>
                </NavLink>
            </div>
        </aside>
    );
}

export default DocenteSidebar;