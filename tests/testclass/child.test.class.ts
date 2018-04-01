import {TestDescription} from "./test.description";
import {Type} from "@digitalascetic/ngx-reflection";
import {AbstractTestClass} from "./abstract.test.class";
import {TestClass} from "./test.class";


export class ChildTestClass extends AbstractTestClass {

    @Type()
    private _childType: number;

    constructor(name: string, description: string, startDate: Date, childType: number) {
        const testDescription = new TestDescription(description);
        const testClass = new TestClass(name, null);
        testClass.description = testDescription;
        testClass.startDate = startDate;
        super(testClass);
        this._childType = childType;
    }

    get childType(): number {
        return this._childType;
    }
}
