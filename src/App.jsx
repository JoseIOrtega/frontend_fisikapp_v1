import { BrowserRouter, Routes, Route } from "react-router-dom";
import RutaProtegida from './components/UI/auth/RutaProtegida';
import AuthRoutes from "./routes/AuthRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import DocenteRoutes from "./routes/DocenteRoutes";
import { ModalProvider } from './context/ModalContext';
import './styles/variables.css';
import './styles/index.css';

function App() {
  return (
    <BrowserRouter>
        <ModalProvider> 
          <Routes>
            {/* Rutas Públicas (Login, etc.) */}
            <Route path="/*" element={<AuthRoutes />} />

            {/* 3. RUTAS PROTEGIDAS PARA ADMIN */}
            <Route 
              path="/admin/*" 
              element={
                <RutaProtegida rolesPermitidos={['superadmin', 'admin']}>
                  <AdminRoutes />
                </RutaProtegida>
              } 
            />

            {/* 4. RUTAS PROTEGIDAS PARA PROFESOR */}
            <Route 
              path="/profesor/*" 
              element={
                <RutaProtegida rolesPermitidos={['profesor']}>
                  <DocenteRoutes />
                </RutaProtegida>
              } 
            />
          </Routes>
        </ModalProvider>
    </BrowserRouter>
  );
}

export default App;