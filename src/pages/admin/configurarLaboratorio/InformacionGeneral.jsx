 import { Plus, Sparkles } from "lucide-react";
import style from "../LabConfigurarLabs.module.css";

function InformacionGeneral({
  formData,
  handleInputChange,
  categorias,
  handleSelectChange,
  openModal,
  imagenPreview,
  setImagenPreview,
  handleGenerarConIA,
  isGeneratingIA,
}) {

  return (
        <section className={style.form_section}>
    
    <h3 className={style.subtitulo}>
      1. Información General
    </h3>

    <div className={style.gridInfoGeneral}>

      {/* TITULO */}
      <div className={style.field}>
        <label>Título del Laboratorio *</label>
        <input
          type="text"
          name="titulo_lab"
          className={style.input_diseno}
          onChange={handleInputChange}
          value={formData.titulo_lab}
        />
      </div>

       {/* CATEGORIA */}
      <div className={style.field}>
        <label>Categoría Existente *</label>

        <div className={style.input_group_row} style={{ position: 'relative' }}>
                    <div className={style.input_group_row}>
  <select
    className={style.input_diseno}
    value={formData.categoria}
    onChange={(e) => handleSelectChange(e, 'categoria')}
  >
    <option value="">Seleccione una categoría...</option>

    {categorias.map((cat) => (
      <option key={cat.id} value={cat.id}>
        {cat.nombre}
      </option>
    ))}
  </select>

  <button
    type="button"
    onClick={() => openModal("CAT")}
    className={style.btn_plus_secondary}
  >
    <Plus size={20} />
  </button>
</div>
                    
 </div>
                  
                  
 </div>
</div>


    {/* DESCRIPCION CORTA */}
    <div className={style.field}>
      <label>Descripción corta *</label>

      <textarea
    name="descripcion_corta"
    className={style.textarea_diseno}
    value={formData.descripcion_corta || ""}
    onChange={handleInputChange}
    placeholder="Describe brevemente el laboratorio..."
/>
    </div>

    <div className={style.wrapper_botones_header}>
            <button 
              type="button" 
              className={style.btn_ia_gradient} 
              onClick={handleGenerarConIA}
              disabled={isGeneratingIA}
            >
              <Sparkles size={16} className={style.icon_spark} /> 
              {isGeneratingIA ? "Generando..." : "Generar con IA"}
            </button>
           
          </div>
    

    <div className={style.uploadSection}>
  <label>Imagen de portada (opcional)</label>

  <div className={style.uploadContainer}>
    
    <div className={style.uploadBox}>
  <label htmlFor="imagenPortada" className={style.uploadLabel}>
    <div className={style.uploadContent}>
      
      <p>Arrastra una imagen o haz clic para seleccionar</p>
      <span>PNG, JPG o WEBP</span>
    </div>
  </label>

  <input
  id="imagenPortada"
  type="file"
  accept="image/*"
  hidden
  onChange={(e) => {
    const file = e.target.files[0];

    if (file) {
      setImagenPreview(URL.createObjectURL(file));
    }
  }}
/>
</div>

  <div className={style.previewBox}>
  {imagenPreview ? (
    <>
      <img
        src={imagenPreview}
        alt="Vista previa"
        className={style.previewImage}
      />

      <button
        type="button"
        className={style.btnEliminarImagen}
        onClick={() => setImagenPreview(null)}
      >
        ✕
      </button>
    </>
  ) : (
    <span>Vista previa</span>
  )}
</div>

  </div>
</div>

<div className={style.estadoGrid}>

  

  

</div>

  </section>
);
}

export default InformacionGeneral;
 
  