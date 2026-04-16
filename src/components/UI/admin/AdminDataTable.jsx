import style from './AdminDataTable.module.css';

function AdminDataTable({ columns, data, renderRow }) {
  return (
    <div className={style.tableContainer}>
      <table className={style.customTable}>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index} style={col.style}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => renderRow(item, index))}
        </tbody>
      </table>
    </div>
  );
}
export default AdminDataTable;