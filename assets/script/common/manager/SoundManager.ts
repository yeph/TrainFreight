import ResUtils from "../utils/ResUtils";

/**
 * 音效管理类
 */
class SoundManager {

    music: string = "";
    state: boolean = false;
    audioId = null;

    private getMusic(url: string) {
        return ResUtils.getAsset<cc.AudioClip>(url, cc.AudioClip);
    }

    //设置音效音量
    setEffectsVolume(volume) {
        cc.audioEngine.setEffectsVolume(volume);
    }

    /**
     * 获取当前音效的时长
     */
    getMusicDuration() {
        if (this.audioId == null) {
            cc.log("No music is playing!");
            return -1;
        }

        return cc.audioEngine.getDuration(this.audioId);
    }

    /**
     * 播放引导音效
     * @param fxName 音效名称
     */
    playGuideFx(fxName: string, onStart = null, onFinish = null) {
        let audio = this.getMusic(fxName);
        if (audio) {
            this.audioId = cc.audioEngine.playEffect(audio, false);

            onStart && onStart();
            onFinish && cc.audioEngine.setFinishCallback(this.audioId, () => {
                this.audioId = null;
                onFinish();
            });
        }
    }


    /**
     * 播放普通音效
     * @param fxName 
     */
    playFx(fxName: string) {
        let audio = this.getMusic(fxName);
        audio && cc.audioEngine.playEffect(audio, false);
    }

    /**
     * 关闭正在播放的音效
     */
    stopCurEffect(): void {
        this.audioId != null && cc.audioEngine.stopEffect(this.audioId);
    }

    //播放背景音乐
    playMusic(musicName: string) {
        if (this.music != musicName) {
            this.state = false;
        }
        this.music = musicName;
        this.state = true;
        let audio = this.getMusic(musicName);
        audio && cc.audioEngine.playMusic(audio, true);
    }

    //停止播放背景音乐
    stopMusic() {
        cc.audioEngine.stopMusic();
    }

    //暂停播放背景音乐
    pauseMusic() {
        cc.audioEngine.pauseMusic();
    }

    //恢复播放背景音乐
    resumeMusic() {
        if (this.state) {
            cc.audioEngine.resumeMusic();
        } else if (!this.state && this.music != "") {
            let audio = this.getMusic(this.music);
            audio && cc.audioEngine.playMusic(audio, true);
        }
    }
}

export let soundManager: SoundManager = new SoundManager();