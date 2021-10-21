import { EHandlerResult } from "../../common/bridge/EHandlerResult";
import Handler from "../../common/bridge/Handler";
import { ViewZorder } from "../../common/const/ViewZOrder";
import UIMng from "../../common/manager/UIMng";
import MasterGlobal from "../../common/MasterGlobal";
import { lyx_math } from "../../common/utils/LYXMath";
import UIHelp from "../../common/utils/UIHelp";
import cfg from "../../common/vo/ConfigReader";
import { Package, PackageType } from "../data/const/DefineConst";
import GameController from "../GameController";
import UIResultDialog from "../logic/ui/common/UIResultDialog";
import UITransition from "../logic/ui/common/UITransition";
import UIFrame from "../logic/ui/prefab/UIFrame";
import { lyx_bridge } from "../manager/LYXBridge";
import simpleFrameBridge from "../SimpleFrameBridge";

export default class GameOverHandler extends Handler {
    public uiFrame: UIFrame;
    public constructor(uiFrame: UIFrame) {
        super(uiFrame.node);

        this.uiFrame = uiFrame;
    }

    public handleRequest(msg: string, callback?: (...args: any[]) => void): EHandlerResult {
        if (msg.startsWith("gameover")) {

            MasterGlobal.isOver = true;

            MasterGlobal.data["id"] = GameController.gameId;
            MasterGlobal.data["lv"] = GameController.curLevel;
            MasterGlobal.data["newGameFlag"] = 1;
            MasterGlobal.data["newGameVersion"] = cfg.version;

            MasterGlobal.data["maxLv"] = cfg.maxLevel
            MasterGlobal.data["lvWin"] = MasterGlobal.data["lvWin"] == false ? false : true;  //是否过关，现在默认是过关，如果特殊在自己的UIGame里面进行重写
            MasterGlobal.data["score"] = lyx_math.toFixed(MasterGlobal.data["score"], 2);
            MasterGlobal.data["realScore"] = MasterGlobal.data["score"];

            MasterGlobal.data["correctRate"] =
                lyx_math.toFixed(MasterGlobal.data["correctCount"] / (MasterGlobal.data["errorCount"] + MasterGlobal.data["correctCount"])) || 0;
            MasterGlobal.data["errorRate"] =
                lyx_math.toFixed(MasterGlobal.data["errorCount"] / (MasterGlobal.data["errorCount"] + MasterGlobal.data["correctCount"])) || 0;

            MasterGlobal.data["rUsedTime"] = MasterGlobal.data["rUsedTime"] || [];
            MasterGlobal.data["qUsedTime"] = MasterGlobal.data["qUsedTime"] || [];
            MasterGlobal.data["qPassedTime"] = MasterGlobal.data["qPassedTime"] || [];
            MasterGlobal.data["qAnsResult"] = MasterGlobal.data["qAnsResult"] || [];
            // 兼容老数据 ----------------------------------------------------------------
            MasterGlobal.data["lvCostTime"] = MasterGlobal.data["usedTime"];
            MasterGlobal.data["lvCorrectCount"] = MasterGlobal.data["correctCount"];
            MasterGlobal.data["lvWrongCount"] = MasterGlobal.data["errorCount"];
            MasterGlobal.data["lvCorrectRate"] = MasterGlobal.data["correctRate"];
            MasterGlobal.data["lvWrongRate"] = MasterGlobal.data["errorRate"];
            if (MasterGlobal.data["score"] < 0) {
                MasterGlobal.data["score"] = 0;
            }
            if (MasterGlobal.data["realScore"] < 0) {
                MasterGlobal.data["realScore"] = 0;
            }
            cc.log("待提交的数据：", MasterGlobal.data);
            //将结果传给原生app
            if (Package.TYPE == PackageType.APP) {
                lyx_bridge.sendData(MasterGlobal.data, (res) => {
                    res == "continue" && this.doProgressFlow();
                });
            } else {
                this.doProgressFlow();
            }
        }
        return EHandlerResult.CONTINUE;
    }

    /**
     * 后面的流程处理
     * @param flag 
     */
    public doProgressFlow(): void {
        let fun = () => {
            simpleFrameBridge.sendMessage("cleargame");
            UIHelp.ShowUI(UITransition, ViewZorder.UI, () => {
                UIMng.getInstance().closeFilterAllUI(UITransition);
            }, null, () => {
                UIHelp.ShowUI(UIFrame, ViewZorder.Float);
            });
        };

        if (Package.TYPE == PackageType.APP) {
            if (cfg.maxLevel <= GameController.curLevel) {
                lyx_bridge.sendState("passalllevel", () => { fun && fun(); });
            } else {
                lyx_bridge.sendState("passlevel", () => { fun && fun(); });
            }
        }

        //开发过程中、web包、微信小游戏
        if (Package.TYPE == PackageType.DEV || Package.TYPE == PackageType.WEB || Package.TYPE == PackageType.WX) {
            UIHelp.ShowUI(UIResultDialog, ViewZorder.Dialog, null, null, true, MasterGlobal.data, () => { fun && fun(); });
        }
    }

}