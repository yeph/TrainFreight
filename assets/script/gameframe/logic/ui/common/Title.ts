import { ViewZorder } from "../../../../common/const/ViewZOrder";
import MasterGlobal from "../../../../common/MasterGlobal";
import ResUtils from "../../../../common/utils/ResUtils";
import UIHelp from "../../../../common/utils/UIHelp";
import { ViewUtil } from "../../../../common/utils/ViewUtil";
import cfg from "../../../../common/vo/ConfigReader";
import AddScoreHandler from "../../../handler/AddScoreHandler";
import simpleFrameBridge from "../../../SimpleFrameBridge";
import Clock from "./Clock";
import { Round } from "./Round";
import UIGameSetting from "./UIGameSetting";

export class Title {
	node: cc.Node;
	mask: cc.Node;
	bg: cc.Node;
	btn_back: cc.Node;
	contain: cc.Node;
	fenshu: cc.Node;
	lbl_score: cc.Node;
	lbl_add: cc.Node;

	public _clock: Clock;
	public _round: Round;

	public curScore: number = 0; //当前分数

	constructor() {
		this.init()
	}

	public init(): void {
		this.initView();

		simpleFrameBridge.registerHandler(new AddScoreHandler(this));
	}

	public initView(): void {
		let itemprefab = ResUtils.getAsset<cc.Prefab>("gameframe:prefab/common/Title");
		this.node = cc.instantiate(itemprefab);
		this.mask = this.node.getChildByName("mask");
		this.bg = this.mask.getChildByName("bg");
		this.btn_back = this.node.getChildByName("btn_back");
		this.contain = this.node.getChildByName("contain");
		this.fenshu = this.node.getChildByName("fenshu");
		this.lbl_score = this.fenshu.getChildByName("lbl_score");
		this.lbl_add = this.fenshu.getChildByName("lbl_add");

		this.setColor();
		this.setClock();

		this.btn_back.on(cc.Node.EventType.TOUCH_END, this.onClickBack, this);
	}

	/**
	 * 设置颜色
	 */
	public setColor(): void {
		let color: string = cfg.titleBgColor || "#FFFFFF";
		this.bg.width = this.node.width;
		this.bg.color = new cc.Color().fromHEX(color);
		this.bg.opacity = cfg.titleBgOpacity;
		this.lbl_score.color = cc.color(cfg.titleTxtColor);
	}

	/**
	 * 设置倒计时时钟
	 */
	public setClock(): void {
		if (cfg.timeout) {
			this._clock = new Clock(cfg.timeout, () => {
				simpleFrameBridge.sendMessage("timeover", () => {
					this._clock.switch = true;
				});
			});
			this.contain.addChild(this._clock.node);

			return;
		}

		if (cfg.round) {
			this._round = new Round(cfg.round);
			this.contain.addChild(this._round.node);

			return;
		}
	}

	/**
	 * 增加分数
	 */
	public addScore(add: number, isAnim: boolean = true): void {
		MasterGlobal.data["score"] += add;
		this.curScore += add;
		if (this.curScore < 0) {
			this.curScore = 0;
		}
		//不需要动画
		if (!isAnim) {
			ViewUtil.setLabelStr(this.lbl_score, this.curScore + "");
			return;
		}

		let lbl_add: cc.Node = cc.instantiate(this.lbl_add);
		ViewUtil.setLabelStr(lbl_add, (add > 0 ? "+" : "-") + Math.abs(add));
		lbl_add.opacity = 255;
		this.fenshu.addChild(lbl_add);
		lbl_add.runAction(cc.sequence(
			cc.moveTo(0.2, this.lbl_score.x, this.lbl_score.y - 12),
			cc.callFunc(() => {
				lbl_add.opacity = 0;
				lbl_add.destroy();
				this.lbl_score.runAction(cc.sequence(
					cc.scaleTo(0.1, 1.5),
					cc.callFunc(() => {
						ViewUtil.setLabelStr(this.lbl_score, this.curScore + "");
					}),
					cc.scaleTo(0.1, 1)
				))
			})
		));
	}

	/**
	 * 点击左上角返回
	 */
	public onClickBack(): void {
		if (this.btn_back.getComponent(cc.Button).enabled) {
			UIHelp.ShowUI(UIGameSetting, ViewZorder.Dialog);
		}
	}

	onDestroy() {
		this._clock && this._clock.onDestroy();
		this.btn_back.off(cc.Node.EventType.TOUCH_END, this.onClickBack, this);
		this.node.destroy();
	}
}