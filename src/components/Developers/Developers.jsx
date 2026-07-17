import './Developers.css';
import pfpRia from '../../assets/pfp_ria.png';
import pfpDom from '../../assets/pfp_dom.png';
import pfpSof from '../../assets/pfp_sof.png';
import pfpNik from '../../assets/pfp_nik.png';

const DEVELOPERS = [
  {
    id: 1,
    name: 'Joshua R. Riana',
    role: 'Project Manager & Database Developer',
    description:
      "Designed the game's database structure and wrote the technical and user documentation for LifePATH.",
    email: 'rianajoshua.pdm@gmail.com',
    photo: pfpRia,
    photoPosition: 'center 8%',
    photoZoom: 1.5,
  },
  {
    id: 2,
    name: 'Miguel Dominic Santiago',
    role: 'Front-End Developer & 3D Modeller',
    description:
      "Built the game's front-end interfaces and user interaction flow.",
    email: 'santiagomigueldominic.pdm@gmail.com',
    photo: pfpDom,
    photoPosition: 'center 35%',
  },
  {
    id: 3,
    name: 'Sofia Parreño',
    role: 'Lead Programmer & Level Designer',
    description:
      "Led core programming and designed the game's levels and progression.",
    email: 'parrenosofia.pdm@gmail.com',
    photo: pfpSof,
    photoPosition: 'center 3%',
    photoZoom: 1.05,
  },
  {
    id: 4,
    name: 'Nikol Lopez',
    role: 'Co-Lead Programmer & Level Designer',
    description: "Co-led core programming and helped implement game mechanics and interactive systems in Unity.",
    email: 'lopeznikol.pdm@gmail.com',
    photo: pfpNik,
    photoPosition: 'center 20%',
    photoZoom: 1.2,
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
              <div className="developers__avatar">
                {dev.photo ? (
                <img
                  src={dev.photo}
                  alt={dev.name}
                  className="developers__avatar-photo"
                  style={{
                    '--photo-position': dev.photoPosition,
                    '--photo-zoom': dev.photoZoom || 1,
                  }}
                />
                ) : (
                  <span className="developers__avatar-initials" aria-hidden="true">
                    {dev.name
                      .split(' ')
                      .map((part) => part[0])
                      .join('')}
                  </span>
                )}
              </div>
              <h3 className="developers__name">{dev.name}</h3>
              <span className="developers__role">{dev.role}</span>
              <p className="developers__description">{dev.description}</p>
              {dev.email && (
                <a href={`mailto:${dev.email}`} className="developers__email">
                  {dev.email}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Developers;