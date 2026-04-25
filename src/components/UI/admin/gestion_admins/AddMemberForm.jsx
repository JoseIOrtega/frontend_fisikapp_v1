import { useState} from 'react';
import { RefreshCcw } from 'lucide-react';
import AuthInput from "../../auth/AuthInput";
import AuthButton from "../../auth/AuthButton";
import style from './AddMemberForm.module.css';

// 1. LA FUNCIÓN VA AFUERA (así no marca error de referencia)
const generarClave = () => `Fisikapp_${Math.random().toString(36).substring(2, 8)}`;

function AddMemberForm({ onSave, onCancel, cargando, errores }) {
    
    // 2. ESTADO INICIAL: Llamamos a la función aquí mismo
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        rol: 'admin',
        clave: generarClave() // Así ya nace con una clave y no necesitas el useEffect inicial
    });

    
    // ya inicializamos la clave arriba.

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegenerar = () => {
        setFormData(prev => ({ ...prev, clave: generarClave() }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className={style.form}>
            {/* ... todo tu JSX igual ... */}
             <AuthInput 
                label="Nombre completo" 
                name="nombre"
                value={formData.nombre} 
                onChange={handleChange} 
                placeholder="Ej. Carlos Martínez" 
                required 
                error={errores?.nombre}
            />
            
            <AuthInput 
                label="Correo electrónico" 
                name="correo"
                type="email" 
                value={formData.correo} 
                onChange={handleChange} 
                placeholder="admin@fisikapp.com" 
                required 
                error={errores?.correo}
            />

            <div className={style.row}>
                {/* Grupo del Select */}
                <div className={style.selectGroup}>
                    <label className={style.label}>Rol de usuario</label>
                    <select 
                        name="rol"
                        className={`${style.select} ${errores?.rol ? style.selectError : ''}`}
                        value={formData.rol} 
                        onChange={handleChange}
                    >
                        <option value="admin">Administrador</option>
                        <option value="superadmin">Superadmin</option>
                    </select>
                </div>

                {/* Grupo de la Contraseña */}
                <div className={style.passwordGroup}>
                    <AuthInput 
                        label="Contraseña Temporal" 
                        value={formData.clave} 
                        readOnly 
                        // Si el AuthInput tiene un prop para estilos extra, úsalo para quitarle margenes
                    />
                    <button 
                        type="button" 
                        onClick={handleRegenerar} 
                        className={style.btnRegenerate}
                        title="Generar otra clave"
                    >
                        <RefreshCcw size={18} />
                    </button>
                </div>
            </div>

            <p className={style.infoText}>
                * Se enviará un correo automático con estas credenciales.
            </p>

            <div className={style.actions}>
                <AuthButton type="button" onClick={onCancel} variant="secondary">
                    Cancelar
                </AuthButton>
                <AuthButton type="submit" disabled={cargando}>
                    {cargando ? 'Guardando...' : 'Crear y Enviar'}
                </AuthButton>
            </div>
        </form>
    );
}

export default AddMemberForm;