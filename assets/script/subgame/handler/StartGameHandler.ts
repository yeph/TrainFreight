import { EHandlerResult } from "../../common/bridge/EHandlerResult";
import Handler from "../../common/bridge/Handler";
import UIGameLogic from "../prefab/UIGameLogic";
import UIGame from "../prefab/UIGame";

export default class StartGameHandler extends Handler {
    public uiGame: UIGame;
    public constructor(uiGame: UIGame) {
        super(uiGame.node);

        this.uiGame = uiGame;
    }

    public handleRequest(msg: string, callback?: (...args: any[]) => void): EHandlerResult {
        if (msg === "startgame") {
            cc.log("进入正式的游戏逻辑页");
            let uiGameLogic: UIGameLogic = new UIGameLogic();
            this.uiGame.node.addChild(uiGameLogic.node);
        }
        return EHandlerResult.CONTINUE;
    }

}