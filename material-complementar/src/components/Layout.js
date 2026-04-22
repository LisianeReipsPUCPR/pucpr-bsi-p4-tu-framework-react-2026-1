import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/equipe">Equipe</Link> |{" "}
        <Link to="/contadores">Contadores</Link> |{" "}
        <Link to="/cadastro">Cadastro</Link>
      </nav>

      <hr />

      <Outlet />
    </div>
  );
}


