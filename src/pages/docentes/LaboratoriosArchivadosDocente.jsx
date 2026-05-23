import DocenteLayout from '../../layouts/DocenteLayout'
import LaboratorioCard from '../../components/UI/docente/LaboratorioCard';
import { ArchiveX } from 'lucide-react' 
import style from './LaboratoriosArchivadosDocente.module.css' // Reutilizamos el CSS

// Datos de prueba para archivados (pueden ser laboratorios viejos)
const laboratoriosArchivados = [
  { 
    id: 101, 
    titulo_lab: "Termodinámica Básica", 
    categoria_nombre: "Física Calor", 
    codigo_lab: "ARC-2023", 
    ra_activa: true, 
    estado: 'inactivo' // Siempre inactivos en esta pestaña
  },
];

function LaboratoriosArchivadosDocente() {

  // En lugar de ingresar, aquí la acción principal es Reutilizar
  const handleReutilizar = (id) => {
    console.log("Clonando laboratorio para nuevo semestre. ID:", id);
  };

  const handleEliminarDefinitivo = (id) => {
    console.log("Eliminando permanentemente de la base de datos. ID:", id);
  };

  return (
    <DocenteLayout>
      <div className={style.pageContainer}>
        
        <header className={style.header}>
          <div>
            <h2 className={style.pageTitle}>Laboratorios Archivados</h2>
            {/* <p style={{color: '#64748b', fontSize: '0.9rem'}}>Proyectos de semestres anteriores</p> */}
          </div>
          {/* Aquí no hay botón de "Crear", quizás un indicador de vaciar papelería */}
          <button className={style.deleteButtonSimple} onClick={() => console.log("Limpiar todo")}>
             <ArchiveX size={20} />
             Vaciar Archivo
          </button>
        </header>

        <main className={style.gridContainer}>
          {laboratoriosArchivados.map((lab) => (
            <LaboratorioCard 
              key={lab.id} 
              laboratorio={lab} 
              esArchivado={true} // Enviamos esta prop para que la tarjeta cambie
              onReutilizar={handleReutilizar}
              onEliminar={handleEliminarDefinitivo}
            />
          ))}
        </main>

      </div>
    </DocenteLayout>
  )
}

export default LaboratoriosArchivadosDocente;