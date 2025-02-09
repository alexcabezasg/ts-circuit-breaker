import NodeCache from "node-cache";

export interface FuseConfig {
    errors: number;
    recovery_time_in_ms: number;
    shouldMelt: Function;
}

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