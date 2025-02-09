import NodeCache from "node-cache";
import {FuseStatus} from "./Types";

const cache = new NodeCache({useClones: false});

export const FuseStatusRepository = {
    get: (fuseName: string): FuseStatus => {
        const status = cache.get(fuseName);
        if (!status) {
            throw new Error(`get FuseStatus: No status found for fuse ${fuseName}`);
        }
        return <FuseStatus>status;
    },

    set(fuseName: string, status: FuseStatus) {
        cache.set(fuseName, status);
    }
}