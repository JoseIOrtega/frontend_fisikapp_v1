import AuthLayout from "../../layouts/AuthLayout";
import AuthForm from "../../components/UI/AuthForm";
import AuthInput from "../../components/UI/AuthInput"; 
import AuthTextLink from "../../components/UI/AuthTextLink";
import AuthButton from "../../components/UI/AuthButton";
import style from './RegistrarUsuario.module.css' 

function RegistrarUsuario() {
    return (
        <AuthLayout>
            <div className={style.ubicacion}>
                <AuthForm>
                    <AuthInput label="Nombre completo" placeholder="Ej. Juan Pérez" required />
                    <AuthInput label="Número de Identificación" type="text" placeholder="Documento de identidad" required />
                    <AuthInput label="Fecha de Nacimiento" type="date" required />
                    <AuthInput label="Institución / Colegio" placeholder="Nombre de tu institución" required />
                    <AuthInput label="Correo electrónico" type="email" placeholder="correo@ejemplo.com" required />
                    <AuthInput label="Contraseña" type="password" placeholder="••••••••" required />
                    <AuthInput label="Confirmar contraseña" type="password" placeholder="••••••••" required />
                    
                    <AuthTextLink to="/">¿Ya tienes cuenta? Inicia sesión</AuthTextLink>

                    <div className={style.buttonContainer}>
                        <AuthButton type="submit">Registrate ahora</AuthButton>
                    </div>
                </AuthForm>
            </div>
        </AuthLayout>
    );
}

export default RegistrarUsuario;