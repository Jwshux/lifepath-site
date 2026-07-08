import './Developers.css';

const DEVELOPERS = [
  {
    id: 1,
    name: 'Joshua R. Riana',
    role: 'Role Placeholder',
    description: 'Short description placeholder — bio coming soon.',
  },
  {
    id: 2,
    name: 'Miguel Dominic Santiago',
    role: 'Role Placeholder',
    description: 'Short description placeholder — bio coming soon.',
  },
  {
    id: 3,
    name: 'Sofia Parreño',
    role: 'Role Placeholder',
    description: 'Short description placeholder — bio coming soon.',
  },
  {
    id: 4,
    name: 'Nikol Lopez',
    role: 'Role Placeholder',
    description: 'Short description placeholder — bio coming soon.',
  },
];

function Developers() {
  return (
    <section id="developers" className="developers">
      <div className="developers__inner">
        <div className="developers__header">
          <span className="developers__eyebrow">The Team</span>
          <h2 className="developers__heading">Meet the Developers</h2>
          <p className="developers__subheading">
            The people behind LifePATH's story, systems, and design.
          </p>
        </div>

        <div className="developers__grid">
          {DEVELOPERS.map((dev, index) => (
            <div
              key={dev.id}
              className="developers__card"
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              <div className="developers__avatar" aria-hidden="true">
                <span className="developers__avatar-initials">
                  {dev.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')}
                </span>
              </div>
              <h3 className="developers__name">{dev.name}</h3>
              <span className="developers__role">{dev.role}</span>
              <p className="developers__description">{dev.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Developers;