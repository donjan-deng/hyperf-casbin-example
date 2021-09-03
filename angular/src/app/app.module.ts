import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';

import { SharedModule } from './app-share.module';
import { AuthInterceptor } from './app-authInterceptor.module';

import { IndexComponent } from './views/index/index.component';
import { LoginComponent } from './views/index/login.component';
import { ProfileComponent } from './views/index/profile.component';

import { UserListComponent } from './views/user/list.component';
import { RoleListComponent } from './views/role/list.component';
import { PermissionListComponent } from './views/permission/list.component';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    IndexComponent,
    ProfileComponent,
    UserListComponent,
    RoleListComponent,
    PermissionListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
