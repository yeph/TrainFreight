import BaseComponent from "../../../common/base/BaseComponent";
import BaseObject from "../../../common/base/BaseObject";
import EventMng from "../../../common/manager/EventMng";
import MasterGlobal from "../../../common/MasterGlobal";
import ResUtils from "../../../common/utils/ResUtils";
import { QuickTool, RandomUtils } from "../../../common/utils/UtilsToolkit";
import cfg from "../../../common/vo/ConfigReader";
import { Item } from "../../model/Item";
import simpleGameBridge from "../../SimpleGameBridge";
import ComFireWork from "../component/ComFireWork";
import GoodsItme from "../component/GoodsItme";
import MapChangeItme from "../component/MapChangeItme";
import MapItme from "../component/MapItme";
import ScoreProgress from "../component/ScoreProgress";
import { Tips } from "../component/Tips";
import TrainBoxCtrl from "../component/TrainBoxCtrl";
import TrainCtrl from "../component/TrainCtrl";
import { gameManager } from "./gamemanager";

export default class GeneraItem extends BaseObject {

    public callBack: any = null;

    public itemsArr: Item[] = []; // 存放数据对象数组

    public ScoreProgress: ScoreProgress;

    public RoadLayout: cc.Node;
    public OrnamentLayout: cc.Node;
    public RoadChangeLayout: cc.Node;
    public TrainLayout: cc.Node;
    public HouseLayout: cc.Node;
    public RouteTips: cc.Node;

    public ShowLevel: cc.Label;
    public MaxLevel: cc.Label;

    public hideLine;

    public redTrainBox = [];
    public blueTrainBox = [];

    public trainRedArry = [];
    public trainBlueArry = [];
    public trainRedBoxArry = [];
    public trainBlueBoxArry = [];
    constructor(callBack = null) {
        super((ResUtils.getAsset<cc.Prefab>("subgame:./prefab/component/GeneraItem")));
        this.callBack = callBack;
        this.RoadLayout = this.findNode("RoadLayout");
        this.OrnamentLayout = this.findNode("OrnamentLayout");
        this.RoadChangeLayout = this.findNode("RoadChangeLayout");
        this.TrainLayout = this.findNode("TrainLayout");
        this.HouseLayout = this.findNode("HouseLayout");
        this.RouteTips = this.findNode("RouteTips");

        this.ShowLevel = this.findNode("nowLevel").getComponent(cc.Label);
        this.MaxLevel = this.findNode("maxLevel").getComponent(cc.Label);
        this.ShowLevel.string = "当前关卡：" + cfg.diff;
        this.MaxLevel.string = "最大关卡:" + cfg.maxLevel;

        gameManager.blueFullFoods = false;
        gameManager.redFullFoods = false;
        EventMng.on("showRedGoods", this.showRedGoods, this);
        EventMng.on("showBlueGoods", this.showBlueGoods, this);
        EventMng.on("showWarn", this.showWarn, this);
        gameManager.isShowRed = cfg.showRedGoods;
    }

    start() {
        /****开启物理引擎和绘制碰撞组件 */
        // cc.director.getPhysicsManager().enabled = true;
        // cc.director.getCollisionManager().enabledDebugDraw = true;
        // cc.director.getCollisionManager().enabledDrawBoundingBox = true;
        // let draw = cc.PhysicsManager.DrawBits;
        // cc.director.getPhysicsManager().debugDrawFlags = draw.e_shapeBit | draw.e_jointBit;
        // cc.director.getCollisionManager().enabled = true;
        this.scheduleOnce(() => {
            this.initView();
            this.flag("usedTime");
        }, 1 / 60)
    }

    initView() {
        gameManager.speedBlue = cfg.speedBlue;
        gameManager.speedRed = cfg.speedRed;
        this.ShowLevel.string = "当前关卡：" + cfg.diff;
        this.ScoreProgress = new ScoreProgress(() => {
            this.NextLevel();
        });
        this.node.addChild(this.ScoreProgress.node);
        this.ScoreProgress.node.setSiblingIndex(0)
        this.ScoreProgress.node.getComponent(cc.Widget).updateAlignment();
        // cc.log(cfg.codes)
        let width = cfg.road[0].length * gameManager.mapWidth;
        let height = cfg.road.length * gameManager.mapHeight;
        this.RoadLayout.setContentSize(width, height);
        this.OrnamentLayout.setContentSize(width, height);
        this.RoadChangeLayout.setContentSize(width, height);
        this.TrainLayout.setContentSize(width, height);
        this.HouseLayout.setContentSize(width, height);
        this.RouteTips.setContentSize(width, height);
        this.initMap();
    }

