import type { QueryParameter } from "@/api";

export class CampsiteQueryFilters {
    static VisitedByUserId(userId: string): QueryParameter {
        return {
            Name: "visitedbyuserid",
            Value: [userId]
        };
    }
    static WithNames(names: string[]): QueryParameter {
        return {
            Name: "withnames",
            Value: names
        };
    }

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

    static WithinRadius(lat: number, lon: number, radiusKm: number): QueryParameter {
        return {
            Name: "withinradius",
            Value: [lat.toString(), lon.toString(), radiusKm.toString()]
        };
    }

    static Empty(): QueryParameter {
        return {
            Name: "",
            Value: []
        };
    }
}
