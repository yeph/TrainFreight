import { EHandlerResult } from "../../common/bridge/EHandlerResult";
import Handler from "../../common/bridge/Handler";
import UIGame from "../prefab/UIGame";

export default class InitGameHandler extends Handler {

    public constructor(node: cc.Node) {
        super(node);
    }

    public handleRequest(msg: string, callback?: (...args: any[]) => void): EHandlerResult {
        if (msg === "initgame") {
            cc.director.getScene().addChild(new UIGame().node, 0);
            callback && callback();
        }
        return EHandlerResult.CONTINUE;
    }

}