    public initMap() {
        cc.log("cfg", cfg.showRedGoods)
        gameManager.isShowRed = cfg.showRedGoods;
        this.RoadLayout.removeAllChildren(); //绿色小马路
        this.RoadChangeLayout.removeAllChildren();//弯道
        this.TrainLayout.removeAllChildren();//小火车
        this.OrnamentLayout.removeAllChildren();//资源
        this.HouseLayout.removeAllChildren();
        this.RouteTips.removeAllChildren();
        let info = cfg.road;
        for (let i = 0; i < info.length; i++) {
            for (let j = 0; j < info[i].length; j++) {
                let mapId = info[i][j];
                let mapItme = new MapItme(mapId);
                this.RoadLayout.addChild(mapItme.node);
            }
        }
        let changeInfo = cfg.roadChange;
        for (let i = 0; i < changeInfo.length; i++) {

            for (let j = 0; j < changeInfo[i].length; j++) {
                let mapId = changeInfo[i][j];

                let mapChangeItme = new MapChangeItme(mapId, i, j, (data, isShow) => {
                    this.changeRoad(data, isShow);
                });
                this.RoadChangeLayout.addChild(mapChangeItme.node);
            }
        }

        let trainInfo = cfg.train;
        this.trainRedArry = [];
        this.trainBlueArry = [];
        this.trainRedBoxArry = [];
        this.trainBlueBoxArry = [];
        let trainIndex = 0;
        for (let i = 0; i < trainInfo.length; i++) {
            for (let j = 0; j < trainInfo[i].length; j++) {
                let mapId = trainInfo[i][j];
                if (mapId != 0) {
                    trainIndex = i * cfg.roadChange[0].length + j;
                    let y = (i - 4) * (-90)
                    let x = (j - 3) * 90 - 45;
                    let pos = cc.v2(x, y)
                    let mapTrain = new TrainCtrl(mapId, this.RoadLayout, trainIndex, i, j, () => {
                        // this.initTrain();
                        gameManager.speedBlue = cfg.speedBlue;
                        gameManager.speedRed = cfg.speedRed;
                        gameManager.isPeng = false;
                        this.initMap();
                    }, this.ScoreProgress);
                    if (mapTrain.type == 1) {
                        this.trainRedArry.push(mapTrain);
                    } else {
                        this.trainBlueArry.push(mapTrain);
                    }
                    let row = i;
                    let col = j;
                    this.TrainLayout.addChild(mapTrain.node);
                    mapTrain.node.setPosition(pos)
                    let trainType = mapTrain.trainType;
                    // cc.log("属于哪个车", mapTrain.type)
                    let belongType = mapTrain.type;
                    let box = [];
                    for (let i = 1; i < cfg.trainCount + 1; i++) {
                        let xiang = new TrainBoxCtrl(mapId, i, trainType, this.RoadLayout, row, col, belongType);
                        if (mapTrain.type == 1) {
                            this.trainRedBoxArry.push(xiang);
                        } else {
                            this.trainBlueBoxArry.push(xiang);
                        }
                        let offSet = 0;
                        switch (trainType) {
                            case 1:
                                offSet = -(xiang.node.getContentSize().width / 2 + mapTrain.node.getContentSize().width / 2);
                                xiang.node.setPosition(mapTrain.node.x + offSet - (i - 1) * xiang.node.getContentSize().width, mapTrain.node.y)
                                break;
                            case 2:
                                offSet = xiang.node.getContentSize().height / 2 + mapTrain.node.getContentSize().height / 2;
                                xiang.node.setPosition(mapTrain.node.x, mapTrain.node.y + offSet + (i - 1) * xiang.node.getContentSize().height)
                                break;
                            case 3:
                                offSet = xiang.node.getContentSize().width / 2 + mapTrain.node.getContentSize().width / 2;
                                xiang.node.setPosition(mapTrain.node.x + offSet + (i - 1) * xiang.node.getContentSize().width, mapTrain.node.y)
                                break;
                            case 4:
                                offSet = -(xiang.node.getContentSize().height / 2 + mapTrain.node.getContentSize().height / 2);
                                xiang.node.setPosition(mapTrain.node.x, mapTrain.node.y + offSet - (i - 1) * xiang.node.getContentSize().height)
                                break;
                            default:
                                break;
                        }
                        this.TrainLayout.addChild(xiang.node);
                        box.push(xiang.node)
                    }
                    if (mapTrain.type == 1) {
                        this.redTrainBox = box;
                    }
                    if (mapTrain.type == 2) {
                        this.blueTrainBox = box;
                    }
                }
            }
        }

        let goodsInfo = cfg.goods;
        for (let i = 0; i < goodsInfo.length; i++) {

            for (let j = 0; j < goodsInfo[i].length; j++) {
                let mapId = goodsInfo[i][j];
                if (mapId == 5 || mapId == 6) {
                    mapId = 0;
                }
                let goodsItme = new GoodsItme(mapId);
                this.OrnamentLayout.addChild(goodsItme.node);

            }
        }
        for (let i = 0; i < goodsInfo.length; i++) {

            for (let j = 0; j < goodsInfo[i].length; j++) {
                let mapId = goodsInfo[i][j];
                if (mapId == 5 || mapId == 6) {
                    cc.log("mapId", mapId)
                } else {
                    mapId = 0;
                }

                let goodsItme = new GoodsItme(mapId);
                this.HouseLayout.addChild(goodsItme.node);
            }
        }
    }

