import AuthLayout from "../../layouts/AuthLayout";
import AuthForm from "../../components/UI/AuthForm";
import AuthInput from "../../components/UI/AuthInput";
import AuthTextLink from "../../components/UI/AuthTextLink";
import AuthButton from "../../components/UI/AuthButton";
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../context/ModalContext'; // 1. Importamos el control remoto
import { loginUser } from '../../services/auth/authService';
import { useState } from 'react';
import style from './Login.module.css';

function Login() {
    const navigate = useNavigate();

    const handleRegisterClick = () => {
        navigate('/registrar-usuario'); 
    };

    const { showModal } = useModal(); // 2. Activamos el acceso al almacén de modales
    
    const [correo, setCorreo] = useState('');
    const [clave, setClave] = useState('');

    const handleInciarSesionClick = async (e) => {
        if (e) e.preventDefault();
        try {
            const res = await loginUser(correo, clave);
            if (res.ok) {
                const datos = await res.json();
                localStorage.setItem('token', datos.access)
                showModal('success', '¡Bienvenido a Fisikapp!');
                navigate('/admin');
            } else {
                showModal('error', 'Correo o contraseña incorrectos. Por favor, verifica tus datos.');
            }
        } catch (error) {
            console.error("Detalle técnico del error:", error);
            showModal('warning', 'No logramos conectar con el servidor de Fisikapp.');
        }
    };

    return (
        <AuthLayout>
            <div className={style.ubicacion}>
                <AuthForm>
                    <AuthInput label="Correo electrónico" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)}  placeholder="correo@ejemplo.com" required />
                    <AuthInput label="Contraseña" type="password" value={clave} onChange={(e) => setClave(e.target.value)}   placeholder="***********" required />
                    
                    <AuthTextLink to="recuperar-contrasena">¿Olvidaste tu contraseña?</AuthTextLink>
            
                    <AuthButton type="button" onClick={handleInciarSesionClick}>Inicia sesión</AuthButton>
                    <AuthButton type="button" onClick={handleRegisterClick} variant="secondary">Regístrate</AuthButton>
                </AuthForm>
            </div>
        </AuthLayout>
    );
}

export default Login;
