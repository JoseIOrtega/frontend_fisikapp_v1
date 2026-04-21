import AdminLayout from "../../layouts/AdminLayout"
import AdminCrateButton from "../../components/UI/admin/AdminCreateButton"
import AdminCardContainer from "../../components/UI/admin/AdminCardContainer"
import { FlaskConical, Plus, X } from 'lucide-react'
import style from './LabConfigurarLabs.module.css'

import { useEffect, useState } from "react"
import { getCategorias, getPalabrasClave } from "../../services/admin/ConfigLabServices"
import { useModal } from "../../context/ModalContext"

function LabConfigurarLabs() {

  const { showModal } = useModal()

  // ===== CATEGORIAS =====
  const [categorias, setCategorias] = useState([])
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("")
  const [descripcionCategoria, setDescripcionCategoria] = useState("")

  // ===== PALABRAS CLAVE =====
  const [busqueda, setBusqueda] = useState("")
  const [todasPalabras, setTodasPalabras] = useState([])
  const [palabrasFiltradas, setPalabrasFiltradas] = useState([])
  const [palabrasSeleccionadas, setPalabrasSeleccionadas] = useState([])

  // ===== LOAD DATA =====
  useEffect(() => {

    const cargarCategorias = async () => {
      try {
        const data = await getCategorias()
        setCategorias(data)
      } catch {
        showModal("error", "Error cargando categorías")
      }
    }

    const cargarPalabras = async () => {
      try {
        const data = await getPalabrasClave()
        setTodasPalabras(data)
      } catch {
        showModal("error", "Error cargando palabras clave")
      }
    }

    cargarCategorias()
    cargarPalabras()

  }, [])

  // ===== BUSCAR PALABRAS =====
  const buscarPalabrasClave = (texto) => {
    setBusqueda(texto)

    if (texto.length < 2) {
      setPalabrasFiltradas([])
      return
    }

    const filtradas = todasPalabras.filter(p =>
      p.palabra_clave.toLowerCase().includes(texto.toLowerCase())
    )

    setPalabrasFiltradas(filtradas)
  }

  // ===== SELECCIONAR PALABRA =====
  const seleccionarPalabra = (p) => {

    const existe = palabrasSeleccionadas.find(item => item.id === p.id)

    if (existe) {
      showModal("warning", "La palabra ya está agregada")
      return
    }

    setPalabrasSeleccionadas(prev => [...prev, p])
    setBusqueda("")
    setPalabrasFiltradas([])

    showModal("info", p.descripcion)
  }

  // ===== ELIMINAR PALABRA =====
  const eliminarPalabra = (id) => {
    setPalabrasSeleccionadas(prev => prev.filter(p => p.id !== id))
  }

  return (
    <AdminLayout>
        <div className={style["layout"]}>
            <div className={style["seccion_del_header"]}>
              <h2 className={style.titulo_header_laboratorio}>Configurar Laboratorios</h2>
              <AdminCrateButton icon={FlaskConical} text="Guardar Plantilla" />
            </div>

            <AdminCardContainer>
                <div className={style.form_container}>
                    
                    {/* ===== 1. CATEGORIA ===== */}
                    <section className={style.form_section}>
                        <h4 className={style.subtitulo}>1. Clasificación del Laboratorio</h4>

                        <div className={style.field}>
                            <label>Seleccionar Categoría Existente</label>

                            <div className={style.input_group_row}>
                                <select 
                                    className={style.input_diseno}
                                    value={categoriaSeleccionada}
                                    onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                                >
                                    <option value="">Seleccione una categoría...</option>
                                    {categorias.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.nombre}
                                        </option>
                                    ))}
                                </select>

                                <button 
                                    type="button" 
                                    className={style.btn_plus_secondary} 
                                    onClick={() => showModal("info", "Aquí irá crear categoría")}
                                >
                                    <Plus size={18} />
                                </button>
                            </div>

                            {/* DESCRIPCION */}
                            <input
                                type="text"
                                placeholder="Descripción de la categoría"
                                className={style.input_diseno}
                                value={descripcionCategoria}
                                onChange={(e) => setDescripcionCategoria(e.target.value)}
                            />

                            <p className={style.helper_text}>
                                Se requiere una categoría antes de proceder.
                            </p>
                        </div>
                    </section>

                    {/* ===== 2. ESTRUCTURA ===== */}
                    <section className={style.form_section}>
                        <h4 className={style.subtitulo}>
                          2. Estructura Pedagógica (Dependencias)
                        </h4>

                        <div className={style.grid_inputs}>
                            
                            {/* OBJETIVOS */}
                            <div className={style.field}>
                                <label>Objetivos del Laboratorio</label>

                                <div className={style.input_group_row}>
                                    <div className={style.fake_input}>
                                        <span className={style.placeholder}>
                                            Añade objetivos detallados...
                                        </span>
                                    </div>

                                    <button 
                                        type="button" 
                                        className={style.btn_plus_secondary}
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* ===== PALABRAS CLAVE ===== */}
                            <div className={style.field}>
                                <label>Palabras Clave</label>

                                {/* TAGS */}
                                <div style={{ marginBottom: "8px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                    {palabrasSeleccionadas.map(p => (
                                        <span key={p.id} style={{
                                            background: "#e0e7ff",
                                            padding: "4px 8px",
                                            borderRadius: "12px",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "5px",
                                            fontSize: "12px"
                                        }}>
                                            {p.palabra_clave}
                                            <X 
                                                size={12} 
                                                style={{ cursor: "pointer" }} 
                                                onClick={() => eliminarPalabra(p.id)}
                                            />
                                        </span>
                                    ))}
                                </div>

                                <div className={style.input_group_row}>
                                    
                                    <div style={{ position: "relative", width: "100%" }}>
                                        
                                        <input
                                            type="text"
                                            placeholder="Buscar palabra clave..."
                                            className={style.input_diseno}
                                            value={busqueda}
                                            onChange={(e) => buscarPalabrasClave(e.target.value)}
                                        />

                                        {/* AUTOCOMPLETE */}
                                        {palabrasFiltradas.length > 0 && (
                                            <div style={{
                                                position: "absolute",
                                                top: "100%",
                                                left: 0,
                                                right: 0,
                                                background: "#fff",
                                                border: "1px solid #ddd",
                                                zIndex: 10,
                                                maxHeight: "150px",
                                                overflowY: "auto"
                                            }}>
                                                {palabrasFiltradas.map(p => (
                                                    <div
                                                        key={p.id}
                                                        style={{ padding: "8px", cursor: "pointer" }}
                                                        onClick={() => seleccionarPalabra(p)}
                                                    >
                                                        {p.palabra_clave}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                    </div>

                                    <button 
                                        type="button" 
                                        className={style.btn_plus_secondary}
                                        onClick={() => {
                                            showModal("info", "Busca y selecciona una palabra clave")
                                        }}
                                    >
                                        <Plus size={20} />
                                    </button>

                                </div>
                            </div>

                        </div>

                        <p className={style.helper_text_2}>
                          Añada estas dependencias antes de continuar.
                        </p>
                    </section>

                    {/* ===== 3. CONTENIDO ===== */}
                    <section className={style.form_section}>
                        <h4 className={style.subtitulo}>
                          3. Contenido del Laboratorio (Auto-generado)
                        </h4>
                        
                        <div className={style.field}>
                            <div className={style.header_with_ai}>
                                <label>Resumen*</label>
                                <button className={style.btn_ia_gradient_small}>
                                    ✨ Generar Resumen con IA
                                </button>
                            </div>

                            <textarea 
                                placeholder="La síntesis..." 
                                className={style.textarea_diseno} 
                            />
                        </div>

                        <div className={style.grid_inputs}>
                            <div className={style.field}>
                                <div className={style.header_with_ai}>
                                    <label>Introducción*</label>
                                    <button className={style.btn_ia_gradient_small}>
                                        ✨ Generar
                                    </button>
                                </div>

                                <textarea 
                                    placeholder="Contexto histórico..." 
                                    className={style.textarea_diseno} 
                                />
                            </div>

                            <div className={style.field}>
                                <div className={style.header_with_ai}>
                                    <label>Marco Teórico*</label>
                                    <button className={style.btn_ia_gradient_small}>
                                        ✨ Generar
                                    </button>
                                </div>

                                <textarea 
                                    placeholder="Principios físicos..." 
                                    className={style.textarea_diseno} 
                                />
                            </div>
                        </div>
                    </section>

                </div>
            </AdminCardContainer>
        </div>
    </AdminLayout>
  )
}

export default LabConfigurarLabs