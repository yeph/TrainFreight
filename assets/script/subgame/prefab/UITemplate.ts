import BaseObject from "../../common/base/BaseObject";
import { lyx_math } from "../../common/utils/LYXMath";
import cfg from "../../common/vo/ConfigReader";
import simpleGameBridge from "../SimpleGameBridge";

/**
 * 辅助UIGame处理配置部分内容，从而使UIGame部分尽量干净（仅仅关心游戏主逻辑）
 */
export default abstract class UITemplate extends BaseObject {

	public qStartTime: number = 0;  //"题"开始的时间
	public qEndTime: number = 0;  //"题"结束的时间

	start(): void {
		this.qStartTime = new Date().getTime();
	}

	/**
	 * 回答问题
	 * @param res 
	 */
	onAnswer(res: boolean): void {
		this.qEndTime = new Date().getTime();
		let curLevel: number = cfg.level;
		let curRes: boolean = res;
		let obj = {
			curLevel: curLevel,
			curRes: curRes,
			useTime: lyx_math.toFixed((this.qEndTime - this.qStartTime) / 1000)
		};

		this.onAnswerEnd(obj);
	}

	/**
	 * 本轮结束
	 */
	onRoundOver(): void {
		simpleGameBridge.sendMessage("roundover");
	}

	/**
	 * 游戏结束,进入下一关
	 */
	onGameOver(): void {
		simpleGameBridge.sendMessage("gameover");
	}

	/**
	 * 整合数据
	 */
	public integrateData(): void {
		/*this.data["id"] = GameController.gameId;
		this.data["lv"] = cfg.level;
		this.data["maxLv"] = cfg.maxLevel;
		this.data["lvWin"] = true;  //是否过关，现在默认是过关，如果特殊在自己的UIGame里面进行重写

		let answerNumArr: number[] = this.managerAnswer();
		this.data["correctCount"] = answerNumArr[0] || 0;
		this.data["errorCount"] = answerNumArr[1] || 0;
		this.data["correctRate"] = lyx_math.toFixed(answerNumArr[0] / this.resultArr.length);
		this.data["errorRate"] = lyx_math.toFixed(answerNumArr[1] / this.resultArr.length);
		this.data["realScore"] = this.data["correctRate"] * 100;
		this.data["score"] = this.data["correctRate"] * 100;

		this.data["rUsedTime"] = [];
		this.data["qUsedTime"] = this.qTimeArr;
		this.data["qPassedTime"] = this.managerPassTime();
		this.data["qAnsResult"] = this.resultArr;

		// 兼容老数据 ----------------------------------------------------------------
		this.data["lvCostTime"] = this.data["usedTime"];
		this.data["lvCorrectCount"] = this.data["correctCount"];
		this.data["lvWrongCount"] = this.data["errorCount"];
		this.data["lvCorrectRate"] = this.data["correctRate"];
		this.data["lvWrongRate"] = this.data["errorRate"];

		this.onChangeData && this.onChangeData();*/

	}

	/**
	 * 处理答案  [正确答案的数量,错误答案数量]
	 */
	/*public managerAnswer(): number[] {
		let correctNum: number = 0;
		let wrongNum: number = 0;
		for (let i: number = 0; i < this.resultArr.length; i++) {
			this.resultArr[i] ? correctNum++ : wrongNum++;
		}

		return [correctNum, wrongNum];
	}*/

	/**
	 * 直到回答正确的时间间隔
	 */
	/*public managerPassTime(): number[] {
		let arr: number[] = [];
		let timeOffset: number = 0;
		for (let i: number = 0; i < this.resultArr.length; i++) {
			timeOffset += this.qTimeArr[i];
			if (this.resultArr[i]) {
				arr.push(lyx_math.toFixed(timeOffset));
				timeOffset = 0;
			}
		}
		return arr;
	}*/

	/**
	 * 回答结束之后的回调
	 */
	abstract onAnswerEnd(obj): void;
}