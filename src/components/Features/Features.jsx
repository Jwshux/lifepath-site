import './Features.css';

const FEATURES = [
  {
    title: 'Narrative-Driven Story',
    description:
      'Follow a branching story shaped entirely by the choices you make along the way.',
  },
  {
    title: 'Moral Dilemmas',
    description:
      'Face situations with no clean answer, and decide what matters most to you.',
  },
  {
    title: 'Life Stage Progression',
    description:
      'Move through distinct stages of life, each with its own pressures and choices.',
  },
  {
    title: 'Consequences Matter',
    description:
      'Every decision ripples forward, quietly reshaping the story still to come.',
  },
  {
    title: 'Character Relationships',
    description:
      'Build, strain, or repair bonds with people who remember what you chose.',
  },
  {
    title: 'Educational Experience',
    description:
      'Designed as a supplementary learning tool for exploring ethics in practice.',
  },
  {
    title: 'Offline Gameplay',
    description:
      'Play anywhere, anytime — no connection required to experience the story.',
  },
  {
    title: 'Multiple Save Slots',
    description:
      'Explore different paths in parallel by keeping several playthroughs at once.',
  },
];

function Features() {
  return (
    <section id="features" className="features">
      <div className="features__inner">
        <div className="features__header">
          <span className="features__eyebrow">What to Expect</span>
          <h2 className="features__heading">Built Around Choice</h2>
          <p className="features__subheading">
            A closer look at what shapes every playthrough of LifePATH.
          </p>
        </div>

        <div className="features__grid">
          {FEATURES.map((feature, index) => (
            <div
              key={feature.title}
              className="features__card"
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              <div className="features__icon" aria-hidden="true">
                <span className="features__icon-mark" />
              </div>
              <h3 className="features__card-title">{feature.title}</h3>
              <p className="features__card-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;