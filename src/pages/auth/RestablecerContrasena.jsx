import AuthLayout from "../../layouts/AuthLayout";
import AuthForm from "../../components/UI/AuthForm";
import AuthInput from "../../components/UI/AuthInput";
import AuthButton from "../../components/UI/AuthButton";
import style from "./RestablecerContrasena.module.css";
import { useNavigate } from 'react-router-dom';

function RestablecerContrasena() {

    const navigate = useNavigate();

    const handleRegisterClick = () => {
        navigate('/'); 
    };

    return (
        <AuthLayout>
            <div className={style.ubicacion}>
                <AuthForm>
                    <AuthInput label="Nueva Contraseña" type="password" placeholder="***********" required></AuthInput>
                    <AuthInput label="Confirmar Contraseña" type="password" placeholder="***********" required></AuthInput>
                    <div className={style.espacio}>
                        <AuthButton type="button" onClick={handleRegisterClick}>Guardar nueva contraseña</AuthButton>
                    </div>
                </AuthForm>
            </div>
        </AuthLayout>
    );
}
export default RestablecerContrasena;