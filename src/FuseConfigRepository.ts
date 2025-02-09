import NodeCache from "node-cache";
import {FuseConfig} from "./Types";

const cache = new NodeCache({useClones: false});

export const FuseConfigRepository = {
    get: (fuseName: string): FuseConfig => {
        const config = cache.get(fuseName);
        if (!config) {
            throw new Error(`get FuseConfig: No config found for fuse ${fuseName}`);
        }
        return <FuseConfig>config;
    },

    set(fuseName: string, config: FuseConfig) {
        cache.set(fuseName, config);
    }
}