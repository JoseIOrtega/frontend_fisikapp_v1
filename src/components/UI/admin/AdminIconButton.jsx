import style from './AdminIconButton.module.css';

// Agregamos 'disabled' y 'style' a las props recibidas
function AdminIconButton({ icon: Icon, onClick, title, type = 'default', disabled, style: customStyle }) {
  
  if (!Icon) return null;

  return (
    <button 
      // Si está disabled, le añadimos una clase de CSS para ponerlo gris
      className={`${style.iconBtn} ${style[type]} ${disabled ? style.disabled : ''}`} 
      // Si está disabled, el clic no hace nada
      onClick={disabled ? (e) => e.preventDefault() : onClick} 
      title={title}
      type="button"
      // Aplicamos los estilos que mandamos desde afuera (como la opacidad)
      style={customStyle}
      disabled={disabled}
    >
      <Icon size={18} />
    </button>
  );
}

export default AdminIconButton;