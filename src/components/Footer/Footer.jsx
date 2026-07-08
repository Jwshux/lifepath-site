import './Footer.css';

const QUICK_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Features', href: '#features' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Developers', href: '#developers' },
];

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <a href="#home" className="footer__logo">
              <span className="footer__logo-life">Life</span>
              <span className="footer__logo-path">PATH</span>
            </a>
            <p className="footer__tagline">Every choice writes the next chapter.</p>
          </div>

          <div className="footer__column">
            <span className="footer__heading">Quick Links</span>
            <ul className="footer__links">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="footer__link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__column">
            <span className="footer__heading">Get the Game</span>
            <ul className="footer__links">
              <li>
                <a href="#download" className="footer__link">
                  Download APK
                </a>
              </li>
                <li>
                <a
                    href="https://github.com/"
                    className="footer__link"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    GitHub
                </a>
                </li>
              <li>
                <a href="mailto:contact@lifepath.game" className="footer__link">
                  contact@lifepath.game
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            Copyright {year} LifePATH. All rights reserved.
          </p>

          <a href="#home" className="footer__back-to-top" aria-label="Back to top">
            <span className="footer__back-to-top-icon" aria-hidden="true">
              Up
            </span>
            Back to Top
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;