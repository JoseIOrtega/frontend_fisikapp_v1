import { useState, useEffect } from 'react';
import style from './AdminNavbar.module.css';
import AdminUserMenu from '../components/UI/admin/AdminUserMenu';
import AdminSearchBar from '../components/UI/admin/AdminSearchBar';

function AdminNavbar({ pageTitle, onSearch }) {
    // Inicializamos con lo que haya en la mochila, o "Usuario" por defecto
    const [nombreUsuario, setNombreUsuario] = useState(() => {
        return localStorage.getItem('user_name') || "Usuario";
    });

    useEffect(() => {
        // Esta función se activa cuando lanzamos el "grito" desde el Perfil
        const actualizarNombre = () => {
            const guardado = localStorage.getItem('user_name');
            if (guardado) setNombreUsuario(guardado);
        };

        // Escuchamos el evento global de almacenamiento
        window.addEventListener('storage', actualizarNombre);

        return () => {
            window.removeEventListener('storage', actualizarNombre);
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
                    <AdminUserMenu userName={nombreUsuario} /> 
                </div>
            </div>
        </header>
    );
}

export default AdminNavbar;