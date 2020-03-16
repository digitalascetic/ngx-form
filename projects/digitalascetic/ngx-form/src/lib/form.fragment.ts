import {AbstractFormPart} from './abstract.form.part';
import {AbstractControl, FormGroup} from '@angular/forms';
import {FormPartType} from './form.part.type';

/**
 * Class describing a form that can be dynamically rendered.
 *
 * e.g. this object might be rendered as a form fragment of two fields, username and password
 * on a single row, grouped with a "group" tag and name "Credentials"
 *
 * let username = new FormField('username', 'Username');
 * let password = new FormField('password', 'Password', 'password');
 * let form = new FormFragment(FormFragmentType.FIELD_GROUP, 'Credentials');
 * let credentialsRow = new FormFragment(FormFragmentType.SAME_ROW);
 * credentialsRow.fields.push(username, password);
 * form.subForms.push(credentialsRow);
 *
 */
export class FormFragment extends AbstractFormPart {

    private _parts: Array<AbstractFormPart>;

    constructor(type: FormPartType = FormPartType.GROUP_DEFAULT, key?: string, label?: string, options?: any) {
        super(type, key, label, options);
        this._parts = [];
    }

    public getParts(): IterableIterator<AbstractFormPart> {
        return this._parts[Symbol.iterator]();
    }

    public insertPart(...parts: AbstractFormPart[]) {
        parts.forEach(
            part => {
                part.parent = this;
                this._parts.push(part);
            }
        );
    }

    public replacePart(part: AbstractFormPart, index: number) {
        part.parent = this;
        this._parts[index].parent = null;
        this._parts[index] = part;
    }

    public getControl(): AbstractControl {

        let frmGrp = new FormGroup({});
        this.visitFragmentParts(this.getParts(), frmGrp);
        if (Object.getOwnPropertyNames(frmGrp.controls).length > 0) {
            return frmGrp;
        }
        return null;
    }

    private visitFragmentParts(parts: IterableIterator<AbstractFormPart>, frmGrp: FormGroup) {

        let item: IteratorResult<AbstractFormPart>;
        let formPart: AbstractFormPart;

        while (true) {

            item = parts.next();

            if (item.done) {
                break;
            }

            formPart = item.value;

            let key = formPart.key;
            let control = formPart.getControl();
            if (key && control) {
                frmGrp.addControl(key, control);
            } else {
                if (formPart instanceof FormFragment) {
                    this.visitFragmentParts((<FormFragment>formPart).getParts(), frmGrp);
                }
            }

        }

    }


}
