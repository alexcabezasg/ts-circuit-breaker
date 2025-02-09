import {FuseConfig} from "./FuseConfig";
import {CircuitBreakerCache} from "./CircuitBreakerCache";

enum CircuitBreakerResponseStatus {
    CIRCUIT_OPEN = 0,
    SUCCESS = 1,
}

interface CircuitBreakerResponse {
    status: CircuitBreakerResponseStatus;
    response: any,
}

export const CircuitBreaker = {
    installFuse: (fuse: string, config: FuseConfig) => {
        CircuitBreakerCache.setFuseConfig(fuse, config);
        CircuitBreakerCache.setFuseStatus(fuse, {
            melts: 0,
            asks: 0,
        });
    },

    execute: async (fuseName: string, fun: Function): Promise<CircuitBreakerResponse> => {
        const fuseConfig = CircuitBreakerCache.getFuseConfig(fuseName);
        const fuseStatus = CircuitBreakerCache.getFuseStatus(fuseName);
        const fuseTimeStatus = CircuitBreakerCache.getFuseOpenTimeStatus(fuseName);

        if (fuseTimeStatus.open_time > 0) {
            return {status: CircuitBreakerResponseStatus.CIRCUIT_OPEN, response: {error: "circuit open"}}
        }

        const result = await fun();
        if (fuseConfig.shouldMelt(result)) {
            fuseStatus.melts++;
            if (fuseStatus.melts > fuseConfig.errors) {
                fuseStatus.melts = 0;
                console.error(`Circuit open for fuse ${fuseName}`)
                CircuitBreakerCache.setFuseTimeStatus(fuseName, {open_time: fuseConfig.recovery_time_in_ms});
                CircuitBreakerCache.setFuseStatus(fuseName, fuseStatus);
                return {status: CircuitBreakerResponseStatus.CIRCUIT_OPEN, response: {error: "circuit open"}};
            }
        } else {
            fuseStatus.asks++;
        }

        CircuitBreakerCache.setFuseStatus(fuseName, fuseStatus);
        return {status: CircuitBreakerResponseStatus.SUCCESS, response: result};
    }
}