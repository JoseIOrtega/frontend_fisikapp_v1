import { Search } from 'lucide-react';
import style from './AdminSearchBar.module.css';

// Mantenemos tus estilos originales (searchInput, searchIcon, etc.)
function AdminSearchBar({ placeholder = "Buscador...", onSearch }) {
  return (
    <div className={style.searchContainer}>
      <Search size={20} className={style.searchIcon} />
      <input 
        type="text" 
        placeholder={placeholder} 
        className={style.searchInput} 
        // Esta línea es la que hace la magia:
        onChange={(e) => onSearch(e.target.value)} 
      />
    </div>
  );
}

export default AdminSearchBar;