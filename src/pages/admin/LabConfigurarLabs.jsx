import AdminLayout from "../../layouts/AdminLayout"
import AdminCrateButton from "../../components/UI/admin/AdminCreateButton"
import AdminCardContainer from "../../components/UI/admin/AdminCardContainer"
import { FlaskConical, Plus, Target, Key } from 'lucide-react'; // Añadimos iconos para contexto
import style from './LabConfigurarLabs.module.css'

function LabConfigurarLabs() {
  return (
    <AdminLayout>
        <div className={style["layout"]}>
            <div className={style["seccion_del_header"]}>
              <h2 className={style.titulo_header_laboratorio}>Configurar Laboratorios</h2>
              <AdminCrateButton icon={FlaskConical} text="Guardar Plantilla" />
            </div>

            <AdminCardContainer>
                <div className={style.form_container}>
                    
                    {/* PASO 1: CATEGORÍA (Dependencia Principal) */}
                    <section className={style.form_section}>
                        <h4 className={style.subtitulo}>1. Clasificación del Laboratorio</h4>
                        <div className={style.field}>
                            <label>Seleccionar Categoría Existente</label>
                            <div className={style.input_group_row}>
                                <select className={style.input_diseno}>
                                    <option>Seleccione una categoría...</option>
                                    <option>Cinemática</option>
                                    <option>Electromagnetismo</option>
                                </select>
                                <button 
                                    type="button" 
                                    className={style.btn_plus_secondary} 
                                    title="Crear Nueva Categoría"
                                    onClick={() => {/* Lógica modal categoría */}}
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                            <p className={style.helper_text}>Se requiere una categoría antes de proceder.</p>
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
                                        onClick={() => {/* Lógica para abrir modal de Objetivos */}}
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
                                        onClick={() => {/* Lógica para abrir modal de Palabras Clave */}}
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
                                    <button type="button" className={style.btn_ia_gradient_small}>✨ Generar</button>
                                </div>
                                <textarea 
                                    placeholder="Contexto histórico..." 
                                    className={style.textarea_diseno} 
                                />
                            </div>
                            <div className={style.field}>
                                <div className={style.header_with_ai}>
                                    <label>Marco Teórico*</label>
                                    <button type="button" className={style.btn_ia_gradient_small}>✨ Generar</button>
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

export default LabConfigurarLabs;
