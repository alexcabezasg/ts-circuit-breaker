import {FuseConfig} from "./FuseConfig";
import {FuseTimeStatus, FuseStatus} from "./FuseStatus";

const fuseConfigInMemoryCache = new Map<string, FuseConfig>();
const fuseStatusInMemoryCache = new Map<string, FuseStatus>();
const fuseTimeStatusInMemoryCache = new Map<string, FuseTimeStatus>();

export const CircuitBreakerCache = {

    setFuseConfig(fuseName: string, config: FuseConfig) {
        fuseConfigInMemoryCache.set(fuseName, config);
    },

    setFuseStatus(fuseName: string, status: FuseStatus) {
        fuseStatusInMemoryCache.set(fuseName, status);
    },

    setFuseTimeStatus(fuseName: string, status: FuseTimeStatus) {
        fuseTimeStatusInMemoryCache.set(fuseName, status);
        setInterval(() => {
            status.open_time = status.open_time - 1000 < 0 ? 0 : status.open_time - 1000;
            fuseTimeStatusInMemoryCache.set(fuseName, status);
        }, 1000)
    },

    getFuseConfig: (fuseName: string): FuseConfig => {
        const fuseConfig = fuseConfigInMemoryCache.get(fuseName);
        if (!fuseConfig) {
            throw new Error(`CircuitBreakerCache.getFuseConfig: No config found for fuse ${fuseName}`);
        }
        return fuseConfig;
    },

    getFuseStatus(fuseName: string): FuseStatus {
        const fuseStatus = fuseStatusInMemoryCache.get(fuseName);
        if (!fuseStatus) {
            throw new Error(`Unexpected error: No fuseStatus found for fuse ${fuseName}`);
        }
        return fuseStatus;
    },

    getFuseOpenTimeStatus(fuseName: string): FuseTimeStatus {
        const fuseTimeStatus = fuseTimeStatusInMemoryCache.get(fuseName);
        if (!fuseTimeStatus) {
            return {open_time: 0};
        }
        return fuseTimeStatus;
    }
}