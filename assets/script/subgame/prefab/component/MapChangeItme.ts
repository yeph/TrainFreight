import BaseObject from "../../../common/base/BaseObject";
import ResUtils from "../../../common/utils/ResUtils";

export default class MapChangeItme extends BaseObject {

    mapId: number = 0;
    public callBack = null;

    private _row: number;
    public get row(): number {
        return this._row;
    }
    private _col: number;
    public get col(): number {
        return this._col;
    }

    public canChange: boolean = true;

    public roadType = 0;

    constructor(id: number, row: number, col: number, callBack) {
        super((ResUtils.getAsset<cc.Prefab>("subgame:./prefab/mapPrefab/RoadChange_" + id)));
        this.mapId = id;
        this._row = row;
        this._col = col;
        this.callBack = callBack;
        this.canChange = true;
        this.setType();
        this.init();
    }

    public init() {

        let data = {
            row: this._row,
            col: this._col,
            roadType: this.roadType
        }
        if (this.roadType == 0) return;
        this.callBack && this.callBack(data);
    }

    public onClickEvent() {
        if (this.mapId == 0) return
        if (!this.canChange) return
        this.node.children[0].active = !this.node.children[0].active;
        this.node.children[1].active = !this.node.children[0].active;
        this.setType();
        let data = {
            row: this._row,
            col: this._col,
            roadType: this.roadType
        }
        this.callBack && this.callBack(data);
    }
    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter(other, self) {
        if (other.node.name.startsWith("TrainHead")) {
            this.canChange = false;
        }
    }

    /**
     * 当碰撞结束后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionExit(other, self) {
        if (other.node.name.startsWith("xiang")) {
            this.canChange = true;
        }
    }

    public setType() {
        for (let i = 0; i < this.node.childrenCount; i++) {
            let name = this.node.children[i].name;
            if (this.node.children[i].active) {
                cc.log("name", name)
                switch (name) {
                    case "road_9":
                        this.roadType = 1;
                        break;
                    case "road_10":
                        this.roadType = 2;
                        break;
                    case "road_11":
                        this.roadType = 3;
                        break;
                    case "road_12":
                        this.roadType = 4;
                        break;
                    default:
                        break;
                }
            }
        }
    }
}