import {AbstractFormPart} from "./abstract.form.part";
import {AbstractControl, FormControl} from "@angular/forms";
import {FormPartType} from "./form.part.type";

/**
 *
 */
export class FormField extends AbstractFormPart {

    protected _placeHolder: string;

    protected _defaultValue: any;

    protected _possibleValues: {key: string, value: string}[] = [];

    constructor(key: string, label?: string, type: FormPartType = FormPartType.FIELD_TEXT,
                possibleValues?: {key: string, value: string}[], options?: any) {
        super(type, key, label, options);
        this._possibleValues = possibleValues;
    }

    get placeHolder(): string {
        return this._placeHolder;
    }

    set placeHolder(value: string) {
        this._placeHolder = value;
    }

    get defaultValue(): any {
        return this._defaultValue;
    }

    set defaultValue(value: any) {
        this._defaultValue = value;
    }

    get possibleValues(): {key: string; value: string}[] {
        return this._possibleValues;
    }

    set possibleValues(value: {key: string; value: string}[]) {
        this._possibleValues = value;
    }

    getControl(): AbstractControl {
        return new FormControl(this._defaultValue);
    }


}
