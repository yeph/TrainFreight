import { EHandlerResult } from "../../common/bridge/EHandlerResult";
import Handler from "../../common/bridge/Handler";
import { soundManager } from "../../common/manager/SoundManager";
import UIGame from "../prefab/UIGame";
import UIGuide from "../prefab/UIGuide";

export default class StartGuideHandler extends Handler {
    public uiGame: UIGame;
    public uiGuide: UIGuide;

    public constructor(uiGame: UIGame) {
        super(uiGame.node);

        this.uiGame = uiGame;
    }

    public handleRequest(msg: string, callback?: (...args: any[]) => void): EHandlerResult {
        if (msg === "startguide") {
            soundManager.stopMusic();
            soundManager.stopCurEffect();
            this.uiGuide = new UIGuide();
            this.uiGuide.startGameCallback = () => {
                this.uiGuide.node.removeFromParent();
                this.uiGuide.node.destroy();
                this.uiGuide = null;
                cc.log("即将进入倒计时哦---------");
                callback && callback();
            };
            this.uiGame.node.addChild(this.uiGuide.node);
        }
        return EHandlerResult.CONTINUE;
    }
}