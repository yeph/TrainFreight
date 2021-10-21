import BaseObject from "../../../common/base/BaseObject";
import ResUtils from "../../../common/utils/ResUtils";
import cfg from "../../../common/vo/ConfigReader";

export default class ScoreProgress extends BaseObject {

    private _handle: cc.Node;
    private _progressBar: cc.ProgressBar;
    private _len: number = 0;

    public valueProgress: number = 0;
    public callBack;
    constructor(callBack) {
        super((ResUtils.getAsset<cc.Prefab>("subgame:./prefab/component/ScoreProgress")));
        this._handle = this.findNode("handle");
        this._progressBar = this.node.getComponent(cc.ProgressBar);
        this._len = Math.abs(this._handle.x);
        this.callBack = callBack;
    }

    /**
     * 设置进度条长度
     * @param value 
     * @returns 
     */
    setProgressBar(value) {
        this.valueProgress += value;
        let progress = this.valueProgress / cfg.totalScore;
        if (this.valueProgress >= cfg.totalScore) {
            cc.log("过关啦");
            this.valueProgress = cfg.totalScore;
            progress = 1;
            this.callBack && this.callBack();
        }
        if (this.valueProgress < 0) {
            this.valueProgress = 0;
            progress = 0;
        }
        cc.log("progress", progress)
        let totalWidth = this.node.width;
        cc.log("totalWidth", totalWidth)
        this._handle.x = totalWidth * progress - totalWidth / 2;
        // cc.log("len", this._handle.x + this._len)
        this.node.getComponent(cc.ProgressBar).progress = progress;
    }

    /**
     * 初始化进度条
     */
    clearProgressBar() {
        this._handle.x = -this._len;
        this.node.getComponent(cc.ProgressBar).progress = 0;
    }
}
