import style from './AuthForm.module.css';

function AuthForm({ children, onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(e);
  };

  return (
    <div className={style["form-wrapper"]}>
      
      <form className={style["formulario-base"]} onSubmit={handleSubmit}>
        {/* Aquí caerán todos los Inputs y botones que componen el formulario */}
        {children}
      </form>
    </div>
  );
}

export default AuthForm;