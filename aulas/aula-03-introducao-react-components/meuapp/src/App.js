import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/Home";
import EquipePage from "./pages/EquipePage";
import ContadoresPage from "./pages/ContadoresPage";

export default function App() {
  const [valor, setValor] = useState(0);

  return (
    <BrowserRouter>

      <nav>
        <Link to="/">Home</Link> |{" "}
        {/*<a href="/equipe">Equipe</a> |{" "}*/}
        <Link to="/equipe">Equipe</Link> |{" "}
        <Link to="/contadores">Contadores</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/equipe" element={<EquipePage />} />
        <Route path="/contadores" element={<ContadoresPage valor={valor} setValor={setValor} />} />
      </Routes>

    </BrowserRouter>
  );
}