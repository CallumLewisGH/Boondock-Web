// api/AuthenticationService.ts
import { config } from "../helpers/config";
import { getUsersMe } from "../api";
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

export class AuthenticationService {
    private static _provider: string = 'google';

    public static setProvider(provider: string): void {
        this._provider = provider;
    }

    public static handleCallback(): boolean {
        const url = new URL(window.location.href);
        const token = url.searchParams.get('token');

        if (token) {
            localStorage.setItem('jwt_token', token);

            url.searchParams.delete('token');
            url.searchParams.delete('redirect');
            window.history.replaceState({}, document.title, url.toString());

            return true;
        }
        return false;
    }

    public static login(provider?: string): void {
        const targetProvider = provider || this._provider;
        const url = `${config.apiBaseUrl}/authentication/${targetProvider}`;

        if (Capacitor.isNativePlatform()) {
            // Google blocks OAuth logins from embedded WebViews, so this has to run in the
            // system browser. The backend redirects back via a custom-scheme deep link
            // (handled in main.ts's appUrlOpen listener) instead of a web query param.
            Browser.open({ url: `${url}?platform=mobile` });
        } else {
            window.location.href = url;
        }
    }

    public static logout(): void {
        localStorage.removeItem('jwt_token');

        if (Capacitor.isNativePlatform()) {
            // Native auth state is just the local JWT; the backend's OAuth-handshake
            // session cookie lives in the system browser's jar, not this WebView's, so
            // there's nothing else to clear by hitting the logout endpoint here.
            return;
        }

        window.location.href = `${config.apiBaseUrl}/authentication/logout/${this._provider}`;
    }
}