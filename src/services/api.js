const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:8000';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error ||
      data.message ||
      'Something went wrong. Please try again.'
    );
  }

  return data;
}

export function signUp({ email, password, username }) {
  return request('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      username,
    }),
  });
}

export function signIn({ username, password }) {
  return request('/api/auth/signin', {
    method: 'POST',
    body: JSON.stringify({
      username,
      password,
    }),
  });
}

export function submitFeedback({ message, rating }, token) {
  return request('/api/feedback/', {
    method: 'POST',
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
    body: JSON.stringify({
      message,
      rating,
    }),
  });
}

export function checkUsername(username) {
  return request(
    `/api/auth/check-username?username=${encodeURIComponent(username)}`,
    {
      method: 'GET',
    }
  );
}

export function forgotPassword(email) {
  return request('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function verifyResetCode(email, code) {
  return request('/api/auth/verify-reset-code', {
    method: 'POST',
    body: JSON.stringify({
      email,
      code,
    }),
  });
}