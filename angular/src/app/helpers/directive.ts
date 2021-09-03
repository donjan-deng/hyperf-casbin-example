import { Directive, Input, AfterViewInit, ElementRef, TemplateRef, ViewContainerRef, HostListener, Renderer2 } from '@angular/core';

@Directive({ selector: '[appCan]' })
export class CanDirective {

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef
    ) { }

    @Input() set appCan(params) { // 接收一个数组的参数，第一个是用户拥有的权限，第二个为需要判断的权限
        let hasPermission = false;
        for (let p of params.check) {
            let index = params.perms.findIndex(e => {
                return e[1].toLowerCase() == p[0].toLowerCase() && e[2].toLowerCase() == p[1].toLowerCase();
            });
            if (index >= 0) {
                hasPermission = true;
                break;
            }
        }
        if (hasPermission) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }
}