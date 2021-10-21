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
        gameManager.blueFullFoods = false;
        gameManager.redFullFoods = false;
        EventMng.on("showRedGoods", this.showRedGoods, this);
        EventMng.on("showBlueGoods", this.showBlueGoods, this);
        EventMng.on("showWarn", this.showWarn, this);
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
        }, 1 / 60)
    }

    initView() {
        gameManager.speedBlue = cfg.speedBlue;
        gameManager.speedRed = cfg.speedRed;
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
        this.initMap();
    }

    public initMap() {
        this.RoadLayout.removeAllChildren(); //绿色小马路
        this.RoadChangeLayout.removeAllChildren();//弯道
        this.TrainLayout.removeAllChildren();//小火车
        this.OrnamentLayout.removeAllChildren();//资源
        this.HouseLayout.removeAllChildren();
        gameManager.isShowRed = cfg.showRedGoods;
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

                let mapChangeItme = new MapChangeItme(mapId, i, j, (data) => {
                    this.changeRoad(data);
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
        cc.log("------------------------->>>NextLevel")
        gameManager.record(0);
        // this.clearInfo();
        // this.initView();
        gameManager.speedBlue = 0;
        gameManager.speedRed = 0;
        let comFireWork = new ComFireWork(() => {
            EventMng.emit("gameIsOver");
        })
        this.node.addChild(comFireWork.node);
        comFireWork.node.setPosition(0, 100);


    }

    public changeRoad(data) {
        let index = data.row * cfg.roadChange[0].length + data.col;
        // cc.log("index", index)
        // cc.log("改变对应的道路节点", this.RoadLayout.children[index]);
        // cc.log("道路类型", data.roadType);
        //@ts-ignore
        this.RoadLayout.children[index]["roadType"] = data.roadType
    }

    public showRedGoods() {
        let url = "subgame:./texture/" + gameManager.boxUrl
        let redHouse = this.node.getChildByName("OrnamentLayout").getChildByName("redHouse");
        if (!gameManager.redFullFoods) {
            this.ScoreProgress.setProgressBar(cfg.goodsScore);
            MasterGlobal.data["correctCount"] += 1;
            simpleGameBridge.sendMessage("addscore:" + cfg.goodsScore);
            redHouse.getChildByName("markBg").active = false;
            this.showTips(redHouse, cfg.goodsScore)
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
            this.ScoreProgress.setProgressBar(cfg.goodsScore);
            MasterGlobal.data["correctCount"] += 1;
            simpleGameBridge.sendMessage("addscore:" + cfg.goodsScore);
            blueHouse.getChildByName("markBg").active = false;
            this.showTips(blueHouse, cfg.goodsScore)
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
        EventMng.off("showRedGoods", this.showRedGoods, this);
        EventMng.off("showBlueGoods", this.showBlueGoods, this);
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
        this.ScoreProgress.clearProgressBar();
        gameManager.redFullFoods = false;
        gameManager.blueFullFoods = false;
    }

    update(dt) {
        // if (!this.ScoreProgress) return
        // this.ScoreProgress.setProgressBar(dt * 30);
    }
}