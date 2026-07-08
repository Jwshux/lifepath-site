import { useCallback, useEffect, useRef, useState } from 'react';
import './Gallery.css';

const SCREENSHOTS = [
  { id: 1, caption: 'Childhood — the first choice' },
  { id: 2, caption: 'A dilemma at school' },
  { id: 3, caption: 'Friendship under strain' },
  { id: 4, caption: 'Career crossroads' },
  { id: 5, caption: 'A promise, kept or broken' },
  { id: 6, caption: 'The weight of consequence' },
];

function Gallery() {
  const [activeIndex, setActiveIndex] = useState(null);
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);

  const isOpen = activeIndex !== null;

  const openLightbox = (index, event) => {
    triggerRef.current = event.currentTarget;
    setActiveIndex(index);
  };

  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
    if (triggerRef.current) {
      triggerRef.current.focus();
    }
  }, []);

  const showPrev = useCallback(() => {
    setActiveIndex((current) =>
      current === null ? current : (current - 1 + SCREENSHOTS.length) % SCREENSHOTS.length
    );
  }, []);

  const showNext = useCallback(() => {
    setActiveIndex((current) =>
      current === null ? current : (current + 1) % SCREENSHOTS.length
    );
  }, []);

  // Keyboard controls: Escape closes, arrow keys navigate.
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeLightbox();
      } else if (event.key === 'ArrowLeft') {
        showPrev();
      } else if (event.key === 'ArrowRight') {
        showNext();
      } else if (event.key === 'Tab') {
        // Simple focus trap: only the dialog's close button and nav
        // controls are focusable, so keep Tab from escaping to the page.
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeLightbox, showPrev, showNext]);

  // Lock scroll and move focus into the dialog when it opens.
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      dialogRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const activeShot = isOpen ? SCREENSHOTS[activeIndex] : null;

  return (
    <section id="gallery" className="gallery">
      <div className="gallery__inner">
        <div className="gallery__header">
          <span className="gallery__eyebrow">In-Game Moments</span>
          <h2 className="gallery__heading">Gallery</h2>
          <p className="gallery__subheading">
            A glimpse at the moments and choices along the way.
          </p>
        </div>

        <div className="gallery__grid">
          {SCREENSHOTS.map((shot, index) => (
            <button
              key={shot.id}
              type="button"
              className="gallery__item"
              onClick={(event) => openLightbox(index, event)}
              aria-label={`Open screenshot: ${shot.caption}`}
            >
              <span className="gallery__placeholder">
                <span className="gallery__placeholder-index">{`0${shot.id}`}</span>
              </span>
              <span className="gallery__caption">{shot.caption}</span>
            </button>
          ))}
        </div>
      </div>

      {isOpen && (
        <div className="gallery__overlay" onClick={closeLightbox}>
          <div
            className="gallery__dialog"
            role="dialog"
            aria-modal="true"
            aria-label={activeShot.caption}
            tabIndex={-1}
            ref={dialogRef}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="gallery__dialog-close"
              onClick={closeLightbox}
              aria-label="Close screenshot viewer"
            >
              &times;
            </button>

            <button
              type="button"
              className="gallery__dialog-nav gallery__dialog-nav--prev"
              onClick={showPrev}
              aria-label="Previous screenshot"
            >
              &#8249;
            </button>

            <div className="gallery__dialog-placeholder">
              <span className="gallery__placeholder-index">{`0${activeShot.id}`}</span>
            </div>

            <button
              type="button"
              className="gallery__dialog-nav gallery__dialog-nav--next"
              onClick={showNext}
              aria-label="Next screenshot"
            >
              &#8250;
            </button>

            <p className="gallery__dialog-caption">{activeShot.caption}</p>
          </div>
        </div>
      )}
    </section>
  );
}

export default Gallery;