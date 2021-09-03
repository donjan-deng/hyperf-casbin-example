import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Helper } from '../../helpers/helper';
import * as moment from 'moment';
import { AppService } from '../../services/app.service';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  templateUrl: './login.component.html',
  styles: [
    `
      .login-form {
        max-width: 400px;
        margin:10% auto;
      }

      .login-form-forgot {
        float: right;
      }
      .login-form-margin {
        margin-bottom: 16px;
      }
      .login-form-button {
        width: 100%;
      }
    `
  ]
})

export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private storage: LocalStorageService,
    public app: AppService
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      // captcha: ['', [Validators.required]],
      remember: [false]
    });
  }
  submitForm() {
    Helper.validateForm(this.loginForm);
    if (this.loginForm.valid) {
      this.http.post('/admin/login', this.loginForm.value).subscribe((data: any) => {
        data.expires_time = moment().add(data.expires_in - 200, 'seconds');
        this.storage.store('token', data);
        this.app.get();
        this.router.navigate(['/index'], { queryParams: { refresh: true } });
      });
    }
    //批量赋值
    // this.profileForm.patchValue({
    //   firstName: 'Nancy',
    //   address: {
    //     street: '123 Drew Street'
    //   }
    // });
  }
  // 刷新验证码
  refreshCaptcha($event) {
    $event.target.src += '&t=' + (new Date()).getTime();
  }
}
