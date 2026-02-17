import { 
    postCampsitesByIdReviews,
    postReviewsSearch,
    getReviewsById,
    patchReviewsById,
    deleteReviewsById,
} from "../api";
import type {
    CreateCampsiteReviewRequest,
    UpdateCampsiteReviewRequest,
    CampsiteReviewProfile,
    QueryParameter,
} from "../api";
import { QueryBuilder } from "../helpers/queryBuilder";
import type { ApiResult } from "@/helpers/apiResult";

export class CampsiteReviewsService {
    /**
     * POST /campsites/{id}/reviews
     * Create a review for a specific campsite.
     */
    public static async createReview(campsiteId: string, body: CreateCampsiteReviewRequest): Promise<ApiResult<CampsiteReviewProfile>> {
        const { data, error, response } = await postCampsitesByIdReviews({ 
            path: { id: campsiteId }, 
            body 
        });
        return { data, error, status: response.status } as ApiResult<CampsiteReviewProfile>;
    }

    /**
     * POST /reviews/search
     * Search for reviews using query filters (e.g., by CampsiteId or OwnerId).
     */
    public static async searchReviews(query?: QueryParameter[]): Promise<ApiResult<CampsiteReviewProfile[]>> {
        if (!query) query = new QueryBuilder().build();
        const { data, error, response } = await postReviewsSearch({ body: query });
        return { data, error, status: response.status } as ApiResult<CampsiteReviewProfile[]>;
    }

    /**
     * GET /reviews/{id}
     * Fetch a single review by its own ID.
     */
    public static async getReviewById(id: string): Promise<ApiResult<CampsiteReviewProfile>> {
        const { data, error, response } = await getReviewsById({ path: { id } });
        return { data, error, status: response.status } as ApiResult<CampsiteReviewProfile>;
    }

    /**
     * PATCH /reviews/{id}
     * Update a review by ID.
     */
    public static async updateReviewById(id: string, body: UpdateCampsiteReviewRequest): Promise<ApiResult<CampsiteReviewProfile>> {
        const { data, error, response } = await patchReviewsById({ path: { id }, body });
        return { data, error, status: response.status } as ApiResult<CampsiteReviewProfile>;
    }

    /**
     * DELETE /reviews/{id}
     * Delete a review by ID.
     */
    public static async deleteReviewById(id: string): Promise<ApiResult<CampsiteReviewProfile>> {
        const { data, error, response } = await deleteReviewsById({ path: { id } });
        return { data, error, status: response.status } as ApiResult<CampsiteReviewProfile>;
    }
}