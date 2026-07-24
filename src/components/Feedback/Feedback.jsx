import { useState } from 'react';
import { submitFeedback } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useAuthModal } from '../../context/AuthModalContext';
import './Feedback.css';

const RATING_VALUES = [1, 2, 3, 4, 5];

function Feedback() {
  const { isAuthenticated } = useAuth();
  const { openModal } = useAuthModal();
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const performSubmit = async () => {
    setError('');
    setStatus('submitting');
    try {
      // Read fresh from storage rather than component state, in case this
      // runs as a callback right after signing in from the auth modal.
      const freshToken = localStorage.getItem('lifepath_token');
      await submitFeedback({ message, rating: rating || undefined }, freshToken);
      setStatus('success');
      setMessage('');
      setRating(0);
    } catch (err) {
      setError(err.message);
      setStatus('idle');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!message.trim()) {
      setError('Please enter your feedback before submitting.');
      return;
    }

    setError('');

    if (!isAuthenticated) {
      openModal('signin', performSubmit);
      return;
    }

    performSubmit();
  };

  return (
    <section id="feedback" className="feedback">
      <div className="feedback__inner">
        <div className="feedback__header">
          <span className="feedback__eyebrow">Tell Us What You Think</span>
          <h2 className="feedback__heading">Feedback &amp; Suggestions</h2>
          <p className="feedback__subheading">
            {isAuthenticated
              ? 'Your feedback helps shape where LifePATH goes next.'
              : 'Write your feedback below — you\u2019ll sign in when you submit it.'}
          </p>
        </div>

        <div className="feedback__card">
          {status === 'success' ? (
            <div className="feedback__success" role="status">
              <p>Thank you! Your feedback has been submitted.</p>
              <button type="button" className="feedback__reset" onClick={() => setStatus('idle')}>
                Send another
              </button>
            </div>
          ) : (
            <form className="feedback__form" onSubmit={handleSubmit}>
              <div className="feedback__rating">
                <span className="feedback__label">Rating (optional)</span>
                <div className="feedback__stars">
                  {RATING_VALUES.map((value) => (
                    <button
                      type="button"
                      key={value}
                      className={`feedback__star ${rating >= value ? 'feedback__star--filled' : ''}`}
                      onClick={() => setRating(value === rating ? 0 : value)}
                      aria-label={`Rate ${value} out of 5`}
                      aria-pressed={rating === value}
                    >
                      &#9733;
                    </button>
                  ))}
                </div>
              </div>

              <label className="feedback__field">
                <span className="feedback__label">Your Feedback</span>
                <textarea
                  name="message"
                  rows={5}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="What did you like? What could be better?"
                  required
                />
              </label>

              {error && (
                <p className="feedback__error" role="alert">
                  {error}
                </p>
              )}

              <button type="submit" className="feedback__submit" disabled={status === 'submitting'}>
                {status === 'submitting'
                  ? 'Submitting…'
                  : isAuthenticated
                    ? 'Submit Feedback'
                    : 'Sign In & Submit'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default Feedback;