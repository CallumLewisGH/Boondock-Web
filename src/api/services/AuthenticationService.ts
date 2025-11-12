/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { user_UserDTO } from '../models/user_UserDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthenticationService {
    /**
     * Google OAuth2 callback
     * Handles the callback from Google OAuth2, creates user if new, and sets JWT cookie
     * @param state OAuth state token
     * @param code OAuth authorization code
     * @returns void
     * @throws ApiError
     */
    public static postAuthenticationCallback(
        state: string,
        code: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/authentication/callback',
            query: {
                'state': state,
                'code': code,
            },
            errors: {
                302: `Redirects to /home on success`,
                400: `Invalid state token`,
                409: `Returns error if username derived from email is already in use`,
                500: `Returns error if token exchange, user info fetch, or JWT generation fails`,
            },
        });
    }
    /**
     * Initiate Google OAuth2 login
     * Redirects to Google's OAuth2 consent page
     * @returns void
     * @throws ApiError
     */
    public static getAuthenticationLogin(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/authentication/login',
            errors: {
                302: `Redirects to Google OAuth`,
                500: `Returns error if session state cannot be generated`,
            },
        });
    }
    /**
     * Logout current user
     * Clears the JWT cookie, effectively logging out the user
     * @returns any Returns success message
     * @throws ApiError
     */
    public static postAuthenticationLogout(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/authentication/logout',
        });
    }
    /**
     * Get authenticated user info
     * Returns information about the currently authenticated user
     * @returns user_UserDTO Returns user object
     * @throws ApiError
     */
    public static getAuthenticationUser(): CancelablePromise<user_UserDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/authentication/user',
            errors: {
                404: `User not found`,
            },
        });
    }
}
