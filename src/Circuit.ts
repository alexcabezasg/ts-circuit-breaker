import NodeCache from "node-cache";
import {FuseStatusRepository} from "./FuseStatusRepository";

const openCircuits = new NodeCache({checkperiod: 1});

export const Circuit = {
    open: (fuseName: string, recoveryTime: number) => {
        openCircuits.set(fuseName, recoveryTime, recoveryTime / 1000);
        // @ts-ignore
        openCircuits.on("expired", (fuse: string, _value: number) => {
            const fuseStatus = FuseStatusRepository.get(fuse)
            fuseStatus.isOpen = false;
        });
    }
}