import { FormGroup, FormControl, FormArray } from '@angular/forms';

export class Helper {
    static validateForm(form) {
        // tslint:disable-next-line:forin
        for (const key in form.controls) {
            let e = form.controls[key];
            if (e instanceof FormGroup) {
                this.validateForm(e);
            } else if (e instanceof FormArray) {
                this.validateForm(e);
            }
            else if (e instanceof FormControl) {
                e.markAsDirty();
                e.updateValueAndValidity();
            }
        }
    }
    static resetForm(form) {
        form.reset();
        // tslint:disable-next-line:forin
        for (const key in form.controls) {
            let e = form.controls[key];
            if (e instanceof FormGroup) {
                this.validateForm(e);
            } else if (e instanceof FormControl) {
                e.setValue('');
                e.markAsPristine();
                e.updateValueAndValidity();
            }
        }
    }
}
