import AuthLayout from "../../layouts/AuthLayout";
import AuthForm from "../../components/UI/auth/AuthForm";
import AuthInput from "../../components/UI/auth/AuthInput";
import AuthTextLink from "../../components/UI/auth/AuthTextLink";
import AuthButton from "../../components/UI/auth/AuthButton";
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../context/ModalContext'; // 1. Importamos el control remoto
import { loginUser } from '../../services/auth/authService';
//import { registrarLogLogin } from '../../services/admin/GestionAdminService';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // Importamos los iconos
import style from './Login.module.css';

function Login() {
    const navigate = useNavigate();
    const { showModal } = useModal();
    const [correo, setCorreo] = useState('');
    const [clave, setClave] = useState('');
    const [cargando, setCargando] = useState(false);
    const [verClave, setVerClave] = useState(false); // Estado para el ojo

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
            console.log("DATOS RECIBIDOS:", datos);

            if (datos && datos.access && datos.user) {
                // 1. Guardamos el token
                localStorage.setItem('token', datos.access);
                
                // 2. Guardamos la info del usuario DIRECTAMENTE del objeto 'user'
                // Ya no necesitamos split('.'), atob(), ni JSON.parse manual.
                localStorage.setItem('user_id', datos.user.id);
                localStorage.setItem('user_name', datos.user.nombre);
                localStorage.setItem('user_role', datos.user.rol);

                // 3. Registrar Log (usando el ID que ya tenemos del objeto user)
                try {
                    await registrarLogLogin(datos.user.id);
                } catch (logError) {
                    console.error("Error en Log:", logError);
                }

                // 4. Redirección
                setTimeout(() => {
                    navigate('/admin');
                }, 1000);

            } else {
                showModal('error', 'Credenciales incorrectas.');
            }
        } catch (error) {
            console.error("Error en login:", error);
            showModal('error', 'Error al conectar con el servidor.');
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
