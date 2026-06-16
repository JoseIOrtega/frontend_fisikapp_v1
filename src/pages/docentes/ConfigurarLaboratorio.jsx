import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  Sliders, 
  HelpCircle, 
  FileText, 
  AlertCircle,
  Loader2,
  Copy
} from 'lucide-react';
import DocenteLayout from "../../layouts/DocenteLayout";
import style from './ConfigurarLaboratorio.module.css';

import { obtenerDetalleFicha, actualizarEstadoHabilitado } from '../../services/docente/configuracionLabService';

function ConfigurarLaboratorio() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [laboratorio, setLaboratorio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdatingEstado, setIsUpdatingEstado] = useState(false);
  const [copied, setCopied] = useState(false);

  // Carga de datos de la base de datos
  useEffect(() => {
    const cargarInformacionFicha = async () => {
      try {
        setLoading(true);
        const data = await obtenerDetalleFicha(id);
        
        if (data) {
          // Ajustamos a tus 4 etapas pedagógicas fijas
          const etapasFlujo = [
            { id: 1, nombre: "Conceptos básicos", configurada: data.etapa1_lista || false, icono: <BookOpen size={18} /> },
            { id: 2, nombre: "Práctica de conceptos", configurada: data.etapa2_lista || false, icono: <Sliders size={18} /> },
          ];

          setLaboratorio({
            id: data.id,
            titulo_lab: data.titulo_lab || "Laboratorio sin título",
            categoria_nombre: data.categoria || "Sin categoría", 
            grado: data.grado || null,     
            jornada: data.jornada || null, 
            estado: data.estado || false,
            codigo_lab: data.codigo_lab || "", // Leído directamente desde tu backend
            etapas: etapasFlujo
          });
        }
      } catch (error) {
        console.error("Error al montar los datos:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) cargarInformacionFicha();
  }, [id]);

  // Manejador del botón Habilitar (PATCH)
  const handleToggleHabilitar = async () => {
    if (!laboratorio || isUpdatingEstado) return;
    
    try {
      setIsUpdatingEstado(true);
      const nuevoEstado = !laboratorio.estado;

      await actualizarEstadoHabilitado(laboratorio.id, nuevoEstado);
      
      // Sincronizamos el estado local de la UI
      setLaboratorio(prev => ({ ...prev, estado: nuevoEstado }));
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      alert("Hubo un problema al intentar cambiar el estado del laboratorio.");
    } finally {
      setIsUpdatingEstado(false);
    }
  };

  // Función para copiar el código generado al portapapeles
  const handleCopyCode = () => {
    if (laboratorio?.codigo_lab) {
      navigator.clipboard.writeText(laboratorio.codigo_lab);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSearch = (query) => {
    console.log("Buscando:", query);
  };

  // Validación: Evalúa si las 4 etapas están guardadas (configurada: true)
  const todoListoParaHabilitar = laboratorio?.etapas.every(e => e.configurada) || false;

  return (
    <DocenteLayout onSearch={handleSearch}>
      <div className={style.layout}>
        
        {loading ? (
          <div className={style.centerBox}>
            <Loader2 size={32} className={style.spinner} />
            <p>Cargando información real del laboratorio...</p>
          </div>
        ) : (
          <div className={style.panelContainer}>
            
            {/* 1. CABECERA CON BOTÓN DINÁMICO SEGÚN LAS CAPTURAS */}
            <div className={style.headerCard}>
              <div className={style.titleArea}>
                <button 
                  className={style.backIconBtn} 
                  onClick={() => navigate('/profesor/mis-laboratorios')}
                  title="Volver a mis laboratorios"
                >
                  <ArrowLeft size={18} />
                </button>
                <div>
                  <h2 className={style.labTitle}>{laboratorio.titulo_lab}</h2>
                  <div className={style.labSubtitle}>
                    <span><strong>Categoría:</strong> {laboratorio.categoria_nombre}</span>
                    {laboratorio.grado && <span><strong>Grado:</strong> {laboratorio.grado}</span>}
                    {laboratorio.jornada && <span><strong>Jornada:</strong> {laboratorio.jornada}</span>}
                  </div>
                </div>
              </div>

              {/* Botón superior derecho mutante basado en las capturas 1, 2 y 4 */}
              <button 
                className={`${style.actionBtn} ${
                  !todoListoParaHabilitar 
                    ? style.btnDeshabilitadoTxt 
                    : laboratorio.estado 
                      ? style.btnDeshabilitar 
                      : style.btnListoParaHabilitar
                }`}
                onClick={handleToggleHabilitar}
                disabled={!todoListoParaHabilitar || isUpdatingEstado}
              >
                {isUpdatingEstado 
                  ? "Procesando..." 
                  : !todoListoParaHabilitar 
                    ? "Habilitar laboratorio" 
                    : laboratorio.estado 
                      ? "Deshabilitar laboratorio" 
                      : "Habilitar laboratorio"
                }
              </button>
            </div>

            {/* 2. ALERTA O ESTADO DINÁMICO AJUSTADO A LAS 3 PRIMERAS CAPTURAS */}
            <div className={`${style.statusBanner} ${
              !todoListoParaHabilitar 
                ? style.bannerIncomplete 
                : laboratorio.estado 
                  ? style.bannerActive 
                  : style.bannerReady
            }`}>
              <div className={style.bannerText}>
                <AlertCircle size={18} className={
                  !todoListoParaHabilitar 
                    ? style.iconIncomplete 
                    : laboratorio.estado 
                      ? style.iconActive 
                      : style.iconReady
                } />
                <div className={style.bannerContentArea}>
                  
                  {/* CASO 1: Captura 'image_6c6722.png' (Faltan etapas por configurar) */}
                  {!todoListoParaHabilitar && (
                    <>
                      <strong>Laboratorio no habilitado</strong>
                      <p>Debes configurar todas las etapas del laboratorio para habilitarlo.</p>
                    </>
                  )}

                  {/* CASO 2: Captura 'image_6c66aa.png' (Configurado al 100% pero apagado) */}
                  {todoListoParaHabilitar && !laboratorio.estado && (
                    <>
                      <strong>Laboratorio listo para habilitar</strong>
                      <p>Todas las etapas están configuradas. Habilita el laboratorio y genera el código.</p>
                    </>
                  )}

                  {/* CASO 3: Captura 'image_6c63e0.png' (Habilitado con caja de código) */}
                  {todoListoParaHabilitar && laboratorio.estado && (
                    <div className={style.bannerActiveLayout}>
                      <div>
                        <strong>Laboratorio habilitado</strong>
                        <p>El laboratorio ya está activo. Comparte el siguiente código con los participantes para que puedan unirse.</p>
                        
                        {/* Caja del código autogenerado */}
                        <div className={style.codeBoxContainer}>
                          <span className={style.codeLabel}>Código del laboratorio:</span>
                          <span className={style.codeValue}>{laboratorio.codigo_lab || "GENERANDO..."}</span>
                        </div>
                      </div>
                      
                      <button className={style.copyBtn} onClick={handleCopyCode}>
                        <Copy size={16} />
                        {copied ? "¡Copiado!" : "Copiar código"}
                      </button>
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* 3. BLOQUE DE ETAPAS */}
            <div className={style.etapasBlock}>
              <div className={style.blockTitleGroup}>
                <h3>Etapas del laboratorio</h3>
                <p>Las etapas siguen un orden pedagógico preestablecido.</p>
              </div>

              <div className={style.etapasList}>
                {laboratorio.etapas.map((etapa, idx) => (
                  <div key={etapa.id} className={style.etapaRow}>
                    <div className={style.etapaLeftLayout}>
                      <div className={style.verticalBar} />
                      <div className={style.etapaIconBox}>
                        {etapa.icono}
                      </div>
                      <div className={style.etapaDetails}>
                        <span className={style.etapaNumber}>Etapa {idx + 1}</span>
                        <h4>{etapa.nombre}</h4>
                        <span className={etapa.configurada ? style.statusReadyTxt : style.statusPendingTxt}>
                          {etapa.configurada ? "● Configurado" : "● Pendiente por configurar"}
                        </span>
                      </div>
                    </div>

                    <button 
                      className={style.rowConfigBtn}
                      onClick={() => navigate(`/profesor/mis-laboratorios/configurar/${id}/etapa/${etapa.id}`)}
                    >
                      Configurar
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </DocenteLayout>
  );
}

export default ConfigurarLaboratorio;