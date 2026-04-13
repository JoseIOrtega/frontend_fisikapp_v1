import AuthLayout from "../../layouts/AuthLayout";
import AuthForm from "../../components/UI/auth/AuthForm";
import AuthInput from "../../components/UI/auth/AuthInput";
import AuthTextLink from "../../components/UI/auth/AuthTextLink";
import AuthButton from "../../components/UI/auth/AuthButton";
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../context/ModalContext'; // 1. Importamos el control remoto
import { loginUser } from '../../services/auth/authService';
import { registrarLogLogin } from '../../services/admin/GestionAdminService';
import { useState } from 'react';
import style from './Login.module.css';

function Login() {
    const navigate = useNavigate();
    const { showModal } = useModal();
    const [correo, setCorreo] = useState('');
    const [clave, setClave] = useState('');
    const [cargando, setCargando] = useState(false); // Nuevo: Estado para evitar doble clic

    const handleInciarSesionClick = async (e) => {
        if (e) e.preventDefault();

        // NUEVO: Limpiamos datos viejos para que no se mezclen los IDs
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');

        if (!correo || !clave) {
            showModal('warning', 'Por favor, completa todos los campos.');
            return;
        }

        setCargando(true); // Desactivamos el botón mientras esperamos

        try {
            const datos = await loginUser(correo, clave);
            console.log("MOSTRAR LOS DATOS: ", datos)
            if (datos && datos.access) {
            
                localStorage.setItem('token', datos.access);
                    
                // Función rápida para decodificar el token sin librerías
                const base64Url = datos.access.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const payload = JSON.parse(window.atob(base64));

                // Guardamos el ID que viene dentro del token
                const userId = payload.user_id || payload.id || payload.sub;
                localStorage.setItem('user_id', userId);

                // Registramos el ingreso en los Logs antes de navegar
                try {
                    await registrarLogLogin(userId);
                } catch (logError) {
                    console.error("No se pudo registrar el log, pero el login continúa", logError);
                }

                // Pequeña pausa para que el usuario vea el mensaje de éxito
                setTimeout(() => {
                    navigate('/admin');
                }, 1500);

            } else {
                showModal('error', 'Correo o contraseña incorrectos. Por favor, verifica tus datos.');
            }
        } catch (error) {
            console.error("Error en login:", error);
            showModal('error', error.message || 'Error al conectar con el servidor.');
        } finally {
            setCargando(false); // Reactivamos el botón
        }
    };

    const handleRegisterClick = () => {
        navigate('/registrar-usuario'); 
    };

    return (
        <AuthLayout>
            <div className={style.ubicacion}>
                <AuthForm onSubmit={handleInciarSesionClick}>
                    <AuthInput label="Correo electrónico" type="text" value={correo} onChange={(e) => setCorreo(e.target.value)}  placeholder="correo@ejemplo.com" required />
                    <AuthInput label="Contraseña" type="password" value={clave} onChange={(e) => setClave(e.target.value)}   placeholder="***********" required />
                    
                    <AuthTextLink to="recuperar-contrasena">¿Olvidaste tu contraseña?</AuthTextLink>
            
                    <AuthButton type="submit" disabled={cargando}>{cargando ? 'Inicia sesión' : 'Inicia sesión'}</AuthButton>
                    <AuthButton type="button" onClick={handleRegisterClick} variant="secondary">Regístrate</AuthButton>
                </AuthForm>
            </div>
        </AuthLayout>
    );
}

export default Login;
