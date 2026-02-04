import { getUsersMe, postUsersSearch } from "../api";
import type { UserPrivateProfile, UserPublicProfile } from "../api";
import { UserQueryFilters } from "../queryFilters/userQueryFilters";
import { QueryBuilder } from "../helpers/queryBuilder";
import type { ApiResult } from "@/helpers/apiResult";

export class UsersService {
    public static async getUsers(): Promise<ApiResult<UserPublicProfile[]>> {
        const query = new QueryBuilder()
        .addParameter(UserQueryFilters.IsActive(false))
        .build();

        const { data, error, response } = await postUsersSearch({ body: query });

        const result = { data: data, error: error, status: response.status } as ApiResult<UserPublicProfile[]>;

        return result;
  }

    public static async getCurrentUser(): Promise<ApiResult<UserPrivateProfile>> {
        const {data, error, response} = await getUsersMe();

         const result = { data: data, error: error, status: response.status } as ApiResult<UserPrivateProfile>;
        return result;
    }
}