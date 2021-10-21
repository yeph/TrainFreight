import BaseObject from "../../../common/base/BaseObject";
import ResUtils from "../../../common/utils/ResUtils";

export default class ComFireWork extends BaseObject {
    public callBack;
    constructor(callBack) {
        super((ResUtils.getAsset<cc.Prefab>("subgame:./prefab/component/Firework")));
        this.callBack = callBack;
        this.node.scale = 2;
        this.node.setPosition(0, 50);
        this.scheduleOnce(() => {
            this.node.removeFromParent();
            this.node.destroy();
            this.callBack && this.callBack();
        }, 1)
    }
}