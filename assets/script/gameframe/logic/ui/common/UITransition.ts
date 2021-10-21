import auto_Transition from "../../../data/autoui/common/auto_Transition";
import { Package, PackageType } from "../../../data/const/DefineConst";
import GameController from "../../../GameController";
import { lyx_bridge } from "../../../manager/LYXBridge";
import UIBase from "../../../../common/base/UIBase";
import UIHelp from "../../../../common/utils/UIHelp";
import cfg from "../../../../common/vo/ConfigReader";
import { httpServer } from "../../../../common/manager/HttpServer";
import MasterGlobal from "../../../../common/MasterGlobal";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/common/UITransition")
export default class UITransition extends UIBase {
	ui: auto_Transition = null;

	protected static bundleName = "gameframe";
	protected static prefabUrl = "common/Transition";
	protected static className = "UITransition";

	public offset: number = 0.05;
	public unit: number = 0;
	public completeCallback = null;

	onUILoad() {
		this.ui = this.node.addComponent(auto_Transition);

		if (this.params) {
			this.completeCallback = this.params[0];
		}
	}

	onShow() {
		cc.log("清理上一局的数据");
	}

	update(dt): void {
		this.unit += dt;
		if (this.unit >= this.offset) {
			this.ui.bar.getComponent(cc.Sprite).fillRange += 0.1;
			this.unit = 0;

			let gameConfig = cfg.gameConfig;
            let levelConfig = cfg.levelConfig;

			//跟原生平台交互
			if (Package.TYPE == PackageType.APP) {
				if (this.ui.bar.getComponent(cc.Sprite).fillRange >= 1) {
					//如果是原生平台，需要获取原生平台传递的数据
					lyx_bridge.getParams((res) => {
						let data = JSON.parse(res);
						if (data) {
							GameController.gameId = data["gameid"];
							GameController.curLevel = data["level"] || 0;
							GameController.mode = data["mode"] || 0;
							GameController.requestUrl = data["requestUrl"] || "";
							GameController.planId = data["planid"] || "";
							GameController.token = data["token"] || "";
							GameController.hiddenBack = data["hiddenBack"] || 0;

							GameController.requestUrl && httpServer.setMainUrl(GameController.requestUrl + "api/");
							GameController.token && httpServer.setToken(GameController.token);

							GameController.curLevel = data["level"] <= 0 ? 1 : data["level"];
							GameController.curLevel = data["level"] > cfg.maxLevel ? cfg.maxLevel : data["level"];
							MasterGlobal.level = GameController.curLevel;
							
							GameController.config = Object.assign(gameConfig, levelConfig[GameController.curLevel]);

							this.completeCallback && this.completeCallback();
							this.onClose();
						}
					}, () => {
						this.getCommonConfig();
						this.completeCallback && this.completeCallback();
						this.onClose();
					});
				}
			}

			//开发过程中、web包、微信小游戏
			if (Package.TYPE == PackageType.DEV || Package.TYPE == PackageType.WEB || Package.TYPE == PackageType.WX) {
				if (this.ui.bar.getComponent(cc.Sprite).fillRange >= 1) {
					GameController.nextGameLevel();
					GameController.config = Object.assign(gameConfig, levelConfig[GameController.curLevel]);
					this.completeCallback && this.completeCallback();
					this.onClose();
				}
			}
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
		GameController.curLevel = params["level"];

		let config: cc.JsonAsset = cc.resources.get("config/config") as cc.JsonAsset;
		let gameConfig = config.json["gameConfig"];
		let levelConfig = config.json["levelConfig"];
		if (GameController.curLevel == -1) {
			GameController.curLevel = gameConfig["curLevel"];
		}
		if (GameController.curLevel > gameConfig["maxLevel"]) {
			cc.error("Level:" + GameController.curLevel + "is invalid!");
			GameController.curLevel = 1;
		}

		GameController.config = Object.assign(gameConfig, levelConfig[GameController.curLevel]);
	}

	onClose() {
		UIHelp.CloseUI(UITransition);
	}
}