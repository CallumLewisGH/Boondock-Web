/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DatabaseService {
    /**
     * Returns the state of the connected database
     * Gets the state of the connected database
     * @returns string Returns database health status
     * @throws ApiError
     */
    public static getDatabaseHealth(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/database/health',
        });
    }
    /**
     * Runs the migrations from GORM
     * Runs the database migrations from GORM
     * @returns string Retuns success message
     * @throws ApiError
     */
    public static postDatabaseMigrations(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/database/migrations',
            errors: {
                500: `Retuns any errors`,
            },
        });
    }
}
