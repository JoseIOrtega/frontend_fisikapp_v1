import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import AdminCrateButton from "../../components/UI/admin/AdminCreateButton";
import AdminCardContainer from "../../components/UI/admin/AdminCardContainer";
import GenericModal from "../../components/modals/GenericModal"; 
import { Plus, Save } from 'lucide-react';
import style from './LabConfigurarLabs.module.css';
import { 
  getCategorias, crearCategoria, 
  getObjetivos, crearObjetivo,
  crearLaboratorio 
} from "../../services/admin/ConfigLabServices";

function LabConfigurarLabs() {
  const [categorias, setCategorias] = useState([]);
  const [objetivos, setObjetivos] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [selectedObjetivo, setSelectedObjetivo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); 

  const [formData, setFormData] = useState({
    titulo_lab: '', 
    codigo_lab: '', 
    resumen: '', 
    prologo: '', 
    introduccion: '', 
    marco_teorico: '', 
    categoria: '', 
    objetivo: '', 
    estado: true, 
    ra: true
  });

  const [newData, setNewData] = useState({ nombre: '', descripcion: '' });

  const cargarMaestros = async () => {
    const catData = await getCategorias();
    const objData = await getObjetivos();
    setCategorias(catData);
    setObjetivos(objData);
    return { catData, objData };
  };

  useEffect(() => { cargarMaestros(); }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (e, tipo) => {
    const id = e.target.value;
    setFormData(prev => ({ ...prev, [tipo]: id }));
    if (tipo === 'categoria') {
      setSelectedCategoria(categorias.find(c => String(c.id) === String(id)) || null);
    } else {
      setSelectedObjetivo(objetivos.find(o => String(o.id) === String(id)) || null);
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setNewData({ nombre: '', descripcion: '' });
    setIsModalOpen(true);
  };

  const handleCreateInModal = async (e) => {
    e.preventDefault();
    try {
      if (modalType === "CAT") {
        await crearCategoria(newData);
      } else {
        await crearObjetivo(newData);
      }

      const { catData, objData } = await cargarMaestros();
      
      if (modalType === "CAT") {
        const nuevo = catData.find(c => c.nombre === newData.nombre);
        if (nuevo) { 
          setFormData(p => ({ ...p, categoria: nuevo.id })); 
          setSelectedCategoria(nuevo); 
        }
      } else {
        const nuevo = objData.find(o => o.tipo_objetivo === newData.nombre);
        if (nuevo) { 
          setFormData(p => ({ ...p, objetivo: nuevo.id })); 
          setSelectedObjetivo(nuevo); 
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      alert("Error al guardar en el modal.");
    }
  };

  const handleSavePlantilla = async () => {
    try {
      await crearLaboratorio(formData);
      alert("¡Plantilla de laboratorio creada con éxito!");
    } catch (error) {
      console.error(error);
      alert("Error al crear la plantilla general.");
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
            
            {/* SECCIÓN 1: CLASIFICACIÓN (CATEGORÍA Y OBJETIVO) */}
            <section className={style.form_section}>
              <h3 className={style.subtitulo}>1. Clasificación del Laboratorio</h3>
              <div className={style.grid_inputs}>
                <div className={style.field}>
                  <label>Categoría Existente *</label>
                  <div className={style.input_group_row}>
                    <select className={style.input_diseno} onChange={(e) => handleSelectChange(e, 'categoria')} value={formData.categoria}>
                      <option value="">Seleccione...</option>
                      {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>
                    <button type="button" onClick={() => openModal("CAT")} className={style.btn_plus_secondary}><Plus size={20}/></button>
                  </div>
                  <div className={style.textarea_resumen} style={{marginTop:'10px'}}>{selectedCategoria?.descripcion || "Descripción de categoría..."}</div>
                </div>

                <div className={style.field}>
                  <label>Objetivo Principal *</label>
                  <div className={style.input_group_row}>
                    <select className={style.input_diseno} onChange={(e) => handleSelectChange(e, 'objetivo')} value={formData.objetivo}>
                      <option value="">Seleccione...</option>
                      {objetivos.map(o => <option key={o.id} value={o.id}>{o.tipo_objetivo}</option>)}
                    </select>
                    <button type="button" onClick={() => openModal("OBJ")} className={style.btn_plus_secondary}><Plus size={20}/></button>
                  </div>
                  <div className={style.textarea_resumen} style={{marginTop:'10px'}}>{selectedObjetivo?.descripcion_objetivo || "Descripción del objetivo..."}</div>
                </div>
              </div>
            </section>

            {/* SECCIÓN 2: INFORMACIÓN GENERAL (TÍTULO Y CÓDIGO) */}
            <section className={style.form_section}>
              <h3 className={style.subtitulo}>2. Información General</h3>
              <div className={style.grid_inputs}>
                <div className={style.field}>
                  <label>Título del Laboratorio *</label>
                  <input type="text" name="titulo_lab" className={style.input_diseno} value={formData.titulo_lab} onChange={handleInputChange} placeholder="Ej: Ley de Newton" />
                </div>
                <div className={style.field}>
                  <label>Código de Referencia</label>
                  <input type="text" name="codigo_lab" className={style.input_diseno} value={formData.codigo_lab} onChange={handleInputChange} placeholder="Ej: LAB-001" />
                </div>
              </div>
            </section>

            {/* SECCIÓN 3: CONTENIDO DETALLADO */}
            <section className={style.form_section}>
              <h3 className={style.subtitulo}>3. Contenido del Laboratorio</h3>
              <div className={style.field}>
                <label>Resumen / Descripción Corta</label>
                <textarea name="resumen" className={style.textarea_diseno} value={formData.resumen} onChange={handleInputChange}></textarea>
              </div>
              <div className={style.field}>
                <label>Prólogo</label>
                <textarea name="prologo" className={style.textarea_diseno} value={formData.prologo} onChange={handleInputChange}></textarea>
              </div>
              <div className={style.field}>
                <label>Introducción</label>
                <textarea name="introduccion" className={style.textarea_diseno} value={formData.introduccion} onChange={handleInputChange}></textarea>
              </div>
              <div className={style.field}>
                <label>Marco Teórico</label>
                <textarea name="marco_teorico" className={style.textarea_diseno} value={formData.marco_teorico} onChange={handleInputChange}></textarea>
              </div>
            </section>

          </div>
        </AdminCardContainer>

        {/* MODAL PARA CREAR NUEVOS REGISTROS */}
        <GenericModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalType === "CAT" ? "Nueva Categoría" : "Nuevo Objetivo"}>
          <form onSubmit={handleCreateInModal} className={style.modal_form}>
            <div className={style.modal_field}>
              <label>{modalType === "CAT" ? "Nombre" : "Tipo de Objetivo"}</label>
              <input className={style.input_diseno} value={newData.nombre} onChange={e => setNewData({...newData, nombre: e.target.value})} required />
            </div>
            <div className={style.modal_field}>
              <label>Descripción</label>
              <textarea className={style.textarea_diseno} value={newData.descripcion} onChange={e => setNewData({...newData, descripcion: e.target.value})} />
            </div>
            <button type="submit" className={style.btn_guardar_modal}>Guardar</button>
          </form>
        </GenericModal>

      </div>
    </AdminLayout>
  );
}

export default LabConfigurarLabs;