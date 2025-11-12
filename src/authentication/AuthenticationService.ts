// api/AuthenticationService.ts

import { config } from "@/helpers/config";

export class AuthenticationService {
    private static _provider: string = 'google'; 

    /**
     * Set the default provider for all auth operations
     */
    public static setProvider(provider: string): void {
        this._provider = provider;
    }

    /**
     * Get the current default provider
     */
    public static getProvider(): string {
        return this._provider;
    }

    /**
     * Login with the current provider (or default to google)
     */
    public static login(provider?: string): void {
        const targetProvider = provider || this._provider;
        window.location.href = `${config.apiBaseUrl}/authentication/${targetProvider}`;
    }

    /**
     * Logout from the current provider  
     */
    public static logout(provider?: string): void {
        const targetProvider = provider || this._provider;
        window.location.href = `${config.apiBaseUrl}/authentication/logout/${targetProvider}`;
    }

    /**
     * Check if user is authenticated
     */
    public static async getCurrentUser(): Promise<any> {
        const response = await fetch(`${config.apiBaseUrl}/users/me`, {
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Not authenticated');
        }
        
        return response.json();
    }
}