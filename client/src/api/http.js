import axios from 'axios';

let accessToken = null;
let isRefreshing = false;
let refreshQueue = [];

export function setAccessToken(token) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

function processQueue(error, token = null) {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  refreshQueue = [];
}

const http = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

let activeRole = localStorage.getItem('staffsync_direct_role') || 'hr';

export function setActiveRole(role) {
  activeRole = role;
  if (role) localStorage.setItem('staffsync_direct_role', role);
}

export function getActiveRole() {
  return activeRole;
}

// Attach access token and active role on every request
http.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  if (activeRole) {
    config.headers['x-role'] = activeRole;
  }
  return config;
});

// On 401: try refresh once, queue concurrent requests
http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const isAuthRoute =
      original.url?.includes('/auth/login') ||
      original.url?.includes('/auth/refresh');

    if (error.response?.status === 401 && !original._retry && !isAuthRoute) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return http(original);
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const { data } = await http.post('/auth/refresh');
        const newToken = data.data.accessToken;
        setAccessToken(newToken);
        processQueue(null, newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return http(original);
      } catch (refreshError) {
        processQueue(refreshError, null);
        setAccessToken(null);
        // Do not force redirect to login in direct access mode
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export { http };
export default http;
