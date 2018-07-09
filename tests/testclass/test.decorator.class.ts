import {Type} from "@digitalascetic/ngx-reflection";
import {ControlExclude, ControlReplace} from "../../src";
import {TestDescription} from "./test.description";


export class TestDecoratorClass {

    @ControlReplace("id")
    @Type(TestDescription)
    private _description: TestDescription;

    @Type(TestDescription)
    @ControlReplace("id", {excludeIfNull: false, asFormControlIfNull: true})
    private _description2: TestDescription;

    @ControlExclude()
    private _notInForm: string;

    private _inForm: number;

    constructor(description: TestDescription, notInForm: string, inForm: number, description2?: TestDescription) {
        this._description = description;
        this._notInForm = notInForm;
        this._inForm = inForm;
        this._description2 = description2;
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
}
