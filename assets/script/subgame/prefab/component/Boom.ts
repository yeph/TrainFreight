import BaseObject from "../../../common/base/BaseObject";
import EventMng from "../../../common/manager/EventMng";
import ResUtils from "../../../common/utils/ResUtils";
import cfg from "../../../common/vo/ConfigReader";
import { gameManager } from "../manager/gamemanager";

export default class Boom extends BaseObject {

    public callBack;
    constructor(callBack) {
        super((ResUtils.getAsset<cc.Prefab>("subgame:./prefab/component/Boom")));
        this.callBack = callBack;
    }

    start() {
        let anim = this.node.getComponent(cc.Animation);
        if (!anim) return
        anim.play();

        anim.on("finished", () => {
            this.callBack && this.callBack();
            this.node.destroy();
        })
    }
    onDestroy() {

    }

    update(dt) {

    }
}