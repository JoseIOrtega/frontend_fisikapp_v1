import AuthLayout from "../../layouts/AuthLayout";
import AuthForm from "../../components/UI/auth/AuthForm";
import AuthInput from "../../components/UI/auth/AuthInput"; 
import AuthTextLink from "../../components/UI/auth/AuthTextLink";
import AuthButton from "../../components/UI/auth/AuthButton";
import { useModal } from '../../context/ModalContext';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/auth/authService';
import { useState } from 'react'; 
import { Eye, EyeOff } from 'lucide-react'; // Importamos los iconos
import style from './RegistrarUsuario.module.css';

function RegistrarUsuario() {
    const { showModal } = useModal();
    const navigate = useNavigate();
    const [verClave, setVerClave] = useState(false); // Estado para el ojo
    
    const [formData, setFormData] = useState({
        nombre: '',
        fecha_nacimiento: '',
        identificacion: '',
        correo: '',
        password: '',
        confirmPassword: '',
        institucion: '',
        rol: 'estudiante'
    });

    // --- NUEVO: Estado para el mensaje de error de la contraseña ---
    const [passwordError, setPasswordError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Validar contraseña mientras escribe
        if (name === 'password') {
            const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
            if (value.length > 0 && !regex.test(value)) {
                setPasswordError('');
            } else {
                setPasswordError('');
            }
        }
    };

    const handleRegistro = async (e) => {
        if (e) e.preventDefault();

        // Validaciones finales antes de enviar
        if (passwordError) {
            showModal('error', 'Por favor usa una contraseña más segura.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            showModal('error', 'Las contraseñas no coinciden.');
            return;
        }

        try {
            // "Limpiamos" el objeto: Django espera exactamente estos campos según tu Swagger
            const payload = {
                nombre: formData.nombre,
                correo: formData.correo,
                password: formData.password,
                rol: formData.rol,
                identificacion: formData.identificacion,
                fecha_nacimiento: formData.fecha_nacimiento,
                institucion: formData.institucion,
                estado: true // Lo agregamos porque el Swagger lo marca como requerido
            };

            await registerUser(payload); 
            showModal('success', '¡Cuenta creada con éxito! Bienvenid@.');
            navigate('/');
        } catch (error) {
            // El error.message ahora vendrá detallado desde el servicio
            showModal('error', error.message || 'Error al registrar');
        }
    };

    return (
        <AuthLayout>
            <div className={style.ubicacion}>
                <AuthForm onSubmit={handleRegistro}>
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
                    
                    {/* Input de Contraseña con mensaje de ayuda */}
                    <AuthInput 
                        label="Contraseña" 
                        name="password"
                        type={verClave ? "text" : "password"} 
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Mínimo 8 caracteres (letras y números)" 
                        required
                        // PASAMOS EL ICONO COMO PROP
                        iconAction={
                            verClave 
                                ? <Eye size={20} onClick={() => setVerClave(false)} /> 
                                : <EyeOff size={20} onClick={() => setVerClave(true)} />
                        } 
                    />
                    {passwordError && <p className={style.errorText}>{passwordError}</p>}

                    <AuthInput 
                        label="Confirmar contraseña" 
                        name="confirmPassword"
                        type="password" 
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Repite tu contraseña" 
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