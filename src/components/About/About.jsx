import { useEffect, useRef, useState } from 'react';
import './About.css';

function About() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Reveal the section once it scrolls into view, rather than animating
  // on page load (which would fire off-screen before the user gets here).
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`about ${isVisible ? 'about--visible' : ''}`}
    >
      <div className="about__inner">
        <div className="about__content">
          <span className="about__eyebrow">About the Game</span>

          <h2 className="about__heading">What is LifePATH?</h2>

          <p className="about__paragraph">
            LifePATH is a narrative-driven Android simulation game, built as
            a supplementary learning tool for the Ethics subject. It turns
            moral philosophy into something you live through, rather than
            something you memorize.
          </p>

          <p className="about__paragraph">
            Across different stages of life, players face moral dilemmas
            with no easy way out. Every choice ripples forward, shaping
            relationships, personal growth, and the scenarios still to come.
          </p>

          <blockquote className="about__callout">
            LifePATH doesn&apos;t hand you right or wrong answers. It hands
            you consequences, and asks you to reflect on them.
          </blockquote>
        </div>

        <div className="about__illustration">
          <div className="about__illustration-frame">
            <span className="about__illustration-label">Illustration</span>
            <span className="about__illustration-sublabel">
              Placeholder — key art coming soon
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;