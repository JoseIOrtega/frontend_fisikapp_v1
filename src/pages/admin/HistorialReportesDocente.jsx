import { useState, useEffect } from 'react';
import style from './HistorialReportes.module.css';
import { getHistorialReportes } from '../../services/docente/reporteService';

const HistorialReportes = () => {
    // --- ESTADOS ---
    const [reportes, setReportes] = useState([]);
    const [fechaFiltro, setFechaFiltro] = useState('');
    const [loading, setLoading] = useState(true);

    // Estados para el Modal de Estudiantes
    const [modalEstudiantesAbierto, setModalEstudiantesAbierto] = useState(false);
    const [estudiantesDetalle, setEstudiantesDetalle] = useState([]);

    // Estados para el Modal de Observaciones del Docente
    const [modalObservacionesAbierto, setModalObservacionesAbierto] = useState(false);
    const [observacionTexto, setObservacionTexto] = useState('');

    // --- PASO 2: EFECTO PARA TRAER DATOS REALES DEL BACKEND ---
    useEffect(() => {
        setLoading(true);
        getHistorialReportes(fechaFiltro)
            .then((data) => {
                setReportes(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error al cargar el historial de reportes:", error);
                setLoading(false);
            });
    }, [fechaFiltro]); // Se vuelve a ejecutar automáticamente si cambias la fecha

    // --- MANEJADORES DE MODALES (PASO 4) ---
    const handleAbrirEstudiantes = (objetoEstudiantes) => {
        console.log("-> Procesando objetoEstudiantes:", objetoEstudiantes);

        // Extraemos la lista detallada directamente del objeto confirmado en consola
    const arrayOrigen = objetoEstudiantes?.lista_detallada || [];
    
        // Forzamos a React a romper la referencia vieja creando una copia limpia del array
        setEstudiantesDetalle([...arrayOrigen]);
        setModalEstudiantesAbierto(true);
    };

    const handleAbrirObservaciones = (texto) => {
        setObservacionTexto(texto);
        setModalObservacionesAbierto(true);
    };

    return (
        <div className={style.container}>
            {/*<h2 className={style.title}>Historial de Reportes</h2> */}

            {/* Selector de Fecha Independiente */}
            <div className={style.contenedorFiltros}>
                <div className={style.campoFecha}>
                    <input 
                        type="date" 
                        value={fechaFiltro}
                        onChange={(e) => setFechaFiltro(e.target.value)}
                        className={style.inputFecha}
                    />
                    {fechaFiltro && (
                        <button 
                            className={style.botonLimpiar} 
                            onClick={() => setFechaFiltro('')}
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* CONTENEDOR DE LA TABLA */}
            <div className={style.tabla_container}>
                <table className={style.tabla}>
                    <thead>
                        <tr>
                            <th>Laboratorio</th>
                            <th>Estudiantes</th>
                            <th>Reporte Estudiante</th>
                            <th>Reporte Docente</th>
                            <th>Informe Final</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* PASO 3: RENDEREADO DINÁMICO SEGÚN RESPUESTA DEL BACKEND */}
                        {loading ? (
                            <tr><td colSpan="5" className={style.text_center}>Cargando reportes...</td></tr>
                        ) : reportes.length === 0 ? (
                            <tr><td colSpan="5" className={style.text_center}>No se encontraron reportes.</td></tr>
                        ) : (
                            reportes.map((reporte) => (
                                <tr key={reporte.id}>
                                    <td>{reporte.laboratorio_nombre}</td>
                                    <td>{reporte.estudiantes_info?.lista_detallada?.length > 0? reporte.estudiantes_info.lista_detallada
                                        .map(est => est.nombre)
                                        .join(', ')
                                        : "Sin estudiantes asignados"}
                                    </td>
                                    <td>
                                        <button 
                                            className={style.btn_ver}
                                            onClick={() => handleAbrirEstudiantes(reporte.estudiantes_info || reporte.estudiantes)}
                                        >
                                            Ver Datos
                                        </button>
                                    </td>
                                    <td>
                                        <button 
                                            className={style.btn_ver}
                                            disabled={!reporte.reporte_docente_info.tiene_observaciones}
                                            onClick={() => handleAbrirObservaciones(reporte.reporte_docente_info.observaciones)}
                                        >
                                            Ver Observaciones
                                        </button>
                                    </td>
                                    <td>
                                        <span 
                                            className={style.status_done}
                                            onClick={() => {
                                                if (reporte.url_informe_final) {
                                                    window.open(reporte.url_informe_final, '_blank');
                                                }
                                            }}
                                        >
                                            {reporte.estado_informe}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* =========================================================
                PASO 4: MODAL DE DETALLE DE ESTUDIANTES
               ========================================================= */}
            {modalEstudiantesAbierto && (
                <div className={style.modal_overlay}>
                    <div className={style.modal_content}>
                        <h3>Información Estudiante</h3>
                        <table className={style.tabla_modal}>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Código</th>
                                    <th>Correo</th>
                                </tr>
                            </thead>
                            <tbody>
                                    {estudiantesDetalle && estudiantesDetalle.length > 0 ? (
                                        estudiantesDetalle.map((est, index) => (
                                            <tr key={est.id || index}>
                                                <td>{est.nombre}</td>
                                                <td>{est.codigo}</td>
                                                <td>{est.correo}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" style={{ textAlign: "center", color: "#666" }}>
                                                No hay datos de estudiantes en este reporte.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                        </table>
                        <button className={style.btn_cerrar} onClick={() => setModalEstudiantesAbierto(false)}>
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            {/* =========================================================
                PASO 4: MODAL DE OBSERVACIONES DOCENTE
               ========================================================= */}
            {modalObservacionesAbierto && (
                <div className={style.modal_overlay}>
                    <div className={style.modal_content}>
                        <h3>Observaciones del Docente</h3>
                        <p className={style.observacion_parrafo}>{observacionTexto}</p>
                        <button className={style.btn_cerrar} onClick={() => setModalObservacionesAbierto(false)}>
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HistorialReportes;