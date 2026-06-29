import { Plus, Sparkles, ImagePlus} from "lucide-react";
import style from "../LabConfigurarLabs.module.css";

function InformacionGeneral({
  formData,
  handleInputChange,
  categorias,
  handleSelectChange,
  openModal,
  imagenPreview,
  isGeneratingImagen,
  setImagenPreview,
  setFormData,
  handleGenerarConIA,
  isGeneratingIA,

  busquedaCategoria,
  setBusquedaCategoria,
  mostrarDropdown,
  setMostrarDropdown,
  handleSeleccionarCategoria,
}) {
  return (
    <section className={style.form_section}>
      <h3 className={style.subtitulo}>1. Información General</h3>
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

          <div
            className={style.input_group_row}
            style={{ position: "relative" }}
          >
            <div className={style.autocompleteContainer}>
              <input
                type="text"
                className={style.input_diseno}
                placeholder="Buscar categoría..."
                value={busquedaCategoria}
                onChange={(e) => {
                  setBusquedaCategoria(e.target.value);
                  setMostrarDropdown(true);
                }}
                onFocus={() => setMostrarDropdown(true)}
              />

              {mostrarDropdown && (
                <div className={style.dropdownCategorias}>
                  {categorias
                    .filter((cat) =>
                      cat.nombre
                        .toLowerCase()
                        .includes(busquedaCategoria.toLowerCase()),
                    )
                    .map((cat) => (
                      <div
                        key={cat.id}
                        className={style.itemCategoria}
                        onClick={() => handleSeleccionarCategoria(cat)}
                      >
                        {cat.nombre}
                      </div>
                    ))}

                  {categorias.filter((cat) =>
                    cat.nombre
                      .toLowerCase()
                      .includes(busquedaCategoria.toLowerCase()),
                  ).length === 0 && (
                    <div className={style.noResultados}>
                      No se encontraron categorías
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* BOTÓN + */}
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
                <ImagePlus size={42} className={style.iconUpload} />

                <h4>Agregar portada</h4>

                <p>Arrastra una imagen o haz clic para seleccionarla</p>

                <span>PNG · JPG · WEBP</span>

                <small>Máximo 20 MB</small>
              </div>
            </label>

            <input
                id="imagenPortada"
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {

                    const file = e.target.files[0];

                    if (!file) return;

                    setImagenPreview(URL.createObjectURL(file));

                    setFormData(prev => ({
                        ...prev,
                        imagen_portada: file
                    }));

                }}
            />

            </div>   

          <div className={style.previewBox}>
            {isGeneratingImagen ? (
              <div className={style.generandoImagen}>
                <div className={style.spinner}></div>

                <h4>Creando una portada personalizada</h4>

                <p>
                  La IA está generando una ilustración para este laboratorio.
                </p>

                <span>Esto puede tardar unos segundos...</span>
              </div>
            ) : imagenPreview ? (
              <>
                <img
                  src={imagenPreview}
                  alt="Vista previa"
                  className={style.previewImage}
                />

                <button
                  type="button"
                  className={style.btnEliminarImagen}
                  onClick={() => {

                      setImagenPreview(null);

                      setFormData(prev => ({
                          ...prev,
                          imagen_portada: null
                      }));

                      document.getElementById("imagenPortada").value = "";

                  }}
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
      <div className={style.estadoGrid}></div>
    </section>
  );
}

export default InformacionGeneral;
 
  