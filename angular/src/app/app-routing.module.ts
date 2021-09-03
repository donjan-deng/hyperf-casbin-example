import { NgModule } from '@angular/core';
import { Routes, RouterModule, RouteReuseStrategy } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReuseStrategy } from './app-reusestrategy.module';

import { IndexComponent } from './views/index/index.component';
import { LoginComponent } from './views/index/login.component';
import { ProfileComponent } from './views/index/profile.component';

import { UserListComponent } from './views/user/list.component';
import { RoleListComponent } from './views/role/list.component';
import { PermissionListComponent } from './views/permission/list.component';

const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index/login', component: LoginComponent },
  { path: 'index', component: IndexComponent, data: { title: '后台首页' } },
  { path: 'profile', component: ProfileComponent, data: { title: '后台首页' } },
  { path: 'users', component: UserListComponent, data: { title: '用户管理' } },
  { path: 'roles', component: RoleListComponent, data: { title: '角色管理' } },
  { path: 'permissions', component: PermissionListComponent, data: { title: '节点管理' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, relativeLinkResolution: 'legacy' }), CommonModule],
  exports: [RouterModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: ReuseStrategy }
  ]
})
export class AppRoutingModule { }
