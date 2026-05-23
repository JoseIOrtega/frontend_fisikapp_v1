import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Al cargar la app, miramos si hay un usuario guardado en el "bolsillo" del navegador
    const userStorage = localStorage.getItem("user");
    if (userStorage) {
      setUsuario(JSON.parse(userStorage));
    }
    setCargando(false);
  }, []);

  const login = (userData) => {
    setUsuario(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, cargando }}>
      {children}
    </AuthContext.Provider>
  );
};

// Este es el "gancho" (hook) que usarás en RutaProtegida y otros componentes
export const useAuth = () => useContext(AuthContext);