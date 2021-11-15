import EventMng from "../../../common/manager/EventMng";
import MasterGlobal from "../../../common/MasterGlobal";
import { lyx_math } from "../../../common/utils/LYXMath";
import Optional from "../../../common/utils/Optional";
import ResUtils from "../../../common/utils/ResUtils";
import cfg from "../../../common/vo/ConfigReader";
import { Item } from "../../model/Item";

class GameManager {
    //难度
    public diff: number = 1;
    /** 存放难度 */
    public diffArray = [];
    /** 存放关卡数据 */
    public gameLvlArr = [];
    /** 玩家 */
    public playerWidth: number = null;
    /** 地图宽度 */
    public mapWidth: number = 90;
    /** 地图高度 */
    public mapHeight: number = 90;
    /** 游戏状态 */
    public isgameOver: boolean = false;
    /** 颜色数组 */
    public colorArr = [];
    /** 游戏状态 */
    public gameState: boolean = true;

    public levelSmallArr = [];//当前难度需要显示的记忆顺序

    public speedRed: number = 180;

    public speedBlue: number = 180;

    public speedGuide: number = 180;

    public redFullFoods: boolean = false;

    public blueFullFoods: boolean = false;

    public redGuideFullFoods: boolean = false;

    public blueGuideFullFoods: boolean = false;

    public tempRedFullFoods: boolean = false;

    public tempBlueFullFoods: boolean = false;

    public tempShow: boolean = false;

    public isPeng: boolean = false;

    public errorCount = 2; //捡起的错误次数

    public isShowGuide: boolean = false;

    public count = 0;   //点了几次

    public isShowRed: boolean = false;

    public boxUrl: string = "train_bule_carriage";
    public boxGuideUrl: string = "train_bule_carriage";

    public correctCombo: number = 0;
    public errorCombo: number = 0;

    public showLab: string = '';
    public showType: number = 1;

    public init(): void {
        this.diff = cfg.startDifficulty;
        MasterGlobal.difficulty = this.diff;
        this.diffArray = [this.diff];
    }

    // 连续正确或者连续错误记录
    public record(num: number) {
        cc.log(this.correctCombo)
        cc.log(this.errorCombo)
        if (num == 0) {
            this.correctCombo++;
            this.errorCombo = 0;
            if (this.correctCombo == 1) {
                this.saveDiff(1);
                this.correctCombo = 0;
                // EventMng.emit("refleshInfo");
                return 1
            }
        } else {
            this.errorCombo++;
            this.correctCombo = 0;
            if (this.errorCombo == 1) {
                this.saveDiff(-1);
                this.errorCombo = 0;
                return 2
            }
        }
    }

    public initCombo() {
        this.correctCombo = 0;
        this.errorCombo = 0;
    }

    /**
     * 存放难度
     *  @param num
    */
    saveDiff(num: number) {
        cc.log('存放难度了！！！！！！！！！！！！！');
        // 难度要大于1小与最大关卡数
        this.diff += num;
        if (this.diff == 0) {
            this.diff = 1;
        }
        if (this.diff >= cfg.maxLevel) {
            this.diff = cfg.maxLevel;
        }
        if (this.diff <= 0) {
            this.diff = 1;
        }
        MasterGlobal.difficulty = this.diff;
        this.diffArray.push(this.diff);
        console.log(this.diffArray + '难度数组');
    }

    /**
    *  获取当前平均难度
    */
    getAverageDiff() {
        let sum: number = 0;
        this.diffArray.forEach(e => { sum += e; });
        return Math.round(sum / this.diffArray.length);
    }

    /**
    * 安全获取SpriteFrame，兼容自动图集和手动图集方式加载SpriteFrame
    * @param url 
    * @param atlasUrl 
    */
    public getSpriteFrame(url: string, atlasUrl: string = "subgame:./texture/AutoAtlas"): cc.SpriteFrame {
        let op: Optional<cc.SpriteFrame> = Optional.of(ResUtils.getAsset<cc.SpriteFrame>(url, cc.SpriteFrame));
        let name = url;
        let idx = name.lastIndexOf("/");
        if (idx < 0) idx = name.lastIndexOf(":");
        if (idx >= 0) {
            name = name.substring(idx + 1);
        }
        let atlasUrls = [];
        for (let i = 0; i < 10; i++) atlasUrls.push(atlasUrl + i);
        return op.orElse(this.getSpriteFrameFromAtlas(atlasUrls, name));
    }

    private getSpriteFrameFromAtlas(atlasUrls: string[], spriteFrameName: string): cc.SpriteFrame {
        let op = null
        for (let i = 0; i < atlasUrls.length; i++) {
            op = Optional.of(ResUtils.getAsset<cc.SpriteAtlas>(atlasUrls[i], cc.SpriteAtlas)).map(it => it.getSpriteFrame(spriteFrameName));
            if (op.empty()) continue;
        }
        return op.get();
    }
}
export let gameManager: GameManager = new GameManager();