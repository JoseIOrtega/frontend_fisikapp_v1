import { NavLink } from 'react-router-dom';
import imgLogo from "../assets/images/Logo.png";
import style from './AdminSidebar.module.css';
// Puedes usar librerías como lucide-react para los iconos
import { Home, FlaskConical, Users, UserPen, Lock, Unlock, Settings, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

function Sidebar({ esSuperAdmin }) {

    esSuperAdmin=true;  // QUITAR ESTA LINEA SOLO ES DE PRUEBA

    const [isLaboratoriosOpen, setIsLaboratoriosOpen] = useState(false);

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

            <div className={style.menuItem}>
                <button
                    onClick={() => setIsLaboratoriosOpen(!isLaboratoriosOpen)}
                    className={`${style.link} ${style.menuButton} ${isLaboratoriosOpen ? style.menuButtonOpen : ''}`}
                >
                    <FlaskConical size={20} />
                    <span>Laboratorios</span>
                    {isLaboratoriosOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>

                {isLaboratoriosOpen && (
                    <div className={style.submenu}>
                        <NavLink
                            to="/admin/laboratorio/repositorio_labs"
                            className={({isActive}) => isActive ? style.activeSubLink : style.subLink}
                        >
                            Repositorio de Laboratorios
                        </NavLink>
                        <NavLink
                            to="/admin/laboratorio/auditoria_contenido"
                            className={({isActive}) => isActive ? style.activeSubLink : style.subLink}
                        >
                            Auditoría de Contenido
                        </NavLink>
                        <NavLink
                            to="/admin/laboratorio/configurar_labs"
                            className={({isActive}) => isActive ? style.activeSubLink : style.subLink}
                        >
                            Configurar Laboratorios
                        </NavLink>
                    </div>
                )}
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