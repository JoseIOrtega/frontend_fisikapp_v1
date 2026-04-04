import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthRoutes from "./routes/AuthRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import { ModalProvider } from './context/ModalContext';
import './styles/variables.css';
import './styles/index.css';

function App() {
  return (
    <BrowserRouter>
      <ModalProvider> 
        <Routes>
          <Route path="/*" element={<AuthRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </ModalProvider>
    </BrowserRouter>
  );
}

export default App;