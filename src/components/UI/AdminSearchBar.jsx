import { Search } from 'lucide-react';
import style from './AdminSearchBar.module.css';

function AdminSearchBar({ placeholder = "Buscador..." }) {
  return (
    <div className={style.searchContainer}>
      <Search size={20} className={style.searchIcon} />
      <input 
        type="text" 
        placeholder={placeholder} 
        className={style.searchInput} 
      />
    </div>
  );
}

export default AdminSearchBar;