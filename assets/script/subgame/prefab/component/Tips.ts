const { ccclass, property } = cc._decorator;

@ccclass
export class Tips extends cc.Component {
    dtY = 0;
    orgPos = new cc.Vec3(0, 0, 0);
    start() {
    }

    setString(str) {
        this.node.getChildByName("lab").getComponent(cc.Label).string = str;
        setTimeout(() => {
            if (this.node && this.node.destroy) {
                this.node.destroy();
            }

        }, 2000);

    }

    setPos(pos) {
        if (pos == null) return;
        this.node.position = pos;
        this.orgPos = pos;
    }



    update(deltaTime: number) {
        this.dtY += deltaTime * 150;
        if (this.dtY < 80) {
            this.node.position = new cc.Vec3(this.orgPos.x, this.orgPos.y + this.dtY, this.orgPos.z);
        }
        else {
            this.node.position = new cc.Vec3(this.orgPos.x, this.orgPos.y + 80, this.orgPos.z);
        }

    }
}
