const figmaApiBase = 'https://api.figma.com/v1';

async function fetchWrapper(url, token, options) {
  const baseUrl = figmaApiBase;
  const headers = {
    'Content-Type': 'application/json',
    'X-Figma-Token': token,
  };
  const fetchOptions = { ...options, headers };
  const response = await fetch(`${baseUrl}${url}`, fetchOptions);
  const data = await response.json();
  return { data };
}

export function figmaClientRequest(token) {
  return {
    get: url => fetchWrapper(url, token, { method: 'GET' }),
    post: (url, body) => fetchWrapper(url, token, { method: 'POST', body: JSON.stringify(body) }),
    put: (url, body) => fetchWrapper(url, token, { method: 'PUT', body: JSON.stringify(body) }),
    delete: url => fetchWrapper(url, token, { method: 'DELETE' }),
  };
}
