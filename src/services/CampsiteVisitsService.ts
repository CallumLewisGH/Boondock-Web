import { 
    postCampsitesByCampsiteIdVisits,
    postVisitsSearch,
} from "../api";
import type {
    CampsiteVisitProfile,
    QueryParameter,
} from "../api";
import { QueryBuilder } from "../helpers/queryBuilder";
import type { ApiResult } from "@/helpers/apiResult";

export class CampsiteVisitsService {
    /**
     * POST /campsites/{campsiteId}/visits
     * Toggles a visit for a specific campsite for the current user.
     */
    public static async toggleVisit(campsiteId: string): Promise<ApiResult<CampsiteVisitProfile>> {
        const { data, error, response } = await postCampsitesByCampsiteIdVisits({ 
            path: { campsiteId: campsiteId }, body: {} 
        });
        return { data, error, status: response.status } as ApiResult<CampsiteVisitProfile>;
    }

    /**
     * POST /visits/search
     * Search for visits using query filters (e.g., by OwnerId to see travel history).
     */
    public static async searchVisits(query?: QueryParameter[]): Promise<ApiResult<CampsiteVisitProfile[]>> {
        if (!query) query = new QueryBuilder().build();
        const { data, error, response } = await postVisitsSearch({ body: query });
        return { data, error, status: response.status } as ApiResult<CampsiteVisitProfile[]>;
    }
}