import type { QueryParameter } from "@/api";

export class CampsiteVisitQueryFilters {
    static WithIds(ids: string[]): QueryParameter {
        return {
            Name: "withids",
            Value: ids
        };
    }

    static WithOwnerId(ownerId: string): QueryParameter {
        return {
            Name: "withownerid",
            Value: [ownerId]
        };
    }

    static WithCampsiteId(campsiteId: string): QueryParameter {
        return {
            Name: "withcampsiteid",
            Value: [campsiteId]
        };
    }
}