/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type user_UserDTO = {
    authId?: string;
    bio?: string;
    createdAt?: string;
    deactivatedAt?: string;
    email?: string;
    emailVerified?: boolean;
    id?: string;
    /**
     * Status
     */
    isActive?: boolean;
    isBanned?: boolean;
    lastLogin?: string;
    /**
     * Preferences
     */
    locale?: string;
    /**
     * Profile
     */
    profilePicture?: string;
    timezone?: string;
    updatedAt?: string;
    /**
     * Authentication
     */
    username?: string;
};