    public NextLevel() {
        gameManager.record(0);
        // this.clearInfo();
        // this.initView();
        gameManager.speedBlue = 0;
        gameManager.speedRed = 0;
        let comFireWork = new ComFireWork(() => {
            // EventMng.emit("gameIsOver");
            this.clearInfo();
            this.initView();
        })
        this.node.addChild(comFireWork.node);
        comFireWork.node.setPosition(0, 100);


    }

    public changeRoad(data, isShow) {
        this.RouteTips.removeAllChildren();
        this.unschedule(this.hideLine);
        this.RouteTips.opacity = 50;
        let index = data.row * cfg.roadChange[0].length + data.col;
        // cc.log("index", index)
        // cc.log("改变对应的道路节点", this.RoadLayout.children[index]);
        // cc.log("道路类型", data.roadType);
        //@ts-ignore
        this.RoadLayout.children[index]["roadType"] = data.roadType;
        if (!isShow) return;
        let r = this.RoadLayout.children[index].width / 2;
        let pos = cc.v2(this.RoadLayout.children[index].x, this.RoadLayout.children[index].y);
        let type1 = 0;
        let type2 = 0;
        switch (data.roadType) {
            case 1:
                let row1 = data.row + 1;
                let index1 = row1 * cfg.roadChange[0].length + data.col;
                let col2 = data.col + 1;
                let index2 = data.row * cfg.roadChange[0].length + col2;
                let pos1 = cc.v2(this.RoadLayout.children[index1].x, this.RoadLayout.children[index1].y);
                let pos2 = cc.v2(this.RoadLayout.children[index2].x, this.RoadLayout.children[index2].y);
                type1 = this.RoadLayout.children[index1]["roadType"];
                type2 = this.RoadLayout.children[index2]["roadType"];
                let endPos1 = cc.v2(pos1.x, pos1.y + r + 1);
                let endPos2 = cc.v2(pos2.x - r - 1, pos2.y);
                if (type1 == 0) {
                    this.drawLine(cc.v2(pos1.x, pos1.y - r), endPos1);
                } else {
                    this.checkType(type1, pos1, r);
                }
                if (type2 == 0) {
                    this.drawLine(cc.v2(pos2.x + r, pos2.y), endPos2);
                } else {
                    this.checkType(type2, pos2, r);
                }
                this.drawArc(pos.x + r, pos.y - r, r, 0.5 * Math.PI, 1 * Math.PI, true);
                break;
            case 2:
                let row3 = data.row - 1;
                let index3 = row3 * cfg.roadChange[0].length + data.col;
                let col3 = data.col + 1;
                let index4 = data.row * cfg.roadChange[0].length + col3;
                let pos3 = cc.v2(this.RoadLayout.children[index3].x, this.RoadLayout.children[index3].y);
                let pos4 = cc.v2(this.RoadLayout.children[index4].x, this.RoadLayout.children[index4].y);
                type1 = this.RoadLayout.children[index3]["roadType"];
                type2 = this.RoadLayout.children[index4]["roadType"];
                let endPos3 = cc.v2(pos3.x, pos3.y - r - 1);
                let endPos4 = cc.v2(pos4.x - r - 1, pos4.y);
                if (type1 == 0) {
                    this.drawLine(cc.v2(pos3.x, pos3.y + r), endPos3);
                } else {
                    this.checkType(type1, pos3, r);
                }
                if (type2 == 0) {
                    this.drawLine(cc.v2(pos4.x + r, pos4.y), endPos4);
                } else {
                    this.checkType(type2, pos4, r);
                }
                this.drawArc(pos.x + r, pos.y + r, r, 1 * Math.PI, 1.5 * Math.PI, true);
                break;
            case 3:
                let row5 = data.row + 1;
                let index5 = row5 * cfg.roadChange[0].length + data.col;
                let col5 = data.col - 1;
                let index6 = data.row * cfg.roadChange[0].length + col5;
                let pos5 = cc.v2(this.RoadLayout.children[index5].x, this.RoadLayout.children[index5].y);
                let pos6 = cc.v2(this.RoadLayout.children[index6].x, this.RoadLayout.children[index6].y);
                type1 = this.RoadLayout.children[index5]["roadType"];
                type2 = this.RoadLayout.children[index6]["roadType"];
                let endPos5 = cc.v2(pos5.x, pos5.y + r + 1);
                let endPos6 = cc.v2(pos6.x + r + 1, pos6.y);
                if (type1 == 0) {
                    this.drawLine(cc.v2(pos5.x, pos5.y - r), endPos5);
                } else {
                    this.checkType(type1, pos5, r);
                }
                if (type2 == 0) {
                    this.drawLine(cc.v2(pos6.x - r, pos6.y), endPos6);
                } else {
                    this.checkType(type2, pos6, r);
                }
                this.drawArc(pos.x - r, pos.y - r, r, 0, 0.5 * Math.PI, true);
                break;
            case 4:
                let row7 = data.row - 1;
                let index7 = row7 * cfg.roadChange[0].length + data.col;
                let col7 = data.col - 1;
                let index8 = data.row * cfg.roadChange[0].length + col7;
                let pos7 = cc.v2(this.RoadLayout.children[index7].x, this.RoadLayout.children[index7].y);
                let pos8 = cc.v2(this.RoadLayout.children[index8].x, this.RoadLayout.children[index8].y);
                type1 = this.RoadLayout.children[index7]["roadType"];
                type2 = this.RoadLayout.children[index8]["roadType"];
                let endPos7 = cc.v2(pos7.x, pos7.y - r - 1);
                let endPos8 = cc.v2(pos8.x + r + 1, pos8.y);
                if (type1 == 0) {
                    this.drawLine(cc.v2(pos7.x, pos7.y + r), endPos7);
                } else {
                    this.checkType(type1, pos7, r);
                }
                if (type2 == 0) {
                    this.drawLine(cc.v2(pos8.x - r, pos8.y), endPos8);
                } else {
                    this.checkType(type2, pos8, r);
                }

                this.drawArc(pos.x - r, pos.y + r, r, 1.5 * Math.PI, 2 * Math.PI, true);
                break;
            default:
                break;
        }
    }

