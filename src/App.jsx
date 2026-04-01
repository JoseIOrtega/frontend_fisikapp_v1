import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthRoutes from "./routes/AuthRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import './styles/variables.css';
import './styles/index.css'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<AuthRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
