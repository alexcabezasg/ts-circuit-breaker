# @alexcabezas0/circuit-breaker

## Usage

```typescript
import {CircuitBreaker, CircuitBreakerResponseStatus} from "@alexcabezas0/circuit-breaker";

CircuitBreaker.installFuse("<FUSE_NAME>", {
    errors: 5, // Number of errors to tolerate before open the circuit
    recovery_time_in_ms: 1000, // Number of ms that the circuit will be open
    shouldMelt: (response) => response.status == 500 // Function to check if the circuit should melt
})

const cb = CircuitBreaker.execute("<FUSE_NAME>", () => httpclient.get());
if (cb.status == CircuitBreakerResponseStatus.SUCCESS) {
    res.json(cb.response) // actual data coming from downstream
    // Procced
} else {
    // Return default, error, or whatever
}
```

## Notes
- The `fuse_name` represents the piece of code you want to protect (for example, a call to a store http client)
- The circuit will melt as many times as errors are tolerated. After that, it will be open the amount of time described
in the `recovery_time_in_ms`
