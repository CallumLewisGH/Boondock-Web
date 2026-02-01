/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ErrorModel } from '../models/ErrorModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DatabaseService {
    /**
     * Get database health
     * @returns string OK
     * @returns ErrorModel Error
     * @throws ApiError
     */
    public static getDatabaseHealth(): CancelablePromise<string | ErrorModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/database/health',
        });
    }
    /**
     * Post database migrations
     * @returns string OK
     * @returns ErrorModel Error
     * @throws ApiError
     */
    public static postDatabaseMigrations(): CancelablePromise<string | ErrorModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/database/migrations',
        });
    }
}
