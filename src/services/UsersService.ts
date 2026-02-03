import { postUsersSearch } from "../api";
import type { UserPublicProfile } from "../api";
import { UserQueryFilters } from "../queryFilters/userQueryFilters";
import { QueryBuilder } from "../helpers/queryBuilder";

export class UsersService {
    public static async getUsers(): Promise<UserPublicProfile[]> {
        const query = new QueryBuilder()
        .addParameter(UserQueryFilters.IsActive(false))
        .build();

        const { data, error } = await postUsersSearch({ body: query });

        if (error || !data) {
            console.error('Search failed:', error);
            throw error;
        }

    return data;
  }
}