import { useState, useEffect } from 'react'; 
import DocenteLayout from "../../layouts/DocenteLayout";
import style from './PerfilDocente.module.css';
import AuthInput from "../../components/UI/auth/AuthInput";
import { useModal } from '../../context/ModalContext';
import { getPerfilUser, updatePerfilUser, changePasswordUser } from '../../services/admin/PerfilService';
import { Eye, EyeOff, Camera } from 'lucide-react';

function PerfilDocente() {
    const { showModal } = useModal();
    const [loading, setLoading] = useState(true);
    const [editando, setEditando] = useState(false);
    const [verClave, setVerClave] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    // Estado para guardar una copia de respaldo de los datos
    const [copiaRespaldo, setCopiaRespaldo] = useState(null);
    
    // 1. Datos del perfil
    const [formData, setFormData] = useState({
        id: '', nombre: '', correo: '', fecha_nacimiento: '',
        identificacion: '', institucion: '', rol: '', foto: null
    });

    // 2. Datos de seguridad
    const [passData, setPassData] = useState({ 
        old_password: '', 
        new_password: '', 
        confirmar_password: '' 
    });

    // 🚀 NUEVA FUNCIÓN: Extrae las iniciales del docente para usarlas de respaldo
    const obtenerIniciales = (nombre) => {
        if (!nombre) return "U";
        const palabras = nombre.trim().split(/\s+/);
        if (palabras.length === 1) return palabras[0].charAt(0).toUpperCase();
        return (palabras[0].charAt(0) + palabras[1].charAt(0)).toUpperCase();
    };

    useEffect(() => {
        const cargarDatos = async () => {
            setLoading(true);
            try {
                const dataObtenida = await getPerfilUser();

                if (dataObtenida) {
                    const datosLimpios = {
                        id: dataObtenida.id || '',
                        nombre: dataObtenida.nombre || '',
                        correo: dataObtenida.correo || '',
                        fecha_nacimiento: dataObtenida.fecha_nacimiento || '',
                        identificacion: dataObtenida.identificacion || '',
                        institucion: dataObtenida.institucion || '',
                        rol: dataObtenida.rol || '',
                        foto: dataObtenida.foto || null 
                    };

                    setFormData(datosLimpios);
                    setCopiaRespaldo({ ...datosLimpios });
                }
            } catch (error) {
                showModal('error', 'No se pudieron cargar los datos del perfil.');
            } finally {
                setLoading(false);
            }
        };
        
        cargarDatos();
        
    }, []);

    // FUNCIÓN PARA CANCELAR
    const handleCancelar = () => {
        setEditando(false);
        // Arreglado 'confirmar_password' para limpiar bien el estado
        setPassData({ old_password: '', new_password: '', confirmar_password: '' });
        setPreviewImage(null);
        setFormData({ ...copiaRespaldo }); 
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePassChange = (e) => {
        setPassData({ ...passData, [e.target.name]: e.target.value });
    };

    const handleGuardar = async () => {
        setLoading(true);
        try {
            const hayNuevaFoto = formData.foto instanceof File;
            const fechaFormateada = formData.fecha_nacimiento ? new Date(formData.fecha_nacimiento).toISOString().split('T')[0] : null;
            
            const cambioTextoPerfil = 
                formData.nombre !== copiaRespaldo.nombre ||
                formData.correo !== copiaRespaldo.correo ||
                formData.identificacion !== copiaRespaldo.identificacion ||
                formData.institucion !== copiaRespaldo.institucion ||
                fechaFormateada !== copiaRespaldo.fecha_nacimiento;

            const cambioPerfil = hayNuevaFoto || cambioTextoPerfil;
            const cambioClave = passData.old_password && passData.new_password;

            // PARTE 1: Actualizar Perfil y Foto
            if (cambioPerfil) {
                const dataAEnviar = new FormData();
                dataAEnviar.append('nombre', formData.nombre);
                dataAEnviar.append('correo', formData.correo);
                dataAEnviar.append('identificacion', formData.identificacion);
                dataAEnviar.append('institucion', formData.institucion);
                
                if (fechaFormateada) {
                    dataAEnviar.append('fecha_nacimiento', fechaFormateada);
                }
                
                if (hayNuevaFoto) {
                    dataAEnviar.append('foto', formData.foto);
                }

                await updatePerfilUser(dataAEnviar);
                
                const response = await getPerfilUser();
                
                if (response.foto) {
                    localStorage.setItem('user_photo', response.foto);
                } else {
                    localStorage.removeItem('user_photo');
                }

                window.dispatchEvent(new Event('userUpdate'));
                setFormData({ ...response });
                setCopiaRespaldo({ ...response });
                setPreviewImage(null); 
            }

            // PARTE 2: Actualizar Contraseña
            if (cambioClave) {
                if (passData.new_password !== passData.confirmar_password) {
                    showModal('error', 'La nueva contraseña y la confirmación no coinciden.');
                    return; 
                }
                await changePasswordUser(passData);
            }

            // PARTE 3: Mensajes Informativos
            if (cambioPerfil && cambioClave) {
                showModal('success', '¡Perfil y contraseña actualizados!');
            } else if (cambioClave) {
                showModal('success', '¡Contraseña actualizada con éxito!');
            } else if (cambioPerfil) {
                showModal('success', 'Perfil actualizado con éxito.');
            } else {
                showModal('info', 'No se detectaron cambios para guardar.');
            }

            setEditando(false);
            // Arreglado 'confirmar_password' aquí también
            setPassData({ old_password: '', new_password: '', confirmar_password: '' });

        } catch (err) {
            const error = err.data || err; 
            
            if (error && error.error) {
                showModal('error', error.error);
                return;
            } 

            if (error && error.identificacion) {
                let msgId = Array.isArray(error.identificacion) ? error.identificacion[0] : error.identificacion;
                if (msgId.includes("already exists")) {
                    showModal('error', 'Esta identificación ya está registrada por otro usuario.');
                } else {
                    showModal('error', msgId);
                }
            }
            else if (error && error.fecha_nacimiento) {
                showModal('error', 'Agrega tu fecha de nacimiento. Usa el calendario');
            }
            else if (error && error.correo) {
                let mensajeOriginal = Array.isArray(error.correo) ? error.correo[0] : error.correo;
                if (mensajeOriginal.includes("already exists")) {
                    showModal('error', 'Este correo electrónico ya se encuentra registrado. Intenta con otro.');
                } else {
                    showModal('error', mensajeOriginal);
                }
            }
            else {
                showModal('error', 'No se pudieron guardar los cambios. Inténtalo más tarde.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, foto: file });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    if (loading) {
        return (
            <DocenteLayout>
                <div className={style.container}>
                    <div className={style.skeletonContainer}>
                        <p>Cargando datos del docente...</p>
                    </div>
                </div>
            </DocenteLayout>
        );
    }

    // Identificamos si hay alguna imagen disponible para pintar en el <img>
    const tieneImagenValida = previewImage || formData.foto;

    return (
        <DocenteLayout>
            
            <div className={style["layout"]}>
                <h2 className={style.title}>Configuración</h2>
                <div className={style["headerPerfil"]}>
                    <h3 className={style["rol"]}>{formData.rol ? formData.rol.toUpperCase() : ""}</h3>
                </div>
                <div className={style["card"]}>
                    
                    {/* SECCIÓN DE FOTO CORREGIDA Y ALINEADA */}
                    <div className={style["avatarSection"]}>
                        {tieneImagenValida ? (
                            <div className={`${style["avatarContainer"]} ${editando ? style["editable"] : ""}`}>
                                <img 
                                    src={previewImage || formData.foto} 
                                    alt="Perfil" 
                                    className={style["profileCircle"]}
                                    onError={() => {
                                        console.warn("La imagen de perfil dio 404. Cambiando a iniciales.");
                                        setPreviewImage(null);
                                        setFormData({ ...formData, foto: null });
                                    }} 
                                />
                                {editando && (
                                    <label className={style["uploadBadge"]}>
                                        <Camera size={20} />
                                        <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                                    </label>
                                )}
                            </div>
                        ) : (
                            /* AQUÍ: Si no hay foto, el div de las iniciales controla su propio borde de forma exacta */
                            <div className={`${style["initialsCircle"]} ${editando ? style["editable"] : ""}`}>
                                {obtenerIniciales(formData.nombre)}
                                
                                {editando && (
                                    <label className={style["uploadBadge"]}>
                                        <Camera size={20} />
                                        <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                                    </label>
                                )}
                            </div>
                        )}
                    </div>

                    {/* INPUTS DE DATOS PERSONALES */}
                    <AuthInput label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} disabled={!editando} />
                    <AuthInput label="Fecha de Nacimiento" name="fecha_nacimiento" type="date" value={formData.fecha_nacimiento} onChange={handleChange} disabled={!editando}/>
                    <AuthInput label="Institución / Colegio" name="institucion" value={formData.institucion} onChange={handleChange} disabled={!editando}/>

                    {/* SECCIÓN DE CONTRASEÑA */}
                    {editando && (
                        <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                            <p style={{ color: '#666', fontSize: '0.8rem' }}>Solo llena esto si deseas cambiar tu clave.</p>
                            
                            <AuthInput 
                                label="Contraseña Actual" 
                                name="old_password" 
                                type={verClave ? "text" : "password"}  
                                value={passData.old_password} 
                                onChange={handlePassChange} 
                                placeholder="Escribe tu contraseña actual"
                                iconAction={
                                    verClave 
                                        ? <Eye size={20} onClick={() => setVerClave(false)} /> 
                                        : <EyeOff size={20} onClick={() => setVerClave(true)} />
                                }
                            />
                            
                            <AuthInput 
                                label="Nueva Contraseña" 
                                name="new_password" 
                                type="password" 
                                value={passData.new_password} 
                                onChange={handlePassChange} 
                                placeholder="Mínimo 8 caracteres"
                            />

                            <AuthInput 
                                label="Repetir Nueva Contraseña" 
                                name="confirmar_password" 
                                type="password" 
                                value={passData.confirmar_password}
                                onChange={handlePassChange}
                                placeholder="Escribe de nuevo la contraseña"
                            />
                        </div>
                    )}

                    {/* BOTONES DE ACCIÓN */}
                    <div style={{ display: 'flex', gap: '10px', flexDirection: 'column', marginTop: '25px' }}>
                        {!editando ? (
                            <button className={style["btnActualizar"]} onClick={() => setEditando(true)}>Modificar Datos</button>
                        ) : (
                            <>
                                <button 
                                    className={style["btnGuardar"]} 
                                    onClick={handleGuardar}
                                    disabled={loading} 
                                >
                                    {loading ? "Guardando..." : "Guardar Cambios"} 
                                </button>
                                <button 
                                    className={style["btnCancelar"]} 
                                    onClick={handleCancelar}
                                >
                                    Cancelar
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </DocenteLayout>
    );
}

export default PerfilDocente;