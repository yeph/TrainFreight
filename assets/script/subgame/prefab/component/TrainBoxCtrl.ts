import BaseObject from "../../../common/base/BaseObject";
import MasterGlobal from "../../../common/MasterGlobal";
import ResUtils from "../../../common/utils/ResUtils";
import cfg from "../../../common/vo/ConfigReader";
import { gameManager } from "../manager/gamemanager";

export default class TrainBoxCtrl extends BaseObject {

    public roadLayout: cc.Node;  //铁路
    public trainType: number = 0; //火车方向
    public canMove: boolean = false;  //是否能移动
    public nextRoad: cc.Node;   //下一步位置
    public nowRoad: cc.Node;    //当前位置
    public trainIndex: number = 0;
    public nextIndex: number = 0;
    public row: number;
    public col: number;
    public belongType: number;

    public endPos: cc.Vec2; //下一步的坐标
    public startPos: cc.Vec2; //小车现在的坐标
    public needMoveDistance: number; //需要移动的距离
    public speed: number;
    public isGuide;

    constructor(id, index, type, roadLayout, row, col, belongType, isGuide: boolean = false) {
        super((ResUtils.getAsset<cc.Prefab>("subgame:./prefab/mapPrefab/xiang_" + id)));
        this.node["boxIndex"] = index;
        this.isGuide = isGuide;
        this.trainType = type;
        this.node["belongType"] = belongType;
        this.roadLayout = roadLayout;
        this.setType(id);
        this.nowRoad = this.roadLayout.children[this.trainIndex];
        this.row = row;
        this.col = col;
        this.belongType = belongType;
        this.getNextRoad();
        this.initBox(belongType)
    }

    start() {
        this.scheduleOnce(() => {
            this.moveTrain();
        }, 2)
    }

    public initBox(belongType) {
        let boxUrl = ""
        if (belongType == 1) {
            if (gameManager.redFullFoods) {
                boxUrl = "train_red_carriage";
            } else {
                boxUrl = "train_red_carriage1";
            }
        }
        if (belongType == 2) {
            if (gameManager.blueFullFoods) {
                boxUrl = "train_bule_carriage";
            } else {
                boxUrl = "train_bule_carriage1";
            }
        }
        let url = "subgame:./texture/" + boxUrl;
        this.node.getComponent(cc.Sprite).spriteFrame = gameManager.getSpriteFrame(url);
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
        let len = this.node.getPosition().sub(this.nextRoad.getPosition()).mag();
        let v = 0;
        if (this.belongType) {
            if (this.belongType == 1) {
                v = gameManager.speedRed;
            }
            if (this.belongType == 2) {
                v = gameManager.speedBlue;
            }
        }
        let times = len / v;
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

    }

    update(dt) {
        if (!this.canMove) return;

        if (this.belongType == 1) {
            this.speed = gameManager.speedRed;
        }
        if (this.belongType == 2) {
            this.speed = gameManager.speedBlue;
        }
        if (this.isGuide) {
            this.speed = gameManager.speedGuide;
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