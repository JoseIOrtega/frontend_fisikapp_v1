import { useState} from 'react';
import { RefreshCcw } from 'lucide-react';
import AuthInput from "../../auth/AuthInput";
import AuthButton from "../../auth/AuthButton";
import style from './AddMemberForm.module.css';



function AddLabForm() {
    

    return (
        <form onSubmit={} className={style.form}>
            {/* ... todo tu JSX igual ... */}
             <AuthInput 
                label="" 
                name="nombre"
                value={formData.nombre} 
                onChange={handleChange} 
                placeholder="Ej. Carlos Martínez" 
                required 
            />
            
            <AuthInput 
                label="Correo electrónico" 
                name="correo"
                type="email" 
                value={formData.correo} 
                onChange={handleChange} 
                placeholder="admin@fisikapp.com" 
                required 
            />

            <div className={style.row}>
                <div className={style.selectGroup}>
                    <label className={style.label}>Rol de usuario</label>
                    <select 
                        name="rol"
                        className={style.select}
                        value={formData.rol} 
                        onChange={handleChange}
                    >
                        <option value="admin">Administrador</option>
                        <option value="superadmin">Superadmin</option>
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

export default AddLabForm;