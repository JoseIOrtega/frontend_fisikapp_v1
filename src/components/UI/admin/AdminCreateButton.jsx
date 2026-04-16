import style from './AdminCreateButton.module.css'

function AdminCreateButton({ icon: Icon, text, onClick, type = "button" }) {
  return (
    <button className={style.btnPrimary} onClick={onClick} type={type}>
      {Icon && <Icon size={20} />}
      <span>{text}</span>
    </button>
  );
}

export default AdminCreateButton