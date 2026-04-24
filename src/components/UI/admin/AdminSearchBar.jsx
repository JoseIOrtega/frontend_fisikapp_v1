import { useState } from 'react';
import { Search } from 'lucide-react';
import style from './AdminSearchBar.module.css';

function AdminSearchBar({ placeholder = "Buscador..." }) {
  const [searchText, setSearchText] = useState('');

  return (
    <div className={style.searchContainer}>
      <Search size={20} className={style.searchIcon} />
      <input 
        type="text" 
        placeholder={placeholder} 
        className={style.searchInput} 
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
    </div>
  );
}

export default AdminSearchBar;