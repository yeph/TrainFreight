import MasterGlobal from "../MasterGlobal";

export class ConfigReader {

    public get level(): number {
        return MasterGlobal.level;
    }

    public get difficulty(): number {
        if (MasterGlobal.difficulty == null) MasterGlobal.difficulty = this.startDifficulty;
        return MasterGlobal.difficulty;
    }

    public get gameConfig(): any {
        return MasterGlobal.config.gameConfig;
    }

    public get maxLevel(): any {
        return MasterGlobal.config.gameConfig.maxLevel;
    }

    public get curLevel(): any {
        return MasterGlobal.config.gameConfig.curLevel;
    }

    public get titleConfig(): any {
        return MasterGlobal.config.gameConfig.titleConfig;
    }

    public get titleBgOpacity(): any {
        return MasterGlobal.config.gameConfig.titleConfig.titleBgOpacity;
    }

    public get titleTxtColor(): any {
        return MasterGlobal.config.gameConfig.titleConfig.titleTxtColor;
    }

    public get titleBgColor(): any {
        return MasterGlobal.config.gameConfig.titleConfig.titleBgColor;
    }

    public get myGameConfig(): any {
        return MasterGlobal.config.gameConfig.myGameConfig;
    }

    public get itemDelayTime(): any {
        return MasterGlobal.config.gameConfig.myGameConfig.itemDelayTime;
    }

    public get DurationTime(): any {
        return MasterGlobal.config.gameConfig.myGameConfig.DurationTime;
    }

    public get round(): any {
        return MasterGlobal.config.gameConfig.round;
    }

    public get name(): any {
        return MasterGlobal.config.gameConfig.name;
    }

    public get timedown(): any {
        return MasterGlobal.config.gameConfig.timedown;
    }

    public get val(): any {
        return MasterGlobal.config.gameConfig.timedown.val;
    }

    public get color(): any {
        return MasterGlobal.config.gameConfig.timedown.color;
    }

    public get musicStart(): any {
        return MasterGlobal.config.gameConfig.timedown.musicStart;
    }

    public get musicEnd(): any {
        return MasterGlobal.config.gameConfig.timedown.musicEnd;
    }

    public get guideMsg(): any[] {
        return MasterGlobal.config.gameConfig.guideMsg;
    }

    public get nameConfig(): any {
        return MasterGlobal.config.gameConfig.nameConfig;
    }

    public get nameBgColor(): any {
        return MasterGlobal.config.gameConfig.nameConfig.nameBgColor;
    }

    public get nameTxtColor(): any {
        return MasterGlobal.config.gameConfig.nameConfig.nameTxtColor;
    }

    public get nameBgOpacity(): any {
        return MasterGlobal.config.gameConfig.nameConfig.nameBgOpacity;
    }

    public get version(): any {
        return MasterGlobal.config.gameConfig.version;
    }

    public get musicBg(): any {
        return MasterGlobal.config.gameConfig.musicBg;
    }

    public get timeout(): any {
        return MasterGlobal.config.gameConfig.timeout;
    }

    public get difficultyConfig(): any[] {
        return MasterGlobal.config.difficultyConfig;
    }

    public get speedBlue(): any {
        return MasterGlobal.config.difficultyConfig[this.difficulty].speedBlue;
    }

    public get speedRed(): any {
        return MasterGlobal.config.difficultyConfig[this.difficulty].speedRed;
    }

    public get showRedGoods(): any {
        return MasterGlobal.config.difficultyConfig[this.difficulty].showRedGoods;
    }

    public get diff(): any {
        return MasterGlobal.config.difficultyConfig[this.difficulty].diff;
    }

    public get goodsScore(): any {
        return MasterGlobal.config.difficultyConfig[this.difficulty].goodsScore;
    }

    public get map(): any {
        return MasterGlobal.config.difficultyConfig[this.difficulty].map;
    }

    public get totalScore(): any {
        return MasterGlobal.config.difficultyConfig[this.difficulty].totalScore;
    }

    public get trainCount(): any {
        return MasterGlobal.config.difficultyConfig[this.difficulty].trainCount;
    }

    public get errorScore(): any {
        return MasterGlobal.config.difficultyConfig[this.difficulty].errorScore;
    }

    public get levelConfig(): any[] {
        return MasterGlobal.config.levelConfig;
    }

    public get lv(): any {
        return MasterGlobal.config.levelConfig[this.level].lv;
    }

    public get levelTitle(): any {
        return MasterGlobal.config.levelConfig[this.level].levelTitle;
    }

    public get startDifficulty(): any {
        return MasterGlobal.config.levelConfig[this.level].startDifficulty;
    }

    public get mapConfig(): any[] {
        return MasterGlobal.config.mapConfig;
    }

    public get road(): any[] {
        return MasterGlobal.config.mapConfig[this.map].road;
    }

    public get goods(): any[] {
        return MasterGlobal.config.mapConfig[this.map].goods;
    }

    public get mapId(): any {
        return MasterGlobal.config.mapConfig[this.map].mapId;
    }

    public get roadChange(): any[] {
        return MasterGlobal.config.mapConfig[this.map].roadChange;
    }

    public get train(): any[] {
        return MasterGlobal.config.mapConfig[this.map].train;
    }


}

let cfg = new ConfigReader();

export default cfg;
