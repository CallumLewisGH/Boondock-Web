// api/AuthenticationService.ts
import { config } from "@/helpers/config";
import { OpenAPI, UsersService } from "@/api";

export class AuthenticationService {
    private static _provider: string = 'google'; 

    public static setProvider(provider: string): void {
        this._provider = provider;
    }

    public static initializeGlobalAuth(): void {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            (OpenAPI as any).HEADERS = {
                ...OpenAPI.HEADERS,
                Authorization: `Bearer ${token}`,
            };
        }
    }

    /**
     * Extracts token from URL, saves it, and visually cleans the browser URL bar.
     */
    public static handleCallback(): boolean {
        const url = new URL(window.location.href);
        const token = url.searchParams.get('token');

        if (token) {
            localStorage.setItem('jwt_token', token);
            
            // Apply it to OpenAPI headers immediately
            this.initializeGlobalAuth();

            // Clean the params from the URL object
            url.searchParams.delete('token');
            url.searchParams.delete('redirect');
            
            // Update the browser URL immediately (Visual only, Router handles state)
            window.history.replaceState({}, document.title, url.toString());
            
            return true;
        }
        return false;
    }

    public static login(provider?: string): void {
        const targetProvider = provider || this._provider;
        window.location.href = `${config.apiBaseUrl}/authentication/${targetProvider}`;
    }

    public static logout(): void {
        localStorage.removeItem('jwt_token');
        (OpenAPI as any).HEADERS = {
            ...OpenAPI.HEADERS,
            Authorization: '',
        };
        window.location.href = `${config.apiBaseUrl}/authentication/logout/${this._provider}`;
    }

    public static async getCurrentUser(): Promise<any> {
        return await UsersService.getUsersMe();
    }
}