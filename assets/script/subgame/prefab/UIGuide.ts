import BaseObject from "../../common/base/BaseObject";
import EventMng from "../../common/manager/EventMng";
import { soundManager } from "../../common/manager/SoundManager";
import MasterGlobal from "../../common/MasterGlobal";
import ResUtils from "../../common/utils/ResUtils";
import { TaskPool } from "../../common/utils/TaskToolkit";
import { ViewUtil } from "../../common/utils/ViewUtil";
import cfg from "../../common/vo/ConfigReader";
import simpleGameBridge from "../SimpleGameBridge";
import GoodsItme from "./component/GoodsItme";
import MapChangeItme from "./component/MapChangeItme";
import MapItme from "./component/MapItme";
import ScoreProgress from "./component/ScoreProgress";
import { Tips } from "./component/Tips";
import TrainBoxCtrl from "./component/TrainBoxCtrl";
import TrainCtrl from "./component/TrainCtrl";
import { gameManager } from "./manager/gamemanager";

export default class UIGuide extends BaseObject {
    public btn_start: cc.Node;
    public btn_continue: cc.Node;
    public lbl_tip: cc.Node;
    public contain: cc.Node;

    public startGameCallback;  //开始游戏的回调

    public type: number = 1;  //1---开始游戏   2---继续游戏

    public myContain: cc.Node;
    public comFinger: cc.Node;
    // public startPoint: cc.Node;
    // public endPoint: cc.Node;
    public yesTips: cc.Node;

    public taskpool: TaskPool;

    public showArr = [2, 4, 5];

    public fingerPos = cc.v2(0, 0);

    public RoadLayout: cc.Node;
    public OrnamentLayout: cc.Node;
    public RoadChangeLayout: cc.Node;
    public TrainLayout: cc.Node;
    public ScoreProgress: ScoreProgress;

    public redTrainBox = [];
    public blueTrainBox = [];

    public goodsCount: number = 0;

    public mapChangeItme: MapChangeItme;

    public constructor(type: number = 1) {
        super(ResUtils.getAsset<cc.Prefab>("subgame:./prefab/Guide"));
        this.taskpool = new TaskPool();
        this.type = type;
        // EventMng.on("showRedGoods", this.showRedGoods, this);
        // EventMng.on("showBlueGoods", this.showBlueGoods, this);
        cc.director.getCollisionManager().enabled = true;
        // cc.director.getCollisionManager().enabledDebugDraw = true;
        // cc.director.getCollisionManager().enabledDrawBoundingBox = true;
        EventMng.on("showGuideRedGoods", this.showGuideRedGoods, this);
    }

    public onLoad(): void {
        this.btn_start = this.findNode("btn_start");
        this.btn_continue = this.findNode("btn_continue");
        this.contain = this.findNode('contain');
        this.myContain = this.findNode('contain').getChildByName("contain");
        this.comFinger = this.findNode("confinger");

        this.RoadLayout = this.findNode("RoadLayout");
        this.OrnamentLayout = this.findNode("OrnamentLayout");
        this.RoadChangeLayout = this.findNode("RoadChangeLayout");
        this.TrainLayout = this.findNode("TrainLayout");

        this.ScoreProgress = new ScoreProgress(() => {

        });
        this.node.addChild(this.ScoreProgress.node);
        this.ScoreProgress.node.active = false;
        this.ScoreProgress.node.getComponent(cc.Widget).updateAlignment();

        this.fingerPos = this.comFinger.getPosition();
        this.yesTips = this.myContain.getChildByName('yes');
        this.lbl_tip = this.contain.getChildByName("lbl_tip");
        if (this.type == 1) {
            this.btn_continue.active = false;
            this.btn_start.on(cc.Node.EventType.TOUCH_END, this.onClickStart, this);
        } else {
            this.btn_start.active = false;
            this.btn_continue.on(cc.Node.EventType.TOUCH_END, this.onClickContinue, this);
        }
        this.goodsCount = 0;
    }
    start() {
        this.initView();
        this.playGuideTip();
        this.playVoiceAndAni();
    }
    //引导音效
    public tipIndex: number = 0;
    public playGuideTip(): void {
        //播放文字介绍
        let guideMsg = cfg.guideMsg;
        if (guideMsg && guideMsg.length) {
            let msg = guideMsg[this.tipIndex];
            msg["sound"] && soundManager.playGuideFx(msg["sound"], () => {
                ViewUtil.setLabelStr(this.lbl_tip, msg["content"]);
            }, () => {
                if (this.tipIndex + 1 >= guideMsg.length) {
                    // this.playVoiceAndAni();
                    return;
                }
                this.scheduleOnce(() => {
                    this.tipIndex++;
                    this.playGuideTip();
                }, 1);
            });
        }
        guideMsg && guideMsg["sound"] && soundManager.playGuideFx(guideMsg["sound"]);
    }
    playVoiceAndAni() {
        cc.log("引导--------------->>>>");
        this.initMap();
        gameManager.speedGuide = 0;
        this.moveComFinger();
        cc.log("------------------引导结束")
    }

