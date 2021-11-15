import BaseObject from "../../../common/base/BaseObject";
import EventMng from "../../../common/manager/EventMng";
import { soundManager } from "../../../common/manager/SoundManager";
import MasterGlobal from "../../../common/MasterGlobal";
import ResUtils from "../../../common/utils/ResUtils";
import cfg from "../../../common/vo/ConfigReader";
import simpleGameBridge from "../../SimpleGameBridge";
import { gameManager } from "../manager/gamemanager";
import Boom from "./Boom";
import { Tips } from "./Tips";

export default class TrainCtrl extends BaseObject {

    public trainType: number = 0; //火车方向
    public canMove: boolean = false;  //是否能移动
    public nextRoad: cc.Node;   //下一步位置
    public nowRoad: cc.Node;    //当前位置
    public roadLayout: cc.Node;  //铁路
    public trainIndex: number = 0;
    public nextIndex: number = 0;
    public row: number;
    public col: number;
    public type: number = 0; // 1-红车 2-蓝车 

    public endPos: cc.Vec2; //下一步的坐标
    public startPos: cc.Vec2; //小车现在的坐标
    public needMoveDistance: number; //需要移动的距离
    public speed: number;
    public callBack;
    public ScoreProgress;
    public isGuide;

    public isFullFoods: boolean = false;
    public isGuideFullFoods: boolean = false;
    constructor(id, roadLayout, index, row, col, callBack, ScoreProgress, isGuide: boolean = false) {
        super((ResUtils.getAsset<cc.Prefab>("subgame:./prefab/mapPrefab/TrainHead_" + id)));
        this.isGuide = isGuide;
        this.callBack = callBack;
        this.roadLayout = roadLayout;
        this.trainIndex = index;
        this.ScoreProgress = ScoreProgress;
        this.nowRoad = this.roadLayout.children[this.trainIndex];
        this.setType(id);
        this.row = row;
        this.col = col;
        this.startPos = this.node.getPosition();
        this.getNextRoad();
        if (id > 0 && id < 5) {
            this.type = 2;
            this.speed = gameManager.speedBlue;
            this.isFullFoods = gameManager.blueFullFoods;
        } else if (id >= 5) {
            this.type = 1;
            this.speed = gameManager.speedRed;
            this.isFullFoods = gameManager.redFullFoods;
            this.isGuideFullFoods = gameManager.redGuideFullFoods;
        } else {
            this.type = 0;
        }

        // if (id == 0) return;
        // cc.log("this.row", this.row)
        // cc.log("this.col", this.col)

        // cc.log("id", id)
        // cc.log("this.trainType", this.trainType)
        // cc.log("当前的火车位置", this.trainIndex);
        // cc.log("下一步火车位置", this.nextIndex);
    }

    start() {
        if (this.trainType != 0) {
            this.scheduleOnce(() => {
                this.moveTrain();
                this.scheduleOnce(() => {
                    if (!this.isGuide) {
                        EventMng.emit("showGoods");
                    }
                }, 1)
            }, 2)
        }
    }

    public setType(type) {
        switch (type) {
            case 1:
                this.trainType = 1;
                break;
            case 5:
                this.trainType = 1;
                break;
            case 2:
                this.trainType = 2;
                break;
            case 6:
                this.trainType = 2;
                break;
            case 3:
                this.trainType = 3;
                break;
            case 7:
                this.trainType = 3;
                break;
            case 4:
                this.trainType = 4;
                break;
            case 8:
                this.trainType = 4;
                break;
            default:
                break;
        }
    }

    public getNextRoad() {
        if (this.trainType == 0) return;
        switch (this.trainType) {
            case 1:
                this.col += 1;
                break;
            case 2:
                this.row += 1;
                break;
            case 3:
                this.col -= 1;
                break;
            case 4:
                this.row -= 1;
                break;
            default:
                break;
        }
        if (this.isGuide) {
            this.nextIndex = this.row * MasterGlobal.config.mapConfig[0].roadChange[0].length + this.col;
        } else {
            this.nextIndex = this.row * cfg.roadChange[0].length + this.col;
        }
        if (this.roadLayout.children[this.nextIndex]) {
            this.nextRoad = this.roadLayout.children[this.nextIndex];
        }
    }

