import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import { LocalStorageService } from 'ngx-webstorage';

// 拦截器
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private notification: NzNotificationService,
    private modalService: NzModalService,
    private storage: LocalStorageService
  ) {

  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.storage.retrieve('token');
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token.access_token}`
        }
      });
    }
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) { // 这里是返回，可通过event.body获取返回内容
          // event.body
        }
      }, error => { // 统一处理所有的http错误
        if (error instanceof HttpErrorResponse) {
          if (error.status == 401) {
            this.router.navigate(['/index/login']);
          } else if (error.status == 500) {
            this.notification.create('error', '出错拉', '请求失败,请刷新页面试一试');
          } else if (error.status == 504) {
            this.notification.create('error', '重要提醒', '你当前的网络不稳定哦！');
          } else {
            // this.message.create('warning', error.error['message']);
            this.modalService.error({
              nzTitle: 'Error',
              nzContent: error.error.message ? error.error.message : error.message
            });
          }
        } else {
          this.notification.create('error', '出错拉', '网络请求错误,请刷新页面试一试');
        }
      })
    )
  }
}