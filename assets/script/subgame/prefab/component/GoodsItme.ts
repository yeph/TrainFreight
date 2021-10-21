import BaseObject from "../../../common/base/BaseObject";
import EventMng from "../../../common/manager/EventMng";
import ResUtils from "../../../common/utils/ResUtils";
import cfg from "../../../common/vo/ConfigReader";
import { gameManager } from "../manager/gamemanager";

export default class GoodsItme extends BaseObject {

    public goodsType: number = 0; //货物类型
    public isGuide;

    constructor(id, isGuide: boolean = false) {
        super((ResUtils.getAsset<cc.Prefab>("subgame:./prefab/goods/goods_" + id)));
        this.goodsType = id;
        cc.log(id)
        this.isGuide = isGuide;
        EventMng.on("showGoods", this.showGoods, this);
        EventMng.on("showGuideGoods", this.showGuideGoods, this);
        if (!this.isGuide) {
            if (gameManager.isShowRed) {
                if (this.goodsType == 4) {
                    this.node.getComponent(cc.BoxCollider).enabled = false;
                }
            } else {
                if (this.goodsType == 3) {
                    this.node.getComponent(cc.BoxCollider).enabled = false;
                }
            }
        }

        if (this.goodsType == 1) {
            this.node.name = "redHouse";
            if (gameManager.redFullFoods) {
                this.node.getChildByName("markBg").active = true;
            }
        }
        if (this.goodsType == 2) {
            this.node.name = "blueHouse";
            if (gameManager.blueFullFoods) {
                this.node.getChildByName("markBg").active = true;
            }
        }
        // cc.log("gameManager.redFullFoods", gameManager.redFullFoods);
        // cc.log("gameManager.blueFullFoods", gameManager.blueFullFoods);

        if (gameManager.redFullFoods || gameManager.blueFullFoods) {
            // cc.log("this.goosTpye", this.goodsType);
            if (this.goodsType == 4 || this.goodsType == 3) {
                this.node.getComponent(cc.BoxCollider).enabled = false;
                this.node.opacity = 0;
            }
        }

        if (this.goodsType == 3 || this.goodsType == 4) {
            this.node.opacity = 0;
        }
    }

    start() {

    }
    showGoods() {
        // cc.log("生成货物-------------->>>>>>>>");
        cc.Tween.stopAllByTarget(this.node);
        if (gameManager.isShowRed) { //显示红货
            if (this.goodsType == 3) { //红货
                // this.node.active = true;
                if (gameManager.blueFullFoods) return;
                this.node.getComponent(cc.BoxCollider).enabled = true;
                this.node.opacity = 255;

                // cc.tween(this.node).to(0.3, { scale: 1 }, { easing: cc.easing.backIn }).call(() => {
                //     // cc.tween(this.node).to(0.5, { scale: 1 }).call(() => {
                //     //     cc.log("生成红色货物------->>>>>>>")
                //     // }).start();
                // }).start();
                this.node.runAction(cc.sequence(
                    cc.scaleTo(0.2, 1.1), cc.scaleTo(0.1, 0.9), cc.callFunc(() => {

                    })
                ));
            }

        } else {
            if (this.goodsType == 4) { //蓝货
                // this.node.active = true;
                if (gameManager.redFullFoods) return;
                this.node.getComponent(cc.BoxCollider).enabled = true;
                this.node.opacity = 255;
                // cc.tween(this.node).to(0.3, { scale: 1 }, { easing: cc.easing.backIn }).call(() => {
                //     // cc.tween(this.node).to(0.5, { scale: 1 }).call(() => {
                //     //     cc.log("生成蓝色货物------->>>>>>>")
                //     // }).start();
                // }).start();
                this.node.runAction(cc.sequence(
                    cc.scaleTo(0.2, 1.1), cc.scaleTo(0.1, 0.9), cc.callFunc(() => {

                    })
                ));
            }
        }
    }

    showGuideGoods() {
        cc.Tween.stopAllByTarget(this.node);
        if (gameManager.isShowRed) { //显示红货
            if (this.goodsType == 7) { //红货
                // this.node.active = true;
                if (gameManager.blueFullFoods) return;
                this.node.getComponent(cc.BoxCollider).enabled = true;
                this.node.opacity = 255;
                this.node.scale = 0;
                // cc.tween(this.node).to(0.3, { scale: 1 }, { easing: cc.easing.backIn }).call(() => {
                //     // cc.tween(this.node).to(0.5, { scale: 1 }).call(() => {
                //     //     cc.log("生成红色货物------->>>>>>>")
                //     // }).start();
                // }).start();
                this.node.runAction(cc.sequence(
                    cc.scaleTo(0.2, 1.1), cc.scaleTo(0.1, 0.9), cc.callFunc(() => {

                    })
                ));
            }

        }
    }

    /**
 * 当碰撞产生的时候调用
 * @param  {Collider} other 产生碰撞的另一个碰撞组件
 * @param  {Collider} self  产生碰撞的自身的碰撞组件
 */
    onCollisionEnter(other, self) {
        // console.log('on collision enter', other);
    }

    onDestroy() {
        EventMng.off("showGoods", this.showGoods, this);
        EventMng.off("showGuideGoods", this.showGuideGoods, this);
    }

    update(dt) {

    }
}