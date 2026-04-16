import { Link } from "react-router-dom";
import style from "./AuthTextLink.module.css";

const AuthTextLink = ({ to, children }) => {
  return (
    <Link className={style.link} to={to}> {children} </Link>
  );
};

export default AuthTextLink;