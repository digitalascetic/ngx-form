export class TestDescription {

    private _id: number;

    private _text: string;

    constructor(text: string, id?: number) {
        this._text = text;
        this._id = id;
    }

    get id(): number {
        return this._id;
    }

    get text(): string {
        return this._text;
    }
}
