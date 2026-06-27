import React, { useState } from 'react';
import DocenteLayout from '../../layouts/DocenteLayout';
import ModalCrearSesion from '../../components/modals/docente/ModalCrearSesion';
import { PlusCircle, CalendarClock } from 'lucide-react';
import style from './SesionesDocente.module.css';

function SesionesDocente() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sesiones, setSesiones] = useState([]);

  const handleConfirmarCreacion = (datos) => {
    // Aquí conectarás con el servicio de backend más adelante
    console.log("Nueva sesión creada con los datos:", datos);
    setIsModalOpen(false);
  };

  return (
    <DocenteLayout>
      <div className={style.pageContainer}>
        <header className={style.header}>
          <h2 className={style.pageTitle}>Sesiones de Clase</h2>
          <button className={style.createButton} onClick={() => setIsModalOpen(true)}>
            <PlusCircle size={20} />
            Crear Sesión
          </button>
        </header>

        <main className={sesiones.length > 0 ? style.gridContainer : style.emptyContainer}>
          {sesiones.length > 0 ? (
            <div> {/* Aquí irán tus futuras tarjetas de sesiones */} </div>
          ) : (
            <div className={style.emptyStateCard}>
              <div className={style.emptyIconBadge}><CalendarClock size={40} /></div>
              <h3>¡Programa tu primera sesión!</h3>
              <p>Crea una sesión de laboratorio para que tus estudiantes puedan unirse mediante un código desde sus dispositivos.</p>
            </div>
          )}
        </main>

        <ModalCrearSesion 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onConfirm={handleConfirmarCreacion}
        />
      </div>
    </DocenteLayout>
  );
}

export default SesionesDocente;