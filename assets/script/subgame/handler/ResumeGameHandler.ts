import { EHandlerResult } from "../../common/bridge/EHandlerResult";
import Handler from "../../common/bridge/Handler";
import UIGameLogic from "../prefab/UIGameLogic";

export default class ResumeGameHandler extends Handler {
    public uiGameLogic: UIGameLogic;
    public constructor(uiGameLogic: UIGameLogic) {
        super(uiGameLogic.node);

        this.uiGameLogic = uiGameLogic;
    }

    public handleRequest(msg: string, callback?: (...args: any[]) => void): EHandlerResult {
        if (msg === "resumegame") {
            cc.log("游戏进入激活状态");
            this.uiGameLogic.onResume();
            return EHandlerResult.BREAK;
        }
        return EHandlerResult.CONTINUE;
    }

}