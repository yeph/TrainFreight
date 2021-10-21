import UIBase from "../../../../common/base/UIBase";
import { soundManager } from "../../../../common/manager/SoundManager";
import MasterGlobal from "../../../../common/MasterGlobal";
import UIHelp from "../../../../common/utils/UIHelp";
import cfg from "../../../../common/vo/ConfigReader";
import { default as auto_Frame, default as auto_Game } from "../../../data/autoui/prefab/auto_Frame";
import GameController from "../../../GameController";
import GameOverHandler from "../../../handler/GameOverHandler";
import RoundOverHandler from "../../../handler/RoundOverHandler";
import simpleFrameBridge from "../../../SimpleFrameBridge";
import { ComTimeDown } from "../common/ComTimeDown";
import { GameName } from "../common/GameName";
import { Title } from "../common/Title";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/prefab/UIFrame")
export default class UIFrame extends UIBase {
	ui: auto_Frame = null;

	protected static bundleName = "gameframe";
	protected static prefabUrl = "Frame";
	protected static className = "UIFrame";

	public _name: GameName;  //游戏名称
	public _timedown: ComTimeDown;  //倒计时
	public _title: Title;  //逻辑页的标题

	onUILoad() {
		this.ui = this.node.addComponent(auto_Game);

		simpleFrameBridge.registerHandler(new GameOverHandler(this));
		simpleFrameBridge.registerHandler(new RoundOverHandler(this));

		this.initView();
	}

	public initView(): void {
		this.showGameName();

		simpleFrameBridge.sendMessage("startguide", () => {
			// 重新开始时清空data，重新赋初始值
			MasterGlobal.data = {};

			//每次重新开始都需要对数据进行重新赋值
			MasterGlobal.data["nextLevel"] = GameController.curLevel;
			MasterGlobal.data["usedTime"] = 0.0;

			MasterGlobal.data["errorCount"] = 0;
			MasterGlobal.data["correctCount"] = 0;
			MasterGlobal.data["score"] = 0.0;

			//点击“开始游戏”的回调
			this.showTimeDown();
		});
	}

	/**
	 * 显示游戏名称
	 */
	public showGameName(): void {
		if (this._title && this._title.node) {
			this._title.node.removeFromParent();
			this._title.node.destroy();
			this._title = null;
		}
		this._name = new GameName();
		this.node.addChild(this._name.node);
	}

	/**
	 * 显示倒计时3  2  1
	 */
	public showTimeDown(): void {
		if (this._name && this._name.node) {
			this._name.node.removeFromParent();
			this._name.node.destroy();
			this._name = null;
		}

		soundManager.stopCurEffect();
		this._timedown = new ComTimeDown(() => {
			MasterGlobal.isOver = false;
			simpleFrameBridge.sendMessage("startgame");
			if (this._timedown && this._timedown.node) {
				this._timedown.node.removeFromParent();
				this._timedown.onDestroy();
				this._timedown = null;
			}

			this.showTitle();
			soundManager.playMusic(cfg.musicBg);
			if (!MasterGlobal.musicon) soundManager.pauseMusic();
		});
		this._timedown && this._timedown.node && this.node.addChild(this._timedown.node);
	}

	/**
	 * 显示title页
	 */
	public showTitle(): void {
		if (this._name && this._name.node) {
			this._name.node.removeFromParent();
			this._name.node.destroy();
			this._name = null;
		}
		this._title = new Title();
		this.node.addChild(this._title.node);
	}

	onClose() {
		UIHelp.CloseUI(UIFrame);
	}
}