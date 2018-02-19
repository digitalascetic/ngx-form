import {Validator} from "@angular/forms";
import {ObjectTransformer} from "@digitalascetic/ngx-object-transformer";

export function ControlTransform(transformer: ObjectTransformer) {
    return Reflect.metadata('ControlTransform', transformer);
}

export function ControlExclude(func?: Function) {
    if (!func) {
        func = function () {
            return true;
        }
    }
    return Reflect.metadata('ControlExclude', func);
}

export function ControlReplace(prop: string, excludeIfNull: boolean = true) {
    return Reflect.metadata('ControlReplace', {prop: prop, excludeIfNull: excludeIfNull});
}

export function ControlValidators(validators: Array<Validator> = []) {
    return Reflect.metadata('ControlValidators', validators);
}



