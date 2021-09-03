import { RouteReuseStrategy, DefaultUrlSerializer, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';
import { Injectable } from '@angular/core';

declare var window: any;

@Injectable()
export class ReuseStrategy implements RouteReuseStrategy {

    public static handlers: { [key: string]: DetachedRouteHandle } = {};
    private static waitDelete; // 待删除，离开时不储存快照
    private static excludeRoute = ['/admin/index']; // 不缓存的路由

    public static deleteRouteSnapshot(name) {

        if (ReuseStrategy.handlers[name]) {
            delete ReuseStrategy.handlers[name];
        } else {
            ReuseStrategy.waitDelete = name;
        }
    }
    /** 表示对所有路由允许复用 如果你有路由不想利用可以在这加一些业务逻辑判断 */
    public shouldDetach(route: ActivatedRouteSnapshot): boolean {
        if (ReuseStrategy.excludeRoute.indexOf(route['_routerState'].url) > -1) { // 有ckeditor的不能复用
            return false;
        }
        return true;
    }
    /** 当路由离开时会触发。按path作为key存储路由快照&组件当前实例对象 */
    public store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        if (ReuseStrategy.waitDelete && ReuseStrategy.waitDelete == this.getCacheKey(route)) {
            // 如果待删除是当前路由则不存储快照
            ReuseStrategy.waitDelete = null;
            return;
        }
        let snapshot = <any>handle;
        if (snapshot && snapshot.componentRef.instance.timer) {
            window.clearInterval(snapshot.componentRef.instance.timer);
            snapshot.componentRef.instance.timer = null;
        }
        ReuseStrategy.handlers[this.getCacheKey(route)] = handle;
    }
    /** 若 path 在缓存中有的都认为允许还原路由 */
    public shouldAttach(route: ActivatedRouteSnapshot): boolean {
        let cacheKey = this.getCacheKey(route);
        if (!!route.routeConfig && !!ReuseStrategy.handlers[cacheKey]) {
            let snapshot = <any>ReuseStrategy.handlers[cacheKey];
            if (snapshot.componentRef && snapshot.componentRef.instance) {
                let prototype = snapshot.componentRef.instance.__proto__;
                if (prototype['init']) {
                    snapshot.componentRef.instance.init(); // 刷新页面数据
                }
            }
            return true;
        } else {
            return false;
        }
        //return !!route.routeConfig && !!ReuseStrategy.handlers[route.routeConfig.path]
    }
    /** 从缓存中获取快照，若无则返回nul */
    public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        if (!route.routeConfig) {
            return null;
        }
        return ReuseStrategy.handlers[this.getCacheKey(route)];
    }

    /** 进入路由触发，判断是否同一路由 */
    public shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return future['_routerState'].url === curr['_routerState'].url;
        return future.routeConfig === curr.routeConfig;
    }
    // 缓存key
    private getCacheKey(route: ActivatedRouteSnapshot) {
        return route['_routerState'].url;
        const key = route['_routerState'].url.replace(/\//g, '_');
        return key;
    }
}
