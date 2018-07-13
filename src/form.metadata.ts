import {Validator, Validators} from "@angular/forms";
import {ObjectTransformer} from "@digitalascetic/ngx-object-transformer";

export function ControlTransform(transformer: ObjectTransformer) {
    return Reflect.metadata("ControlTransform", transformer);
}

export function ControlExclude(func?: Function) {
    if (!func) {
        func = function () {
            return true;
        };
    }
    return Reflect.metadata("ControlExclude", func);
}

export interface ControlReplaceOptions {
    excludeIfNull?: boolean;
    asFormControlIfNull?: boolean;
}

export function ControlReplace(prop: string, options?: ControlReplaceOptions) {

    if (!options) {
        options = {
            excludeIfNull: true,
            asFormControlIfNull: false
        };
    }

    return Reflect.metadata("ControlReplace", {
        prop: prop,
        excludeIfNull: options.excludeIfNull,
        asFormControlIfNull: options.asFormControlIfNull
    });
}

export function ControlValidators(validators: Array<Validator | Validators> = []) {
    return Reflect.metadata("ControlValidators", validators);
}

export function ControlWrapper(func?: Function) {
    if (!func) {
        func = function () {
            return true;
        };
    }
    return Reflect.metadata("ControlWrapper", func);
}