    checkType(type, pos, r) {
        switch (type) {
            case 1:
                this.drawArc(pos.x + r, pos.y - r, r, 0.5 * Math.PI, 1 * Math.PI);
                break;
            case 2:
                this.drawArc(pos.x + r, pos.y + r, r, 1 * Math.PI, 1.5 * Math.PI);
                break;
            case 3:
                this.drawArc(pos.x - r, pos.y - r, r, 0, 0.5 * Math.PI);
                break;
            case 4:
                this.drawArc(pos.x - r, pos.y + r, r, 1.5 * Math.PI, 2 * Math.PI);
                break;
            default:
                break;
        }
    }

    /**
   * 画线
   * @param from 
   * @param to 
   * @returns 
   */
    public drawLine(from: cc.Vec2, to: cc.Vec2): void {
        // cc.log("from", from)
        // cc.log("to", to)
        let dashNode: cc.Node = new cc.Node("dashNode");
        dashNode.opacity = 0;
        dashNode.addComponent(cc.Graphics);
        this.RouteTips.addChild(dashNode);
        dashNode.opacity = 255 * 0.7;
        let g: cc.Graphics = dashNode.getComponent(cc.Graphics);
        g.clear();
        g.moveTo(from.x, from.y)
        g.lineTo(to.x, to.y);
        g.lineWidth = 8;
        g.strokeColor = new cc.Color().fromHEX("#FF2828");
        g.stroke();
    }

