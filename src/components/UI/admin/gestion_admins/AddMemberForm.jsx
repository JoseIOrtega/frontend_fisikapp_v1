import { useState, useEffect } from 'react'; // Agregamos useEffect
import { RefreshCcw } from 'lucide-react';
import AuthInput from "../../auth/AuthInput";
import AuthButton from "../../auth/AuthButton";
import style from './AddMemberForm.module.css';

const generarClave = () => `Fisikapp_${Math.random().toString(36).substring(2, 8)}`;

function AddMemberForm({ onSave, onCancel, cargando, errores, esGestionUsuarios = false }) {
    
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        rol: esGestionUsuarios ? 'estudiante' : 'admin',
        clave: generarClave()
    });

    // FUERZA EL ROL CORRECTO: 
    // Si la prop cambia o el componente se monta, nos aseguramos de que el rol coincida
    useEffect(() => {
        if (esGestionUsuarios) {
            setFormData(prev => ({ ...prev, rol: 'estudiante' }));
        } else {
            setFormData(prev => ({ ...prev, rol: 'admin' }));
        }
    }, [esGestionUsuarios]);

    const opcionesRoles = esGestionUsuarios 
        ? [
            { value: "profesor", label: "Docente" },
            { value: "estudiante", label: "Estudiante" }
          ]
        : [
            { value: "admin", label: "Administrador" },
            { value: "superadmin", label: "Super Administrador" }
          ];

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
                placeholder="usuario@fisikapp.com" 
                required 
                error={errores?.correo}
            />

            <div className={style.row}>
                <div className={style.selectGroup}>
                    <label className={style.label}>Rol de usuario</label>
                    <select 
                        name="rol"
                        className={`${style.select} ${errores?.rol ? style.selectError : ''}`}
                        value={formData.rol} 
                        onChange={handleChange}
                    >
                        {opcionesRoles.map((opcion) => (
                            <option key={opcion.value} value={opcion.value}>
                                {opcion.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={style.passwordGroup}>
                    <AuthInput 
                        label="Contraseña Temporal" 
                        value={formData.clave} 
                        readOnly 
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