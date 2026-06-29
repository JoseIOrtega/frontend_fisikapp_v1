import React from 'react';
import { X, Download, UploadCloud, FileText } from 'lucide-react';
import style from './ModalCargaCSVAdmin.module.css';

function ModalCargaCSVAdmin({ isOpen, onClose, onArchivoSeleccionado, cargando }) {
  if (!isOpen) return null;

const descargarPlantilla = () => {
  const indicadorExcel = "sep=,\n";

  const encabezados = "nombre,correo,identificacion,institucion\n";

  const contenidoCompleto = indicadorExcel + encabezados;

  const blob = new Blob([contenidoCompleto], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = "plantilla_profesores_fisikapp.csv";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

  return (
    <div className={style.overlay}>
      <div className={style.modalContainer}>
        {/* Cabecera */}
        <div className={style.header}>
          <div className={style.titleGroup}>
            <FileText size={20} className={style.iconTitle} />
            <h3>Carga Masiva de Usuarios</h3>
          </div>
          <button
            className={style.btnClose}
            onClick={onClose}
            disabled={cargando}
          >
            <X size={20} />
          </button>
        </div>

        {/* Cuerpo */}
        <div className={style.body}>
          <p className={style.description}>
            Sigue estos pasos para registrar a los profesores de forma masiva.
          </p>

          <div className={style.stepsGrid}>
            {/* Paso 1 */}
            <div className={style.stepCard}>
              <div className={style.stepBadge}>1</div>
              <h4>Descargar Formato</h4>
              <p>
                Descarga la plantilla oficial con los datos requeridos para
                registrar profesores.
              </p>
              <button
                className={style.btnSecondary}
                onClick={descargarPlantilla}
              >
                <Download size={16} /> Descargar Plantilla
              </button>
            </div>

            {/* Paso 2 */}
            <div className={style.stepCard}>
              <div className={style.stepBadge}>2</div>
              <h4>Subir Archivo</h4>
              <p>Selecciona el archivo ya diligenciado para procesarlo.</p>
              <button
                className={style.btnPrimary}
                onClick={() => document.getElementById("csvInputReal").click()}
                disabled={cargando}
              >
                {cargando ? (
                  "Procesando..."
                ) : (
                  <>
                    <UploadCloud size={18} />
                    <span>Seleccionar CSV</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Input Oculto */}
        <input
          type="file"
          id="csvInputReal"
          accept=".csv,.xlsx,.xls"
          style={{ display: "none" }}
          onChange={(e) => {
            onArchivoSeleccionado(e);
            onClose(); // Cerramos al seleccionar
          }}
        />
      </div>
    </div>
  );
}

export default ModalCargaCSVAdmin;