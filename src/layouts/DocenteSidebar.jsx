import { NavLink } from 'react-router-dom';
import imgLogo from "../assets/images/Logo.png";
import style from './AdminSidebar.module.css'; // Reutilizamos el MISMO CSS
import { 
  Home, FlaskConical, Users, UserPen, Settings 
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
                {/* DASHBOARD */}
                <NavLink 
                    to="/docente/dashboard" 
                    end 
                    className={({isActive}) => isActive ? style.activeLink : style.link}
                >
                    <Home size={20} /> <span>Dashboard</span>
                </NavLink>

                {/*LABORATORIOS CREADOS POR EL DOCENTE USANDO LA ESTRUCTURA del lab creado por el admin*/}
                <NavLink 
                    to="/docente/mis-laboratorios" 
                    className={({isActive}) => isActive ? style.activeLink : style.link}
                >
                    <FlaskConical size={20} /> <span>Mis Laboratorios</span>
                </NavLink>

                {/* LOS ESTUDIANTES QUE SE UNEN A UN LABORATORIO ESPECIFICO*/}
                <NavLink 
                    to="/docente/mis-estudiantes" 
                    className={({isActive}) => isActive ? style.activeLink : style.link}
                >
                    <Users size={20} /> <span>Mis Estudiantes</span>
                </NavLink>

                {/* PERFIL DOCENTE */}
                <NavLink 
                    to="/docente/perfil" 
                    className={({isActive}) => isActive ? style.activeLink : style.link}
                >
                    <UserPen size={20} /> <span>Perfil</span>
                </NavLink>
            </nav>

            <div className={style.footer}>
                <NavLink to="/docente/configuracion" className={style.link}>
                    <Settings size={20} /> <span>Configuración</span>
                </NavLink>
            </div>
        </aside>
    );
}

export default DocenteSidebar;