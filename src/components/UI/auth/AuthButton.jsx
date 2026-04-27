import style from './AuthButton.module.css';

const AuthButton = ({ children, onClick, type = "button", variant = "primary" }) => {
  return (
    <button className={`${style.boton} ${style[variant]}`} onClick={onClick} type={type}>{children}</button>
  );
};

export default AuthButton;