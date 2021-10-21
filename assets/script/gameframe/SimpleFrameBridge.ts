import MasterGlobal from "../common/MasterGlobal";
import AbFrameBridge from "../launcher/AbFrameBridge";
import { Package, PackageType } from "./data/const/DefineConst";
import GameController from "./GameController";

class SimpleFrameBridge extends AbFrameBridge {
    protected static instance: SimpleFrameBridge = new SimpleFrameBridge();

    protected constructor () {
        super();
    }

    public static getInstance(): SimpleFrameBridge {
        return this.instance;
    }

    public initFrame(): void {
        Package.TYPE = MasterGlobal.isDebugMode ? PackageType.DEV : PackageType.APP;
        cc.assetManager.loadBundle("gameframe", (err, bundle) => {
            GameController.init();
        });
    }

}

let simpleFrameBridge = SimpleFrameBridge.getInstance();

export default simpleFrameBridge;