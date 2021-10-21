
import UIBase from "../../../../common/base/UIBase";
import { lyx_math } from "../../../../common/utils/LYXMath";
import UIHelp from "../../../../common/utils/UIHelp";
import auto_Loading from "../../../data/autoui/common/auto_Loading";
import { lyx_bridge } from "../../../manager/LYXBridge";

const { ccclass, menu, property } = cc._decorator;

const SEND_STATE_THRESHOLD = 0.1;

@ccclass
@menu("UI/common/UILoading")
export default class UILoading extends UIBase {
	ui: auto_Loading = null;

	protected static bundleName = "gameframe";
	protected static prefabUrl = "common/Loading";
	protected static className = "UILoading";

	private _loadingPercent: number;

	onUILoad() {
		this.ui = this.node.addComponent(auto_Loading);
		this.setLoadingDisplay();
	}

	setLoadingDisplay() {
		// Loading splash scene
		let splash = document.getElementById('splash');

		splash.style.display = 'block';
		splash.style.display = 'none';

		lyx_bridge.sendState("startLoaded");

		this._loadingPercent = 0.0;
	}

	setProgress(percent: number) {
		this.ui.bar.getComponent(cc.Sprite).fillRange = percent;

		if (percent - this._loadingPercent > SEND_STATE_THRESHOLD) {
			this._loadingPercent = percent;

			//需要将加载进度反馈到原生平台
			lyx_bridge.sendState("loading:" + lyx_math.toFixed(this._loadingPercent, 1));
		}

	}

	onClose() {
		UIHelp.CloseUI(UILoading);
	}
}