import React, { useState, useEffect } from 'react';
import styles from './ModalEditarAdmin.module.css';

const ModalEditarAdmin = ({ usuario, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        rol: '',
        estado: true,
        identificacion: ''
    });

    // Cargar los datos del usuario cuando se abre el modal
    useEffect(() => {
        if (usuario) {
            setFormData({
                nombre: usuario.nombre || '',
                correo: usuario.correo || '',
                // Convertimos a booleano real para que el botón de estado funcione
                estado: usuario.estado === true || usuario.estado === 1, 
                identificacion: usuario.identificacion || ''
            });
        }
    }, [usuario]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleToggleEstado = () => {
        setFormData({ ...formData, estado: !formData.estado });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const datosParaEnviar = {
            nombre: formData.nombre,
            correo: formData.correo,
            identificacion: formData.identificacion,
            //estado: formData.estado // Aquí React suele tener true/false
            // Convertimos el true/false a 1/0 manualmente antes de enviar
            estado: formData.estado ? 1 : 0
        };


        onSave(datosParaEnviar);
    };

    if (!usuario) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>Editar Información</h2>
                    <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label>Nombre Completo</label>
                        <input 
                            type="text" 
                            name="nombre" 
                            value={formData.nombre} 
                            onChange={handleChange} 
                            placeholder="Ej: Juan Pérez"
                            required 
                        />
                    </div>

                    <div className={styles.field}>
                        <label>Correo Electrónico</label>
                        <input 
                            type="email" 
                            name="correo" 
                            value={formData.correo} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className={styles.field}>
                        <label>Número de Identificación</label>
                        <input 
                            type="text" 
                            name="identificacion" 
                            value={formData.identificacion} 
                            onChange={handleChange} 
                            placeholder="Ej: 1061..."
                            required 
                        />
                    </div>

                    {/* <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Estado de Cuenta</label>
                            <button 
                                type="button"
                                className={formData.estado ? styles.btnActivo : styles.btnInactivo}
                                onClick={handleToggleEstado}
                            >
                                {formData.estado ? 'Cuenta Activa' : 'Cuenta Inactiva'}
                            </button>
                        </div>
                    </div> */}

                    <div className={styles.footer}>
                        <button type="button" className={styles.btnCancelar} onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className={styles.btnGuardar}>
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalEditarAdmin;