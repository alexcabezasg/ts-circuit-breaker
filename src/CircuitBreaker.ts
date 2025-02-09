import {FuseConfig, FuseConfigRepository} from "./FuseConfig";
import {FuseStatusRepository} from "./FuseStatus";
import {Circuit} from "./Circuit";

interface CircuitBreakerResponse {
    status: CircuitBreakerResponseStatus;
    response: any,
}

export enum CircuitBreakerResponseStatus {
    CIRCUIT_OPEN = 0,
    SUCCESS = 1,
}

export const CircuitBreaker = {
    installFuse: (fuse: string, config: FuseConfig) => {
        FuseConfigRepository.set(fuse, config);
        FuseStatusRepository.set(fuse, {
            melts: 0,
            asks: 0,
            isOpen: false
        });
    },

    execute: async (fuseName: string, fun: Function): Promise<CircuitBreakerResponse> => {
        const fuseConfig = FuseConfigRepository.get(fuseName);
        const fuseStatus = FuseStatusRepository.get(fuseName);

        if (fuseStatus.isOpen) {
            return {status: CircuitBreakerResponseStatus.CIRCUIT_OPEN, response: {error: "circuit open"}}
        }

        const result = await fun();
        if (fuseConfig.shouldMelt(result)) {
            fuseStatus.melts++;
            if (fuseStatus.melts > fuseConfig.errors) {
                fuseStatus.melts = 0;
                fuseStatus.isOpen = true;
                Circuit.open(fuseName, fuseConfig.recovery_time_in_ms);
                console.error(`Circuit open for fuse ${fuseName}`)
                return {status: CircuitBreakerResponseStatus.CIRCUIT_OPEN, response: {error: "circuit open"}};
            }
        } else {
            fuseStatus.asks++;
        }

        return {status: CircuitBreakerResponseStatus.SUCCESS, response: result};
    }
}