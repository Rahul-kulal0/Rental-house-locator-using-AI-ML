/*import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="w-full bg-white shadow-lg py-4 px-6 flex justify-between items-center sticky top-0 z-50">

      {/* Logo *}
      <Link to="/" className="text-2xl font-bold text-blue-600">
        RentEasy 🏡
      </Link>

      {/* Navigation Links *}
      <div className="flex gap-6 text-lg">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <Link to="/favorites" className="hover:text-blue-600">Favorites ❤️</Link>
        <Link to="/login" className="hover:text-blue-600">Login</Link>
      </div>
    </div>
  );
}*/

import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="glass sticky top-0 z-50 animate-slide-down">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <Link 
          to={user ? "/home" : "/login"}
          className="text-2xl font-extrabold text-gradient hover:scale-105 transition-transform duration-300"
        >
          🏠 RentalHouse
        </Link>

        <div className="flex gap-6 items-center">
          <Link 
            to="/home"
            className="font-medium text-gray-700 hover:text-primary-600 transition-colors duration-300 hover:scale-105 transform"
          >
            Home
          </Link>
          <Link 
            to="/predict" 
            className="font-medium text-gray-700 hover:text-primary-600 transition-colors duration-300 hover:scale-105 transform flex items-center gap-1"
          >
            🔮 Predict Price
          </Link>

          {user ? (
            <>
              <span className="font-semibold text-gray-800 px-4 py-2 bg-primary-50 rounded-lg border border-primary-100">
                Hi, {user.name}
              </span>
              <button onClick={logout} className="btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-primary">Login</Link>
              <Link to="/signup" className="btn-secondary">Sign Up</Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}

