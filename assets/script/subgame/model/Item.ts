export class Item {
    /** 图片id */
    public id: number = 1;
    public color = [];
    public isCorrect: boolean;

    constructor(data) {
        this.id = data["id"];
        this.color = data["color"];
        this.isCorrect = data['isCorrect'];
    }
}