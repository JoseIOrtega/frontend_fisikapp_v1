import AuthLayout from "../../layouts/AuthLayout";
import AuthForm from "../../components/UI/auth/AuthForm";
import AuthInput from "../../components/UI/auth/AuthInput";
import AuthButton from "../../components/UI/auth/AuthButton";
import { useModal } from '../../context/ModalContext';
import { useNavigate, useLocation } from 'react-router-dom'; // 1. Importamos useLocation
import { useState } from 'react'; // 2. Para capturar el texto
import { confirmarRestablecerPassword } from "../../services/auth/authService"; // 3. Tu función real
import style from "./RestablecerContrasena.module.css";

function RestablecerContrasena() {
    const navigate = useNavigate();
    const location = useLocation(); // 4. El "escáner" de la URL
    const { showModal } = useModal();

    // Estados para los inputs
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // 5. Extraemos el UID y TOKEN de la URL automáticamente
    const queryParams = new URLSearchParams(location.search);
    const uid = queryParams.get('uid');
    const token = queryParams.get('token');

    const handleGuardarPassword = async (e) => {
        if (e) e.preventDefault();

        // Validamos primero en el cliente para no gastar peticiones
        if (password !== confirmPassword) {
            showModal('error', 'Las contraseñas no coinciden.');
            return;
        }

        if (password.length < 8) {
            showModal('error', 'La contraseña debe tener al menos 8 caracteres.');
            return;
        }

        try {
            // 6. LLAMADA REAL AL BACKEND
            // Enviamos los datos que sacamos de la URL + la nueva clave
            await confirmarRestablecerPassword(uid, token, password);

            showModal(
                'success', 
                '¡Contraseña actualizada! Ya puedes iniciar sesión con tu nueva contraseña.'
            );
            navigate('/'); // Regresamos al Login
            
        } catch (error) {
            // Manejamos errores (Token expirado, red, etc.)
            showModal(
                'error', 
                error.message || 'Hubo un problema al actualizar la contraseña. El enlace podría haber caducado.'
            );
        }
    };

    return (
        <AuthLayout>
            <div className={style.ubicacion}>
                <AuthForm onSubmit={handleGuardarPassword}>
                    <AuthInput 
                        label="Nueva Contraseña" 
                        type="password" 
                        placeholder="***********" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Capturamos la clave
                        required 
                    />
                    <AuthInput 
                        label="Confirmar Contraseña" 
                        type="password" 
                        placeholder="***********" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)} // Capturamos la confirmación
                        required 
                    />
                    <div className={style.espacio}>
                        <AuthButton type="submit">Guardar nueva contraseña</AuthButton>
                    </div>
                </AuthForm>
            </div>
        </AuthLayout>
    );
}

export default RestablecerContrasena;