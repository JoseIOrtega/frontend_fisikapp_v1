import { Plus } from "lucide-react";
import style from "../LabConfigurarLabs.module.css";

function Objetivos({
  objetivos,
  palabrasClave,
  selectedObjetivo,
  selectedPalabra,
  formData,
  handleSelectChange,
  openModal,
  searchTerm,
  setSearchTerm
}) {

  return (
    <section className={style.form_section}>

      {

        <section className={style.form_section}>
              <h3 className={style.subtitulo}>2. Clasificación y Metadatos</h3>
              <div className={style.grid_inputs}>
                
                

                {/* OBJETIVO */}
            <div className={style.field}>
              <label>Objetivo Principal *</label>
              <div className={style.input_group_row}>
                <select 
                  className={style.input_diseno} 
                  onChange={(e) => handleSelectChange(e, 'objective' in formData ? 'objective' : 'objetivo')} 
                  value={formData.objetivo || formData.objective || ""}
                >
                  <option value="">Seleccione...</option>
                  {/* Filtramos la lista en tiempo real para eliminar duplicados por ID */}
                  {objetivos
                    .filter((obj, index, self) => self.findIndex(o => o.id === obj.id) === index)
                    .map((obj) => (
                      <option key={obj.id} value={obj.id}>
                        {obj.descripcion}
                      </option>
                    ))
                  }
                </select>
                <button type="button" onClick={() => openModal("OBJ")} className={style.btn_plus_secondary}>
                  <Plus size={20}/>
                </button>
              </div>
              {/* Se mantiene la descripción vinculada al estado si se requiere mostrar detalles adicionales */}
             <div className={style.textarea_resumen}>{selectedObjetivo?.descripcion || "..."}</div>
            </div>

                {/* PALABRA CLAVE */}
                <div className={style.field}>
                  <label>Palabra Clave *</label>
                  <div className={style.input_group_row}>
                    <input
                      list="palabras-list"
                      className={style.input_diseno}
                      placeholder="Escribe para buscar..."
                      value={searchTerm} 
                      onChange={(e) => {
                        const val = e.target.value;
                        setSearchTerm(val);
                        const coincidencia = palabrasClave.find(p => p.palabra_clave === val);
                        if (coincidencia) {
                          handleSelectChange({ target: { value: coincidencia.id } }, 'palabra_clave');
                        }
                      }}
                      onBlur={() => {
                        const actual = palabrasClave.find(p => String(p.id) === String(formData.palabra_clave));
                        if (actual) setSearchTerm(actual.palabra_clave);
                      }}
                    />
                    <datalist id="palabras-list">
                         {palabrasClave.map(p => (
                            <option key={p.id} value={p.palabra_clave} />
                              ))}
                    </datalist>
                    <button type="button" onClick={() => openModal("PAL")} className={style.btn_plus_secondary}><Plus size={20}/></button>
                  </div>
                  <div className={style.textarea_resumen}>{selectedPalabra?.descripcion || "..."}</div>
                </div>
              </div>
            </section>
      }

    </section>
  );
}

export default Objetivos;