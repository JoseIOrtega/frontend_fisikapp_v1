import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthRoutes from "./routes/AuthRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import './styles/variables.css';
import './styles/index.css'
import AdminModalLaboratorio from "./components/modals/AdminModalLaboratorio";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<AuthRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/add/*" element={<AdminModalLaboratorio />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
