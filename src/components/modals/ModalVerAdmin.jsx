import { useEffect, useState } from 'react';
import { getUsuarioDetalle } from '../../services/admin/GestionAdminService';
import styles from './ModalVerAdmin.module.css';

const ModalVerAdmin = ({ id, isOpen, onClose, titulo = "Perfil de Administrador" }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && id) {
            const cargarDetalle = async () => {
                setLoading(true);
                try {
                    const data = await getUsuarioDetalle(id);
                    setAdmin(data); 
                } catch (error) {
                    console.error("Error al cargar detalle:", error);
                } finally {
                    setLoading(false);
                }
            };
            cargarDetalle();
        }
    }, [isOpen, id]);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h3>{titulo}</h3>
                    <button className={styles.closeX} onClick={onClose}>&times;</button>
                </div>

                {loading ? (
                    <div className={styles.loaderContainer}><p>Cargando información...</p></div>
                ) : admin && (
                    <div className={styles.content}>
                        {/* SECCIÓN DE FOTO */}
                        <div className={styles.photoSection}>
                            <div className={styles.avatarContainer}>
                                {admin.foto ? (
                                    <img src={admin.foto} alt="Perfil" className={styles.profileImg} />
                                ) : (
                                    <div className={styles.defaultAvatar}>
                                        {admin.nombre.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <span className={`${styles.badge} ${admin.rol === 'superadmin' ? styles.super : styles.admin}`}>
                                {admin.rol}
                            </span>
                        </div>

                        {/* SECCIÓN DE DATOS GRID */}
                        <div className={styles.infoGrid}>
                            <div className={styles.infoBox}>
                                <label>Nombre Completo</label>
                                <p>{admin.nombre}</p>
                            </div>
                            <div className={styles.infoBox}>
                                <label>Correo Electrónico</label>
                                <p>{admin.correo}</p>
                            </div>
                            <div className={styles.infoBox}>
                                <label>Identificación</label>
                                <p>{admin.identificacion}</p>
                            </div>
                            <div className={styles.infoBox}>
                                <label>Institución</label>
                                <p>{admin.institucion || 'No especificada'}</p>
                            </div>
                            <div className={styles.infoBox}>
                                <label>Fecha de Nacimiento</label>
                                <p>{admin.fecha_nacimiento || 'No registrada'}</p>
                            </div>
                            <div className={styles.infoBox}>
                                <label>Estado de Cuenta</label>
                                <p className={admin.estado ? styles.active : styles.inactive}>
                                    {admin.estado ? 'Activo' : 'Inactivo'}
                                </p>
                            </div>
                        </div>

                        <div className={styles.footer}>
                            <button className={styles.btnCerrar} onClick={onClose}>
                                Cerrar Vista
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModalVerAdmin;