import BaseObject from "../../common/base/BaseObject";
import ResUtils from "../../common/utils/ResUtils";
import simpleGameBridge from "../SimpleGameBridge";
import StartGuideHandler from "../handler/StartGuideHandler";
import StartGameHandler from "../handler/StartGameHandler";

export default class UIGame extends BaseObject {

    public startGameCallback;  //开始游戏的回调

    public constructor() {
        super(ResUtils.getAsset<cc.Prefab>("subgame:./prefab/Game"));

        simpleGameBridge.registerHandler(new StartGuideHandler(this));
        simpleGameBridge.registerHandler(new StartGameHandler(this));
    }

    public onLoad(): void {
       
    }

    
    public onDestroy(): void {
        
    }
}