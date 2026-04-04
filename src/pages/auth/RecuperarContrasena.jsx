import AuthLayout from "../../layouts/AuthLayout";
import AuthForm from "../../components/UI/AuthForm";
import AuthInput from "../../components/UI/AuthInput";
import AuthButton from "../../components/UI/AuthButton";
import AuthTextLink from "../../components/UI/AuthTextLink";
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../context/ModalContext';
import style from "./RecuperarContrasena.module.css";


function RecuperarContrasena() {

    const { showModal } = useModal();
    const navigate = useNavigate();

    const handleRecuperar = (e) => {
        e.preventDefault();
        
        showModal(
            'success', 
            'Si el correo ingresado coincide con una cuenta activa, recibirás un enlace de recuperación en pocos minutos. Revisa tu bandeja de entrada.'
        );
        
        // Opcional: Redirigir al inicio después de unos segundos
        navigate('/'); 
    };

    return (
        <AuthLayout>
            <div className={style.ubicacion}>
                <AuthForm onSubmit={handleRecuperar}>
                    <AuthInput label="Correo electrónico" type="email" placeholder="correo@ejemplo.com" required></AuthInput>
                    <div className={style.espacio}>
                        <AuthButton type="submit">Enviar enlace de recuperación</AuthButton>
                    </div>
                    <AuthTextLink to="/">Volver a Inicio de sesión</AuthTextLink>
                </AuthForm>
            </div>
        </AuthLayout>
    );
}
export default RecuperarContrasena;