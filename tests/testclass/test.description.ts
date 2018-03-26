import {Type} from "@digitalascetic/ngx-reflection";

export class TestDescription {

    private _id: number;

    private _text: string;

    @Type()
    private _active: boolean;

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

    get active(): boolean {
        return this._active;
    }

    set active(value: boolean) {
        this._active = value;
    }
}
