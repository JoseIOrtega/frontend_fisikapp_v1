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
import { obtenerDatosPorId } from '../../services/admin/PerfilService';
import { Eye, EyeOff } from 'lucide-react'; // Importamos los iconos
import style from './Login.module.css';

function Login() {
    const navigate = useNavigate();
    const { showModal } = useModal();
    const [correo, setCorreo] = useState('');
    const [clave, setClave] = useState('');
    const [cargando, setCargando] = useState(false); // Nuevo: Estado para evitar doble clic
    const [verClave, setVerClave] = useState(false); // Estado para el ojo

    const handleInciarSesionClick = async (e) => {
        if (e) e.preventDefault();

        // Limpiamos datos viejos
        localStorage.clear(); // Es más seguro limpiar todo al iniciar

        if (!correo || !clave) {
            showModal('warning', 'Por favor, completa todos los campos.');
            return;
        }

        setCargando(true);

        try {
            const datos = await loginUser(correo, clave);

            

            if (datos && datos.access) {
                localStorage.setItem('token', datos.access);
                
                // 1. Decodificación manual del token
                const base64Url = datos.access.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const payload = JSON.parse(window.atob(base64));
                const userId = payload.user_id || payload.id || payload.sub;
                
                localStorage.setItem('user_id', userId);

                // --- ¡EL CAMBIO CLAVE AQUÍ! ---
                // En lugar de confiar en el payload que dice 'estudiante', 
                // consultamos el perfil real de la base de datos inmediatamente.
                try {
                    const perfilReal = await obtenerDatosPorId(userId); 
                    if (perfilReal && perfilReal.rol) {
                        localStorage.setItem('user_role', perfilReal.rol); // Guardará 'superadmin'
                        localStorage.setItem('user_name', perfilReal.nombre);
                        console.log("Rol real sincronizado:", perfilReal.rol);
                    } else {
                        // Si falla la consulta, usamos un fallback basado en el token
                        const fallBackRole = payload.rol || (payload.is_superuser ? 'superadmin' : 'docente');
                        localStorage.setItem('user_role', fallBackRole);
                    }
                } catch (perfilError) {
                    console.error("Error al obtener perfil real en login:", perfilError);
                    // Fallback de seguridad
                    localStorage.setItem('user_role', 'docente'); 
                }
                // ------------------------------

                // Registro de logs
                try {
                    await registrarLogLogin(userId);
                } catch (logError) {
                    console.error("Error en log:", logError);
                }

                console.log("MOSTRAR DATOS ",datos);
                setTimeout(() => {
                    navigate('/admin');
                }, 1000);

            } else {
                showModal('error', 'Correo o contraseña incorrectos.');
            }
        } catch (error) {
            showModal('error', error.message || 'Error al conectar con el servidor.');
        } finally {
            setCargando(false);
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
                    <AuthInput 
                        label="Contraseña" 
                        type={verClave ? "text" : "password"} 
                        value={clave} 
                        onChange={(e) => setClave(e.target.value)}  
                        placeholder="***********" 
                        required 
                        // PASAMOS EL ICONO COMO PROP
                        iconAction={
                            verClave 
                                ? <Eye size={20} onClick={() => setVerClave(false)} /> 
                                : <EyeOff size={20} onClick={() => setVerClave(true)} />
                        }
                    ></AuthInput>
                    <AuthTextLink to="recuperar-contrasena">¿Olvidaste tu contraseña?</AuthTextLink>
            
                    <AuthButton type="submit" disabled={cargando}>{cargando ? 'Inicia sesión' : 'Inicia sesión'}</AuthButton>
                    <AuthButton type="button" onClick={handleRegisterClick} variant="secondary">Regístrate</AuthButton>
                </AuthForm>
            </div>
        </AuthLayout>
    );
}

export default Login;
