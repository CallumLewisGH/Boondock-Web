/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthenticationService {
    /**
     * Logout current user from OAuth provider
     * Clears the JWT cookie and performs OAuth provider logout
     * @param provider OAuth provider (e.g., google, github)
     * @returns void
     * @throws ApiError
     */
    public static getAuthenticationLogout(
        provider: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/authentication/logout/{provider}',
            path: {
                'provider': provider,
            },
            errors: {
                302: `Redirects to home page`,
            },
        });
    }
    /**
     * Initiate OAuth2 login
     * Redirects to OAuth2 consent page for the specified provider
     * @param provider OAuth provider (e.g., google, github)
     * @returns void
     * @throws ApiError
     */
    public static getAuthentication(
        provider: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/authentication/{provider}',
            path: {
                'provider': provider,
            },
            errors: {
                302: `Redirects to OAuth provider`,
                500: `Returns error if authentication fails`,
            },
        });
    }
    /**
     * OAuth2 callback
     * Handles the callback from OAuth2 provider and sets JWT cookie
     * @param provider OAuth provider (e.g., google, github)
     * @returns void
     * @throws ApiError
     */
    public static getAuthenticationCallback(
        provider: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/authentication/{provider}/callback',
            path: {
                'provider': provider,
            },
            errors: {
                302: `Redirects to /home on success`,
                500: `Returns error if user authentication fails`,
            },
        });
    }
}