    moveComFinger() {
        cc.log("this.goodsCount", this.goodsCount)
        if (this.goodsCount == 0) {
            EventMng.emit("showGoods");
        } else if (this.goodsCount != 0 && this.goodsCount % 2 == 1) {
            cc.log("moveComFinger-------------------------->>>>>")
            EventMng.emit("showGuideGoods");
        } else if (this.goodsCount != 0 && this.goodsCount % 2 == 0) {
            EventMng.emit("showGoods");
        }
        this.scheduleOnce(() => {
            this.comFinger.opacity = 255;
            cc.tween(this.comFinger).to(1, { position: cc.v3(-140, 70, 0) }).call(() => {
                cc.tween(this.comFinger).to(0.2, { scale: 0.6 }).call(() => {
                    cc.tween(this.comFinger).to(0.1, { scale: 0.8 }).call(() => {
                        this.mapChangeItme.onClickEvent();
                        this.comFinger.opacity = 0;
                        this.comFinger.setPosition(this.fingerPos);
                        gameManager.speedGuide = 180;
                    }).start()
                }).start()

            }).start();
        }, 1)

    }

    /**
     * 点击开始
     */
    public onClickStart(): void {
        soundManager.stopCurEffect();
        this.startGameCallback && this.startGameCallback();
    }

    /**
     * 点击继续
     */
    public onClickContinue(): void {
        soundManager.stopCurEffect();
        this.startGameCallback && this.startGameCallback();
    }

    public onDestroy(): void {
        this.btn_start && this.btn_start.off(cc.Node.EventType.TOUCH_END, this.onClickStart, this);
        this.btn_continue && this.btn_continue.off(cc.Node.EventType.TOUCH_END, this.onClickContinue, this);
        this.taskpool.stop();

        EventMng.off("showGuideRedGoods", this.showGuideRedGoods, this);
    }

    initView() {
        let width = MasterGlobal.config.mapConfig[0].road[0].length * gameManager.mapWidth;
        let height = MasterGlobal.config.mapConfig[0].road.length * gameManager.mapHeight;
        this.RoadLayout.setContentSize(width, height);
        this.OrnamentLayout.setContentSize(width, height);
        this.RoadChangeLayout.setContentSize(width, height);
        this.TrainLayout.setContentSize(width, height);
    }

