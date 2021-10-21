import { EHandlerResult } from "../../common/bridge/EHandlerResult";
import Handler from "../../common/bridge/Handler";
import UIGameLogic from "../prefab/UIGameLogic";

export default class TimeOverHandler extends Handler {
    public uiGameLogic: UIGameLogic;

    public constructor(uiGameLogic: UIGameLogic) {
        super(uiGameLogic.node);

        this.uiGameLogic = uiGameLogic;
    }

    public handleRequest(msg: string, callback?: (...args: any[]) => void): EHandlerResult {
        if (msg === "timeover") {
            cc.log("11111111", "倒计时结束");
            this.uiGameLogic.onGameOver();
            callback && callback();
            return EHandlerResult.CONTINUE;
        }
    }

}