    public moveTrain() {
        if (!this.nextRoad) return
        this.endPos = this.nextRoad.getPosition();
        this.needMoveDistance = this.startPos.sub(this.nextRoad.getPosition()).mag();
        let v = 0;
        if (this.type) {
            if (this.type == 1) {
                v = gameManager.speedRed;
            }
            if (this.type == 2) {
                v = gameManager.speedBlue;
            }
        }
        let times = this.needMoveDistance / v;
        let moveToPos = cc.v3(this.endPos.x, this.endPos.y, 0);
        // cc.tween(this.node).to(times, { position: moveToPos }).call(() => {
        //     this.changeTrainDir();
        // }).start();
        this.canMove = true;
    }

    public changeTrainDir() {
        // cc.log("this.trainType", this.trainType)
        // cc.log("roadType", this.nextRoad["roadType"])
        //@ts-ignore
        // cc.log("当前的路的类型", this.nextRoad.roadType)
        switch (this.trainType) {
            case 1:
                //@ts-ignore
                switch (this.nextRoad["roadType"]) {

                    case 2:

                        break;
                    case 1:

                        break;
                    case 3:
                        this.trainType = 2;
                        this.node.angle -= 90;
                        break;
                    case 4:
                        this.trainType = 4;
                        this.node.angle += 90;
                        break;
                    case 18:
                        this.trainType = 2;
                        this.node.angle -= 90;
                        break;
                    default:
                        break;
                }
                break;
            case 2:
                //@ts-ignore
                switch (this.nextRoad["roadType"]) {

                    case 2:
                        this.trainType = 1;
                        this.node.angle += 90;
                        break;
                    case 1:

                        break;
                    case 3:

                        break;
                    case 4:
                        this.trainType = 3;
                        this.node.angle -= 90;
                        break;
                    case 21:
                        this.trainType = 1;
                        this.node.angle += 90;
                        break;
                    default:
                        break;
                }
                break;
            case 3:
                //@ts-ignore
                switch (this.nextRoad["roadType"]) {

                    case 2:
                        this.trainType = 4;
                        this.node.angle -= 90;
                        break;
                    case 1:
                        this.trainType = 2;
                        this.node.angle += 90;
                        break;
                    case 3:

                        break;
                    case 4:

                        break;
                    case 20:
                        this.trainType = 2;
                        this.node.angle += 90;
                        break;
                    default:
                        break;
                }
                break;
            case 4:
                //@ts-ignore
                switch (this.nextRoad["roadType"]) {

                    case 2:

                        break;
                    case 1:
                        this.trainType = 1;
                        this.node.angle -= 90;
                        break;
                    case 3:
                        this.trainType = 3;
                        this.node.angle += 90;
                        break;
                    case 4:

                        break;
                    case 19:
                        this.trainType = 3;
                        this.node.angle += 90;
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }

        this.getNextRoad();
        this.moveTrain();
    }

    /**
    * 当碰撞产生的时候调用
    * @param  {Collider} other 产生碰撞的另一个碰撞组件
    * @param  {Collider} self  产生碰撞的自身的碰撞组件
    */
    onCollisionEnter(other, self) {
        // console.log('on collision enter', other);
        if (this.node.parent.parent.name != other.node.parent.parent.name) return;
        if (this.isGuide) { //引导状态 火车碰到 卸货区 和 装货区
            if (other.node.name.startsWith("goods_5")) {//出红货
                if (this.type == 1) {
                    if (this.isGuideFullFoods) {
                        // soundManager.playFx("resources:music/wupingfangxia");
                        this.isGuideFullFoods = false;
                        gameManager.redGuideFullFoods = false;
                        gameManager.isShowRed = true;
                        gameManager.boxGuideUrl = "train_red_carriage1";
                        // EventMng.emit("showGoods");
                        EventMng.emit("showGuideRedGoods");
                    }
                }
            }

            if (other.node.name.startsWith("goods_3")) {//生成红色货物 引导状态
                if (this.type == 1) {
                    if (!this.isGuideFullFoods) {
                        // soundManager.playFx("resources:music/wupingzhuangshang");
                        this.isGuideFullFoods = true;
                        gameManager.redGuideFullFoods = true;
                        gameManager.boxGuideUrl = "train_red_carriage";
                        cc.Tween.stopAllByTarget(other.node);
                        other.node.opacity = 0;
                        other.node.getComponent(cc.BoxCollider).enabled = false;
                        gameManager.isShowRed = true;
                        // EventMng.emit("showGoods");
                        EventMng.emit("showGuideRedGoods");
                    }
                }
            }

            if (other.node.name.startsWith("goods_7")) {//生成红色货物 引导状态
                if (this.type == 1) {
                    if (!this.isGuideFullFoods) {
                        // soundManager.playFx("resources:music/wupingzhuangshang");
                        this.isGuideFullFoods = true;
                        gameManager.redGuideFullFoods = true;
                        gameManager.boxGuideUrl = "train_red_carriage";
                        cc.Tween.stopAllByTarget(other.node);
                        other.node.opacity = 0;
                        other.node.getComponent(cc.BoxCollider).enabled = false;
                        gameManager.isShowRed = true;
                        // EventMng.emit("showGoods");
                        EventMng.emit("showGuideRedGoods");
                    }
                }
            }
        } else {
            if (other.node.name.startsWith("goods_5")) {//出红货
                if (this.type == 1) {
                    if (this.isFullFoods) {
                        soundManager.playFx("resources:music/wupingfangxia");
                        this.isFullFoods = false;
                        gameManager.redFullFoods = false;
                        gameManager.boxUrl = "train_red_carriage1";
                        EventMng.emit("showGoods");
                        EventMng.emit("showRedGoods");
                    }
                }
            }
            if (other.node.name.startsWith("goods_6")) {//出蓝货
                if (this.type == 2) {
                    if (this.isFullFoods) {
                        soundManager.playFx("resources:music/wupingfangxia");
                        this.isFullFoods = false;
                        gameManager.blueFullFoods = false;
                        gameManager.boxUrl = "train_bule_carriage1";
                        EventMng.emit("showGoods");
                        EventMng.emit("showBlueGoods");
                    }
                }
            }

            if (other.node.name.startsWith("goods_3")) { //碰到红货
                if (this.type == 1) {
                    if (!this.isFullFoods) {
                        gameManager.errorCount = 0;
                        soundManager.playFx("resources:music/wupingzhuangshang");
                        // this.scheduleOnce(() => {
                        //     soundManager.playFx("resources:music/wuwuwu");
                        // }, 0.5)
                        this.isFullFoods = true;
                        gameManager.redFullFoods = true;
                        gameManager.boxUrl = "train_red_carriage";
                        cc.Tween.stopAllByTarget(other.node);
                        other.node.opacity = 0;
                        other.node.getComponent(cc.BoxCollider).enabled = false;
                        gameManager.isShowRed = false;
                        EventMng.emit("showRedGoods");
                    }
                } else if (this.type == 2) {
                    if (gameManager.errorCount == 2) {
                        soundManager.playFx("resources:music/tipRed");
                        this.showTips(2, "红色的货物只能由红色的小火车拾起哦")
                        gameManager.errorCount = 0;
                    } else {
                        gameManager.errorCount += 1;
                    }
                }
            }
            if (other.node.name.startsWith("goods_4")) {//碰到蓝货
                if (this.type == 2) {
                    if (!this.isFullFoods) {
                        gameManager.errorCount = 0;
                        soundManager.playFx("resources:music/wupingzhuangshang");
                        // this.scheduleOnce(() => {
                        //     soundManager.playFx("resources:music/wuwuwu");
                        // }, 0.5)
                        this.isFullFoods = true;
                        gameManager.blueFullFoods = true;
                        gameManager.boxUrl = "train_bule_carriage";
                        cc.Tween.stopAllByTarget(other.node);
                        other.node.opacity = 0;
                        other.node.getComponent(cc.BoxCollider).enabled = false;
                        gameManager.isShowRed = true;
                        EventMng.emit("showBlueGoods");
                    }
                } else if (this.type == 1) {
                    if (gameManager.errorCount == 2) {
                        soundManager.playFx("resources:music/tipBlue");
                        this.showTips(1, "蓝色的货物只能由蓝色的小火车拾起哦")
                        gameManager.errorCount = 0;
                    } else {
                        gameManager.errorCount += 1;
                    }
                }
            }
        }


        if (other.node.name.startsWith("TrainHead")) {
            cc.log("碰到车头啦")
            if (other.node["belongType"] != this.type && this.type == 2) {
                if (!this.isGuide) {
                    soundManager.playFx("resources:music/wboom");
                }
                gameManager.speedBlue = 0;
                gameManager.speedRed = 0;

                if (!this.isGuide) {
                    gameManager.redFullFoods = false;
                    gameManager.blueFullFoods = false;
                    this.isFullFoods = false;
                }

                let boom = new Boom(() => {
                    this.callBack && this.callBack();
                });
                this.node.addChild(boom.node)
                switch (this.trainType) {
                    case 1:
                        boom.node.setPosition(-35, 0);
                        break;
                    case 2:
                        boom.node.setPosition(0, -35);
                        break;
                    case 3:
                        boom.node.setPosition(35, 0);
                        break;
                    case 4:
                        boom.node.setPosition(0, 35);
                        break;
                    default:
                        break;
                }
                if (!gameManager.isPeng) {
                    if (gameManager.isShowGuide) return;
                    gameManager.isPeng = true;
                    MasterGlobal.data["errorCount"] += 1;
                    simpleGameBridge.sendMessage("addscore:" + (-cfg.errorScore));
                     this.ScoreProgress.setProgressBar(-cfg.errorScore);
                }
            }
        }

        if (other.node.name.startsWith("xiang")) {
            if (other.node["belongType"] != this.type) {
                if (!this.isGuide) {
                    soundManager.playFx("resources:music/wboom");
                }
                if (!gameManager.isPeng) {
                    if (gameManager.isShowGuide) return;
                    gameManager.isPeng = true;
                    MasterGlobal.data["errorCount"] += 1;
                    simpleGameBridge.sendMessage("addscore:" + (-cfg.errorScore));
                    this.ScoreProgress.setProgressBar(-cfg.errorScore);
                }

                if (!this.isGuide) {
                    gameManager.redFullFoods = false;
                    gameManager.blueFullFoods = false;
                    this.isFullFoods = false;
                }

                gameManager.speedBlue = 0;
                gameManager.speedRed = 0;
                let boom = new Boom(() => {
                    this.callBack && this.callBack();
                });
                this.node.addChild(boom.node)
                switch (this.trainType) {
                    case 1:
                        boom.node.setPosition(35, 0);
                        break;
                    case 2:
                        boom.node.setPosition(0, -35);
                        break;
                    case 3:
                        boom.node.setPosition(-35, 0);
                        break;
                    case 4:
                        boom.node.setPosition(0, 35);
                        break;
                    default:
                        break;
                }
            }
        }

    }

    public showTips(type, lab) {
        // let tips = cc.instantiate(ResUtils.getAsset<cc.Prefab>("subgame:./prefab/component/Tips"));
        // tips.getComponent(Tips).setString(lab);
        // parentNode.addChild(tips);
        gameManager.showLab = lab;
        gameManager.showType = type;
        EventMng.emit("showWarn");
    }

    /**
     * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionStay(other, self) {
        // console.warn('on collision stay--------------------');
    }

    onClickEvent() {
        cc.log("接收到点击了------------>>>>>")
        // if (this.type == 2) {
        //     gameManager.speedBlue += 50;
        // }
    }

    update(dt) {

        if (!this.canMove) return;

        if (this.type == 1) {
            this.speed = gameManager.speedRed;
        }
        if (this.type == 2) {
            this.speed = gameManager.speedBlue;
        }

        if (this.isGuide) {
            this.speed = gameManager.speedGuide;
        } else {
            // cc.log("this.speed", this.speed)
            // cc.log("this.type", this.type)
        }

        //由于Math函数接受的是孤度，所以我们先节节点的旋转转化为弧度
        let angle = this.node.angle / 180 * Math.PI;
        //合成基于 X正方向的方向向量
        let dir = cc.v2(Math.cos(angle), Math.sin(angle));
        //单位化向量
        dir.normalizeSelf();
        // //根据方向向量移动位置
        // let moveSpeed = 100;
        let offSetX = dt * dir.x * this.speed;
        let offSetY = dt * dir.y * this.speed;
        let horizontal = this.node.x + offSetX;
        let vertical = this.node.y + offSetY;
        switch (this.trainType) {
            case 1:
                if (horizontal >= this.endPos.x) {
                    let currentX = JSON.parse(JSON.stringify(this.endPos.x));
                    let currentY = JSON.parse(JSON.stringify(this.endPos.y));
                    this.node.y = this.endPos.y;
                    this.node.x = this.endPos.x;
                    this.changeTrainDir();
                    if (this.trainType == 1) {
                        this.node.x = horizontal;
                    } else if (this.trainType == 2) {
                        this.node.y = currentY - (horizontal - currentX);
                    } else if (this.trainType == 4) {
                        this.node.y = currentY + (horizontal - currentX);
                    }
                } else {
                    this.node.x += dt * dir.x * this.speed;
                    this.node.y += dt * dir.y * this.speed;
                }
                break;
            case 2:
                if (vertical <= this.endPos.y) {
                    let currentX = JSON.parse(JSON.stringify(this.endPos.x));
                    let currentY = JSON.parse(JSON.stringify(this.endPos.y));
                    this.node.y = this.endPos.y;
                    this.node.x = this.endPos.x;
                    this.changeTrainDir();
                    if (this.trainType == 2) {
                        this.node.y = vertical;
                    } else if (this.trainType == 1) {
                        this.node.x = currentX + (currentY - vertical);
                    } else if (this.trainType == 3) {
                        this.node.x = currentX - (currentY - vertical);
                    }

                } else {
                    this.node.x += dt * dir.x * this.speed;
                    this.node.y += dt * dir.y * this.speed;
                }
                break;
            case 3:
                if (horizontal <= this.endPos.x) {
                    let currentX = JSON.parse(JSON.stringify(this.endPos.x));
                    let currentY = JSON.parse(JSON.stringify(this.endPos.y));
                    this.node.y = this.endPos.y;
                    this.node.x = this.endPos.x;
                    this.changeTrainDir();
                    if (this.trainType == 3) {
                        this.node.x = horizontal;
                    } else if (this.trainType == 2) {
                        this.node.y = currentY - (currentX - horizontal);
                    } else if (this.trainType == 4) {
                        this.node.y = currentY + (currentX - horizontal);
                    }

                } else {
                    this.node.x += dt * dir.x * this.speed;
                    this.node.y += dt * dir.y * this.speed;
                }
                break;
            case 4:
                if (vertical >= this.endPos.y) {
                    let currentX = JSON.parse(JSON.stringify(this.endPos.x));
                    let currentY = JSON.parse(JSON.stringify(this.endPos.y));
                    this.node.y = this.endPos.y;
                    this.node.x = this.endPos.x;
                    this.changeTrainDir();
                    if (this.trainType == 4) {
                        this.node.y = vertical;
                    } else if (this.trainType == 1) {
                        this.node.x = currentX + (vertical - currentY);
                    } else if (this.trainType == 3) {
                        this.node.x = currentX - (vertical - currentY);
                    }

                } else {
                    this.node.x += dt * dir.x * this.speed;
                    this.node.y += dt * dir.y * this.speed;
                }
                break;
            default:
                break;
        }
    }
}