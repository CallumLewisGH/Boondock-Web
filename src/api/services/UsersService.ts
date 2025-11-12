/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { queryfilters_QueryParameter } from '../models/queryfilters_QueryParameter';
import type { user_CreateUserRequest } from '../models/user_CreateUserRequest';
import type { user_UpdateUserRequest } from '../models/user_UpdateUserRequest';
import type { user_UserDTO } from '../models/user_UserDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * Creates a new user
     * Creates a new user with the provided details
     * @param user User details
     * @returns user_UserDTO Returns the created user
     * @throws ApiError
     */
    public static postUsers(
        user: user_CreateUserRequest,
    ): CancelablePromise<user_UserDTO> {
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
     * Returns the user with the specified ID
     * Gets the user where ID is passed in the user_id header
     * @param userId User ID to retrieve
     * @returns user_UserDTO Returns the requested user
     * @throws ApiError
     */
    public static getUsersId(
        userId: string,
    ): CancelablePromise<user_UserDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/id',
            headers: {
                'user_id': userId,
            },
            errors: {
                400: `Missing or invalid user ID header`,
                404: `User not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Updates the user with the specified ID
     * Updates the user where ID is passed in the user_id header with the provided details
     * @param userId User ID to update
     * @param user User update details
     * @returns user_UserDTO Successfully updated user
     * @throws ApiError
     */
    public static putUsersId(
        userId: string,
        user: user_UpdateUserRequest,
    ): CancelablePromise<user_UserDTO> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/users/id',
            headers: {
                'user_id': userId,
            },
            body: user,
            errors: {
                400: `Missing or invalid user ID header or invalid request body`,
                404: `User not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Deletes the user with the specified ID
     * Deletes the user where ID is passed in the user_id header
     * @param userId User ID to delete
     * @returns user_UserDTO Successfull deletion returns the model of the deleted user
     * @throws ApiError
     */
    public static deleteUsersId(
        userId: string,
    ): CancelablePromise<user_UserDTO> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/users/id',
            headers: {
                'user_id': userId,
            },
            errors: {
                400: `Missing or invalid user ID header`,
                404: `User not found`,
                500: `Internal server error`,
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
        request: Array<queryfilters_QueryParameter>,
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
}
