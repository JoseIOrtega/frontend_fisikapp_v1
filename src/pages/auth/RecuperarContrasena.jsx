import React, { useState } from 'react'; // Necesario para capturar el correo
import AuthLayout from "../../layouts/AuthLayout";
import AuthForm from "../../components/UI/auth/AuthForm";
import AuthInput from "../../components/UI/auth/AuthInput";
import AuthButton from "../../components/UI/auth/AuthButton";
import AuthTextLink from "../../components/UI/auth/AuthTextLink";
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../context/ModalContext';
import { enviarEnlaceRecuperacion } from '../../services/auth/authService'; // Importamos el servicio
import style from "./RecuperarContrasena.module.css";

function RecuperarContrasena() {
    const { showModal } = useModal();
    const navigate = useNavigate();
    
    // Estados para manejar el formulario
    const [correo, setCorreo] = useState('');
    const [cargando, setCargando] = useState(false);

    const handleRecuperar = async (e) => {
        e.preventDefault();
        
        setCargando(true);
        try {
            // Llamada real al backend enviando solo el correo
            await enviarEnlaceRecuperacion(correo);
            
            showModal(
                'success', 
                'Si el correo está registrado, recibirás un enlace de recuperación en los próximos minutos. Revisa tu bandeja de entrada o spam.'
            );
            
            // Redirigimos al login después de enviar
            navigate('/'); 
        } catch (error) {
            // Si el backend responde con un error (ej. correo no existe)
            showModal('error', error.message || 'No se pudo procesar la solicitud.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <AuthLayout>
            <div className={style.ubicacion}>
                <AuthForm onSubmit={handleRecuperar}>
                    <AuthInput 
                        label="Correo electrónico" 
                        type="email" 
                        placeholder="correo@ejemplo.com" 
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                    />
                    <div className={style.espacio}>
                        <AuthButton type="submit" disabled={cargando}>
                            {cargando ? 'Enviando...' : 'Enviar enlace de recuperación'}
                        </AuthButton>
                    </div>
                    <AuthTextLink to="/">Volver a Inicio de sesión</AuthTextLink>
                </AuthForm>
            </div>
        </AuthLayout>
    );
}

export default RecuperarContrasena;