import React, { useState, useEffect } from 'react';
import style from './HistorialReportes.module.css';

const HistorialReportes = () => {
    // Estado para almacenar los laboratorios del docente
    const [reportes, setReportes] = useState([]);

    return (
        <div className={style.container}>
            <h2 className={style.title}>Historial de Reportes</h2>
            
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
                        {/* Mapeo de ejemplo: Aquí vendrán los datos de tu Postgres */}
                        <tr>
                            <td>Mecánica de Sólidos</td>
                            <td>Juan Pérez, María López</td>
                            <td><button className={style.btn_ver}>Ver Datos</button></td>
                            <td><button className={style.btn_ver}>Ver Observaciones</button></td>
                            <td><span className={style.status_done}>Generado</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HistorialReportes;