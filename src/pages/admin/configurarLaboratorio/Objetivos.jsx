
import style from "./Objetivos.module.css";
import { useState } from "react";
import { Plus, Sparkles } from "lucide-react";


function Objetivos({
  objetivos,
  selectedObjetivo,
  handleGenerarConIA
}) {

    const [objetivosEspecificos, setObjetivosEspecificos] = useState([
  "",
]);

const agregarObjetivo = () => {
  setObjetivosEspecificos([
    ...objetivosEspecificos,
    ""
  ]);
};

const actualizarObjetivo = (index, valor) => {
  const copia = [...objetivosEspecificos];
  copia[index] = valor;
  setObjetivosEspecificos(copia);
};

const eliminarObjetivo = (index) => {
  const copia = [...objetivosEspecificos];
  copia.splice(index, 1);
  setObjetivosEspecificos(copia);
};

  return (
    
   <section className={style.form_section}>

      <div className={style.headerObjetivos}>

  <div>
    <h1 className={style.subtitulo}>Objetivos</h1>

    <p>
      Define el objetivo general y los específicos del laboratorio
    </p>
  </div>

  <button
  type="button"
  className={style.btn_ia_gradient}
  onClick={handleGenerarConIA}
>
  <Sparkles size={16} className={style.icon_spark} />
  Generar con IA
</button>

</div>

      <div className={style.field}>
        <label>Objetivo General *</label>

        <div className={style.textarea_resumen}>
          {selectedObjetivo?.descripcion || "Seleccione un objetivo general"}
        </div>
      </div>

      <div className={style.objetivosHeader}>
  <h3 className={style.tituloObjetivosEspecificos}>
    Objetivos específicos *
  </h3>

  <button
    type="button"
    className={style.btnAgregarObjetivo}
    onClick={agregarObjetivo}
  >
    <Plus size={16} />
    Agregar objetivo
  </button>
</div>

<div className={style.listaObjetivos}>

  {objetivosEspecificos.map((objetivo, index) => (
    <div key={index} className={style.objetivoItem}>

      <span className={style.numeroObjetivo}>
        {index + 1}.
      </span>

      <input
        type="text"
        value={objetivo}
        onChange={(e) =>
          actualizarObjetivo(index, e.target.value)
        }
        className={style.inputObjetivo}
      />

      <button
  type="button"
  className={style.btnEliminar}
  onClick={() => eliminarObjetivo(index)}
>
  🗑️
</button>

    </div>
  ))}

</div>

     
    </section>

  );
}

export default Objetivos;