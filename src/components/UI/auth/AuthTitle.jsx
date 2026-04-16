import style from "./AuthTitle.module.css";

function AuthTitle({ children }) {
    return (
        <h4 className={style.title}>{children}</h4>
    );
}

export default AuthTitle;