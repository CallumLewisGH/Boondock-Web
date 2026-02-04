import { client } from '@/api/client.gen'

let isInitialized = false;

export function useClient() {
    if (isInitialized) return;

    client.setConfig({
        baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
        throwOnError: false
    });

    client.interceptors.request.use((request) => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            request.headers.set('Authorization', `Bearer ${token}`);
        }
        return request;
    });

    isInitialized = true;
}