import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("jwt_token");
    navigate("/login");
  };

  return (
    <nav className="navbar">

      <Link
        to="/"
        className="logo"
        aria-label="Go to dashboard home"
      >
        Go Business
      </Link>

      <div className="nav-links">

        <Link to="/">
          Home
        </Link>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Log out
        </button>

      </div>

    </nav>
  );
};

export default Navbar;