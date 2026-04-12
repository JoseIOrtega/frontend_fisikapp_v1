import { useState, useEffect } from 'react'; 
import AdminLayout from "../../layouts/AdminLayout";
import style from './PerfilAdmin.module.css';
import AuthInput from "../../components/UI/AuthInput";
import { useModal } from '../../context/ModalContext';
// 1. Asegúrate de importar ambas funciones del servicio
import { getPerfilUser, updatePerfilUser } from '../../services/admin/PerfilService';

function PerfilAdmin() {
    const { showModal } = useModal();
    const [editando, setEditando] = useState(false);

    const [formData, setFormData] = useState({
        id: '', // <--- Agregamos esto
        nombre: '',
        correo: '',
        fecha_nacimiento: '',
        identificacion: '',
        institucion: '',
        rol: ''
    });

    // 2. Efecto para cargar los datos del usuario apenas abra la página
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const dataObtenida = await getPerfilUser();

                console.log("Estos son los DATOS:  ",dataObtenida);
                
                if (dataObtenida) {
                    setFormData({
                        id: dataObtenida.id || '',
                        nombre: dataObtenida.nombre || '',
                        correo: dataObtenida.correo || '',
                        fecha_nacimiento: dataObtenida.fecha_nacimiento || '',
                        identificacion: dataObtenida.identificacion || '',
                        institucion: dataObtenida.institucion || '',
                        rol: dataObtenida.rol || ''
                    });

                    // --- ¡ESTO ES LO NUEVO! ---
                    // 1. Guardamos el nombre REAL en la mochila del navegador
                    // --- ESTO ES LO QUE DEBES AGREGAR ---
                    if (dataObtenida.nombre) {
                        // Guardamos el nombre real (ej. "Jose")
                        localStorage.setItem('user_name', dataObtenida.nombre);
                        // Le avisamos al Navbar que ya tenemos el nombre real
                        window.dispatchEvent(new Event('storage'));
                    }
                    // ------------------------------------
                }
            } catch (error) {
                console.error("Error al cargar perfil:", error);
                showModal('error', 'No se pudieron cargar los datos del perfil.');
            }
        };
        cargarDatos();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleGuardar = async () => {
        try {
            // Usamos el nombre correcto de la función que definimos en el servicio
            await updatePerfilUser(formData); 
            
            showModal('success', '¡Perfil actualizado con éxito!');
            setEditando(false); 
        } catch (error) {
            showModal('error', 'No se pudieron guardar los cambios.');
            console.error(error);
        }
    };

    return (
        <AdminLayout>
            <div className={style["layout"]}>
                <h2>Perfil del Usuario</h2>
                <div className={style["headerPerfil"]}>
                    {/* Usamos optional chaining (?.) por si el rol tarda en cargar */}
                    <h3 className={style["rol"]}>{formData.rol?.toUpperCase() || 'CARGANDO...'}</h3>
                </div>

                <div className={style["card"]}>
                    <AuthInput label="Nombre Completo" name="nombre" value={formData.nombre} onChange={handleChange} disabled={!editando} />
                    <AuthInput label="Identificación" name="identificacion" value={formData.identificacion} onChange={handleChange} disabled={!editando}/>
                    <AuthInput label="Correo electrónico" name="correo" value={formData.correo} onChange={handleChange} disabled={!editando}/>
                    <AuthInput label="Fecha de Nacimiento" name="fecha_nacimiento" type="date" value={formData.fecha_nacimiento} onChange={handleChange} disabled={!editando}/>
                    <AuthInput label="Institución / Colegio" name="institucion" value={formData.institucion} onChange={handleChange} disabled={!editando}/>

                    <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                        {!editando ? (
                            <button className={style["btnActualizar"]} onClick={() => setEditando(true)}>Actualizar Información</button>
                        ) : (
                            <>
                                <button className={style["btnGuardar"]} onClick={handleGuardar}> Guardar Cambios</button>
                                <button className={style["btnCancelar"]} onClick={() => setEditando(false)}>Cancelar</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default PerfilAdmin;