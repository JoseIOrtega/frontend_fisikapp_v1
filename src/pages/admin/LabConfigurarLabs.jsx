import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import AdminCrateButton from "../../components/UI/admin/AdminCreateButton";
import AdminCardContainer from "../../components/UI/admin/AdminCardContainer";
import GenericModal from "../../components/modals/GenericModal"; 
import { useModal } from '../../context/ModalContext';
import { Plus, Save, Sparkles } from 'lucide-react';
import style from './LabConfigurarLabs.module.css';
import InformacionGeneral from "./configurarLaboratorio/InformacionGeneral";
import Objetivos from "./configurarLaboratorio/Objetivos";
import Contenido from "./configurarLaboratorio/Contenido";
import VistaPrevia from "./configurarLaboratorio/VistaPrevia";
import logoFisikapp from "../../assets/images/logosinfondo.png";
import {
  getCategorias,
  crearCategoria,
  getObjetivosGenerales,
  crearObjetivoGeneral,
  crearLaboratorio,
} from "../../services/admin/ConfigLabServices";
import { generarPortadaIA,
         generarImagenPortadaIA,
         generarContenidoLaboratorioIA }
 from "../../services/ia/iaService";

function LabConfigurarLabs() {
  // --- ESTADOS DE DATOS ---
  const { showModal } = useModal();
  const [categorias, setCategorias] = useState([]);
  const [objetivos, setObjetivos] = useState([]);

  
  // --- ESTADOS DE SELECCIÓN ---
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [selectedObjetivo, setSelectedObjetivo] = useState(null);
  const [tipoSeleccionado, setTipoSeleccionado] = useState("General");
  const [isGeneratingIA, setIsGeneratingIA] = useState(false);
  const [indiceResaltado, setIndiceResaltado] = useState(-1);

  const [step, setStep] = useState(1);/// cristian
  const [imagenPreview, setImagenPreview] = useState(null);
  const [busquedaCategoria, setBusquedaCategoria] = useState("");
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  
  // --- ESTADOS DE MODALES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); 
  const [newData, setNewData] = useState({ nombre: '', descripcion: '', categoriaId: '', tipo_objetivo: '' });

  // -- cristian--
  const [objetivosEspecificos, setObjetivosEspecificos] = useState([ "" ]);
  const [isGeneratingImagen, setIsGeneratingImagen] = useState(false);

  // --- FORMULARIO PRINCIPAL ---
  const [formData, setFormData] = useState({
    titulo_lab: '',
    descripcion_corta: "",
    resumen: '',
    introduccion: '',
    marco_teorico: '',
    categoria: '',
    objetivo_general: '',
    estado: true,
    ra: false
  });

  // Maneja la selección limpia de una categoría desde el dropdown
    const handleSeleccionarCategoria = (categoria) => {
      setBusquedaCategoria(categoria.nombre);

      setFormData((prev) => ({
        ...prev,
        categoria: categoria.id,
      }));

      setSelectedCategoria(categoria);

      setMostrarDropdown(false);

      setIndiceResaltado(-1);
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
      const [cats, objs] = await Promise.all([
        getCategorias(),
        getObjetivosGenerales(),
      ]);

      setCategorias(cats);
      setObjetivos(objs);
      
      if (formData.categoria) setSelectedCategoria(cats.find(c => String(c.id) === String(formData.categoria)));
      if (formData.objetivo) setSelectedObjetivo(objs.find(o => String(o.id) === String(formData.objetivo)));
    } catch (error) {
      console.error("Error cargando datos");
    }
  };

  useEffect(() => {
    cargarTodosLosDatos();
  }, []);

  useEffect(() => {
    if (selectedCategoria) {
      setBusquedaCategoria(selectedCategoria.nombre);
    }
  }, [selectedCategoria]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSelectChange = (e, tipo) => {
    const id = e.target.value;

    setFormData(prev => ({
        ...prev,
        [tipo]: id
    }));

    if (tipo === "categoria") {
        setSelectedCategoria(
            categorias.find(c => String(c.id) === String(id)) || null
        );
    } else if (tipo === "objetivo") {
        setSelectedObjetivo(
            objetivos.find(o => String(o.id) === String(id)) || null
        );
    }
};

  // --- LÓGICA DE INTEGRACIÓN CON IA ---
const handleGenerarConIA = async () => {

    if (!formData.titulo_lab || !formData.categoria) {
        showModal(
            "error",
            "⚠️ Por favor rellene el Título y la Categoría antes de usar la IA."
        );
        return;
    }

    try {

        setIsGeneratingIA(true);

        // ==========================
        // PORTADA
        // ==========================

        const payloadPortada = {
            titulo: formData.titulo_lab,
            categoria: selectedCategoria
                ? selectedCategoria.nombre
                : ""
        };

        const portada = await generarPortadaIA(payloadPortada);

        console.log("PORTADA:", portada);

        if (portada) {

            // Llenar descripción y objetivo
            setFormData(prev => ({
                ...prev,
                descripcion_corta: portada.descripcion_corta || "",
                objetivo_general: portada.objetivo_general || ""
            }));

            // Llenar objetivos específicos
            setObjetivosEspecificos(
                portada.objetivos_especificos || []
            );

            // ==========================
            // IMAGEN (NO BLOQUEA)
            // ==========================
            setIsGeneratingImagen(true);

            generarImagenPortadaIA(payloadPortada)
                .then((resultado) => {

                    console.log("IMAGEN:", resultado);

                    if (resultado.imagen) {

                        setImagenPreview(
                            `data:image/png;base64,${resultado.imagen}`
                        );

                    }

                })
                .catch((error) => {

                    console.error(
                        "Error generando imagen:",
                        error
                    );

                })

                .finally(() => {

              setIsGeneratingImagen(false);

                });

            // ==========================
            // CONTENIDO
            // ==========================

            const payloadContenido = {
                titulo: formData.titulo_lab,
                categoria: selectedCategoria
                    ? selectedCategoria.nombre
                    : "",
                objetivo: portada.objetivo_general,
                palabras_clave: ""
            };

            const contenido = await generarContenidoLaboratorioIA(
                payloadContenido
            );

            console.log("CONTENIDO:", contenido);

            setFormData(prev => ({
                ...prev,
                resumen: contenido.resumen || "",
                introduccion: contenido.introduccion || "",
                marco_teorico: contenido.marco_teorico || ""
            }));

            showModal(
                "success",
                "✨ ¡Laboratorio generado correctamente!"
            );
        }

    } catch (error) {

        console.error(error);

        

        showModal(
            "error",
            "❌ Ocurrió un error al generar el laboratorio."
        );

    } 
    finally {

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

      } 

      if (typeof cargarTodosLosDatos === 'function') {
            await cargarTodosLosDatos();
        }
        if (typeof closeModal === 'function') {
            closeModal();
        }

      if (res && res.id) {
        const nuevoId = String(res.id);

        if (modalType === "CAT") {
          setFormData((prev) => ({ ...prev, categoria: nuevoId }));

          const catsActualizadas = await getCategorias();
          setCategorias(catsActualizadas);

          setSelectedCategoria(
            catsActualizadas.find((c) => String(c.id) === nuevoId),
          );
        } else if (modalType === "OBJ") {
          setFormData((prev) => ({ ...prev, objetivo: nuevoId }));

          const objsActualizados = await getObjetivosGenerales();
          setObjetivos(objsActualizados);

          setSelectedObjetivo(
            objsActualizados.find((o) => String(o.id) === nuevoId),
          );
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
          introduccion: formData.introduccion,
          marco_teorico: formData.marco_teorico,
          categoria: parseInt(formData.categoriaId || formData.categoria),
          creado_por: parseInt(userId),
          estado: "ACTIVO",
          simulacion: false,
        };

        console.log("PAYLOAD:", payload);

        await crearLaboratorio(payload);
        showModal('success', '✅ Plantilla agregada correctamente');
    } catch (err) {
    console.error("ERROR:", err);
    console.error("RESPUESTA:", err.response?.data);
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
                  step === 1
                    ? "0%"
                    : step === 2
                      ? "30%"
                      : step === 3
                        ? "60%"
                        : "90%",
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
              <span>Vista Previa</span>
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
                handleGenerarConIA={handleGenerarConIA}
                isGeneratingIA={isGeneratingIA}
                isGeneratingImagen={isGeneratingImagen}
                busquedaCategoria={busquedaCategoria}
                setBusquedaCategoria={setBusquedaCategoria}
                mostrarDropdown={mostrarDropdown}
                setMostrarDropdown={setMostrarDropdown}
                indiceResaltado={indiceResaltado}
                handleSeleccionarCategoria={handleSeleccionarCategoria}
                handleKeyDownCategorias={handleKeyDownCategorias}
              />
            )}

            {step === 2 && (
              <Objetivos
                objetivos={objetivos}
                selectedObjetivo={selectedObjetivo}
                formData={formData}
                handleSelectChange={handleSelectChange}
                openModal={openModal}
                objetivosEspecificos={objetivosEspecificos}
                setObjetivosEspecificos={setObjetivosEspecificos}
                handleInputChange={handleInputChange}
              />
            )}

            {/* SECCIÓN 3: CONTENIDO DETALLADO (AUTOMATIZADO POR IA) */}
            {step === 3 && (
              <Contenido
                isGeneratingIA={isGeneratingIA}
                handleInputChange={handleInputChange}
                formData={formData}
              />
            )}

            {step === 4 && (
              <VistaPrevia
                formData={formData}
                selectedObjetivo={selectedObjetivo}
                objetivosEspecificos={objetivosEspecificos}
                imagenPreview={imagenPreview}
                categorias={categorias}
                onGuardar={handleSavePlantilla}
              />
            )}

            <div className={style.navigation}>
              <button
                type="button"
                disabled={step === 1}
                onClick={() => setStep(step - 1)}
              >
                Anterior
              </button>

              {step !== 4 && (
                <button type="button" onClick={() => setStep(step + 1)}>
                  Siguiente
                </button>
              )}
            </div>
          </div>
        </AdminCardContainer>
      </div>

      <GenericModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalType === "CAT" ? "Crear nueva categoría" : "Nuevo objetivo"}
      >
        <form onSubmit={handleCreateInModal} className={style.modal_form}>
          {modalType === "CAT" && (
            <>
              <div className={style.modalLogo}>
                <img
                  src={logoFisikapp}
                  alt="FisikApp"
                  className={style.logoModal}
                />

                <h2>Crear nueva categoría</h2>

                <p>
                  Organiza tus laboratorios creando categorías para que los
                  docentes puedan utilizarlas en sus prácticas.
                </p>
              </div>

              <div className={style.modal_field}>
                <label>Nombre *</label>

                <input
                  className={style.input_diseno}
                  value={newData.nombre}
                  onChange={(e) =>
                    setNewData({
                      ...newData,
                      nombre: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className={style.modal_field}>
                <label>Descripción</label>

                <textarea
                  className={style.textarea_diseno}
                  rows={4}
                  value={newData.descripcion}
                  onChange={(e) =>
                    setNewData({
                      ...newData,
                      descripcion: e.target.value,
                    })
                  }
                />
              </div>
            </>
          )}

          {modalType === "OBJ" && (
            <div className={style.modal_field}>
              <label>Descripción</label>

              <textarea
                className={style.textarea_diseno}
                rows={4}
                value={newData.descripcion}
                onChange={(e) =>
                  setNewData({
                    ...newData,
                    descripcion: e.target.value,
                  })
                }
                required
              />
            </div>
          )}

          <button type="submit" className={style.btn_guardar_modal}>
            {modalType === "CAT" ? "Crear categoría" : "Guardar"}
          </button>
        </form>
      </GenericModal>
    </AdminLayout>
  );
}

export default LabConfigurarLabs;