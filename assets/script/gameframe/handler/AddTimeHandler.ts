import { EHandlerResult } from "../../common/bridge/EHandlerResult";
import Handler from "../../common/bridge/Handler";
import Clock from "../logic/ui/common/Clock";

export default class AddTimeHandler extends Handler {
    public clock: Clock;
    public constructor(clock: Clock) {
        super(clock.node);

        this.clock = clock;
    }

    public handleRequest(msg: string, callback?: (...args: any[]) => void): EHandlerResult {
        if (msg.startsWith("addtime")) {
            let txtArr: string[] = msg.split(":");
            let addTime: number = +txtArr[1];
            let isAnim: boolean = !(+txtArr[2] == 0);

            this.clock.addTime(addTime, isAnim);
        }
        return EHandlerResult.CONTINUE;
    }

}