import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AppService } from './services/app.service';
import { ReuseStrategy } from './app-reusestrategy.module';
import { LocalStorageService } from 'ngx-webstorage';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  // 路由列表
  menuList = new Array<any>();
  urls = new Array<any>();
  config;
  debounceTime = 500; // 防抖延时
  throttleTime = 2000; // 节流延时
  isCollapsed;
  title = 'app';

  constructor(
    private http: HttpClient,
    private router: Router,
    private titleService: Title,
    private storage: LocalStorageService,
    public app: AppService
  ) {
  }

  ngOnInit(): void {
    const token = this.getToken();
    if (!this.app.user) {
      this.app.get();
    }
    this.buildMenuList('', this.router.config);
    this.pushCurrTab();
    this.onNavigationEnd();
  }
  // 获取所有路由
  buildMenuList(parent, config) {
    for (let route of config) {
      if (route.data) {
        this.urls.push({
          title: route.data.title,
          path: parent + '/' + route.path
        });
      }
      if (route.children) {
        const currentPath = route.path ? parent + '/' + route.path : parent;
        this.buildMenuList(currentPath, route.children);
      }
    }
  }
  // 当前路径添加进tab
  pushCurrTab() {
    const currPerm = this.urls.find(e => e.path == this.router.url);
    if (currPerm) {
      this.titleService.setTitle(currPerm.title);
      this.menuList.push({
        title: currPerm.title,
        path: currPerm.path,
        select: true
      });
    } else {
      this.menuList.push({
        title: '后台首页',
        path: '/index',
        select: true
      });
    }
  }
  // 订阅路由事件
  onNavigationEnd() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const path = event.url;
        let perm = this.urls.find(e => e.path == path);
        if (!perm) {
          if (path === '/') {
            perm = {
              path: '/index',
              title: '后台首页'
            };
          } else {
            return;
          }
        }
        this.titleService.setTitle(perm.title);
        this.menuList.forEach(p => p.select = false);
        const exitMenu = this.menuList.find(e => e.path == perm.path);
        if (exitMenu) {// 如果存在不添加，当前表示选中
          this.menuList.forEach(p => p.select = p.path == exitMenu.path);
          return;
        }
        this.menuList.push({
          title: perm.title,
          path: perm.path,
          select: true
        });
      }
    });
  }
  // 关闭选项标签
  closeUrl(path: string, select: boolean) {
    // 当前关闭的是第几个路由
    let index = this.menuList.findIndex(p => p.path == path);
    // 如果只有一个不可以关闭
    if (this.menuList.length == 1 || select == false) {
      return;
    }

    this.menuList = this.menuList.filter(p => p.path != path);
    // 删除复用
    ReuseStrategy.deleteRouteSnapshot(path);
    if (!select) {
      return;
    }
    // 显示上一个选中
    index = index === 0 ? 0 : index - 1;
    let menu = this.menuList[index];
    this.menuList.forEach(p => p.select = p.path == menu.path);
    // 显示当前路由信息
    this.router.navigate([menu.path]);
  }
  logout() {
    this.app.logout();
  }
  getToken() {
    const token = this.storage.retrieve('token');
    if (!token || moment().diff(token.expires_time) > 0) {
      this.router.navigate(['/index/login']);
    } else {
      setInterval(() => {
        this.refreshToken();
      }, 1000 * 60 * 2);
    }
    return token;
  }
  refreshToken() {
    const token = this.storage.retrieve('token');
    if (token && moment(token.expires_time).diff(moment(), 'seconds') < 120) { // 如果在120秒内过期，进行刷新
      const url = '/admin/refresh_token';
      this.http.post(url, {}).subscribe((resp: any) => {
        token.access_token = resp.access_token;
        token.expires_in = resp.expires_in;
        token.expires_time = moment().add(token.expires_in - 200, 'seconds');
        this.storage.store('token', token);
      });
    }
  }
}
