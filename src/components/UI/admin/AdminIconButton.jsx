import style from './AdminIconButton.module.css';

// Importante: La "I" de Icon debe ser mayúscula aquí
function AdminIconButton({ icon: Icon, onClick, title, type = 'default' }) {
  // Verificación de seguridad
  if (!Icon) return null;

  return (
    <button 
      className={`${style.iconBtn} ${style[type]}`} 
      onClick={onClick} 
      title={title}
      type="button"
    >
      {/* Aquí React lo dibuja porque empieza con Mayúscula */}
      <Icon size={18} />
    </button>
  );
}

export default AdminIconButton;