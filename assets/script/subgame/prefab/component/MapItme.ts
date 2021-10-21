import BaseObject from "../../../common/base/BaseObject";
import ResUtils from "../../../common/utils/ResUtils";
import { gameManager } from "../manager/gamemanager";

export default class MapItme extends BaseObject {

    public mapId: number = 0;
    public bgSprit: cc.Sprite;
    // public roadType: number = 0;

    constructor(id) {
        super((ResUtils.getAsset<cc.Prefab>("subgame:./prefab/mapPrefab/Road")));
        this.mapId = id;
        this.init();
        this.node["roadType"] = 0;
        this.setRoadType()
    }

    public init() {
        this.bgSprit = this.find("bg").getComponent(cc.Sprite);
        if (this.mapId == 0) {
            this.bgSprit.spriteFrame = null;
        } else {
            this.bgSprit.spriteFrame = gameManager.getSpriteFrame("subgame:./texture/map_" + this.mapId);
        }
    }

    public setRoadType() {
        switch (this.mapId) {
            case 3:
                this.node["roadType"] = 1;
                break;
            case 4:
                this.node["roadType"] = 2;
                break
            case 5:
                this.node["roadType"] = 3;
                break
            case 6:
                this.node["roadType"] = 4;
                break
            case 18:
                this.node["roadType"] = 18;
                break;
            case 19:
                this.node["roadType"] = 19;
                break
            case 20:
                this.node["roadType"] = 20;
                break
            case 21:
                this.node["roadType"] = 21;
                break
            case 17:
                this.node["roadType"] = 17;
                break;
            default:
                break;
        }
    }
}