    public initMap() {
        this.RoadLayout.removeAllChildren(); //绿色小马路
        this.RoadChangeLayout.removeAllChildren();//弯道
        this.TrainLayout.removeAllChildren();//小火车
        this.OrnamentLayout.removeAllChildren();//资源
        gameManager.isShowRed = true;
        let info = MasterGlobal.config.mapConfig[0].road;
        for (let i = 0; i < info.length; i++) {
            for (let j = 0; j < info[i].length; j++) {
                let mapId = info[i][j];
                let mapItme = new MapItme(mapId);
                this.RoadLayout.addChild(mapItme.node);
            }
        }
        let changeInfo = MasterGlobal.config.mapConfig[0].roadChange;
        for (let i = 0; i < changeInfo.length; i++) {

            for (let j = 0; j < changeInfo[i].length; j++) {
                let mapId = changeInfo[i][j];

                let mapChangeItme = new MapChangeItme(mapId, i, j, (data) => {
                    this.changeRoad(data);
                });
                if (mapId == "2") {
                    this.mapChangeItme = mapChangeItme;
                }
                this.RoadChangeLayout.addChild(mapChangeItme.node);
            }
        }

        let trainInfo = MasterGlobal.config.mapConfig[0].train;
        let trainIndex = 0;
        for (let i = 0; i < trainInfo.length; i++) {
            for (let j = 0; j < trainInfo[i].length; j++) {
                let mapId = trainInfo[i][j];
                if (mapId != 0) {
                    trainIndex = i * MasterGlobal.config.mapConfig[0].roadChange[0].length + j;
                    let y = (3 - i) * 90 - 45;
                    let x = (j - 2) * 90 - 45;
                    let pos = cc.v2(x, y)
                    let mapTrain = new TrainCtrl(mapId, this.RoadLayout, trainIndex, i, j, () => {
                        this.initTrain();
                    }, this.ScoreProgress, true);
                    let row = i;
                    let col = j;
                    this.TrainLayout.addChild(mapTrain.node);
                    mapTrain.node.setPosition(pos)
                    let trainType = mapTrain.trainType;
                    // cc.log("属于哪个车", mapTrain.type)
                    let belongType = mapTrain.type;
                    let box = [];
                    for (let i = 1; i < MasterGlobal.config.difficultyConfig[0].trainCount + 1; i++) {
                        let xiang = new TrainBoxCtrl(mapId, i, trainType, this.RoadLayout, row, col, belongType, true);
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

        let goodsInfo = MasterGlobal.config.mapConfig[0].goods;
        for (let i = 0; i < goodsInfo.length; i++) {

            for (let j = 0; j < goodsInfo[i].length; j++) {
                let mapId = goodsInfo[i][j];
                let goodsItme = new GoodsItme(mapId, true);
                this.OrnamentLayout.addChild(goodsItme.node);
            }
        }
    }

    public initTrain() {
        gameManager.speedBlue = MasterGlobal.config.difficultyConfig[0].speedBlue;
        gameManager.speedRed = MasterGlobal.config.difficultyConfig[0].speedRed;
        gameManager.isPeng = false;
        this.TrainLayout.removeAllChildren();//小火车
        let trainInfo = MasterGlobal.config.mapConfig[0].train;
        let trainIndex = 0;
        for (let i = 0; i < trainInfo.length; i++) {
            for (let j = 0; j < trainInfo[i].length; j++) {
                let mapId = trainInfo[i][j];
                if (mapId != 0) {
                    trainIndex = i * MasterGlobal.config.mapConfig[0].roadChange[0].length + j;
                    let y = (3 - i) * 90 - 45;
                    let x = (j - 2) * 90 - 45;
                    let pos = cc.v2(x, y)
                    let mapTrain = new TrainCtrl(mapId, this.RoadLayout, trainIndex, i, j, () => {
                        this.initTrain();
                    }, this.ScoreProgress, true);
                    let row = i;
                    let col = j;
                    this.TrainLayout.addChild(mapTrain.node);
                    mapTrain.node.setPosition(pos)
                    let trainType = mapTrain.trainType;
                    let belongType = mapTrain.type;
                    let box = [];
                    for (let i = 1; i < MasterGlobal.config.difficultyConfig[0].trainCount + 1; i++) {
                        let xiang = new TrainBoxCtrl(mapId, i, trainType, this.RoadLayout, row, col, belongType, true);
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
    }

    public changeRoad(data) {
        cc.log(data)
        let index = data.row * MasterGlobal.config.mapConfig[0].roadChange[0].length + data.col;
        // cc.log("index", index)
        // cc.log("改变对应的道路节点", this.RoadLayout.children[index]);
        // cc.log("道路类型", data.roadType);
        //@ts-ignore
        this.RoadLayout.children[index]["roadType"] = data.roadType
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
        this.goodsCount += 1;
        this.moveComFinger();
    }

    public showGuideRedGoods() {
        let url = "subgame:./texture/" + gameManager.boxGuideUrl
        if (!gameManager.redGuideFullFoods) {
            let redHouse = this.findNode("redHouse");
            // cc.log("redHouse-------------------", redHouse)
            this.showTips(redHouse, cfg.goodsScore)
        }

        for (let i = 0; i < this.redTrainBox.length; i++) {
            let item = this.redTrainBox[i];
            item.getComponent(cc.Sprite).spriteFrame = gameManager.getSpriteFrame(url);
        }
    }
}