import { EHandlerResult } from "../../common/bridge/EHandlerResult";
import Handler from "../../common/bridge/Handler";
import UIGameLogic from "../prefab/UIGameLogic";

export default class PauseGameHandler extends Handler {
    public uiGameLogic: UIGameLogic;
    public constructor(uiGameLogic: UIGameLogic) {
        super(uiGameLogic.node);

        this.uiGameLogic = uiGameLogic;
    }

    public handleRequest(msg: string, callback?: (...args: any[]) => void): EHandlerResult {
        if (msg === "pausegame") {
            cc.log("游戏进入暂停状态");
            this.uiGameLogic.onPause();
            return EHandlerResult.BREAK;
        }
        return EHandlerResult.CONTINUE;
    }

}