import { NavLink, useLocation } from 'react-router-dom';
import imgLogo from "../assets/images/Logo.png";
import style from './AdminSidebar.module.css';
// Puedes usar librerías como lucide-react para los iconos
import { Home, FlaskConical, Users, UserPen, Lock, Unlock, Settings, ChevronDown } from 'lucide-react';
import { useState } from 'react';

function Sidebar({ esSuperAdmin }) {

    esSuperAdmin=true;  // QUITAR ESTA LINEA SOLO ES DE PRUEBA

    const location = useLocation();
    
    // El submenú se abre automáticamente si estamos en una ruta de laboratorio
    const [isLaboratoriosOpen, setIsLaboratoriosOpen] = useState(location.pathname.includes('/admin/laboratorio'));

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
                    onClick={() => setIsLaboratoriosOpen(!isLaboratoriosOpen)}
                >
                    <div className={style.linkContent}>
                        <FlaskConical size={20} /> 
                        <span>Laboratorios</span>
                    </div>
                    <ChevronDown 
                        size={16} 
                        className={`${style.arrow} ${isLaboratoriosOpen ? style.arrowRotate : ''}`} 
                    />
                </div>

                <div className={`${style.subMenuItems} ${isLaboratoriosOpen ? style.show : ''}`}>
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