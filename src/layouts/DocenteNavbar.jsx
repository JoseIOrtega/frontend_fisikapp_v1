import { useState, useEffect } from 'react';
import style from './AdminNavbar.module.css';
import DocenteUserMenu from '../components/UI/docente/DocenteUserMenu';
import AdminSearchBar from '../components/UI/admin/AdminSearchBar';
// 1. Importamos el servicio para traer los datos del perfil
import { getPerfilUser } from '../services/admin/PerfilService';

function DocenteNavbar({ pageTitle, onSearch }) {
    // Estado para el nombre
    const [nombreUsuario, setNombreUsuario] = useState(() => {
        return localStorage.getItem('user_name') || "Usuario";
    });

    // 2. Estado para la foto (leída de la mochila o nula al inicio)
    const [fotoUsuario, setFotoUsuario] = useState(() => {
        return localStorage.getItem('user_photo') || null;
    });

    useEffect(() => {
        const cargarDatosIniciales = async () => {
            // 3. PLAN B: Si no hay foto en la mochila, vamos al servidor
            if (!localStorage.getItem('user_photo')) {
                try {
                    const data = await getPerfilUser();
                    if (data && data.foto) {
                        setFotoUsuario(data.foto);
                        // La guardamos para que la próxima vez no tenga que ir al servidor
                        localStorage.setItem('user_photo', data.foto);
                    }
                } catch{
                    console.error("No se pudo cargar la foto inicial del usuario");
                }
            }
        };

        // 4. Esta función actualiza la interfaz cuando algo cambia en el sistema
        const actualizarInterfaz = () => {
            const nombre = localStorage.getItem('user_name');
            const foto = localStorage.getItem('user_photo');
            if (nombre) setNombreUsuario(nombre);
            if (foto) setFotoUsuario(foto);
        };

        cargarDatosIniciales();

        // Escuchamos si cambian los datos (storage para otras pestañas, userUpdate para esta)
        window.addEventListener('storage', actualizarInterfaz);
        window.addEventListener('userUpdate', actualizarInterfaz);

        return () => {
            window.removeEventListener('storage', actualizarInterfaz);
            window.removeEventListener('userUpdate', actualizarInterfaz);
        };
    }, []);

    return (
        <header className={style.navbar}>
            <div className={style.leftSection}>
                <p className={style.breadcrumb}>Página</p>
                <h1 className={style.title}>{pageTitle}</h1>
            </div>
            <div className={style.rightSection}>
                <AdminSearchBar onSearch={onSearch} />
                <div className={style.actions}>
                    {/* 5. Le pasamos la foto al menú (el círculo rojo) */}
                    <DocenteUserMenu userName={nombreUsuario} userPhoto={fotoUsuario} /> 
                </div>
            </div>
        </header>
    );
}

export default DocenteNavbar;