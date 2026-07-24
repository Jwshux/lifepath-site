import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAuthModal } from '../../context/AuthModalContext';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Features', href: '#features' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Download', href: '#download' },
  { label: 'Developers', href: '#developers' },
  { label: 'Feedback', href: '#feedback' },
];

const SCROLL_THRESHOLD = 24;
const DESKTOP_BREAKPOINT = 768;

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { openModal } = useAuthModal();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > DESKTOP_BREAKPOINT) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen((open) => !open);

  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const handleSignIn = () => {
    openModal('signin');
    closeMenu();
  };

  const handleSignUp = () => {
    openModal('signup');
    closeMenu();
  };

  const handleLogout = () => {
    setIsAccountOpen(false);
    logout();
    closeMenu();
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <a href="#home" className="navbar__logo" onClick={closeMenu}>
          <span className="navbar__logo-life">Life</span>
          <span className="navbar__logo-path">PATH</span>
        </a>

        <ul className="navbar__links">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="navbar__link">
                {link.label}
              </a>
            </li>
          ))}
          <li className="navbar__auth">
          {isAuthenticated ? (
            <div className="navbar__account">
              <button
                type="button"
                className="navbar__account-trigger"
                onClick={() => setIsAccountOpen((open) => !open)}
                aria-expanded={isAccountOpen}
                aria-haspopup="menu"
              >
                <span className="navbar__account-name">
                  {user?.username}
                </span>

                <span
                  className={`navbar__account-chevron ${
                    isAccountOpen
                      ? 'navbar__account-chevron--open'
                      : ''
                  }`}
                  aria-hidden="true"
                >
                  ▾
                </span>
              </button>

              {isAccountOpen && (
                <div className="navbar__account-menu" role="menu">
                  <button
                    type="button"
                    className="navbar__account-signout"
                    onClick={handleLogout}
                    role="menuitem"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                type="button"
                className="navbar__cta navbar__cta--ghost"
                onClick={handleSignIn}
              >
                Sign In
              </button>

              <button
                type="button"
                className="navbar__cta"
                onClick={handleSignUp}
              >
                Sign Up
              </button>
            </>
          )}
          </li>
        </ul>

        <button
          type="button"
          className={`navbar__toggle ${isMenuOpen ? 'navbar__toggle--open' : ''}`}
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <span className="navbar__toggle-bar" />
          <span className="navbar__toggle-bar" />
          <span className="navbar__toggle-bar" />
        </button>
      </div>

      <div id="mobile-menu" className={`navbar__mobile-menu ${isMenuOpen ? 'navbar__mobile-menu--open' : ''}`}>
        <ul className="navbar__mobile-links">
          {NAV_LINKS.map((link, index) => (
            <li key={link.href} style={{ transitionDelay: isMenuOpen ? `${index * 0.05}s` : '0s' }}>
              <a href={link.href} className="navbar__link" onClick={closeMenu}>
                {link.label}
              </a>
            </li>
          ))}
          {isAuthenticated ? (
            <li style={{ transitionDelay: isMenuOpen ? `${NAV_LINKS.length * 0.05}s` : '0s' }}>
              <button type="button" className="navbar__link navbar__link--button" onClick={handleLogout}>
                Sign Out ({user?.username})
              </button>
            </li>
          ) : (
            <>
              <li style={{ transitionDelay: isMenuOpen ? `${NAV_LINKS.length * 0.05}s` : '0s' }}>
                <button type="button" className="navbar__link navbar__link--button" onClick={handleSignIn}>
                  Sign In
                </button>
              </li>
              <li style={{ transitionDelay: isMenuOpen ? `${(NAV_LINKS.length + 1) * 0.05}s` : '0s' }}>
                <button type="button" className="navbar__link navbar__link--button" onClick={handleSignUp}>
                  Sign Up
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;