import { Link } from "react-router-dom";

function Navbar({ token, setToken }) {
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        The Blog
      </Link>
      <div className="nav-links">
        {token ? (
          <button onClick={handleLogout} className="nav-logout">
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/signup" className="nav-link nav-link-primary">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
