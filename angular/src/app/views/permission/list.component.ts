import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzTreeModule, NzTreeComponent, NzTreeNode, NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { AppService } from '../../services/app.service';
import { PermissionService } from '../../services/permission.service';
import { Helper } from '../../helpers/helper';

@Component({
  templateUrl: './list.component.html',
  styles: [
    `
      :host ::ng-deep .ant-tree {
        overflow: hidden;
        margin: 0 -24px;
        padding: 0 24px;
      }
      :host ::ng-deep .ant-tree li {
        padding: 4px 0 0 0;
      }
      .custom-node {
        cursor: pointer;
        line-height: 24px;
        margin-left: 4px;
        display: inline-block;
        margin: 0 -1000px;
        padding: 0 1000px;
      }
      .active {
        background: #1890ff;
        color: #fff;
      }
    `
  ]
})

export class PermissionListComponent implements OnInit {
  @ViewChild('nzTreeComponent', { static: false }) nzTreeComponent: NzTreeComponent;
  selectNodes = [];
  activedNode: NzTreeNode;
  dialog = {
    visible: false,
    loading: false
  };
  form = this.fb.group({
    id: [],
    parent_id: [0, [Validators.required]],
    path: ['', [Validators.required]],
    method: ['', [Validators.required]],
    display_name: ['', [Validators.required]],
    url: [],
    sort: [],
  });
  constructor(
    public app: AppService,
    public permissionService: PermissionService,
    private fb: FormBuilder,
    private nzContextMenuService: NzContextMenuService
  ) { }
  ngOnInit() {
    this.getList();
  }
  getList() {
    this.permissionService.get().subscribe((resp) => {
      this.selectNodes = [{
        title: '顶级节点',
        key: 0,
        expanded: true,
        isLeaf: false,
        children: this.permissionService.nodes
      }];
    });
  }
  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }
  activeNode(data: NzFormatEmitEvent): void {
    this.activedNode = data.node!;
  }
  add() {
    Helper.resetForm(this.form);
    this.form.get('id').setValue(0);
    this.form.get('parent_id').setValue(0);
    this.dialog.visible = true;
  }
  edit(event) {
    const model = this.activedNode.origin.data;
    Helper.resetForm(this.form);
    this.form.get('id').setValue(model.id);
    this.form.get('parent_id').setValue(model.parent_id);
    this.form.get('path').setValue(model.path);
    this.form.get('method').setValue(model.method);
    this.form.get('display_name').setValue(model.display_name);
    this.form.get('sort').setValue(model.sort);
    this.dialog.visible = true;
  }
  save() {
    Helper.validateForm(this.form);
    if (this.form.valid) {
      this.dialog.loading = true;
      const data = this.form.value;
      let service = this.permissionService.store(data);
      if (data.id > 0) {
        service = this.permissionService.update(data);
      }
      service.subscribe((resp: any) => {
        this.dialog.loading = false;
        this.dialog.visible = false;
        this.getList();
      },
        error => {
          this.dialog.loading = false;
        });
    }
  }
  close() {
    this.dialog.visible = false;
    this.dialog.loading = false;
  }
}