    /**
     * 画弧线
     * @param from 
     * @param x 
     * @param y 
     * @param r 
     * @param sAngle 
     * @param eAngle 
     */
    public drawArc(x, y, r, sAngle, eAngle, isHide: boolean = false): void {
        let dashNode: cc.Node = new cc.Node("dashNode");
        dashNode.addComponent(cc.Graphics);
        this.RouteTips.addChild(dashNode);
        // dashNode.setPosition(x, y)
        dashNode.opacity = 255 * 0.7;
        let g: cc.Graphics = dashNode.getComponent(cc.Graphics);
        g.clear();
        g.arc(x, y, r, sAngle, eAngle, true);
        g.lineWidth = 8;
        g.strokeColor = new cc.Color().fromHEX("#FF2828");
        g.stroke();

        if (isHide) {
            this.scheduleOnce(this.hideLine = () => {
                cc.tween(this.RouteTips).to(0.5, { opacity: 0 }).call(() => {
                    this.RouteTips.removeAllChildren();
                }).start()
            }, 1)
        }


    }

    public showRedGoods() {
        let url = "subgame:./texture/" + gameManager.boxUrl
        let redHouse = this.node.getChildByName("OrnamentLayout").getChildByName("redHouse");
        if (!gameManager.redFullFoods) {
            MasterGlobal.data["correctCount"] += 1;
            simpleGameBridge.sendMessage("addscore:" + cfg.goodsScore);
            redHouse.getChildByName("markBg").active = false;
            this.showTips(redHouse, cfg.goodsScore)
            this.ScoreProgress.setProgressBar(cfg.goodsScore);
        } else {
            redHouse.getChildByName("markBg").active = true;
        }

        for (let i = 0; i < this.redTrainBox.length; i++) {
            let item = this.redTrainBox[i];
            item.getComponent(cc.Sprite).spriteFrame = gameManager.getSpriteFrame(url);
        }
    }

    public showBlueGoods() {
        let url = "subgame:./texture/" + gameManager.boxUrl
        let blueHouse = this.node.getChildByName("OrnamentLayout").getChildByName("blueHouse");
        if (!gameManager.blueFullFoods) {
            MasterGlobal.data["correctCount"] += 1;
            simpleGameBridge.sendMessage("addscore:" + cfg.goodsScore);
            blueHouse.getChildByName("markBg").active = false;
            this.showTips(blueHouse, cfg.goodsScore);
            this.ScoreProgress.setProgressBar(cfg.goodsScore);
        } else {
            blueHouse.getChildByName("markBg").active = true;
        }

        for (let i = 0; i < this.blueTrainBox.length; i++) {
            let item = this.blueTrainBox[i];
            item.getComponent(cc.Sprite).spriteFrame = gameManager.getSpriteFrame(url);
        }
    }

    public showTips(parentNode, score) {
        let tips = cc.instantiate(ResUtils.getAsset<cc.Prefab>("subgame:./prefab/component/Tips"));
        let lab = "";
        if (score > 0) {
            lab = "+" + score;
        } else {
            lab = "-" + score;
        }
        tips.getComponent(Tips).setString(lab);
        parentNode.addChild(tips);
    }

    onDestroy() {
        EventMng.off("showRedGoods");
        EventMng.off("showBlueGoods");
        EventMng.off("showWarn");
    }

    showWarn() {
        let showTips = this.findNode("showTips");
        showTips.opacity = 255;
        let showBlue = this.findNode("showBlue");
        let showRed = this.findNode("showRed");
        let lab = showTips.getChildByName("lab").getComponent(cc.Label);
        lab.string = gameManager.showLab;
        if (gameManager.showType == 1) {
            showBlue.active = true;
            showRed.active = false;
        } else if (gameManager.showType == 2) {
            showBlue.active = false;
            showRed.active = true;
        }
        this.scheduleOnce(() => {
            cc.tween(showTips).to(0.5, { opacity: 0 }).start();
        }, 2)
    }

    clearInfo() {
        this.ScoreProgress.node.destroy();
        gameManager.redFullFoods = false;
        gameManager.blueFullFoods = false;
    }

    update(dt) {
        // if (!this.ScoreProgress) return
        // this.ScoreProgress.setProgressBar(dt * 30);
    }
}