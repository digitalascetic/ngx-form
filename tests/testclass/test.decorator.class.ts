import {Type} from "@digitalascetic/ngx-reflection";
import {ControlExclude, ControlReplace} from "../../src";
import {TestDescription} from "./test.description";
import {TestEmptyObject} from "./test.empty.object";


export class TestDecoratorClass {

    @ControlReplace("id")
    @Type(() => TestDescription)
    private _description: TestDescription;

    @Type(() => TestDescription)
    @ControlReplace("id", {asFormControlIfNull: true})
    private _description2: TestDescription;

    @Type(() => TestDescription)
    private _description3: TestDescription;

    @ControlExclude()
    private _notInForm: string;

    private _inForm: number;

    @Type(() => TestEmptyObject)
    private _emptyObject: TestEmptyObject;

    constructor(description: TestDescription, notInForm: string, inForm: number, description2?: TestDescription, description3?: TestDescription) {
        this._description = description;
        this._notInForm = notInForm;
        this._inForm = inForm;
        this._description2 = description2;
        this._description3 = description3;
    }

    get description(): TestDescription {
        return this._description;
    }

    get notInForm(): string {
        return this._notInForm;
    }

    get inForm(): number {
        return this._inForm;
    }

    get description2(): TestDescription {
        return this._description2;
    }

    get description3(): TestDescription {
        return this._description3;
    }

    get emptyObject(): TestEmptyObject {
        return this._emptyObject;
    }

    set emptyObject(value: TestEmptyObject) {
        this._emptyObject = value;
    }
}
