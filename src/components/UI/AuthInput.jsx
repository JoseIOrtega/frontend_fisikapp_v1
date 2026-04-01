import style from './AuthInput.module.css';

// Usamos "props" para que el componente sea flexible
const Input = ({ label, type = "text", placeholder, name, required = false }) => {
  return (
    <div className={style["input-group"]}>
      {label && <label className={style["label-registrar"]}>{label}</label>}
      <input className={style["input-registrar"]} type={type} name={name} placeholder={placeholder} required={required} />
    </div>
  );
};

export default Input;