import AuthLayout from "../../layouts/AuthLayout";
import AuthForm from "../../components/UI/AuthForm";
import AuthInput from "../../components/UI/AuthInput";
import AuthButton from "../../components/UI/AuthButton";
import { useModal } from '../../context/ModalContext';
import { useNavigate } from 'react-router-dom';
import style from "./RestablecerContrasena.module.css";

function RestablecerContrasena() {

const navigate = useNavigate();

    const { showModal } = useModal(); // 2. Activamos el control remoto

    const handleGuardarPassword = (e) => {
        if (e) e.preventDefault();

        // SIMULACIÓN (Esto lo conectaremos al backend después)
        const passwordsCoinciden = true; 

        if (passwordsCoinciden) {
            // 3. Mensaje de éxito antes de redirigir
            showModal(
                'success', 
                '¡Contraseña actualizada! Ya puedes iniciar sesión con tu nueva clave.'
            );
            navigate('/'); // Lo enviamos al Login
        } else {
            showModal(
                'error', 
                'Las contraseñas no coinciden. Por favor, asegúrate de escribirlas igual.'
            );
        }
    };

    return (
        <AuthLayout>
            <div className={style.ubicacion}>
                <AuthForm onSubmit={handleGuardarPassword}>
                    <AuthInput label="Nueva Contraseña" type="password" placeholder="***********" required></AuthInput>
                    <AuthInput label="Confirmar Contraseña" type="password" placeholder="***********" required></AuthInput>
                    <div className={style.espacio}>
                        <AuthButton type="submit">Guardar nueva contraseña</AuthButton>
                    </div>
                </AuthForm>
            </div>
        </AuthLayout>
    );
}
export default RestablecerContrasena;