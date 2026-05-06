import { Search } from 'lucide-react';
import style from './AdminSearchBar.module.css';

// Agregamos la prop onSearch
function AdminSearchBar({ onSearch, placeholder = "Buscador..." }) {
  return (
    <div className={style.searchContainer}>
      <Search size={20} className={style.searchIcon} />
      <input 
        type="text" 
        placeholder={placeholder} 
        className={style.searchInput} 
        onChange={(e) => onSearch && onSearch(e.target.value)} 
      />
    </div>
  );
}

export default AdminSearchBar;