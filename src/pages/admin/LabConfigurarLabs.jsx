import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import AdminCrateButton from "../../components/UI/admin/AdminCreateButton";
import AdminCardContainer from "../../components/UI/admin/AdminCardContainer";
import GenericModal from "../../components/modals/GenericModal"; 
import { useModal } from '../../context/ModalContext';
import { Plus, Save, Sparkles } from 'lucide-react';
import style from './LabConfigurarLabs.module.css';
import { 
  getCategorias, crearCategoria, 
  getObjetivos, crearObjetivo,
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
  const [busquedaCategoria, setBusquedaCategoria] = useState("");
  
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

  const cargarTodosLosDatos = async () => {
    try {
      const [cats, objs, pals] = await Promise.all([
        getCategorias(), getObjetivos(), getPalabrasClave()
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
        objetivo: selectedObjetivo ? selectedObjetivo.descripcion_objetivo : "",
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
        res = await crearObjetivo({ nombre: newData.nombre, descripcion: newData.descripcion });
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
          const objsActualizados = await getObjetivos();
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
      const payload = {
        titulo_lab: formData.titulo_lab,
        resumen: formData.resumen,
        prologo: formData.prologo,
        introduccion: formData.introduccion,
        marco_teorico: formData.marco_teorico,
        categoria: parseInt(formData.categoria),
        objetivo: parseInt(formData.objetivo),
        palabras_clave: formData.palabra_clave ? [parseInt(formData.palabra_clave)] : [],
        estado: formData.estado,
        ra: formData.ra
      };
      await crearLaboratorio(payload);
      showModal('success', '✅ Plantilla agregada correctamente');
    } catch (err) {
      alert("❌ Verifique los campos obligatorios (*)");
    }
  };

  return (
    <AdminLayout>
      <div className={style.layout}>
        <div className={style.seccion_del_header}>
          <h2 className={style.titulo_header_laboratorio}>Configurar Laboratorios</h2>
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
            <AdminCrateButton icon={Save} text="Agregar Plantilla" onClick={handleSavePlantilla} />
          </div>
        </div>

        <AdminCardContainer>
          <div className={style.form_container}>
            
            {/* SECCIÓN 1: CONFIGURACIÓN E INFORMACIÓN BÁSICA */}
            <section className={style.form_section}>
              <h3 className={style.subtitulo}>1. Información General</h3>
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
            </section>

            {/* SECCIÓN 2: CLASIFICACIÓN Y METADATOS (MOVIDO AQUÍ ABAJO DEL TITULO) */}
            <section className={style.form_section}>
              <h3 className={style.subtitulo}>2. Clasificación y Metadatos</h3>
              <div className={style.grid_inputs}>
                
                {/* CATEGORÍA */}
                <div className={style.field}>
                  <label>Categoría Existente *</label>
                  <div className={style.input_group_row} style={{ position: 'relative' }}>
                    <input 
                      type="text"
                      className={style.input_diseno}
                      placeholder="Escribe para buscar (ej: Mecánica Clásica)..."
                      // Sincronización directa con el estado local de búsqueda sin interferencias de condiciones
                      value={busquedaCategoria}
                      onChange={(e) => {
                        const texto = e.target.value;
                        setBusquedaCategoria(texto);
                        
                        // Si borras el texto por completo, se limpia la selección del formulario
                        if (texto.trim() === "") {
                          handleSelectChange({ target: { value: "" } }, 'categoria');
                          if (typeof setSelectedCategoria === 'function') setSelectedCategoria(null);
                        }
                      }}
                    />
                    <button type="button" onClick={() => openModal("CAT")} className={style.btn_plus_secondary}>
                      <Plus size={20}/>
                    </button>

                    {/* El menú de sugerencias solo se muestra si el usuario ha escrito algo en la caja */}
                    {busquedaCategoria.trim() !== "" && (
                      <div style={{
                        position: 'absolute', top: '100%', left: 0, right: '50px', 
                        backgroundColor: '#fff', border: '1px solid #ccc', zIndex: 10,
                        maxHeight: '150px', overflowY: 'auto', borderRadius: '4px', boxShadow: '0px 4px 6px rgba(0,0,0,0.1)'
                      }}>
                        {categorias
                          .filter(c => {
                            // Limpieza de acentos y minúsculas para coincidencia inteligente
                            const nombreBD = c.nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                            const palabrasBuscadas = busquedaCategoria.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().split(/\s+/).filter(Boolean);
                            
                            // Compara que todas las palabras digitadas estén dentro del nombre de la base de datos
                            return palabrasBuscadas.every(palabra => nombreBD.includes(palabra));
                          })
                          .map(c => (
                            <div 
                              key={c.id} 
                              style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0', color: '#000' }}
                              onClick={() => {
                                // Al hacer clic sobre el resultado, guardamos los datos reales en el formulario
                                handleSelectChange({ target: { value: c.id } }, 'categoria');
                                if (typeof setSelectedCategoria === 'function') setSelectedCategoria(c);
                                
                                // Fijamos el nombre completo de la categoría en el input y cerramos la lista limpiando el filtro
                                setBusquedaCategoria(c.nombre);
                              }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = '#fff'}
                            >
                              {c.nombre}
                            </div>
                          ))
                        }
                        
                        {/* Mensaje de aviso si no hay coincidencias exactas */}
                        {categorias.filter(c => {
                          const nombreBD = c.nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                          const palabrasBuscadas = busquedaCategoria.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().split(/\s+/).filter(Boolean);
                          return palabrasBuscadas.every(palabra => nombreBD.includes(palabra));
                        }).length === 0 && (
                          <div style={{ padding: '8px 12px', color: '#888', fontStyle: 'italic' }}>
                            No se encontraron resultados. Dale al "+" para crearla.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Muestra la descripción de la categoría seleccionada en tiempo real */}
                  <div className={style.textarea_resumen}>
                    {categorias.find(c => String(c.id) === String(formData.categoria))?.descripcion || "..."}
                  </div>
                </div>

                {/* OBJETIVO */}
                <div className={style.field}>
                  <label>Objetivo Principal *</label>
                  <div className={style.input_group_row}>
                    <select className={style.input_diseno} onChange={(e) => handleSelectChange(e, 'objetivo')} value={formData.objetivo}>
                      <option value="">Seleccione...</option>
                      <option value="General">Objetivo General</option>
                      <option value="Especifico">Objetivo Específico</option>
                    </select>
                    <button type="button" onClick={() => openModal("OBJ")} className={style.btn_plus_secondary}>
                      <Plus size={20}/>
                    </button>
                  </div>
                  {/* Se mantiene la descripción vinculada al estado si se requiere mostrar detalles adicionales */}
                  <div className={style.textarea_resumen}>{selectedObjetivo?.descripcion_objetivo || "..."}</div>
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
                      {palabrasClave
                        .filter(p => String(p.categoria) === String(formData.categoria))
                        .map(p => (
                          <option key={p.id} value={p.palabra_clave} />
                        ))
                      }
                    </datalist>
                    <button type="button" onClick={() => openModal("PAL")} className={style.btn_plus_secondary}><Plus size={20}/></button>
                  </div>
                  <div className={style.textarea_resumen}>{selectedPalabra?.descripcion || "..."}</div>
                </div>
              </div>
            </section>

            {/* SECCIÓN 3: CONTENIDO DETALLADO (AUTOMATIZADO POR IA) */}
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

          <div className={style.modal_field}>
            <label>Descripción / Detalle</label>
            <textarea className={style.textarea_diseno} value={newData.descripcion} onChange={e => setNewData({...newData, descripcion: e.target.value})} required />
          </div>
          <button type="submit" className={style.btn_guardar_modal}>Confirmar Guardado</button>
        </form>
      </GenericModal>
    </AdminLayout>
  );
}

export default LabConfigurarLabs;