import { EHandlerResult } from "../../common/bridge/EHandlerResult";
import Handler from "../../common/bridge/Handler";
import { ViewZorder } from "../../common/const/ViewZOrder";
import { soundManager } from "../../common/manager/SoundManager";
import MasterGlobal from "../../common/MasterGlobal";
import UIGameLogic from "../prefab/UIGameLogic";
import UIGuide from "../prefab/UIGuide";

export default class ShowGuideHandler extends Handler {
    public uiGameLogic: UIGameLogic;
    public uiGuide: UIGuide;

    public constructor(uiGameLogic: UIGameLogic) {
        super(uiGameLogic.node);

        this.uiGameLogic = uiGameLogic;
    }

    public handleRequest(msg: string, callback?: (...args: any[]) => void): EHandlerResult {
        if (msg === "showguide") {
            soundManager.pauseMusic();
            soundManager.stopCurEffect();
            this.uiGuide = new UIGuide(2);
            this.uiGuide.startGameCallback = () => {
                MasterGlobal.musicon && soundManager.resumeMusic()
                this.uiGuide.node.removeFromParent();
                this.uiGuide.node.destroy();
                this.uiGuide = null;

                callback && callback();
            };
            this.uiGameLogic.node.parent.addChild(this.uiGuide.node, ViewZorder.Guide);
        }
        return EHandlerResult.CONTINUE;
    }

}