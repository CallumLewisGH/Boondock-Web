/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateUserRequest } from '../models/CreateUserRequest';
import type { ErrorModel } from '../models/ErrorModel';
import type { UpdateUserRequest } from '../models/UpdateUserRequest';
import type { UserPrivateProfile } from '../models/UserPrivateProfile';
import type { UserPublicProfile } from '../models/UserPublicProfile';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * Post users
     * @param requestBody
     * @returns UserPrivateProfile OK
     * @returns ErrorModel Error
     * @throws ApiError
     */
    public static postUsers(
        requestBody: CreateUserRequest,
    ): CancelablePromise<UserPrivateProfile | ErrorModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get users me
     * @returns UserPrivateProfile OK
     * @returns ErrorModel Error
     * @throws ApiError
     */
    public static getUsersMe(): CancelablePromise<UserPrivateProfile | ErrorModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/me',
        });
    }
    /**
     * Post users search
     * @param requestBody
     * @returns any[] OK
     * @returns ErrorModel Error
     * @throws ApiError
     */
    public static postUsersSearch(
        requestBody: any[] | null,
    ): CancelablePromise<any[] | null | ErrorModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/search',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete users by ID
     * @param id ID (UUID)
     * @returns UserPrivateProfile OK
     * @returns ErrorModel Error
     * @throws ApiError
     */
    public static deleteUsersById(
        id: string,
    ): CancelablePromise<UserPrivateProfile | ErrorModel> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/users/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Get users by ID
     * @param id ID (UUID)
     * @returns UserPublicProfile OK
     * @returns ErrorModel Error
     * @throws ApiError
     */
    public static getUsersById(
        id: string,
    ): CancelablePromise<UserPublicProfile | ErrorModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Put users by ID
     * @param id User ID (UUID)
     * @param requestBody
     * @returns UserPrivateProfile OK
     * @returns ErrorModel Error
     * @throws ApiError
     */
    public static putUsersById(
        id: string,
        requestBody: UpdateUserRequest,
    ): CancelablePromise<UserPrivateProfile | ErrorModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/users/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
