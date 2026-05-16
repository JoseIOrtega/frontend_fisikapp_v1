import { useState } from 'react'; // Importamos el estado
import { NavLink, useLocation } from 'react-router-dom';
import imgLogo from "../assets/images/Logo.png";
import style from './AdminSidebar.module.css'; 
import { 
  Home, FlaskConical, Users, ClipboardList, UserPen, Settings, ChevronDown, Archive 
} from 'lucide-react'; 

function DocenteSidebar() {
    const [isLabsOpen, setIsLabsOpen] = useState(false);
    const location = useLocation();

    // Verificamos si alguna subruta de laboratorios está activa para mantener el color
    const isLabsActive = location.pathname.includes('/profesor/mis-laboratorios') || 
                         location.pathname.includes('/profesor/archivados');

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

                {/* 2. GRUPO LABORATORIOS (ACORDEÓN) */}
                <div className={style.subMenuContainer}>
                    <div 
                        className={`${style.link} ${isLabsActive ? style.activeParent : ''}`} 
                        onClick={() => setIsLabsOpen(!isLabsOpen)}
                    >
                        <div className={style.linkContent}>
                            <FlaskConical size={20} /> 
                            <span>Laboratorios</span>
                        </div>
                        <ChevronDown 
                            size={16} 
                            className={`${style.arrow} ${isLabsOpen ? style.arrowRotate : ''}`} 
                        />
                    </div>

                    {/* SUB-ITEMS */}
                    <div className={`${style.subMenuItems} ${isLabsOpen ? style.show : ''}`}>
                        <NavLink 
                            to="/profesor/mis-laboratorios" 
                            className={({isActive}) => isActive ? style.activeSubLink : style.subLink}
                        >
                            Mis Laboratorios
                        </NavLink>
                        <NavLink 
                            to="/profesor/archivados" 
                            className={({isActive}) => isActive ? style.activeSubLink : style.subLink}
                        >
                            Archivados
                        </NavLink>
                    </div>
                </div>

                {/* 3. MIS ESTUDIANTES */}
                <NavLink to="/profesor/mis-estudiantes" className={({isActive}) => isActive ? style.activeLink : style.link}>
                    <Users size={20} /> <span>Mis Estudiantes</span>
                </NavLink>

                {/* 4. HISTORIAL DE REPORTES */}
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