import {Type} from "@digitalascetic/ngx-reflection";
import {TestDescription} from "./test.description";


export class TestClass {

    public static STATUS_STARTED: string = 'STARTED';

    public static STATUS_NOT_STARTED: string = 'NOT STARTED';

    private _name: string;

    private _status: string = TestClass.STATUS_NOT_STARTED;

    @Type(() => TestDescription)
    private _description: TestDescription;

    @Type(() => Date)
    private _startDate: Date;

    constructor(name: string, description: TestDescription, startDate?: Date) {
        this._name = name;
        this._description = description;
        this._startDate = startDate;

        if (startDate) {
            this._status = TestClass.STATUS_STARTED;
        }
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

    get status(): string {
        return this._status;
    }
}
