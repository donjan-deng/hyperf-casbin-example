import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Helper } from '../../helpers/helper';
import { AppService } from '../../services/app.service';

@Component({
    templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
    loading = false;
    form = this.fb.group({
        password: [],
        confirm_password: []
    });
    constructor(
        private http: HttpClient,
        private fb: FormBuilder,
        private modal: NzModalService,
        public app: AppService
    ) {
    }
    ngOnInit(): void {
    }
    save() {
        Helper.validateForm(this.form);
        if (this.form.valid) {
            const data = this.form.value;
            this.loading = true;
            this.http.put('/admin/profile', data).subscribe(() => {
                this.loading = false;
                this.modal.success({
                    nzTitle: 'This is a success message',
                    nzContent: '保存成功'
                });
            },
                error => {
                    this.loading = false;
                });
        }
    }
}
