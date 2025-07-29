import './css/Header.css';
import { Link } from 'react-router-dom';
import secLogo from '../assets/b2.png'; 

const Header = () => {
  return (
    <header className="header">
      <div className="header-title">حجوزاتي</div>

      <nav className="header-nav">
        <Link to="/" className="nav-link">الرئيسية</Link>
        <Link to="/create" className="nav-link">إنشاء طلب+</Link>
      </nav>

      <div className="header-logo">
        <img src={secLogo} alt="SEC Logo" />
      </div>
    </header>
  );
};

export default Header;
