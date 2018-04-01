import {TestClass} from "./test.class";
import {Type} from "@digitalascetic/ngx-reflection";

export abstract class AbstractTestClass {

    @Type(() => TestClass)
    protected _testClass: TestClass;

    constructor(testClass: TestClass, id: number = undefined) {
        this._testClass = testClass;
    }

    get testClass(): TestClass {
        return this._testClass;
    }

    set testClass(value: TestClass) {
        this._testClass = value;
    }
}
