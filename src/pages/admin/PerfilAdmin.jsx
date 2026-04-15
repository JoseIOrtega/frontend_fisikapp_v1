import { useState, useEffect } from 'react'; 
import AdminLayout from "../../layouts/AdminLayout";
import style from './PerfilAdmin.module.css';
import AuthInput from "../../components/UI/auth/AuthInput";
import { useModal } from '../../context/ModalContext';
import { getPerfilUser, updatePerfilUser } from '../../services/admin/PerfilService';
import { Eye, EyeOff } from 'lucide-react';

function PerfilAdmin() {
    const { showModal } = useModal();
    const [editando, setEditando] = useState(false);
    const [verClave, setVerClave] = useState(false);
    const [formData, setFormData] = useState({
        id: '', nombre: '', correo: '', fecha_nacimiento: '',
        identificacion: '', institucion: '', rol: '',
        password: '', confirmPassword: ''
    });

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const dataObtenida = await getPerfilUser();
                if (dataObtenida) {
                    setFormData({
                        ...dataObtenida,
                        password: '', 
                        confirmPassword: ''
                    });
                }
            } catch {
                showModal('error', 'No se pudieron cargar los datos.');
            }
        };
        cargarDatos();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGuardar = async () => {
        // --- VALIDACIÓN DE CONTRASEÑAS ---
        if (formData.password && formData.password.trim() !== "") {
            if (formData.password !== formData.confirmPassword) {
                showModal('warning', 'Las contraseñas no coinciden. Por favor, verifícalas.');
                return;
            }
            if (formData.password.length < 6) {
                showModal('warning', 'La clave debe tener al menos 6 caracteres.');
                return;
            }
        }

        try {
            // --- LIMPIEZA DE DATOS (PARA NO "ROMPER" EL BACKEND) ---
            // Solo enviamos los campos que el perfil permite editar.
            // Sacamos 'rol', 'estado' y 'confirmPassword' para que no den error.
            const datosReales = {
                id: formData.id,
                nombre: formData.nombre,
                correo: formData.correo,
                identificacion: formData.identificacion,
                institucion: formData.institucion,
                fecha_nacimiento: formData.fecha_nacimiento
            };

            // Solo agregamos el password si el usuario escribió uno nuevo
            if (formData.password && formData.password.trim() !== "") {
                datosReales.password = formData.password.trim();
            }

            console.log("DATOS LIMPIOS ENVIADOS:", datosReales);

            await updatePerfilUser(datosReales); 
            
            showModal('success', '¡Información actualizada con éxito!');
            setEditando(false);
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
            
        } catch (error) {
            console.error("Error al guardar:", error);
            showModal('error', 'Hubo un error. Es posible que el servidor no acepte el cambio de clave por este medio.');
        }
    };

    return (
        <AdminLayout>
            <div className={style["layout"]}>
                <h2>Configuración de Mi Perfil</h2>
                <div className={style["headerPerfil"]}>
                    <h3 className={style["rol"]}>{formData.rol?.toUpperCase() || 'USUARIO'}</h3>
                </div>

                <div className={style["card"]}>
                    <AuthInput label="Nombre Completo" name="nombre" value={formData.nombre} onChange={handleChange} disabled={!editando} />
                    <AuthInput label="Identificación" name="identificacion" value={formData.identificacion} onChange={handleChange} disabled={!editando}/>
                    <AuthInput label="Correo electrónico" name="correo" value={formData.correo} onChange={handleChange} disabled={!editando}/>
                    <AuthInput label="Fecha de Nacimiento" name="fecha_nacimiento" type="date" value={formData.fecha_nacimiento} onChange={handleChange} disabled={!editando}/>
                    <AuthInput label="Institución / Colegio" name="institucion" value={formData.institucion} onChange={handleChange} disabled={!editando}/>

                    {editando && (
                        <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                            <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '10px' }}>
                                Solo completa estos campos si deseas cambiar tu contraseña actual.
                            </p>
                            <AuthInput 
                                label="Nueva Contraseña" 
                                name="password" 
                                type={verClave ? "text" : "password"}  
                                value={formData.password} 
                                onChange={handleChange} 
                                placeholder="Mínimo 6 caracteres"
                                iconAction={
                                    verClave 
                                        ? <Eye size={20} onClick={() => setVerClave(false)} /> 
                                        : <EyeOff size={20} onClick={() => setVerClave(true)} />
                                }
                            />
                            <AuthInput 
                                label="Confirmar Contraseña" 
                                name="confirmPassword" 
                                type="password" 
                                value={formData.confirmPassword} 
                                onChange={handleChange} 
                                placeholder="Repite la contraseña"
                            />
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '10px', flexDirection: 'column', marginTop: '25px' }}>
                        {!editando ? (
                            <button className={style["btnActualizar"]} onClick={() => setEditando(true)}>Modificar Datos</button>
                        ) : (
                            <>
                                <button className={style["btnGuardar"]} onClick={handleGuardar}>Guardar Cambios</button>
                                <button className={style["btnCancelar"]} onClick={() => {
                                    setEditando(false);
                                    setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
                                }}>Cancelar</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default PerfilAdmin;