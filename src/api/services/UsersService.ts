/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { queryFilter_QueryParameter } from '../models/queryFilter_QueryParameter';
import type { requests_CreateUserRequest } from '../models/requests_CreateUserRequest';
import type { requests_UpdateUserRequest } from '../models/requests_UpdateUserRequest';
import type { responses_UserPrivateProfileResponse } from '../models/responses_UserPrivateProfileResponse';
import type { responses_UserPublicProfileResponse } from '../models/responses_UserPublicProfileResponse';
import type { user_UserDTO } from '../models/user_UserDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * Creates a new user
     * Creates a new user with the provided details
     * @param user User details
     * @returns responses_UserPrivateProfileResponse Returns the created user
     * @throws ApiError
     */
    public static postUsers(
        user: requests_CreateUserRequest,
    ): CancelablePromise<responses_UserPrivateProfileResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users',
            body: user,
            errors: {
                400: `Invalid request body`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Get current authenticated user
     * Returns information about the currently authenticated user
     * @returns responses_UserPrivateProfileResponse Returns user object
     * @throws ApiError
     */
    public static getUsersMe(): CancelablePromise<responses_UserPrivateProfileResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/me',
            errors: {
                401: `Unauthorized`,
                404: `User not found`,
            },
        });
    }
    /**
     * Get users with filtering and pagination
     * Retrieves a list of users based on query filters
     * @param request Query filters for users
     * @returns user_UserDTO Returns the list of users
     * @throws ApiError
     */
    public static postUsersSearch(
        request: Array<queryFilter_QueryParameter>,
    ): CancelablePromise<Array<user_UserDTO>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/search',
            body: request,
            errors: {
                400: `Invalid request body`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Returns the user with the specified ID
     * Gets the user where ID is passed as a path parameter
     * @param id User ID to retrieve
     * @returns responses_UserPublicProfileResponse Returns the requested user
     * @throws ApiError
     */
    public static getUsers(
        id: string,
    ): CancelablePromise<responses_UserPublicProfileResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Invalid user ID format`,
                404: `User not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Updates the user with the specified ID
     * Updates the user where ID is passed as a path parameter
     * @param id User ID to update
     * @param user User update details
     * @returns responses_UserPrivateProfileResponse Successfully updated user
     * @throws ApiError
     */
    public static putUsers(
        id: string,
        user: requests_UpdateUserRequest,
    ): CancelablePromise<responses_UserPrivateProfileResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/users/{id}',
            path: {
                'id': id,
            },
            body: user,
            errors: {
                400: `Invalid user ID or request body`,
                404: `User not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Deletes the user with the specified ID
     * Deletes the user where ID is passed as a path parameter
     * @param id User ID to delete
     * @returns responses_UserPrivateProfileResponse Successfully deleted user
     * @throws ApiError
     */
    public static deleteUsers(
        id: string,
    ): CancelablePromise<responses_UserPrivateProfileResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/users/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Invalid user ID format`,
                404: `User not found`,
                500: `Internal server error`,
            },
        });
    }
}
