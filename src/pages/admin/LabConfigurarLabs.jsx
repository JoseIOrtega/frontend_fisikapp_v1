import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import AdminCrateButton from "../../components/UI/admin/AdminCreateButton";
import AdminCardContainer from "../../components/UI/admin/AdminCardContainer";
import GenericModal from "../../components/modals/GenericModal"; 
import { useModal } from '../../context/ModalContext';
import { Plus, Save, Sparkles } from 'lucide-react';
import style from './LabConfigurarLabs.module.css';
import InformacionGeneral from "./configurarLaboratorio/InformacionGeneral";
import { 
  getCategorias, crearCategoria, 
  getObjetivosGenerales, crearObjetivoGeneral,
  getPalabrasClave, crearPalabraClave,
  crearLaboratorio 
} from "../../services/admin/ConfigLabServices";
import { generarContenidoLaboratorioIA } from "../../services/ia/iaService";

function LabConfigurarLabs() {
  // --- ESTADOS DE DATOS ---
  const { showModal } = useModal();
  const [categorias, setCategorias] = useState([]);
  const [objetivos, setObjetivos] = useState([]);
  const [palabrasClave, setPalabrasClave] = useState([]);
  
  // --- ESTADOS DE SELECCIÓN ---
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [selectedObjetivo, setSelectedObjetivo] = useState(null);
  const [selectedPalabra, setSelectedPalabra] = useState(null);
  const [tipoSeleccionado, setTipoSeleccionado] = useState("General");
  const [searchTerm, setSearchTerm] = useState("");
  const [isGeneratingIA, setIsGeneratingIA] = useState(false);

  const [step, setStep] = useState(1);/// cristian
  const [imagenPreview, setImagenPreview] = useState(null);
  const [busquedaCategoria, setBusquedaCategoria] = useState("");
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [indiceResaltado, setIndiceResaltado] = useState(-1);
  
  // --- ESTADOS DE MODALES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); 
  const [newData, setNewData] = useState({ nombre: '', descripcion: '', categoriaId: '', tipo_objetivo: '' });

  // --- FORMULARIO PRINCIPAL ---
  const [formData, setFormData] = useState({
    titulo_lab: '',
    resumen: '',
    prologo: '',
    introduccion: '',
    marco_teorico: '',
    categoria: '',
    objetivo: '',
    palabra_clave: '',
    estado: true,
    ra: false
  });

  // Maneja la selección limpia de una categoría desde el dropdown
    const handleSeleccionarCategoria = (categoria) => {
        setBusquedaCategoria(categoria.nombre); // Rellena el input con el texto
        setFormData({ ...formData, categoriaId: categoria.id }); // Guarda el ID en tu formulario
        setMostrarDropdown(false); // Cierra la lista
        setIndiceResaltado(-1); // Resetea el teclado
    };

    // Maneja el movimiento de flechas y Enter dentro del buscador
    const handleKeyDownCategorias = (e) => {
        // Preparamos la misma lista filtrada basándonos en lo que hay escrito
        const palabrasBuscadas = busquedaCategoria.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().split(/\s+/);
        const listaFiltradasEnTiempoReal = categorias.filter(c => {
            const nombreBD = c.nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            return palabrasBuscadas.every(palabra => nombreBD.includes(palabra));
        });

        // Si el dropdown está oculto o no hay coincidencias, no hacemos nada
        if (!mostrarDropdown || listaFiltradasEnTiempoReal.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault(); // Evita que el cursor de texto salte al final
            setIndiceResaltado((prev) =>
                prev < listaFiltradasEnTiempoReal.length - 1 ? prev + 1 : 0
            );
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setIndiceResaltado((prev) =>
                prev > 0 ? prev - 1 : listaFiltradasEnTiempoReal.length - 1
            );
        } else if (e.key === "Enter") {
            e.preventDefault(); // Evita que el formulario se envíe antes de tiempo
            if (indiceResaltado >= 0 && indiceResaltado < listaFiltradasEnTiempoReal.length) {
                const catSeleccionada = listaFiltradasEnTiempoReal[indiceResaltado];
                
                // Actualiza el formulario usando la función nativa que lee la descripción
                handleSelectChange({ target: { value: catSeleccionada.id } }, 'categoria');
                if (typeof setSelectedCategoria === 'function') setSelectedCategoria(catSeleccionada);
                
                // Rellena el input y cierra la lista
                setBusquedaCategoria(catSeleccionada.nombre);
                setMostrarDropdown(false);
                setIndiceResaltado(-1);
            }
        } else if (e.key === "Escape") {
            setMostrarDropdown(false);
        }
    };

  const cargarTodosLosDatos = async () => {
    try {
      const [cats, objs, pals] = await Promise.all([
        getCategorias(), getObjetivosGenerales(), getPalabrasClave()
      ]);
      setCategorias(cats);
      setObjetivos(objs);
      setPalabrasClave(pals);
      
      if (formData.categoria) setSelectedCategoria(cats.find(c => String(c.id) === String(formData.categoria)));
      if (formData.objetivo) setSelectedObjetivo(objs.find(o => String(o.id) === String(formData.objetivo)));
      if (formData.palabra_clave) setSelectedPalabra(pals.find(p => String(p.id) === String(formData.palabra_clave)));
    } catch (error) {
      console.error("Error cargando datos");
    }
  };

  useEffect(() => { cargarTodosLosDatos(); }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSelectChange = (e, tipo) => {
    const id = e.target.value;
    setFormData(prev => ({ ...prev, [tipo]: id }));
    
    if (tipo === 'categoria') {
      setSelectedCategoria(categorias.find(c => String(c.id) === String(id)) || null);
      setFormData(prev => ({ ...prev, palabra_clave: '' }));
      setSelectedPalabra(null);
      setSearchTerm("");
    } else if (tipo === 'objetivo') {
      setSelectedObjetivo(objetivos.find(o => String(o.id) === String(id)) || null);
    } else if (tipo === 'palabra_clave') {
      setSelectedPalabra(palabrasClave.find(p => String(p.id) === String(id)) || null);
    }
  };

  // --- LÓGICA DE INTEGRACIÓN CON IA ---
  const handleGenerarConIA = async () => {
    if (!formData.titulo_lab || !formData.categoria || !formData.objetivo) {
      showModal('error', '⚠️ Por favor rellene el Título, Categoría y Objetivo antes de usar la IA.');
      return;
    }

    try {
      setIsGeneratingIA(true);
      
      // Mapeamos los textos reales que la IA necesita en lugar de los IDs numéricos
      const payloadIA = {
        titulo: formData.titulo_lab,
        categoria: selectedCategoria ? selectedCategoria.nombre : "",
        objetivo: selectedObjetivo ? selectedObjetivo.descripcion : "",
        palabras_clave: searchTerm || (selectedPalabra ? selectedPalabra.palabra_clave : "")
      };

      const resultado = await generarContenidoLaboratorioIA(payloadIA);

      if (resultado) {
        setFormData(prev => ({
          ...prev,
          introduccion: resultado.introduccion || prev.introduccion,
          resumen: resultado.resumen || prev.resumen,
          prologo: resultado.prologo || prev.prologo,
          marco_teorico: resultado.marco_teorico || prev.marco_teorico
        }));
        showModal('success', '✨ ¡Contenido generado y completado por la IA con éxito!');
      }
    } catch (error) {
      showModal('error', '❌ Ocurrió un error al comunicarse con el Agente de IA.');
    } finally {
      setIsGeneratingIA(false);
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setNewData({ 
      ...newData,
      nombre: type === "OBJ" ? tipoSeleccionado : '', 
      descripcion: '', 
      categoriaId: formData.categoria || '' 
    });
    setIsModalOpen(true);
  };

  const handleCreateInModal = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (modalType === "CAT") {
        res = await crearCategoria({ nombre: newData.nombre, descripcion: newData.descripcion });
      } else if (modalType === "OBJ") {
          res = await crearObjetivoGeneral({ 
        plantilla: parseInt(formData.categoriaId || formData.categoria),
        descripcion: newData.descripcion 
    });

      } else if (modalType === "PAL") {
        if (!newData.categoriaId) return alert("Seleccione una categoría");
        res = await crearPalabraClave({ 
          nombre: newData.nombre, 
          descripcion: newData.descripcion,
          categoria_id: parseInt(newData.categoriaId) 
        });
      }

      if (typeof cargarTodosLosDatos === 'function') {
            await cargarTodosLosDatos();
        }
        if (typeof closeModal === 'function') {
            closeModal();
        }


      const palsActualizadas = await getPalabrasClave();
      setPalabrasClave(palsActualizadas);

      if (res && res.id) {
        const nuevoId = String(res.id);
        if (modalType === "PAL") {
          setFormData(prev => ({ ...prev, palabra_clave: nuevoId }));
          setSelectedPalabra(palsActualizadas.find(p => String(p.id) === nuevoId));
          const match = palsActualizadas.find(p => String(p.id) === nuevoId);
          if (match) setSearchTerm(match.palabra_clave);
        } else if (modalType === "CAT") {
          setFormData(prev => ({ ...prev, categoria: nuevoId }));
          const catsActualizadas = await getCategorias();
          setCategorias(catsActualizadas);
          setSelectedCategoria(catsActualizadas.find(c => String(c.id) === nuevoId));
        } else if (modalType === "OBJ") {
          setFormData(prev => ({ ...prev, objetivo: nuevoId }));
          const objsActualizados = await getObjetivosGenerales();
          setObjetivos(objsActualizados);
          setSelectedObjetivo(objsActualizados.find(o => String(o.id) === nuevoId));
        }
      }
      
      setIsModalOpen(false);
    } catch (error) {
      alert("Error al guardar en el servidor principal.");
    }
  };

  const handleSavePlantilla = async () => {
    try {
        const userId = localStorage.getItem("user_id");

        const payload = {
            titulo: formData.titulo_lab,
            resumen: formData.resumen,
            prologo: formData.prologo,
            introduccion: formData.introduccion,
            marco_teorico: formData.marco_teorico,
            categoria: parseInt(formData.categoriaId || formData.categoria),
            creado_por: parseInt(userId),
            estado: "BORRADOR",
            simulacion: false
        };

        console.log("PAYLOAD:", payload);

        await crearLaboratorio(payload);
        showModal('success', '✅ Plantilla agregada correctamente');
    } catch (err) {
        console.error("Error detallado al guardar:", err);
        showModal('error', '❌ Verifique los campos obligatorios (*)');
    }
};

  return (
    <AdminLayout>
      <div className={style.layout}>
        <div className={style.seccion_del_header}>
          
      <div className={style.stepper}>

         <div
    className={style.progressBar}
    style={{
      width:
        step === 1 ? "0%" :
        step === 2 ? "25%" :
        step === 3 ? "50%" :
        step === 4 ? "75%" :
        "100%"
    }}
  />
  <div
    className={`${style.stepItem} ${step >= 1 ? style.completedStep : ""}`}
    onClick={() => setStep(1)}
  >
    <div className={style.stepCircle}>1</div>
    <span>Información General</span>
  </div>

  <div
    className={`${style.stepItem} ${step >= 2 ? style.completedStep : ""}`}
    onClick={() => setStep(2)}
  >
    <div className={style.stepCircle}>2</div>
    <span>Objetivos</span>
  </div>

  <div
    className={`${style.stepItem} ${step >= 3 ? style.completedStep : ""}`}
    onClick={() => setStep(3)}
  >
    <div className={style.stepCircle}>3</div>
    <span>Contenido</span>
  </div>

  <div
    className={`${style.stepItem} ${step >= 4 ? style.completedStep : ""}`}
    onClick={() => setStep(4)}
  >
    <div className={style.stepCircle}>4</div>
    <span>Desarrollo</span>
  </div>

  <div
    className={`${style.stepItem} ${step >= 5 ? style.completedStep : ""}`}
    onClick={() => setStep(5)}
  >
    <div className={style.stepCircle}>5</div>
    <span>Revisión</span>
  </div>
</div>   

          
        </div>

        <AdminCardContainer>
          <div className={style.form_container}>

           {step === 1 && (
  <InformacionGeneral
    formData={formData}
    handleInputChange={handleInputChange}
    handleSelectChange={handleSelectChange}
    categorias={categorias}
    openModal={openModal}
    imagenPreview={imagenPreview}
    setImagenPreview={setImagenPreview}
  />
)}
    
 
            
          
             {/* SECCIÓN 2: CLASIFICACIÓN Y METADATOS (MOVIDO AQUÍ ABAJO DEL TITULO) */}
            {step === 2 && (

           
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

          )}

             {/* SECCIÓN 3: CONTENIDO DETALLADO (AUTOMATIZADO POR IA) */}
            {step === 3 && (

           
            <section className={style.form_section}>
              <h3 className={style.subtitulo}>3. Contenido Detallado {isGeneratingIA && " (Escribiendo automáticamente...)"}</h3>
              <div className={style.field}>
                <label>Resumen *</label>
                <textarea name="resumen" className={style.textarea_diseno} onChange={handleInputChange} value={formData.resumen} disabled={isGeneratingIA} />
              </div>
              <div className={style.field}>
                <label>Prólogo</label>
                <textarea name="prologo" className={style.textarea_diseno} onChange={handleInputChange} value={formData.prologo} disabled={isGeneratingIA} />
              </div>
              <div className={style.field}>
                <label>Introducción *</label>
                <textarea name="introduccion" className={style.textarea_diseno} onChange={handleInputChange} value={formData.introduccion} disabled={isGeneratingIA} />
              </div>
              <div className={style.field}>
                <label>Marco Teórico *</label>
                <textarea name="marco_teorico" className={style.textarea_diseno} onChange={handleInputChange} value={formData.marco_teorico} disabled={isGeneratingIA} />
              </div>
            </section>

            )}


            {step === 4 && (
  <section className={style.form_section}>
    <h3>4. Desarrollo</h3>
    <p>Próximamente...</p>
  </section>
)}

{step === 5 && (
  <section className={style.form_section}>
    <h3>5. Revisión</h3>
    <p>Vista previa del laboratorio</p>
  </section>
)}

              <div className={style.navigation}>
  <button
    type="button"
    disabled={step === 1}
    onClick={() => setStep(step - 1)}
  >
    Anterior
  </button>

  <button
    type="button"
    disabled={step === 5}
    onClick={() => setStep(step + 1)}
  >
    Siguiente
  </button>
</div>

          </div>
        </AdminCardContainer>
      </div>

      <GenericModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalType === "PAL" ? "Nueva Palabra Clave" : "Nuevo Registro"}
      >
        <form onSubmit={handleCreateInModal} className={style.modal_form}>
          <div className={style.modal_field}>
            <label>{modalType === "OBJ" ? "Tipo de Objetivo" : "Nombre/Tipo"}</label>
            <input 
              className={style.input_diseno} 
              value={newData.nombre} 
              onChange={e => setNewData({...newData, nombre: e.target.value})} 
              required 
            />
          </div>

          {modalType === "PAL" && (
            <div className={style.modal_field}>
              <label>Categoría</label>
              <select className={style.input_diseno} value={newData.categoriaId} onChange={e => setNewData({...newData, categoriaId: e.target.value})} required>
                <option value="">Seleccione...</option>
                {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
          )}

          
          <button type="submit" className={style.btn_guardar_modal}>Confirmar Guardado</button>
        </form>


      
      </GenericModal>
    </AdminLayout>
  );
}

export default LabConfigurarLabs;