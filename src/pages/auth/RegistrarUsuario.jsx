import AuthLayout from "../../layouts/AuthLayout";
import AuthForm from "../../components/UI/AuthForm";
import AuthInput from "../../components/UI/AuthInput"; 
import AuthTextLink from "../../components/UI/AuthTextLink";
import AuthButton from "../../components/UI/AuthButton";
import { useModal } from '../../context/ModalContext';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/auth/authService'; // Asegúrate de importar tu servicio
import { useState } from 'react'; 
import style from './RegistrarUsuario.module.css';

function RegistrarUsuario() {
    const { showModal } = useModal();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        nombre: '',
        fecha_nacimiento: '',
        identificacion: '',
        correo: '',
        password: '',
        confirmPassword: '',
        institucion: '',
        rol: 'docente'
    });

    //Función para capturar lo que se escribe
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleRegistro = async (e) => {
        if (e) e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            showModal('error', 'Las contraseñas no coinciden.');
            return;
        }

        try {
            await registerUser(formData); 
            showModal('success', '¡Cuenta creada! Ya puedes iniciar sesión.');
            navigate('/');
        } catch (error) {
            showModal('error', error.message || 'Error al registrar');
        }
    };

    return (
        <AuthLayout>
            <div className={style.ubicacion}>
                <AuthForm onSubmit={handleRegistro}>
                    {/* IMPORTANTE: Agregamos name, value y onChange a cada input */}
                    <AuthInput 
                        label="Nombre completo" 
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="Ej. Juan Pérez" 
                        required 
                    />
                    <AuthInput 
                        label="Número de Identificación" 
                        name="identificacion"
                        value={formData.identificacion}
                        onChange={handleChange}
                        placeholder="Documento de identidad" 
                        required 
                    />
                    <AuthInput 
                        label="Fecha de Nacimiento" 
                        name="fecha_nacimiento"
                        type="date" 
                        value={formData.fecha_nacimiento}
                        onChange={handleChange}
                        required 
                    />
                    <AuthInput 
                        label="Institución / Colegio" 
                        name="institucion"
                        value={formData.institucion}
                        onChange={handleChange}
                        placeholder="Nombre de tu institución" 
                        required 
                    />
                    <AuthInput 
                        label="Correo electrónico" 
                        name="correo"
                        type="email" 
                        value={formData.correo}
                        onChange={handleChange}
                        placeholder="correo@ejemplo.com" 
                        required 
                    />
                    <AuthInput 
                        label="Contraseña" 
                        name="password"
                        type="password" 
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••" 
                        required 
                    />
                    <AuthInput 
                        label="Confirmar contraseña" 
                        name="confirmPassword"
                        type="password" 
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••" 
                        required 
                    />
                    
                    <AuthTextLink to="/">¿Ya tienes cuenta? Inicia sesión</AuthTextLink>

                    <div className={style.buttonContainer}>
                        <AuthButton type="submit">Regístrate ahora</AuthButton>
                    </div>
                </AuthForm>
            </div>
        </AuthLayout>
    );
}

export default RegistrarUsuario;