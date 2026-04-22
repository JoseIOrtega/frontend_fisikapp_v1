import style from './AuthInput.module.css';

// 1. Añadimos 'error' a la desestructuración de props
const AuthInput = ({ label, type = "text", placeholder, name, required = false, value, onChange, disabled, iconAction, error }) => {
  return (
    <div className={style["input-group"]}>
      {label && <label className={style["label-registrar"]}>{label}</label>}
      <input 
        // 2. Si existe la prop 'error', aplicamos la clase de error de CSS
        className={`${style["input-registrar"]} ${error ? style["input-error"] : ""}`} 
        type={type} 
        name={name} 
        placeholder={placeholder} 
        required={required}
        value={value} 
        onChange={onChange}
        disabled={disabled} 
      />
      
      {/* 3. Mostramos el mensaje de error debajo del input si existe */}
      {error && <span className={style["error-message"]}>{Array.isArray(error) ? error[0] : error}</span>}

      {iconAction && type !== "date" && (
          <div className={style.icon_container}>
              {iconAction}
          </div>
      )}
    </div>
  );
};

export default AuthInput;