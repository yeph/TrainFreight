import AbGameBridge from "../launcher/AbGameBridge";
import InitGameHandler from "./handler/InitGameHandler";

class SimpleGameBridge extends AbGameBridge {
    protected static instance: SimpleGameBridge = new SimpleGameBridge();

    protected constructor() {
        super();
    }

    public static getInstance(): SimpleGameBridge {
        return this.instance;
    }

    public initGame(): void {
        simpleGameBridge.registerHandler(new InitGameHandler(cc.director.getScene()));
    }

}

let simpleGameBridge = SimpleGameBridge.getInstance();

export default simpleGameBridge;