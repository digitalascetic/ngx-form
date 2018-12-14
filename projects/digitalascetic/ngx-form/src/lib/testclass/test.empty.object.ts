import {Type} from '@digitalascetic/ngx-reflection';

export class TestEmptyObject {

    @Type()
    private _param1: number;

    @Type()
    private _param2: string;

    constructor() {
    }

    get param1(): number {
        return this._param1;
    }

    set param1(value: number) {
        this._param1 = value;
    }

    get param2(): string {
        return this._param2;
    }

    set param2(value: string) {
        this._param2 = value;
    }
}
