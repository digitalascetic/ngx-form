import {AbstractControl, FormArray, FormGroup, FormControl} from "@angular/forms";
import {Injectable} from "@angular/core";
import "reflect-metadata";
import {PropertyNameMapper} from "@digitalascetic/ngx-object-transformer";
import {ReflectionService} from "@digitalascetic/ngx-reflection";
import {FormServiceConfiguration} from "./form.service.configuration";

@Injectable()
export class FormService {

    private static DEFAULT_OPTIONS = {
        control: {dirtyOnModification: true},
        modifiedValues: {forceInclude: false, includeEntireArray: true, alwaysIncludeProps: []}
    };

    private _propMapper: PropertyNameMapper;

    private _reflectionService: ReflectionService;

    /**
     *
     */
    private _options: {
        control?: { dirtyOnModification?: boolean },
        modifiedValues?: { forceInclude?: boolean, includeEntireArray?: boolean, alwaysIncludeProps?: Array<string> }
    };

    constructor(configuration: FormServiceConfiguration = new FormServiceConfiguration()) {
        this._propMapper = configuration.propertyMapper;
        this._options = {};
        Object.assign(this._options, FormService.DEFAULT_OPTIONS);
        if (configuration.options) {
            Object.assign(this._options, configuration.options);
        }
        this._reflectionService = new ReflectionService();
    }

    /**
     * Given an object or a class returns an AbstractControl representing it.
     * Reads and understands ObjectTransformer decorations
     *
     * @param obj
     * @return
     */
    public getControl(obj: any, propertiesObj ?: any, options ?: { dirtyOnModification?: boolean }): AbstractControl {

        options = Object.assign({}, this._options.control, options);


        if (typeof obj === 'function') {
            if (obj === Date) {
                return this.getControl(propertiesObj);
            }
            return this.getControl(Reflect.construct(obj, []), propertiesObj);
        }

        if (Array.isArray(obj)) {

            let ctrlArr: Array<AbstractControl> = [];
            obj.forEach(
                item => {
                    ctrlArr.push(this.getControl(item, null, options));
                }
            );
            let frmArr = new FormArray(ctrlArr);
            return frmArr;
        }

        if (obj instanceof Object && !(obj instanceof Date)) {

            let ctrlObj = {};

            this._reflectionService.getObjectProperties(obj).forEach(
                prop => {

                    let transProp = this._propMapper ? this._propMapper.getTransformedName(prop) : prop;

                    let excludeFunc = Reflect.getMetadata('ControlExclude', obj, prop);

                    if (excludeFunc && excludeFunc(obj, prop)) {
                        return;
                    }

                    let replacePropObj = Reflect.getMetadata('ControlReplace', obj, prop);

                    if (replacePropObj) {

                        if (replacePropObj['excludeIfNull']
                            && (!propertiesObj || !propertiesObj[transProp])
                            && (!obj[prop])) {
                            return;
                        }

                        let replaceProp = replacePropObj['prop'];
                        let replaceObject = {};

                        if (propertiesObj && propertiesObj[transProp]) {
                            replaceObject[replaceProp] = propertiesObj[transProp][replaceProp];
                        } else {
                            if (obj[prop]) {
                                replaceObject[replaceProp] = obj[prop][this._propMapper.getOriginalName(replaceProp)];
                            } else {
                                replaceObject[replaceProp] = null;
                            }
                        }

                        ctrlObj[transProp] = this.getControl(replaceObject, null, options);

                        return;

                    }

                    let typeProp = this._reflectionService.getObjectPropertyType(obj, prop);

                    if (!obj[prop] && typeof typeProp === 'function' && this.isNotPrimitive(typeProp)) {
                        ctrlObj[transProp] = this.getControl(typeProp, propertiesObj ? propertiesObj[transProp] : null, options);
                    } else {
                        ctrlObj[transProp] = this.getControl(obj[prop], propertiesObj ? propertiesObj[transProp] : null, options);
                    }

                }
            );

            return new FormGroup(ctrlObj);
        }

        let fc = new FormControl(obj);

        if (propertiesObj) {
            fc.patchValue(propertiesObj);
            if (options.dirtyOnModification) {
                fc.markAsDirty();
            }
        }

        return fc;

    }

