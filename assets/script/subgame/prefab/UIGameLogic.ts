import simpleGameBridge from "../SimpleGameBridge";
import UITemplate from "./UITemplate";
import ResUtils from "../../common/utils/ResUtils";
import PauseGameHandler from "../handler/PauseGameHandler";
import ResumeGameHandler from "../handler/ResumeGameHandler";
import ShowGuideHandler from "../handler/ShowGuideHandler";
import TimeOverHandler from "../handler/TimeOverHandler";
import ClearGameHandler from "../handler/ClearGameHandler";
import { ViewUtil } from "../../common/utils/ViewUtil";
import cfg from "../../common/vo/ConfigReader";
import MasterGlobal from "../../common/MasterGlobal";
import { gameManager } from "./manager/gamemanager";
import GeneraItem from "./manager/GeneraItem";
import BaseComponent from "../../common/base/BaseComponent";
import EventMng from "../../common/manager/EventMng";

export default class UIGameLogic extends UITemplate {

	public lbl_desc: cc.Node;

	public generaItem: GeneraItem;

	// public comTimebar: comTimer
	public constructor() {
		super(ResUtils.getAsset<cc.Prefab>("subgame:./prefab/GameLogic"));

		this.lbl_desc = this.findNode("lbl_desc");

		simpleGameBridge.registerHandler(new PauseGameHandler(this));
		simpleGameBridge.registerHandler(new ResumeGameHandler(this));
		simpleGameBridge.registerHandler(new ShowGuideHandler(this));
		simpleGameBridge.registerHandler(new TimeOverHandler(this));
		simpleGameBridge.registerHandler(new ClearGameHandler(this));
		EventMng.on("gameIsOver", this.onGameOver, this);
	}
	/**
 * 游戏暂停
 */
	public onPause(): void {
		// if (this.comTimebar) this.comTimebar.node.getComponent(BaseComponent).enabled = false;
		gameManager.isShowGuide = true;
		gameManager.tempBlueFullFoods = gameManager.blueFullFoods;
		gameManager.tempRedFullFoods = gameManager.redFullFoods;
		gameManager.speedBlue = 0;
		gameManager.speedRed = 0;
		if (this.generaItem) this.generaItem.node.getComponent(BaseComponent).enabled = false;

	}
	/**
	 * 游戏重新激活
	 */
	public onResume(): void {
		// if (this.comTimebar) this.comTimebar.node.getComponent(BaseComponent).enabled = true;
		if (this.generaItem) this.generaItem.node.getComponent(BaseComponent).enabled = true;
		gameManager.isShowGuide = false;
		gameManager.blueFullFoods = gameManager.tempBlueFullFoods;
		gameManager.redFullFoods = gameManager.tempRedFullFoods;
		gameManager.speedBlue = cfg.speedBlue;
		gameManager.speedRed = cfg.speedRed;


	}
	onLoad() {
		gameManager.init();
		gameManager.gameState = true;
	}


	start() {
		ViewUtil.setLabelStr(this.lbl_desc, Math.random() + "");

		this.generaItem = new GeneraItem(() => { this.init(); });
		this.node.addChild(this.generaItem.node);
	}

	public init() {
		if (this.generaItem) {
			this.generaItem.node.removeFromParent();
			this.generaItem.node.destroy();
			this.generaItem = null;
		}
		this.generaItem = new GeneraItem(() => { this.init(); });
		this.node.addChild(this.generaItem.node);
	}

	onAnswerEnd(obj: any): void {
		throw new Error("Method not implemented.");
	}

	onDestroy(): void {
		this.node.removeFromParent();
		this.node.destroy();
		EventMng.off("gameIsOver", this.onGameOver);
	}
	public onGameOver() {
		MasterGlobal.data["usedTime"] = cfg.timeout;
		MasterGlobal.data["nextLevel"] = gameManager.diffArray[gameManager.diffArray.length - 1];
		MasterGlobal.data["diffList"] = gameManager.diffArray;
		gameManager.diffArray = [];
		this.onPause();
		gameManager.gameState = false;
		simpleGameBridge.sendMessage("gameover");
	}
}