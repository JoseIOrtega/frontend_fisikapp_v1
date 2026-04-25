import { useState, useEffect } from 'react'; 
import AdminLayout from "../../layouts/AdminLayout";
import style from './PerfilAdmin.module.css';
import AuthInput from "../../components/UI/auth/AuthInput";
import { useModal } from '../../context/ModalContext';
import { getPerfilUser, updatePerfilUser, changePasswordUser } from '../../services/admin/PerfilService';
import { Eye, EyeOff, Camera } from 'lucide-react';

function PerfilAdmin() {
    const { showModal } = useModal();
    const [editando, setEditando] = useState(false);
    const [verClave, setVerClave] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    // NUEVO: Estado para guardar una copia de respaldo de los datos
    const [copiaRespaldo, setCopiaRespaldo] = useState(null);
    
    // 1. Datos del perfil (Nombre, Correo, etc.)
    const [formData, setFormData] = useState({
        id: '', nombre: '', correo: '', fecha_nacimiento: '',
        identificacion: '', institucion: '', rol: '', foto: null
    });

    // 2. Datos de seguridad (ESTE es el que usaremos para los inputs de clave)
    // const [passData, setPassData] = useState({ old_password: '', new_password: '' });
    const [passData, setPassData] = useState({ 
        old_password: '', 
        new_password: '', 
        confirmar_password: '' // <-- Agregamos la confirmacion
    });

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const dataObtenida = await getPerfilUser();

                console.log("dataObtenida perfil:", dataObtenida);
                if (dataObtenida) {
                    setFormData({ ...dataObtenida });
                    // Guardamos una copia exacta para usarla si el usuario da a "Cancelar"
                    setCopiaRespaldo({ ...dataObtenida });
                }
            } catch {
                showModal('error', 'No se pudieron cargar los datos.');
            }
            finally {
            setLoading(false);
        }
        };
        
        cargarDatos();
        
    }, []);


    // FUNCIÓN PARA CANCELAR (Arregla el problema de la imagen en blanco)
    const handleCancelar = () => {
        // 1. Apagamos el modo edición
        setEditando(false);
        
        // 2. Limpiamos los campos de contraseña para que no se queden escritos
        setPassData({ old_password: '', new_password: '', confirm_password: '' });
        
        // 3. Quitamos la previsualización de la foto nueva
        setPreviewImage(null);

        // 4. IMPORTANTE: Restauramos los datos originales para evitar el "cuadro blanco"
        // Si no haces esto, los cambios que el usuario escribió se quedan en los inputs aunque no edite
        setFormData({ ...copiaRespaldo }); 
    };


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // FUNCIÓN PARA ACTUALIZAR passData CUANDO ESCRIBEN EN LAS CLAVES
    const handlePassChange = (e) => {
        setPassData({ ...passData, [e.target.name]: e.target.value });
    };

    const handleGuardar = async () => {
    try {
        // 1. Detectamos qué quiere cambiar el usuario antes de procesar
        // Revisamos si hay una nueva foto en camino
        const hayNuevaFoto = formData.foto instanceof File;

        // --- ARREGLO DE FECHA ---
        // Forzamos que la fecha siempre sea YYYY-MM-DD para que Django no se queje
        const fechaFormateada = formData.fecha_nacimiento ? new Date(formData.fecha_nacimiento).toISOString().split('T')[0] : null;
        
        // Revisamos si cambió algún texto comparándolo con nuestro respaldo
        const cambioTextoPerfil = 
            formData.nombre !== copiaRespaldo.nombre ||
            formData.correo !== copiaRespaldo.correo ||
            formData.identificacion !== copiaRespaldo.identificacion ||
            formData.institucion !== copiaRespaldo.institucion ||
            //formData.fecha_nacimiento !== copiaRespaldo.fecha_nacimiento;
            fechaFormateada !== copiaRespaldo.fecha_nacimiento; // Comparamos con la formateada

        const cambioPerfil = hayNuevaFoto || cambioTextoPerfil;
        // const cambioClave = passData.old_password && passData.new_password;
        
        const cambioClave = passData.old_password && passData.new_password;

        // PARTE 1: Actualizar Perfil y Foto (Solo si detectamos cambios)
        if (cambioPerfil) {
            const dataAEnviar = new FormData();
            dataAEnviar.append('nombre', formData.nombre);
            dataAEnviar.append('correo', formData.correo);
            dataAEnviar.append('identificacion', formData.identificacion);
            dataAEnviar.append('institucion', formData.institucion);
            
            // 1. CORRECCIÓN: No envíes formData.fecha_nacimiento arriba, usa SOLO la formateada aquí
            if (fechaFormateada) {
                dataAEnviar.append('fecha_nacimiento', fechaFormateada);
            }
            
            if (hayNuevaFoto) {
                dataAEnviar.append('foto', formData.foto);
            }

            // 2. Enviamos al servidor
            await updatePerfilUser(dataAEnviar);
            
            // 3. Pedimos los datos actualizados
            const response = await getPerfilUser();
            
            // 4. CORRECCIÓN: Quitamos el setItem extra que tenías abajo y dejamos solo la validación
            if (response.foto) {
                localStorage.setItem('user_photo', response.foto);
            } else {
                localStorage.removeItem('user_photo');
            }

            // 5. Notificamos y sincronizamos
            window.dispatchEvent(new Event('userUpdate'));
            setFormData({ ...response });
            setCopiaRespaldo({ ...response });
            setPreviewImage(null); 
        }

        // PARTE 2: Actualizar Contraseña
        if (cambioClave) {
            // Validación de coincidencia antes de enviar
            if (passData.new_password !== passData.confirmar_password) {
                showModal('error', 'La nueva contraseña y la confirmación no coinciden.');
                return; 
            }
            
            // Si pasan, enviamos el objeto passData completo (que ya tiene las 3 llaves)
            await changePasswordUser(passData);
        }

        // --- PARTE 3: MENSAJES PERSONALIZADOS ---
        if (cambioPerfil && cambioClave) {
            showModal('success', '¡Perfil y contraseña actualizados!');
        } else if (cambioClave) {
            showModal('success', '¡Contraseña actualizada con éxito!');
        } else if (cambioPerfil) {
            showModal('success', 'Perfil actualizado con éxito.');
        } else {
            // Caso donde le dio guardar pero no movió nada
            showModal('info', 'No se detectaron cambios para guardar.');
        }

        // Finalizamos el modo edición y limpiamos claves
        setEditando(false);
        setPassData({ old_password: '', new_password: '', confirm_password: '' });

    }catch (error) {
            // 1. Siempre dejamos el log para aprender a debugear
            console.log("Error recibido del servidor:", error);

            // 2. PRIORIDAD: Si el backend envía una propiedad llamada 'error' (como vimos en consola)
            if (error && error.error) {
                // Aquí entrará tanto "Contraseña actual incorrecta" como errores de la nueva clave
                showModal('error', error.error);
                return;
            } 

            // A. Error de Identificación (El que viste en consola)
            if (error && error.identificacion) {
                let msgId = Array.isArray(error.identificacion) ? error.identificacion[0] : error.identificacion;
                if (msgId.includes("already exists")) {
                    showModal('error', 'Esta identificación ya está registrada por otro usuario.');
                } else {
                    showModal('error', msgId);
                }
            }
            // B. Error de Fecha
            else if (error && error.fecha_nacimiento) {
                //showModal('error', 'El formato de fecha no es válido. Usa el calendario.');
                showModal('error', 'Agrega tu fecha de nacimiento. Usa el calendario');
            }

            // C. Si el error es en el correo (Correo ya registrado)
            //  TRADUCCIÓN DEL CORREO (Aquí está el cambio clave)
            else if (error && error.correo) {
                let mensajeOriginal = Array.isArray(error.correo) ? error.correo[0] : error.correo;
                
                // Si el backend envía el texto en inglés, lo interceptamos
                if (mensajeOriginal.includes("already exists")) {
                    showModal('error', 'Este correo electrónico ya se encuentra registrado. Intenta con otro.');
                } else {
                    showModal('error', mensajeOriginal);
                }
            }
            // 3. SECUNDARIO: Por si el formato cambia a validación por campos
            else if (error && error.new_password) {
                showModal('error', `Nueva clave: ${error.new_password[0]}`);
            }
            else if (error && error.old_password) {
                showModal('error', `Clave actual: ${error.old_password[0]}`);
            }
            // 4. FINAL: Mensaje de emergencia si no hay respuesta clara
            else {
                showModal('error', 'No se pudieron guardar los cambios. Inténtalo más tarde.');
            }
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, foto: file });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    

    return (
        <AdminLayout>
            <div className={style["layout"]}>
                <h2>Configuración</h2>
                <div className={style["headerPerfil"]}>
                    <h3 className={style["rol"]}>{formData.rol ? formData.rol.toUpperCase() : ""}</h3>
                    
                </div>
                <div className={style["card"]}>
                    {/* SECCIÓN DE FOTO (Igual a como la tenías) */}
                    <div className={style["avatarSection"]}>
                        <div className={`${style["avatarContainer"]} ${editando ? style["editable"] : ""}`}>
                            <img 
                                src={previewImage || formData.foto || `https://ui-avatars.com/api/?name=${formData.nombre || 'U'}&background=0D1B2A&color=fff`} 
                                alt="Perfil" 
                                className={style["profileCircle"]}
                                onError={(e) => { e.target.src = "/default-avatar.png"; }} 
                            />
                            {editando && (
                                <label className={style["uploadBadge"]}>
                                    <Camera size={20} />
                                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* INPUTS DE DATOS PERSONALES */}
                    <AuthInput label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} disabled={!editando} />
                    <AuthInput label="Identificación" name="identificacion" value={formData.identificacion} onChange={handleChange} disabled={!editando}/>
                    <AuthInput label="Correo electrónico" name="correo" value={formData.correo} onChange={handleChange} disabled={!editando}/>
                    <AuthInput label="Fecha de Nacimiento" name="fecha_nacimiento" type="date" value={formData.fecha_nacimiento} onChange={handleChange} disabled={!editando}/>
                    <AuthInput label="Institución / Colegio" name="institucion" value={formData.institucion} onChange={handleChange} disabled={!editando}/>

                    {/* SECCIÓN DE CONTRASEÑA (Aquí están los cambios clave) */}
                    {editando && (
                        <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                            <p style={{ color: '#666', fontSize: '0.8rem' }}>Solo llena esto si deseas cambiar tu clave.</p>
                            
                            <AuthInput 
                                label="Contraseña Actual" 
                                name="old_password" // <-- Nombre que espera el backend
                                type={verClave ? "text" : "password"}  
                                value={passData.old_password} // <-- Conectado a passData
                                onChange={handlePassChange} // <-- Usa la función de passData
                                placeholder="Escribe tu contraseña actual"
                                iconAction={
                                    verClave 
                                        ? <Eye size={20} onClick={() => setVerClave(false)} /> 
                                        : <EyeOff size={20} onClick={() => setVerClave(true)} />
                                }
                            />
                            
                            <AuthInput 
                                label="Nueva Contraseña" 
                                name="new_password" // <-- Nombre que espera el backend
                                type="password" 
                                value={passData.new_password} // <-- Conectado a passData
                                onChange={handlePassChange}
                                placeholder="Mínimo 8 caracteres"
                            />

                            {/* --- NUEVO INPUT DE CONFIRMACIÓN --- */}
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

                    <div style={{ display: 'flex', gap: '10px', flexDirection: 'column', marginTop: '25px' }}>
                        {!editando ? (
                            <button className={style["btnActualizar"]} onClick={() => setEditando(true)}>Modificar Datos</button>
                        ) : (
                            <>
                                <button className={style["btnGuardar"]} onClick={handleGuardar}>Guardar Cambios</button>
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
        </AdminLayout>
    );
}

export default PerfilAdmin;