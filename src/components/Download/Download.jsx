import { useAuth } from '../../context/AuthContext';
import { useAuthModal } from '../../context/AuthModalContext';
import './Download.css';

const APK_URL = '/downloads/lifepath-latest.apk';

const APK_META = [
  { label: 'Latest Version', value: 'v1.2.0' },
  { label: 'Android Requirement', value: '8.0 and up' },
  { label: 'File Size', value: '148 MB' },
  { label: 'Last Updated', value: 'June 2026' },
];

const SHA256_PLACEHOLDER =
  '0000000000000000000000000000000000000000000000000000000000000000';

function triggerFileDownload() {
  const link = document.createElement('a');
  link.href = APK_URL;
  link.setAttribute('download', '');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function Download() {
  const { isAuthenticated } = useAuth();
  const { openModal } = useAuthModal();

  const handleDownloadClick = () => {
    if (isAuthenticated) {
      triggerFileDownload();
    } else {
      openModal('signin', triggerFileDownload);
    }
  };

  return (
    <section id="download" className="download">
      <div className="download__inner">
        <div className="download__intro">
          <span className="download__eyebrow">Get the Game</span>
          <h2 className="download__heading">Download LifePATH</h2>
          <p className="download__description">
            Install the latest build and start your first playthrough. Sign in to
            download — it helps us understand who's playing and keep the project secure.
          </p>
        </div>

        <div className="download__card">
          <div className="download__card-glow" aria-hidden="true" />

          <div className="download__cta">
            <button type="button" className="download__btn" onClick={handleDownloadClick}>
              <span className="download__btn-icon" aria-hidden="true">
                &#8595;
              </span>
              Download APK
            </button>
            <p className="download__cta-note">
              {isAuthenticated
                ? 'Direct download — no third-party store required'
                : 'Sign in required · takes a few seconds'}
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