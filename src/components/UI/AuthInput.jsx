import style from './AuthInput.module.css';

// Agregamos 'value' y 'onChange' a las desestructuración de props
const Input = ({ label, type = "text", placeholder, name, required = false, value, onChange }) => {
  return (
    <div className={style["input-group"]}>
      {label && <label className={style["label-registrar"]}>{label}</label>}
      <input 
        className={style["input-registrar"]} 
        type={type} 
        name={name} 
        placeholder={placeholder} 
        required={required}
        // ESTO ES LO QUE FALTABA:
        value={value} 
        onChange={onChange} 
      />
    </div>
  );
};

export default Input;