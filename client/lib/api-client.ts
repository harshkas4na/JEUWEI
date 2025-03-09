import { ApiError } from '../utils/error'; // Adjust the path as necessary

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Access the environment variable

// In your API client code (e.g., lib/api-client.ts)
export async function fetchWithAuth(
  url: string, 
  options: RequestInit = {}, 
  getToken: () => Promise<string | null>
) {
  const token = await getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Log for debugging
  console.log('Making request with token:', token ? 'Token present' : 'No token');

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  // Log response status for debugging
  console.log('Response status:', response.status);

  // Handle responses appropriately
  if (response.status === 401 || response.status === 403) {
    console.error('Authentication error');
    // Handle auth error
  }

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(data.error || 'An error occurred', response.status);
  }

  return data.data;
}