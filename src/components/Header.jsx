import { Link, useLocation } from 'react-router-dom';
import { useBacklog } from '../context/BacklogContext';

function Header() {
  const location = useLocation();
  const { entries } = useBacklog();

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="app-title">🎮 BacklogBuddy</Link>
        <nav className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Browse
          </Link>
          <Link to="/backlog" className={`nav-link ${location.pathname === '/backlog' ? 'active' : ''}`}>
            My Backlog ({entries.length})
          </Link>
          <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;