import BaseObject from "../../../../common/base/BaseObject";
import MasterGlobal from "../../../../common/MasterGlobal";
import ResUtils from "../../../../common/utils/ResUtils";
import { ViewUtil } from "../../../../common/utils/ViewUtil";
import cfg from "../../../../common/vo/ConfigReader";
import AddTimeHandler from "../../../handler/AddTimeHandler";
import simpleFrameBridge from "../../../SimpleFrameBridge";

export default class Clock extends BaseObject {
	lbl_time: cc.Node;
	lbl_des: cc.Node;

	public timeout: number = 100;
	public callback = null;
	public switch: boolean = false;
	public constructor(timeout: number, callback) {
		super(ResUtils.getAsset<cc.Prefab>("gameframe:prefab/common/Clock"));
		this.lbl_time = this.node.getChildByName("lbl_time");
		this.lbl_des = this.node.getChildByName("lbl_des");
		this.timeout = timeout;
		this.callback = callback;
	}

	onLoad() {
		this.setCurTime();

		simpleFrameBridge.registerHandler(new AddTimeHandler(this));

		this.lbl_time.color = cc.color(cfg.titleTxtColor);
	}

	public offsetTime: number = 0;
	update(dt) {
		if (this.switch) {
			return;
		}
		this.offsetTime += dt;
		if (this.offsetTime >= 1) {
			this.offsetTime = 0;
			this.timeout--;
			this.timeout = Math.max(0, this.timeout);
			this.setCurTime();
			if (this.timeout <= 0) {
				if (MasterGlobal.isOver) this.switch = true;
				this.callback && this.callback();
			}
		}
	}

	/**
	 * 增加时间
	 * @param add 
	 */
	public addTime(add: number, isAnim: boolean = true): void {
		this.timeout += add;
		this.timeout = Math.max(0, this.timeout);
		//不需要动画
		if (!isAnim) {
			this.setCurTime();
			return;
		}
		let lbl_des: cc.Node = cc.instantiate(this.lbl_des);
		ViewUtil.setLabelStr(lbl_des, (add > 0 ? "+" : "-") + Math.abs(add));
		lbl_des.opacity = 255;
		this.node.addChild(lbl_des);
		lbl_des.runAction(cc.sequence(
			cc.moveTo(0.2, lbl_des.x, this.lbl_time.y),
			cc.callFunc(() => {
				lbl_des.opacity = 0;
				lbl_des.destroy();
				this.lbl_time.runAction(cc.sequence(
					cc.scaleTo(0.1, 1.5),
					cc.callFunc(() => {
						this.setCurTime();
					}),
					cc.scaleTo(0.1, 1)
				))
			})
		));
	}

	/**
	 * 设置当前时间
	 */
	public setCurTime(): void {
		let m: number = Math.floor(this.timeout / 60);
		let s: number = this.timeout % 60;
		let sStr: string = s < 10 ? "0" + s : "" + s;
		ViewUtil.setLabelStr(this.lbl_time, m + ":" + sStr);
	}

	onDestroy() {
		this.node.destroy();
	}
}