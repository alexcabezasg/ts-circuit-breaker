export interface FuseConfig {
    errors: number;
    recovery_time_in_ms: number;
    shouldMelt: Function;
}

export interface FuseStatus {
    isOpen: boolean;
    melts: number;
    asks: number;
}

interface CircuitBreakerResponse {
    status: CircuitBreakerResponseStatus;
    response: any,
}

export enum CircuitBreakerResponseStatus {
    SUCCESS = 0,
    CIRCUIT_OPEN = 1
}