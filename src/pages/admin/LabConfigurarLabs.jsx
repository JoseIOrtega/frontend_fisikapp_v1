import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import AdminCrateButton from "../../components/UI/admin/AdminCreateButton";
import AdminCardContainer from "../../components/UI/admin/AdminCardContainer";
import GenericModal from "../../components/modals/GenericModal"; 
import { useModal } from '../../context/ModalContext';
import { Plus, Save } from 'lucide-react';
import style from './LabConfigurarLabs.module.css';
import { 
  getCategorias, crearCategoria, 
  getObjetivos, crearObjetivo,
  getPalabrasClave, crearPalabraClave,
  crearLaboratorio 
} from "../../services/admin/ConfigLabServices";

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
  
  // --- ESTADOS DE MODALES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); 
  const [newData, setNewData] = useState({ nombre: '', descripcion: '', categoriaId: '' });

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
      
      // Sincronizar descripciones con la data cargada
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
    } else if (tipo === 'objetivo') {
      setSelectedObjetivo(objetivos.find(o => String(o.id) === String(id)) || null);
    } else if (tipo === 'palabra_clave') {
      setSelectedPalabra(palabrasClave.find(p => String(p.id) === String(id)) || null);
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setNewData({ nombre: '', descripcion: '', categoriaId: formData.categoria || '' });
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
        // Validación de categoría para la FK necesaria en el backend
        if (!newData.categoriaId) return alert("Seleccione una categoría");
        res = await crearPalabraClave({ 
          nombre: newData.nombre, 
          descripcion: newData.descripcion,
          categoria_id: parseInt(newData.categoriaId) 
        });
      }

      // IMPORTANTE: Refrescamos la lista de palabras clave inmediatamente
      const palsActualizadas = await getPalabrasClave();
      setPalabrasClave(palsActualizadas);

      // Sincronización automática tras guardar exitosamente
      if (res && res.id) {
        const nuevoId = String(res.id);
        if (modalType === "PAL") {
          setFormData(prev => ({ ...prev, palabra_clave: nuevoId }));
          setSelectedPalabra(palsActualizadas.find(p => String(p.id) === nuevoId));
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
      alert("Error al guardar: Verifique que el servicio incluya Content-Type application/json");
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
      //alert("✅ Plantilla agregada correctamente");
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
          <AdminCrateButton icon={Save} text="Agregar Plantilla" onClick={handleSavePlantilla} />
        </div>

        <AdminCardContainer>
          <div className={style.form_container}>
            
            <section className={style.form_section}>
              <h3 className={style.subtitulo}>1. Información General</h3>
              <div className={style.grid_inputs}>
                <div className={style.field}>
                  <label>Título del Laboratorio *</label>
                  <input type="text" name="titulo_lab" className={style.input_diseno} onChange={handleInputChange} value={formData.titulo_lab} />
                </div>
                <div className={style.field}>
                  <label>Opciones</label>
                  <div className={style.checkbox_group}>
                    <label><input type="checkbox" name="estado" checked={formData.estado} onChange={handleInputChange} /> Activo</label>
                    <label><input type="checkbox" name="ra" checked={formData.ra} onChange={handleInputChange} /> RA</label>
                  </div>
                </div>
              </div>
            </section>

            <section className={style.form_section}>
              <h3 className={style.subtitulo}>2. Contenido Detallado</h3>
              <div className={style.field}><label>Resumen *</label><textarea name="resumen" className={style.textarea_diseno} onChange={handleInputChange} value={formData.resumen} /></div>
              <div className={style.field}><label>Prólogo</label><textarea name="prologo" className={style.textarea_diseno} onChange={handleInputChange} value={formData.prologo} /></div>
              <div className={style.field}><label>Introducción *</label><textarea name="introduccion" className={style.textarea_diseno} onChange={handleInputChange} value={formData.introduccion} /></div>
              <div className={style.field}><label>Marco Teórico *</label><textarea name="marco_teorico" className={style.textarea_diseno} onChange={handleInputChange} value={formData.marco_teorico} /></div>
            </section>

            <section className={style.form_section}>
              <h3 className={style.subtitulo}>3. Clasificación y Metadatos</h3>
              <div className={style.grid_inputs}>
                
                {/* CATEGORÍA */}
                <div className={style.field}>
                  <label>Categoría Existente *</label>
                  <div className={style.input_group_row}>
                    <select className={style.input_diseno} onChange={(e) => handleSelectChange(e, 'categoria')} value={formData.categoria}>
                      <option value="">Seleccione...</option>
                      {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>
                    <button type="button" onClick={() => openModal("CAT")} className={style.btn_plus_secondary}><Plus size={20}/></button>
                  </div>
                  <div className={style.textarea_resumen}>{selectedCategoria?.descripcion || "..."}</div>
                </div>

                {/* OBJETIVO */}
                <div className={style.field}>
                  <label>Objetivo Principal *</label>
                  <div className={style.input_group_row}>
                    <select className={style.input_diseno} onChange={(e) => handleSelectChange(e, 'objetivo')} value={formData.objetivo}>
                      <option value="">Seleccione...</option>
                      {objetivos.map(o => <option key={o.id} value={o.id}>{o.tipo_objetivo}</option>)}
                    </select>
                    <button type="button" onClick={() => openModal("OBJ")} className={style.btn_plus_secondary}><Plus size={20}/></button>
                  </div>
                  <div className={style.textarea_resumen}>{selectedObjetivo?.descripcion_objetivo || "..."}</div>
                </div>

                {/* PALABRA CLAVE */}
                <div className={style.field}>
                  <label>Palabra Clave *</label>
                  <div className={style.input_group_row}>
                    <select className={style.input_diseno} onChange={(e) => handleSelectChange(e, 'palabra_clave')} value={formData.palabra_clave}>
                      <option value="">Seleccione...</option>
                      {palabrasClave
                        .filter(p => String(p.categoria) === String(formData.categoria))
                        .map(p => <option key={p.id} value={p.id}>{p.palabra_clave}</option>)
                      }
                    </select>
                    <button type="button" onClick={() => openModal("PAL")} className={style.btn_plus_secondary}><Plus size={20}/></button>
                  </div>
                  <div className={style.textarea_resumen}>{selectedPalabra?.descripcion || "..."}</div>
                </div>
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
            <label>{modalType === "OBJ" ? "Tipo de Objetivo" : "Nombre"}</label>
            <input className={style.input_diseno} value={newData.nombre} onChange={e => setNewData({...newData, nombre: e.target.value})} required />
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
            <label>Descripción</label>
            <textarea className={style.textarea_diseno} value={newData.descripcion} onChange={e => setNewData({...newData, descripcion: e.target.value})} required />
          </div>
          <button type="submit" className={style.btn_guardar_modal}>Confirmar Guardado</button>
        </form>
      </GenericModal>
    </AdminLayout>
  );
}

export default LabConfigurarLabs;