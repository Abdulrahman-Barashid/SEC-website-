import './css/Header.css';
import { NavLink } from 'react-router-dom';
import secLogo from '../assets/b2.png'; 

const Header = () => {
  return (
    <header className="header">
      <div className="header-title">حجوزاتي</div>

      <nav className="header-nav">
        <NavLink 
          to="/" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          الرئيسية
        </NavLink>
        <NavLink 
          to="/create" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          إنشاء طلب+
        </NavLink>
      </nav>

      <div className="header-logo">
        <img src={secLogo} alt="SEC Logo" />
      </div>
    </header>
  );
};

export default Header;