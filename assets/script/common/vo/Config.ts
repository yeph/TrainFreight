
export default class Config extends Object {
    
    public constructor(json?: any) {
        super(json);
    }
    
    gameConfig: {
        maxLevel: any;
        curLevel: any;
        titleConfig: {
            titleBgOpacity: any;
            titleTxtColor: any;
            titleBgColor: any;
        };
        myGameConfig: {
            itemDelayTime: any;
            DurationTime: any;
        };
        round: any;
        name: any;
        timedown: {
            val: any;
            color: any;
            musicStart: any;
            musicEnd: any;
        };
        guideMsg: {
            sound: any;
            content: any;
        }[];
        nameConfig: {
            nameBgColor: any;
            nameTxtColor: any;
            nameBgOpacity: any;
        };
        version: any;
        musicBg: any;
        timeout: any;
    };
    
    difficultyConfig: {
        speedBlue: any;
        speedRed: any;
        showRedGoods: any;
        diff: any;
        goodsScore: any;
        map: any;
        totalScore: any;
        trainCount: any;
        errorScore: any;
    }[];
    
    levelConfig: {
        lv: any;
        levelTitle: any;
        startDifficulty: any;
    }[];
    
    mapConfig: {
        road: any[];
        goods: any[];
        mapId: any;
        roadChange: any[];
        train: any[];
    }[];
    
}