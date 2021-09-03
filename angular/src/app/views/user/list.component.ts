import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Helper } from '../../helpers/helper';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../services/role.service';
import { AppService } from '../../services/app.service';

@Component({
  templateUrl: './list.component.html',
})

export class UserListComponent implements OnInit {
  params = {
    username: '',
    status: '',
    start_time: '',
    end_time: '',
    date_range: [],
    page: 1,
    per_page: 15,
    total: 1,
    sort_name: '',
    sort_value: '',
    loading: true
  };
  list = [];
  pageSizeOption = [15, 25, 50];
  roleList = [];
  dialog = {
    visible: false,
    loading: false
  };
  roleDialog = {
    visible: false,
    loading: false
  };
  form = this.fb.group({
    id: [],
    username: ['', Validators.required],
    password: [],
    confirm_password: [],
    status: []
  });
  roleForm = this.fb.group({
    id: [],
    username: [],
    roles: []
  });
  constructor(
    private fb: FormBuilder,
    public app: AppService,
    public userService: UserService,
    public roleService: RoleService
  ) {
  }
  ngOnInit() {
    this.roleService.get({ per_page: 100 }).subscribe((resp) => { });
  }
  loadData() {
    this.params.loading = true;
    this.userService.get(this.params).subscribe((resp: any) => {
      this.params.loading = false;
      this.list = resp.data;
      this.params.total = resp.total;
    });
  }
  add() {
    Helper.resetForm(this.form);
    this.form.get('id').setValue(0);
    this.form.get('status').setValue(1);
    this.form.get('username').reset({ value: '', disabled: false });
    this.dialog.visible = true;
  }
  edit(model) {
    Helper.resetForm(this.form);
    this.form.patchValue(model);
    this.form.get('username').reset({ value: model.username, disabled: true });
    this.dialog.visible = true;
  }
  save() {
    Helper.validateForm(this.form);
    if (this.form.valid) {
      this.dialog.loading = true;
      const data = this.form.value;
      if (data.id > 0 && !data.username) { // 设disabled后this.form.value.username不会传值过来，避免后端的验证，随便传一个
        data.username = '111';
      }
      let service = this.userService.store(data);
      if (data.id > 0) {
        service = this.userService.update(data);
      }
      service.subscribe((resp: any) => {
        this.dialog.visible = false;
        this.loadData();
        this.dialog.loading = false;
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
  editRole(model) {
    Helper.resetForm(this.roleForm);
    this.roleList = this.roleService.list;
    this.roleList.forEach(e => {
      e.checked = model.roles.findIndex(q => q === e.label) >= 0;
    });
    this.roleForm.get('username').reset({ value: model.username, disabled: true });
    this.roleForm.get('id').setValue(model.id);
    this.roleForm.get('roles').setValue(this.roleList);
    this.roleDialog.visible = true;
  }
  saveRole() {
    this.roleDialog.loading = true;
    const roles = [];
    this.roleForm.get('roles').value.forEach(q => {
      if (q.checked) {
        roles.push(q.value);
      }
    });

    this.userService.roles(this.roleForm.get('id').value, roles).subscribe(() => {
      this.roleDialog.visible = false;
      this.roleDialog.loading = false;
      this.loadData();
    },
      error => {
        this.roleDialog.loading = false;
      });
  }
  closeRole() {
    this.roleDialog.visible = false;
    this.roleDialog.loading = false;
  }
  selectDate() {
    if (this.params.date_range.length > 0) {
      this.params.start_time = formatDate(this.params.date_range[0], 'yyyy-MM-dd 00:00:00', 'zh');
      this.params.end_time = formatDate(this.params.date_range[1], 'yyyy-MM-dd 23:59:59', 'zh');
    } else {
      this.params.start_time = '';
      this.params.end_time = '';
    }
    this.search();
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
}
