import { 
    postCampsites,
    postCampsitesSearch,
    getCampsitesById,
    patchCampsitesById,
    deleteCampsitesById,
} from "../api";
import type {
    CreateCampsiteRequest,
    UpdateCampsiteRequest,
    CampsiteProfile,
    QueryParameter,
} from "../api";
import { QueryBuilder } from "../helpers/queryBuilder";
import type { ApiResult } from "@/helpers/apiResult";

export class CampsitesService {
    /**
     * POST /campsites
     * Create a campsite.
     */
    public static async createCampsite(body: CreateCampsiteRequest): Promise<ApiResult<CampsiteProfile>> {
        const { data, error, response } = await postCampsites({ body });
        return { data, error, status: response.status } as ApiResult<CampsiteProfile>;
    }

    /**
     * POST /campsites/search
     * Search for campsites using query filters.
     */
    public static async searchCampsites(query?: QueryParameter[]): Promise<ApiResult<CampsiteProfile[]>> {
        if (!query) query = new QueryBuilder().build();
        const { data, error, response } = await postCampsitesSearch({ body: query });
        return { data, error, status: response.status } as ApiResult<CampsiteProfile[]>;
    }

    /**
     * GET /campsites/{id}
     * Fetch a campsite by ID.
     */
    public static async getCampsiteById(id: string): Promise<ApiResult<CampsiteProfile>> {
        const { data, error, response } = await getCampsitesById({ path: { id } });
        return { data, error, status: response.status } as ApiResult<CampsiteProfile>;
    }

    /**
     * PATCH /campsites/{id}
     * Update a campsite by ID.
     */
    public static async updateCampsiteById(id: string, body: UpdateCampsiteRequest): Promise<ApiResult<CampsiteProfile>> {
        const { data, error, response } = await patchCampsitesById({ path: { id }, body });
        return { data, error, status: response.status } as ApiResult<CampsiteProfile>;
    }

    /**
     * DELETE /campsites/{id}
     * Delete a campsite by ID.
     */
    public static async deleteCampsiteById(id: string): Promise<ApiResult<CampsiteProfile>> {
        const { data, error, response } = await deleteCampsitesById({ path: { id } });
        return { data, error, status: response.status } as ApiResult<CampsiteProfile>;
    }
}
