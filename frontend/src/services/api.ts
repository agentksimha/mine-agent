export const API_BASE_URL = 'https://krishnasimha-mine-agent.hf.space';

const TOKEN_KEY = 'minerakshak_auth_token';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);

export const setAuthToken = (token: string | null) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
};

const errorMessage = async (response: Response) => {
  try {
    const data = await response.json();
    return data.detail || data.error || data.response || `Request failed (${response.status}).`;
  } catch {
    return `Request failed (${response.status}).`;
  }
};

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  const token = getAuthToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  } catch {
    throw new ApiError('Unable to reach the server. Check your connection and try again.');
  }

  if (!response.ok) {
    const message = await errorMessage(response);
    if (response.status === 401 && token) {
      setAuthToken(null);
      window.dispatchEvent(new Event('minerakshak:unauthorized'));
    }
    throw new ApiError(message, response.status);
  }
  return response;
}

export async function apiJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await apiFetch(path, init);
  return response.json() as Promise<T>;
}

