import style from "../LabConfigurarLabs.module.css";

function Contenido({
  isGeneratingIA,
  handleInputChange,
  formData
}) {
  return (
    <section className={style.form_section}>
      <h3 className={style.subtitulo}>
        3. Contenido Detallado
        {isGeneratingIA && " (Escribiendo automáticamente...)"}
      </h3>

      <div className={style.field}>
        <label>Resumen *</label>
        <textarea
          name="resumen"
          className={style.textarea_diseno}
          onChange={handleInputChange}
          value={formData.resumen}
          disabled={isGeneratingIA}
        />
      </div>

    
      <div className={style.field}>
        <label>Introducción *</label>
        <textarea
          name="introduccion"
          className={style.textarea_diseno}
          onChange={handleInputChange}
          value={formData.introduccion}
          disabled={isGeneratingIA}
        />
      </div>

      <div className={style.field}>
        <label>Marco Teórico *</label>
        <textarea
          name="marco_teorico"
          className={style.textarea_diseno}
          onChange={handleInputChange}
          value={formData.marco_teorico}
          disabled={isGeneratingIA}
        />
      </div>
    </section>
  );
}

export default Contenido;