import { EHandlerResult } from "../../common/bridge/EHandlerResult";
import Handler from "../../common/bridge/Handler";
import UIGameLogic from "../prefab/UIGameLogic";

export default class ClearGameHandler extends Handler {
    public uiGameLogic: UIGameLogic;
    public constructor(uiGameLogic: UIGameLogic) {
        super(uiGameLogic.node);

        this.uiGameLogic = uiGameLogic;
    }

    public handleRequest(msg: string, callback?: (...args: any[]) => void): EHandlerResult {
        if (msg === "cleargame") {
            cc.log("关闭游戏逻辑页");
            this.uiGameLogic && this.uiGameLogic.onDestroy();

            callback && callback();
        }
        return EHandlerResult.CONTINUE;
    }

}