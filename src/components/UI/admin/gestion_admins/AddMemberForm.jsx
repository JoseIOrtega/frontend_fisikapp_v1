import { useState} from 'react';
import { RefreshCcw } from 'lucide-react';
import AuthInput from "../../auth/AuthInput";
import AuthButton from "../../auth/AuthButton";
import style from './AddMemberForm.module.css';

// 1. LA FUNCIÓN VA AFUERA (así no marca error de referencia)
const generarClave = () => `Fisikapp_${Math.random().toString(36).substring(2, 8)}`;

function AddMemberForm({ onSave, onCancel, cargando, errores, initialData }) {
    const esEdicion = !!initialData;

    const [formData, setFormData] = useState({
        nombre: initialData?.nombre || '',
        correo: initialData?.correo || '',
        rol: initialData?.rol || 'administrador',
        identificacion: initialData?.identificacion || '',
        institucion: initialData?.institucion || '',
        fecha_nacimiento: initialData?.fecha_nacimiento || '',
        foto: initialData?.foto || null,
        clave: esEdicion ? '' : generarClave()
    });

    // Para la previsualización de la foto si decides permitir cambiarla desde aquí
    const [preview, setPreview] = useState(initialData?.foto || null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className={style.form}>
            {/* --- SECCIÓN 1: DATOS BÁSICOS (Siempre visibles) --- */}
            <div className={style.sectionTitle}>Información de Cuenta</div>
            <div className={style.row}>
                <AuthInput label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} error={errores?.nombre} required />
                <AuthInput label="Correo" name="correo" value={formData.correo} onChange={handleChange} error={errores?.correo} required />
            </div>

            {/* --- SECCIÓN 2: DATOS DETALLADOS (Solo en Edición) --- */}
            {esEdicion && (
                <>
                    <div className={style.sectionTitle}>Detalles del Perfil</div>
                    <div className={style.row}>
                        <AuthInput label="Identificación" name="identificacion" value={formData.identificacion} onChange={handleChange} />
                        <AuthInput label="Institución" name="institucion" value={formData.institucion} onChange={handleChange} />
                    </div>
                    <div className={style.row}>
                        <AuthInput label="Fecha Nacimiento" name="fecha_nacimiento" type="date" value={formData.fecha_nacimiento} onChange={handleChange} />
                        
                        {/* Visualización de Foto Actual */}
                        <div className={style.photoPreviewGroup}>
                            <label className={style.label}>Foto actual</label>
                            {formData.foto ? (
                                <img src={formData.foto} className={style.miniAvatar} alt="Perfil" />
                            ) : (
                                <div className={style.noPhoto}>Sin foto</div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* --- SECCIÓN 3: SEGURIDAD (Solo en Creación) --- */}
            <div className={style.row}>
                <div className={style.selectGroup}>
                    <label className={style.label}>Rol</label>
                    <select name="rol" value={formData.rol} onChange={handleChange} className={style.select}>
                        <option value="administrador">Administrador</option>
                        <option value="superadmin">Superadmin</option>
                    </select>
                </div>

                {!esEdicion && (
                    <div className={style.passwordGroup}>
                        <label className={style.label}>Contraseña Temporal</label>
                        <div className={style.inputWithBtn}>
                            <AuthInput value={formData.clave} readOnly />
                            <button type="button" onClick={() => setFormData(p => ({...p, clave: generarClave()}))} className={style.btnRegenerate}><RefreshCcw size={18} /></button>
                        </div>
                    </div>
                )}
            </div>

            <div className={style.actions}>
                <AuthButton type="button" onClick={onCancel} variant="secondary">Cancelar</AuthButton>
                <AuthButton type="submit" disabled={cargando}>
                    {cargando ? 'Procesando...' : (esEdicion ? 'Actualizar Todo' : 'Crear y Enviar')}
                </AuthButton>
            </div>
        </form>
    );
}

export default AddMemberForm;