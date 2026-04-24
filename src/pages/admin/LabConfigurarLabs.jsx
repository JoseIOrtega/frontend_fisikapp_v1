import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout"
import AdminCreateButton from "../../components/UI/AdminCreateButton"
import { FlaskConical, Plus, Target, Key } from 'lucide-react';
import { saveLaboratorio } from '../../services/admin/labData';
import ModalCategoria from '../../components/modals/ModalCategoria';
import ModalObjetivos from '../../components/modals/ModalObjetivos';
import ModalPalabrasClaves from '../../components/modals/ModalPalabrasClaves';
import style from './LabConfigurarLabs.module.css'

const defaultForm = {
  id: null,
  nombre_de_laboratorio: "",
  categoria: "",
  estado: "Activo",
  fechacreacion: new Date().toISOString(),
  resumen: "",
  introduccion: "",
  marco_teorico: ""
};

function LabConfigurarLabs() {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Estados para modales
  const [showModalCategoria, setShowModalCategoria] = useState(false);
  const [showModalObjetivos, setShowModalObjetivos] = useState(false);
  const [showModalPalabrasClaves, setShowModalPalabrasClaves] = useState(false);

  // Listas para guardar datos agregados
  const [categorias, setCategorias] = useState([]);
  const [objetivos, setObjetivos] = useState([]);
  const [palabrasClaves, setPalabrasClaves] = useState([]);

  useEffect(() => {
    const laboratorio = location.state?.laboratorio;
    if (laboratorio) {
      setFormData({
        ...defaultForm,
        ...laboratorio,
        resumen: laboratorio.resumen ?? "",
        introduccion: laboratorio.introduccion ?? "",
        marco_teorico: laboratorio.marco_teorico ?? ""
      });
    } else {
      setFormData(defaultForm);
    }
    setErrors({});
    setSuccessMessage("");
  }, [location.state]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo cuando se modifica
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre_de_laboratorio.trim()) {
      newErrors.nombre_de_laboratorio = "El nombre del laboratorio es requerido";
    }
    if (!formData.categoria) {
      newErrors.categoria = "Debe seleccionar una categoría";
    }
    if (!formData.resumen.trim()) {
      newErrors.resumen = "El resumen es requerido";
    }
    if (!formData.introduccion.trim()) {
      newErrors.introduccion = "La introducción es requerida";
    }
    if (!formData.marco_teorico.trim()) {
      newErrors.marco_teorico = "El marco teórico es requerido";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    const dataToSave = {
      ...formData,
      id: formData.id ?? Date.now(),
      fechacreacion: formData.fechacreacion || new Date().toISOString(),
    };

    try {
      const result = await saveLaboratorio(dataToSave);
      if (result) {
        setSuccessMessage("Laboratorio guardado exitosamente");
        // Recargar la página del repositorio para mostrar cambios
        setTimeout(() => {
          navigate("/admin/laboratorio/repositorio_labs");
        }, 3000);
      } else {
        setSuccessMessage("Error al guardar el laboratorio");
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      setSuccessMessage("Error de conexión al guardar");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }
  };

  // Funciones para modales de Categoría
  const handleOpenModalCategoria = () => setShowModalCategoria(true);
  const handleCloseModalCategoria = () => setShowModalCategoria(false);
  const handleSaveCategoria = (data) => {
    setCategorias([...categorias, data]);
    handleCloseModalCategoria();
  };

  // Funciones para modales de Objetivos
  const handleOpenModalObjetivos = () => setShowModalObjetivos(true);
  const handleCloseModalObjetivos = () => setShowModalObjetivos(false);
  const handleSaveObjetivos = (data) => {
    setObjetivos([...objetivos, data]);
    handleCloseModalObjetivos();
  };

  // Funciones para modales de Palabras Claves
  const handleOpenModalPalabrasClaves = () => setShowModalPalabrasClaves(true);
  const handleCloseModalPalabrasClaves = () => setShowModalPalabrasClaves(false);
  const handleSavePalabrasClaves = (data) => {
    setPalabrasClaves([...palabrasClaves, data]);
    handleCloseModalPalabrasClaves();
  };

  return (
    <AdminLayout>
      <div className={style["layout"]}>
        <div className={style["seccion_del_header"]}>
          <h2 className={style.titulo_header_laboratorio}>Configurar Laboratorios</h2>
          <AdminCreateButton icon={FlaskConical} text="Guardar Plantilla" onClick={handleSave} />
        </div>

        {successMessage && (
          <div className={style.successMessage}>
            {successMessage}
          </div>
        )}

        <div className={style.form_bubble}>
          <div className={style.form_container}>

            <section className={style.form_section}>
              <h4 className={style.subtitulo}>1. Clasificación del Laboratorio</h4>
              <div className={style.field}>
                <label>Nombre de Laboratorio</label>
                <input
                  type="text"
                  name="nombre_de_laboratorio"
                  value={formData.nombre_de_laboratorio}
                  onChange={handleInputChange}
                  className={`${style.input_diseno} ${errors.nombre_de_laboratorio ? style.inputError : ''}`}
                  placeholder="Nombre del laboratorio"
                />
                {errors.nombre_de_laboratorio && <span className={style.errorText}>{errors.nombre_de_laboratorio}</span>}
              </div>

              <div className={style.field}>
                            <label>Seleccionar Categoría Existente</label>
                <div className={style.input_group_row}>
                  <select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    className={`${style.input_diseno} ${errors.categoria ? style.inputError : ''}`}
                  >
                    <option value="">Seleccione una categoría...</option>
                    <option value="Cinemática">Cinemática</option>
                    <option value="Electromagnetismo">Electromagnetismo</option>
                  </select>
                  <button
                    type="button"
                    className={style.btn_plus_secondary}
                    title="Crear Nueva Categoría"
                    onClick={handleOpenModalCategoria}
                  >
                    <Plus size={18} />
                  </button>
                </div>
                {errors.categoria && <span className={style.errorText}>{errors.categoria}</span>}
                            <p className={style.helper_text}>Se requiere una categoría antes de proceder.</p>
              </div>

              <div className={style.field}>
                <label>Estado</label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  className={style.input_diseno}
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
            </section>

                    {/* SECCIÓN 2: ESTRUCTURA PEDAGÓGICA */}

                    <section className={style.form_section}>

                        <h4 className={style.subtitulo}>2. Estructura Pedagógica (Dependencias)</h4>

                        <div className={style.grid_inputs}>

                            

                            {/* Gestión de Objetivos */}

                            <div className={style.field}>

                                <label>Objetivos del Laboratorio</label>

                                <div className={style.input_group_row}>

                                    <div className={style.fake_input}>

                                        {/* Aquí se mostrarán los objetivos agregados como etiquetas */}

                                        <span className={style.placeholder}>Añade objetivos detallados...</span>

                                    </div>

                                    <button 

                                        type="button" 

                                        className={style.btn_plus_secondary}

                                        onClick={handleOpenModalObjetivos}

                                    >

                                        <Plus size={20} />

                                    </button>

                                </div>

                            </div>

                            {/* Gestión de Palabras Clave */}

                            <div className={style.field}>

                                <label>Palabras Clave</label>

                                <div className={style.input_group_row}>

                                    <div className={style.fake_input}>

                                        <span className={style.placeholder}>Añade términos técnicos...</span>

                                    </div>

                                    <button 

                                        type="button" 

                                        className={style.btn_plus_secondary}

                                        onClick={handleOpenModalPalabrasClaves}

                                    >

                                        <Plus size={20} />

                                    </button>

                                </div>

                            </div>

                        </div>

                        <p className={style.helper_text_2}>Añada estas dependencias antes de continuar.</p>

                    </section>

                    {/* PASO 3: CONTENIDO DETALLADO DEL LABORATORIO */}

                    <section className={style.form_section}>

                        <h4 className={style.subtitulo}>3. Contenido del Laboratorio (Auto-generado)</h4>

                        

                        <div className={style.field}>

                            <div className={style.header_with_ai}>

                                <label>Resumen*</label>

                                <button type="button" className={style.btn_ia_gradient_small}>

                                    🤖 Generar Resumen con IA

                                </button>

                            </div>

                            <textarea 

                                name="resumen"

                                value={formData.resumen}

                                onChange={handleInputChange}

                                placeholder="La síntesis..." 

                                className={`${style.textarea_diseno} ${errors.resumen ? style.inputError : ''}`}

                            />

                            {errors.resumen && <span className={style.errorText}>{errors.resumen}</span>}

                        </div>

                        <div className={style.grid_inputs}>

                            <div className={style.field}>

                                <div className={style.header_with_ai}>

                                    <label>Introducción*</label>

                                    <button type="button" className={style.btn_ia_gradient_small}>🤖 Generar</button>

                                </div>

                                <textarea 

                                    name="introduccion"

                                    value={formData.introduccion}

                                    onChange={handleInputChange}

                                    placeholder="Contexto histórico..." 

                                    className={`${style.textarea_diseno} ${errors.introduccion ? style.inputError : ''}`}

                                />

                                {errors.introduccion && <span className={style.errorText}>{errors.introduccion}</span>}

                            </div>

                            <div className={style.field}>

                                <div className={style.header_with_ai}>

                                    <label>Marco Teórico*</label>

                                    <button type="button" className={style.btn_ia_gradient_small}>🤖 Generar</button>

                                </div>

                                <textarea 

                                    name="marco_teorico"

                                    value={formData.marco_teorico}

                                    onChange={handleInputChange}

                                    placeholder="Principios físicos..." 

                                    className={`${style.textarea_diseno} ${errors.marco_teorico ? style.inputError : ''}`}

                                />

                                {errors.marco_teorico && <span className={style.errorText}>{errors.marco_teorico}</span>}

                            </div>

                        </div>

                    </section>

          </div>
        </div>
      </div>

      {/* Modales */}
      <ModalCategoria 
        show={showModalCategoria} 
        onHide={handleCloseModalCategoria}
        onSave={handleSaveCategoria}
      />
      <ModalObjetivos 
        show={showModalObjetivos} 
        onHide={handleCloseModalObjetivos}
        onSave={handleSaveObjetivos}
      />
      <ModalPalabrasClaves 
        show={showModalPalabrasClaves} 
        onHide={handleCloseModalPalabrasClaves}
        onSave={handleSavePalabrasClaves}
      />

    </AdminLayout>
  )
}

export default LabConfigurarLabs;