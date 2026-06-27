import style from "./VistaPrevia.module.css";

function VistaPrevia({
  formData,
  objetivosEspecificos,
  imagenPreview,
  categorias,
  contenido,
  onGuardar,
}) {
  const categoriaSeleccionada = categorias?.find(
    (cat) => cat.id === Number(formData.categoria)
  );

  const items = [
    {
     
      titulo: "Información general",
      subtitulo: "Título, categoría y descripción",
      completo: !!formData.titulo_lab,
    },
    {
      
      titulo: "Objetivos",
      subtitulo: `1 objetivo general, ${objetivosEspecificos.length} específicos`,
      completo: !!formData.objetivo_general,
    },
    {
  
  titulo: "Contenido",
  subtitulo: (() => {
    const campos = [
      formData.resumen && "Resumen",
      formData.introduccion && "Introducción",
      formData.marco_teorico && "Marco teórico",
    ].filter(Boolean);

    return campos.length > 0
      ? campos.join(", ")
      : "Sin contenido";
  })(),
  completo: !!formData.introduccion,
},
  ];

  return (
    <section className={style.layoutPreview}>

      {/* ── COLUMNA IZQUIERDA ── */}
      <div>
        <div className={style.panelResumen}>
          {items.map((item, i) => (
            <div key={i} className={style.itemResumen}>
              <div className={style.itemResumenLeft}>
                <div className={style.textoItem}>
                  <strong>{item.titulo}</strong>
                  <span>{item.subtitulo}</span>
                </div>
              </div>
              {item.completo
                ? <span className={style.checkVerde}>✓</span>
                : <span className={style.chevron}>›</span>
              }
            </div>
          ))}
        </div>
      </div>

      {/* ── COLUMNA DERECHA — Preview ── */}
      <div className={style.panelPreview}>

        {imagenPreview ? (
          <div className={style.imagenPortadaWrapper}>
            <img src={imagenPreview} alt="Portada" className={style.imagenPortada} />
            <div className={style.imagenOverlay}>
              <h1 className={style.tituloLaboratorio}>
                {formData.titulo_lab || "Sin título"}
              </h1>
              <span className={style.badgeCategoria}>
                {categoriaSeleccionada?.nombre || "Sin categoría"}
              </span>
            </div>
          </div>
        ) : (
          <div className={style.imagenPlaceholder}>
            <h1 className={style.tituloLaboratorio}>
              {formData.titulo_lab || "Sin título"}
            </h1>
            <span className={style.badgeCategoria}>
              {categoriaSeleccionada?.nombre || "Sin categoría"}
            </span>
          </div>
        )}

        <div className={style.contenidoPreview}>

          <p className={style.descripcionPreview}>
            {formData.resumen || "Sin descripción"}
          </p>


          {formData.introduccion && (
            <>
              <h3 className={style.seccionTitulo}>Introducción</h3>
              <p className={style.objetivoGeneral}>{formData.introduccion}</p>
            </>
          )}

          {formData.marco_teorico && (
            <>
              <h3 className={style.seccionTitulo}>Marco teórico</h3>
              <p className={style.objetivoGeneral}>{formData.marco_teorico}</p>
            </>
          )}

          

          <h3 className={style.seccionTitulo}>Objetivo general</h3>
          <p className={style.objetivoGeneral}>
            {formData.objetivo_general || "Sin objetivo general"}
          </p>

          <h3 className={style.seccionTitulo}>Objetivos específicos</h3>
          <ul className={style.listaObjetivosPreview}>
            {objetivosEspecificos.map((obj, i) => (
              <li key={i}>{obj}</li>
            ))}
          </ul>

        </div>
      </div>

      {/* ── BOTONES DE ACCIÓN ── */}
      <div className={style.botonesAccion}>
        <button
          className={style.btnPublicar}
          onClick={onGuardar}
        >
          Publicar plantilla
        </button>
      </div>

    </section>
  );
}

export default VistaPrevia;