import './Download.css';

const APK_META = [
  { label: 'Latest Version', value: 'v1.2.0' },
  { label: 'Android Requirement', value: '8.0 and up' },
  { label: 'File Size', value: '148 MB' },
  { label: 'Last Updated', value: 'June 2026' },
];

const SHA256_PLACEHOLDER =
  '0000000000000000000000000000000000000000000000000000000000000000';

function Download() {
  return (
    <section id="download" className="download">
      <div className="download__inner">
        <div className="download__intro">
          <span className="download__eyebrow">Get the Game</span>
          <h2 className="download__heading">Download LifePATH</h2>
          <p className="download__description">
            Install the latest build and start your first playthrough. No
            account, no connection required — just choices to make.
          </p>
        </div>

        <div className="download__card">
          <div className="download__card-glow" aria-hidden="true" />

          <div className="download__cta">
            <a href="/downloads/lifepath-latest.apk" className="download__btn" download>
              <span className="download__btn-icon" aria-hidden="true">
                &#8595;
              </span>
              Download APK
            </a>
            <p className="download__cta-note">
              Direct download &middot; no third-party store required
            </p>
          </div>

          <dl className="download__meta">
            {APK_META.map((item) => (
              <div className="download__meta-item" key={item.label}>
                <dt className="download__meta-label">{item.label}</dt>
                <dd className="download__meta-value">{item.value}</dd>
              </div>
            ))}
          </dl>

          <div className="download__checksum">
            <span className="download__checksum-label">SHA256</span>
            <code className="download__checksum-value">{SHA256_PLACEHOLDER}</code>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Download;