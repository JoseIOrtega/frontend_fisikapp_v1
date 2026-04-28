import AuthLayout from "../../layouts/AuthLayout";
import AuthForm from "../../components/UI/auth/AuthForm";
import AuthInput from "../../components/UI/auth/AuthInput";
import AuthTextLink from "../../components/UI/auth/AuthTextLink";
import AuthButton from "../../components/UI/auth/AuthButton";
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../context/ModalContext'; // 1. Importamos el control remoto
import { loginUser } from '../../services/auth/authService';
import { registrarLogLogin } from '../../services/admin/GestionAdminService';
import { useState,useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // Importamos los iconos
import style from './Login.module.css';

function Login() {
    const navigate = useNavigate();
    const { showModal } = useModal();
    const [correo, setCorreo] = useState('');
    const [clave, setClave] = useState('');
    const [cargando, setCargando] = useState(false);
    const [verClave, setVerClave] = useState(false); // Estado para el ojo

    // --- ESTE ES EL CÓDIGO QUE DEBES AGREGAR ---
    useEffect(() => {
        // Al cargar el Login, nos aseguramos de que no haya basura de sesiones viejas
        // Esto evita que otros componentes intenten usar un token que ya no sirve
        const tokenExistente = localStorage.getItem('token');
        
        if (tokenExistente) {
            console.log("Sesión antigua detectada, limpiando para evitar errores 403...");
            localStorage.clear(); 
        }
    }, []);

    const handleInciarSesionClick = async (e) => {
        if (e) e.preventDefault();

        // Limpiamos TODO para empezar de cero
        localStorage.clear(); 

        if (!correo || !clave) {
            showModal('warning', 'Por favor, completa todos los campos.');
            return;
        }

        setCargando(true);

        try {
            const datos = await loginUser(correo, clave);

            // Si llegamos aquí es porque el backend devolvió 200 OK
            localStorage.setItem('token', datos.access);
            localStorage.setItem('user_id', datos.user.id);
            localStorage.setItem('user_name', datos.user.nombre);
            localStorage.setItem('user_role', datos.user.rol);

            await registrarLogLogin(datos.user.id);

            setTimeout(() => navigate('/admin'), 1000);

        } catch (error) {

            if (error.status === 403) {
                // Aquí es donde capturamos el bloqueo de cuenta inactiva
                // Usamos error.data.error porque así viene desde el backend
                const mensaje = error.data?.error || 'Tu cuenta se encuentra inactiva.';
                showModal('error', mensaje);
            } else if (error.status === 400) {
                showModal('error', 'Correo o contraseña incorrectos.');
            } else if (error.status === 404) {
                showModal('error', 'Correo o contraseña incorrectos.');
            } else {
                // Mensaje amigable para que no se estresen si falla otra cosa
                showModal('error', 'Hubo un problema al conectar con el servidor.');
            }
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
