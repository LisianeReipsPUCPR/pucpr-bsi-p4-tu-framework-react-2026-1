import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Layout from "./components/Layout";
import FormCadastro from "./components/FormCadastro";
import Home from "./pages/Home";
import EquipePage from "./pages/EquipePage";
import ContadoresPage from "./pages/ContadoresPage";
import UsuariosPage from "./pages/UsuariosPage";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  const [valor, setValor] = useState(0);

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="equipe" element={<EquipePage />} />
          <Route 
            path="contadores" 
            element={<ContadoresPage valor={valor} setValor={setValor} />} 
          />
	        <Route
            path="usuarios"
            element={
                <PrivateRoute>
                  <UsuariosPage />
                </PrivateRoute>
            }
          />

          {/* Nova rota */}
          <Route path="cadastro" element={<FormCadastro />} />
          <Route path="login" element={<LoginPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}