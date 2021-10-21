import { ViewZorder } from "../common/const/ViewZOrder";
import { httpServer } from "../common/manager/HttpServer";
import { resLoader } from "../common/manager/ResLoader";
import UIMng from "../common/manager/UIMng";
import MasterGlobal from "../common/MasterGlobal";
import UIHelp from "../common/utils/UIHelp";
import cfg from "../common/vo/ConfigReader";
import ResAttr from "../common/vo/ResAttr";
import { Package, PackageType } from "./data/const/DefineConst";
import UILoading from "./logic/ui/common/UILoading";
import UIFrame from "./logic/ui/prefab/UIFrame";
import { lyx_bridge } from "./manager/LYXBridge";
import simpleFrameBridge from "./SimpleFrameBridge";

class GameController {
    //当前游戏ID
    public gameId: number = 0;

    //当前游戏关卡
    public curLevel: number = 1;

    //游戏结果弹窗的控制（0-default   1-不显示弹窗  2-onState事件需要阻塞回调才能继续）
    public mode: number = 0;

    //原生传过来的url（必要时h5直接自己调接口）
    public requestUrl: string = "";

    //h5调接口时的唯一身份
    public planId: number = 1003230;

    //原生传过来的token
    public token: string = null;

    //原生传过来的是否需要隐藏返回键
    public hiddenBack: number = 0;

    //当前关卡下的游戏配置
    public config = null;

    init() {
        this.loadConfigCom();
    }

    /**
     * 加载resList.json
     */
    private loadConfigCom(): void {
        cc.resources.load<cc.JsonAsset>("./config/resList", cc.JsonAsset, (err: Error, asset: cc.JsonAsset) => {
            if (err) throw err;
            else {
                this.loadReslistCom();
            }
        });
    }

    /**
     * 显示加载过程
     */
    public loadingCallback = null;
    private loadReslistCom(): void {
        UIHelp.ShowUI(UILoading, ViewZorder.UI, () => {
            cc.resources.load<cc.JsonAsset>("./config/config", cc.JsonAsset, (err: Error, asset: cc.JsonAsset) => {
                if (err) {
                    cc.error(err);
                    return;
                } else {
                    MasterGlobal.config = asset.json;
                    this.loadingCallback = () => {
                        //加载资源
                        let config: cc.JsonAsset = cc.resources.get("./config/resList") as cc.JsonAsset;
                        let list: Array<ResAttr> = config.json;
                        resLoader.loadResList(list,
                            () => { this.gameStart(); },
                            (finish, total, progress) => { this.loadProgressUpdate(progress); });
                    };
                    this.getGameGonfig();
                }
            });
        });
    }

    /**
     * 获取游戏配置config
     */
    public getGameGonfig() {
        //开发平台
        if (Package.TYPE == PackageType.DEV || Package.TYPE == PackageType.WEB) {
            this.getCommonConfig();
        }

        //原生平台，需要获取原生平台传递的数据
        if (Package.TYPE == PackageType.APP) {
            lyx_bridge.getParams((res) => {
                let data = JSON.parse(res);
                if (data) {
                    cc.log("******", data);

                    this.gameId = data["gameid"];
                    this.curLevel = data["level"] || 0;
                    this.mode = data["mode"] || 0;
                    this.requestUrl = data["requesturl"] || "";
                    this.planId = data["planid"] || 0;
                    this.token = data["token"] || "";
                    this.hiddenBack = data["hiddenBack"] || 0;

                    this.requestUrl && httpServer.setMainUrl(this.requestUrl + "api/");
                    this.token && httpServer.setToken(this.token);
                }

                this.updateServerConfig();
            }, () => {
                this.getCommonConfig();
            });
        }

        //微信平台
        if (Package.TYPE == PackageType.WX) {
            this.curLevel = 0;
            let gameConfig = cfg.gameConfig;
            let levelConfig = cfg.levelConfig;

            this.config = Object.assign(gameConfig, levelConfig[this.curLevel]);
            this.gameStart();
        }
    }

    /**
     * 普通方式获取config
     */
    public getCommonConfig() {
        let url: string = window.location.href.trim();
        let idx: number = url.indexOf("?");
        url = url.substr(idx + 1);
        let params = { "level": -1 };
        url.split("&").map(it => it.trim()).forEach(it => {
            idx = it.indexOf("=");
            if (idx >= 0 && idx < it.length - 1) {
                let v = it.substring(idx + 1).trim();
                if (/^(\-|\+)?\d+([^\-]\d+)?$/.test(v)) {
                    params[it.substring(0, idx).trim()] = parseInt(v);
                }
            }
        });
        this.curLevel = params["level"];

        let gameConfig = cfg.gameConfig;
        let levelConfig = cfg.levelConfig;
        if (this.curLevel == -1) {
            this.curLevel = gameConfig.curLevel;
        }
        if (this.curLevel > gameConfig.maxLevel) {
            cc.error("Level:" + this.curLevel + "is invalid!");
            this.curLevel = 1;
        }

        this.curLevel = this.curLevel <= 0 ? 1 : this.curLevel;
        this.curLevel = this.curLevel > cfg.maxLevel ? cfg.maxLevel : this.curLevel;
        MasterGlobal.level = this.curLevel;

        this.config = Object.assign(gameConfig, levelConfig[this.curLevel]);

        this.loadingCallback && this.loadingCallback();
    }

    /**
     * 更新服务器上的配置
     */
    public updateServerConfig(): void {
        this.curLevel = this.curLevel <= 0 ? 1 : this.curLevel;
        this.curLevel = this.curLevel > cfg.maxLevel ? cfg.maxLevel : this.curLevel;
        MasterGlobal.level = this.curLevel;
        
        let gameConfig = cfg.gameConfig;
        let levelConfig = cfg.levelConfig;
        this.config = Object.assign(gameConfig, levelConfig[this.curLevel]);
        this.loadingCallback && this.loadingCallback();
    }
    
    /**
     * 更新加载进度
     * @param totalCount 
     * @param completeCount 
     */
    private loadProgressUpdate(progress: number): void {
        let loadingUI = UIMng.getInstance().getUI(UILoading) as UILoading;
        if (loadingUI) {
            loadingUI.setProgress(progress);
        }
    }

    /**开始游戏 */
    public gameStart(): void {
        simpleFrameBridge.sendMessage("initgame", () => {
			lyx_bridge.sendState("loading:1");
			lyx_bridge.sendState("loaded");
            UIHelp.CloseUI(UILoading);
            UIHelp.ShowUI(UIFrame, ViewZorder.Float);
        });
    }

    /**
     * 修改当前关卡等级
     * @param level 
     */
    public nextGameLevel(): void {
        this.curLevel++;
        MasterGlobal.level = this.curLevel;

        let gameConfig = cfg.gameConfig;
        let levelConfig = cfg.levelConfig;
        this.config = Object.assign(gameConfig, levelConfig[this.curLevel]);
    }
}

export default new GameController();