    public updateFromValue(object: any, value: any) {

        if (object instanceof Array) {

            if (value instanceof Array) {
                value.forEach(
                    (valueItem, index) => {
                        this.updateFromValue(object[index], valueItem);
                    }
                );
            } else {
                //TODO Throw exception?
                return;
            }

            return;
        }

        if (object instanceof Object) {
            if (value instanceof Object) {
                Object.getOwnPropertyNames(value).forEach(
                    prop => {

                        let transProp = this._propMapper ? this._propMapper.getOriginalName(prop) : prop;
                        if (object[transProp] instanceof Object) {
                            if (value[prop] instanceof Object) {
                                this.updateFromValue(object[transProp], value[prop]);
                            } else {
                                // TODO throw an exception?
                                return;
                            }
                        } else {
                            if (!(value[prop] instanceof Object)) {
                                object[transProp] = value[prop];
                            } else {
                                // TODO throw an exception?
                                return;
                            }
                        }

                    }
                );
            } else {
                //TODO Throw exception?
                return;
            }

            return;
        }

    }

    public updateFromControl(object: any, control: AbstractControl, updateJustModifiedValues: boolean = true) {

        let value: any;
        if (updateJustModifiedValues) {
            value = control.value;

            //   value = this.getModifiedValues(control);
        } else {
            value = control.value;
        }

        this.updateFromValue(object, value);

    }

    /**
     * Creates custom objects from form values. Given an AbstractControl "value"
     * returns an object of type "clazz" patched with the content of value.
     *
     * @param value, e.g. myControl.value
     * @param clazz, e.g. MyClass
     * @returns an instance of MyClass patched w
     */
    public getObject(value: Object, clazz ?: Function) {

        if (!clazz || !(value instanceof Object)) {
            return value;
        }

        let returnValue = Reflect.construct(clazz, []);

        if (Array.isArray(value)) {
            let arr = [];
            value.forEach(
                item => {
                    arr.push(this.getObject(item, clazz));
                });
            return arr;
        }

        this._reflectionService.getObjectProperties(returnValue).forEach(
            prop => {

                let transProp = this._propMapper ? this._propMapper.getTransformedName(prop) : prop;

                let typeProp = this._reflectionService.getObjectPropertyType(returnValue, prop);

                let replacePropObj = Reflect.getMetadata('ControlReplace', returnValue, prop);

                if (replacePropObj) {

                    let replaceProp = replacePropObj['prop'];

                    if (value[transProp]) {

                        if (this.isNullOrUndefined(value[transProp][replaceProp]) &&
                            replacePropObj['excludeIfNull']) {
                            return;
                        }

                        let replaceValue = value[transProp][replaceProp];
                        let replaceObject = {}
                        replaceObject[replaceProp] = replaceValue;
                        returnValue[prop] = this.getObject(replaceObject, typeProp);
                        return;
                    }

                }

                returnValue[prop] = this.getObject(value[transProp], typeProp);
                return;

            }
        );

        return returnValue;
    }

    /**
     * Get an object with just all modified values of a control
     *
     * @param control
     * @param options
     * @return
     */
    public getModifiedValues(control: AbstractControl,
                             options?: { forceInclude?: boolean, includeEntireArray?: boolean, alwaysIncludeProps?: Array<string> }) {

        options = Object.assign({}, this._options.modifiedValues, options);

        if (control.dirty || options.forceInclude) {

            if (control.value === null || typeof control.value === 'undefined') {
                return control.value;
            }

            if (control instanceof FormControl) {
                return control.value
            }

            if (control instanceof FormArray) {

                let frmArr = <FormArray>control;
                let returnArr = [];
                frmArr.controls.forEach(
                    frmArrCtrl => {
                        if (options.includeEntireArray || frmArrCtrl.dirty || options.forceInclude) {
                            let arrCtrlOptions: any = {};
                            Object.assign(arrCtrlOptions, options);
                            arrCtrlOptions.forceInclude = options.includeEntireArray;
                            returnArr.push(this.getModifiedValues(frmArrCtrl, arrCtrlOptions));
                        }
                    }
                );
                return returnArr;

            }

            if (control instanceof FormGroup) {

                let frmGrp = <FormGroup>control;
                let returnObj = {};

                Object.getOwnPropertyNames(frmGrp.controls).forEach(
                    prop => {
                        if (frmGrp.controls[prop].dirty || options.forceInclude ||
                            (options.alwaysIncludeProps && options.alwaysIncludeProps.indexOf(prop) >= 0)) {
                            let frmGrpOptions: any = {};
                            Object.assign(frmGrpOptions, options);
                            frmGrpOptions.forceInclude = options.forceInclude ||
                                (options.alwaysIncludeProps && options.alwaysIncludeProps.indexOf(prop) >= 0 ? true : false);
                            returnObj[prop] = this.getModifiedValues(frmGrp.controls[prop], frmGrpOptions);
                        }
                    }
                );

                return returnObj;
            }

        }

        return undefined;


    }

