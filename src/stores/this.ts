import { postUsersSearch } from '@/api/sdk.gen';
import { QueryBuilder } from '@/helpers/queryBuilder'
import { UserQueryFilters } from '@/queryFilters/userQueryFilters';
import { defineStore } from 'pinia'

export const thingy = defineStore('this', () => {
    async function usersSearch() {
        const query = new QueryBuilder()
        .addParameter(UserQueryFilters.IsActive(false))
        .build();

        const { response, error } = await postUsersSearch({ body: query });

        if (error) {
        console.error('Search failed:', error);
        throw error;
    }

    return response;
  }

    return { usersSearch };
})