import { useState, useEffect } from 'react';
import AuthInput from "../../auth/AuthInput";
import AuthButton from "../../auth/AuthButton";
import style from './AddMemberForm.module.css';

function AddMemberForm({ onSave, onCancel, cargando, errores, esGestionUsuarios = false }) {
    
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        institucion: 'Fisikapp', // Nuevo
        rol: esGestionUsuarios ? 'profesor' : 'admin', 
    });

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            rol: esGestionUsuarios ? 'profesor' : 'admin'
        }));
    }, [esGestionUsuarios]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
                <div className={style.selectGroup} style={{ width: '100%' }}> 
                    <label className={style.label}>Rol de usuario asignado</label>
                    <input 
                        type="text"
                        className={style.select} // Usamos la misma clase para mantener el diseño
                        value={esGestionUsuarios ? 'Profesor' : 'Administrador'} 
                        readOnly // Solo lectura
                        disabled // Para que se vea con el estilo de bloqueado
                    />
                    {/* Mantenemos el valor real en un input oculto para el formulario si es necesario */}
                    <input type="hidden" name="rol" value={formData.rol} />
                </div>
            </div>

            <p className={style.infoText}>
                * La contraseña inicial será el número de identificación del docente.
            </p>

            <div className={style.actions}>
                <AuthButton type="button" onClick={onCancel} variant="secondary">
                    Cancelar
                </AuthButton>
                <AuthButton type="submit" disabled={cargando}>
                    {cargando ? 'Guardando...' : 'Añadir miembro'}
                </AuthButton>
            </div>
        </form>
    );
}

export default AddMemberForm;