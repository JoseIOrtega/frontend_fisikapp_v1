import logo from "../assets/images/Logo.png";
import style from './AuthLayout.module.css';

function AuthLayout({ children }){
  return (
    <div className={style.layout}> {/* Usamos el nombre de clase que definiste */}
        
        {/* LADO IZQUIERDO: Branding */}
        <div className={style.brandColumn}>
            <img src={logo} alt="Logo de Fisikapp" className={style.logo} />
            <p className={style.brandTagline}>Gestión y generación de informes de laboratorio.</p>
        </div>

        {/* LADO DERECHO: El formulario dinámico */}
        <div className={style.formColumn}>
            {children}
        </div>

        {/* Meteoritos de fondo (se mantienen tus animaciones) */}
        <span className={`${style.meteorito} ${style.m1}`}></span>
        <span className={`${style.meteorito} ${style.m2}`}></span>
        <span className={`${style.meteorito} ${style.m3}`}></span>
    </div>
  );
}
export default AuthLayout;