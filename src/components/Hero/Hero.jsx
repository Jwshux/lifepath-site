import './Hero.css';

function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero__inner">
        <div className="hero__content">
          <span className="hero__eyebrow">A Narrative Simulation</span>

          <h1 className="hero__title">
            <span className="hero__title-life">Life</span>
            <span className="hero__title-path">PATH</span>
          </h1>

          <p className="hero__tagline">Every choice writes the next chapter.</p>

          <p className="hero__description">
            LifePATH is a narrative-driven Android simulation game where the
            choices you make shape relationships, character growth, and the
            story of a life fully lived.
          </p>

          <div className="hero__actions">
            <a href="#download" className="hero__btn hero__btn--primary">
              Download APK
            </a>
            <a href="#gallery" className="hero__btn hero__btn--secondary">
              View Screenshots
            </a>
          </div>
        </div>

        <div className="hero__artwork">
          <div className="hero__artwork-frame">
            <span className="hero__artwork-label">Gameplay Preview</span>
            <span className="hero__artwork-sublabel">
              Artwork placeholder — screenshot coming soon
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;