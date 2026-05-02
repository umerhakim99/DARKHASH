import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Gem,
  Heart,
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import {
  getDisplayName,
  getProfile,
  isAuthenticated,
  logout,
} from "../services/authService";

function Navbar() {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();

  const [menuOpen, setMenuOpen] = useState(false);
  const [displayName, setDisplayName] = useState(getDisplayName());

  useEffect(() => {
    const loadUser = async () => {
      if (!loggedIn) {
        setDisplayName("");
        return;
      }

      try {
        await getProfile();
        setDisplayName(getDisplayName());
      } catch {
        setDisplayName(getDisplayName());
      }
    };

    loadUser();
  }, [loggedIn]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setDisplayName("");
    navigate("/login");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B0B0B]/95 backdrop-blur-xl border-b border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto px-5 md:px-6 py-4 flex items-center justify-between">
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full border border-[#D4AF37]/40 flex items-center justify-center group-hover:bg-[#D4AF37]/10 transition">
            <Gem className="text-[#D4AF37]" size={22} />
          </div>

          <div>
            <h1 className="font-luxury text-xl tracking-wide group-hover:text-[#D4AF37] transition">
              DARKHASH
            </h1>
            <p className="text-[10px] text-[#D4AF37] tracking-[0.25em]">
              PRECIOUS STONES
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex gap-8 text-sm">
          <Link className="nav-link" to="/">
            Home
          </Link>

          <Link className="nav-link" to="/stones">
            Stones
          </Link>

          <Link className="nav-link" to="/wishlist">
            Wishlist
          </Link>

          <Link className="nav-link" to="/dashboard">
            Dashboard
          </Link>
        </nav>

        <div className="hidden md:flex gap-3 items-center">
          {loggedIn && (
            <span className="badge-gold max-w-[180px] truncate">
              AoA, {displayName}
            </span>
          )}

          <Link className="icon-link" to="/wishlist" title="Wishlist">
            <Heart size={19} />
          </Link>

          <Link className="icon-link" to="/cart" title="Cart">
            <ShoppingCart size={19} />
          </Link>

          {loggedIn ? (
            <button className="icon-link" onClick={handleLogout} title="Logout">
              <LogOut size={19} />
            </button>
          ) : (
            <Link className="icon-link" to="/login" title="Login">
              <User size={19} />
            </Link>
          )}
        </div>

        <button
          className="md:hidden icon-link"
          onClick={() => setMenuOpen((prev) => !prev)}
          title="Menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-[#D4AF37]/20 bg-[#0B0B0B] animate-fade-up">
          <div className="px-5 py-5 space-y-4">
            {loggedIn && (
              <div className="badge-gold inline-block">
                AoA, {displayName}
              </div>
            )}

            <div className="grid gap-3 text-sm">
              <Link onClick={closeMenu} className="nav-link w-fit" to="/">
                Home
              </Link>

              <Link onClick={closeMenu} className="nav-link w-fit" to="/stones">
                Stones
              </Link>

              <Link onClick={closeMenu} className="nav-link w-fit" to="/wishlist">
                Wishlist
              </Link>

              <Link onClick={closeMenu} className="nav-link w-fit" to="/cart">
                Cart
              </Link>

              <Link onClick={closeMenu} className="nav-link w-fit" to="/dashboard">
                Dashboard
              </Link>
            </div>

            <div className="pt-4 border-t border-[#D4AF37]/20">
              {loggedIn ? (
                <button
                  onClick={handleLogout}
                  className="btn-outline-gold px-5 py-2 rounded-lg"
                >
                  Logout
                </button>
              ) : (
                <Link
                  onClick={closeMenu}
                  to="/login"
                  className="btn-gold inline-block px-5 py-2 rounded-lg"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;