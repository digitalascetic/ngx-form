import {Type} from "@digitalascetic/ngx-reflection";
import {TestDescription} from "./test.description";


export class TestClass {

    private _name: string;

    @Type(() => TestDescription)
    private _description: TestDescription;

    @Type(() => Date)
    private _startDate: Date;

    constructor(name: string, description: TestDescription, startDate?: Date) {
        this._name = name;
        this._description = description;
        this._startDate = startDate;
    }

    get name(): string {
        return this._name;
    }

    get description(): TestDescription {
        return this._description;
    }

    get startDate(): Date {
        return this._startDate;
    }
}
