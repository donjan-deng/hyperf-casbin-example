import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzFormatEmitEvent, NzTreeComponent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
import { Helper } from '../../helpers/helper';
import { RoleService } from '../../services/role.service';
import { PermissionService } from '../../services/permission.service';
import { AppService } from '../../services/app.service';

@Component({
  templateUrl: './list.component.html',
})

export class RoleListComponent implements OnInit {
  @ViewChild('nzTreeComponent') nzTreeComponent: NzTreeComponent;
  params = {
    page: 1,
    per_page: 15,
    total: 1,
    sort_name: '',
    sort_value: '',
    loading: true
  };
  list = [];
  pageSizeOption = [15, 25, 50];
  checkedKeys = []; // 选中的权限
  dialog = {
    visible: false,
    loading: false
  };
  form = this.fb.group({
    id: [],
    name: ['', [Validators.required]],
    description: [''],
    permissions: []
  });
  constructor(
    private fb: FormBuilder,
    public app: AppService,
    public roleService: RoleService,
    public permissionService: PermissionService
  ) { }
  ngOnInit() {
    this.permissionService.get().subscribe((resp) => { });
  }
  loadData() {
    this.params.loading = true;
    this.roleService.get(this.params).subscribe((resp: any) => {
      this.params.loading = false;
      this.list = resp.data;
      this.params.total = resp.total;
    });
  }
  add() {
    Helper.resetForm(this.form);
    this.form.get('id').setValue(0);
    this.form.get('name').reset({ value: '', disabled: false });
    this.checkedKeys = [];
    this.dialog.visible = true;
  }
  edit(model) {
    Helper.resetForm(this.form);
    this.form.get('id').setValue(model.id);
    this.form.get('name').reset({ value: model.name, disabled: true });
    this.form.get('description').setValue(model.description);
    this.checkedKeys = model.permissions;
    this.dialog.visible = true;
  }
  save() {
    Helper.validateForm(this.form);
    if (this.form.valid) {
      this.dialog.loading = true;
      const checkPerms = this.getCheckPerms(this.nzTreeComponent.getTreeNodes());
      this.form.get('permissions').setValue(checkPerms);
      const data = this.form.value;
      if (data.id > 0 && !data.name) {
        data.name = '111';
      }
      let service = this.roleService.store(data);
      if (data.id > 0) {
        service = this.roleService.update(data);
      }
      service.subscribe((resp: any) => {
        this.loadData();
        this.dialog.loading = false;
        this.dialog.visible = false;
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
  search() {
    this.params.page = 1;
    this.loadData();
  }
  onQueryParamsChange(params) {
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);
    this.params.sort_name = (currentSort && currentSort.key) || '';
    this.params.sort_value = (currentSort && currentSort.value) || '';
    this.params.per_page = pageSize;
    this.params.page = pageIndex;
    this.loadData();
  }
  getCheckPerms(nodes) {
    let perms = [];
    for (let m of nodes) {
      if (m.isChecked || m.isHalfChecked) {
        perms.push(m.key);
      }
      const children = m.getChildren();
      if (children.length > 0) {
        const result = this.getCheckPerms(children);
        if (result) {
          perms = perms.concat(result);
        }
      }
    }
    return perms;
  }
}
