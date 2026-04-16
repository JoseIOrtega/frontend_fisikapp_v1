import style from './AuthInput.module.css';

// 1. Agregamos 'disabled' a la desestructuración
const AuthInput = ({ label, type = "text", placeholder, name, required = false, value, onChange, disabled, iconAction }) => {
  return (
    <div className={style["input-group"]}>
      {label && <label className={style["label-registrar"]}>{label}</label>}
      <input 
        className={style["input-registrar"]} 
        type={type} 
        name={name} 
        placeholder={placeholder} 
        required={required}
        value={value} 
        onChange={onChange}
        // 2. Aquí le pasamos la propiedad al input de HTML
        disabled={disabled} 
      />
      {iconAction && type !== "date" && (
          <div className={style.icon_container}>
              {iconAction}
          </div>
      )}
    </div>
  );
};

export default AuthInput;