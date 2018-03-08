import {AbstractControl} from '@angular/forms';
import {FormPartType} from './form.part.type';
import {Type} from '@digitalascetic/ngx-reflection';

export abstract class AbstractFormPart {

    protected _key: string;

    protected _label: string;

    @Type(() => FormPartType)
    protected _type: FormPartType;

    @Type(() => AbstractFormPart)
    protected _parent: AbstractFormPart;

    protected _description: string;

    private _options;

    constructor(type: FormPartType, key?: string, label?: string, options?: any) {
        this._type = type;
        this._key = key;
        this._label = label;
        this._options = options;
    }

    get key(): string {
        return this._key;
    }

    set key(value: string) {
        this._key = value;
    }

    get label(): string {
        return this._label;
    }

    set label(value: string) {
        this._label = value;
    }

    get parent(): AbstractFormPart {
        return this._parent;
    }

    set parent(value: AbstractFormPart) {
        this._parent = value;
    }

    get type(): FormPartType {
        return this._type;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get options() {
        return this._options;
    }

    set options(value) {
        this._options = value;
    }

    public abstract getControl(): AbstractControl;

}