    /**
     *
     * @param arrayControl
     * @param itemOrderProp
     * @param reorderedValues
     * @param pristineValues
     */
    public reorderByValues(arrayControl: FormArray, itemOrderProp: string, reorderedValues: Array<Object>, pristineValues: Array<Object>) {

        reorderedValues.forEach(
            (value, index) => {

                if (value[itemOrderProp] != index) {

                    let valueControl = arrayControl.at(value[itemOrderProp]);
                    let itemOrderControl: AbstractControl;
                    if (valueControl) {
                        itemOrderControl = valueControl.get(itemOrderProp);
                    } else {
                        return;
                    }

                    if (pristineValues.length <= index ||
                        (pristineValues[index] && pristineValues[index][itemOrderProp] != value[itemOrderProp])) {
                        itemOrderControl.markAsDirty();
                    } else {
                        itemOrderControl.markAsPristine();
                    }
                    value[itemOrderProp] = index;
                    itemOrderControl.setValue(index);

                }

            }
        );

        this.reorderByProperty(arrayControl, itemOrderProp);
        this.setItemOrderAsIndex(<Array<Object>>arrayControl.value, itemOrderProp);
        this.setItemOrderAsIndex(reorderedValues, itemOrderProp);
    }

    /**
     *
     * @param arrayControl
     * @param prop
     */
    public reorderByProperty(arrayControl: FormArray, prop: string) {

        let bubbleSort = function (control: FormArray) {

            let sortLength = control.value.length - 1;
            let values: Array<any> = control.value;
            let change = false;

            for (let n = 0; n < sortLength; n++) {
                if (values[n][prop] > values[n + 1][prop]) {
                    let tmpControl = control.at(n);
                    control.setControl(n, control.at(n + 1));
                    control.setControl(n + 1, tmpControl);
                    tmpControl = null;
                    change = true;
                }
            }

            if (change) {
                bubbleSort(control);
            }

        };

        bubbleSort(arrayControl);

    }

    private setItemOrderAsIndex(values: Array<any>, prop: string) {

        values.forEach(
            (value, index) => {
                value[prop] = index;
            }
        )

    }

    public patchValue(control: AbstractControl, value: { [key: string]: any }, {onlySelf, emitEvent}: { onlySelf?: boolean, emitEvent?: boolean } = {}): void {

        if (control instanceof FormControl) {
            control.patchValue(value);
        }

        if (control instanceof FormGroup) {
            let fgControl: FormGroup = control as FormGroup;
            Object.keys(value).forEach(name => {
                let transName = this._propMapper ? this._propMapper.getTransformedName(name) : name;
                if (fgControl.controls[transName]) {
                    this.patchValue(fgControl.controls[transName], value[name], {onlySelf: true, emitEvent});
                }
            });
        }

        if (control instanceof FormArray) {
            if (value instanceof Array) {
                let arrControl: FormArray = control as FormArray;
                arrControl.controls.forEach(
                    (arrCtrl, index) => {
                        if (value.length < index)
                            this.patchValue(arrCtrl, value[index], {onlySelf: true, emitEvent});
                    }
                );
            } else {
                return;
            }
        }

        control.updateValueAndValidity({onlySelf, emitEvent});
    }


    private isNotPrimitive(clazz) {
        return (clazz !== Number && clazz !== String);
    }

    private isNullOrUndefined(value) {
        return (value === null || typeof value === "undefined")
    }

}
