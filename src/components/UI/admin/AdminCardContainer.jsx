// AdminCardContainer.jsx
import style from './AdminCardContainer.module.css'; 

function AdminCardContainer({ children, title }) {
  return (
    <div className={style.tableContainer}> 
      {title && <h3 className={style.cardTitle}>{title}</h3>}
      <div className={style.cardContent}>
        {children}
      </div>
    </div>
  );
}
export default AdminCardContainer;