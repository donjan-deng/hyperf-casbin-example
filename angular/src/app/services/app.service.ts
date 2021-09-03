import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from 'ngx-webstorage';

declare var window: any;

@Injectable({
  providedIn: 'root'
})
export class AppService {

  public user;
  public data;
  public perms = [];

  constructor(private http: HttpClient, private storage: LocalStorageService) { }

  get() {
    this.http.get('/admin/app').subscribe((resp: any) => {
      this.user = resp.user;
      this.perms = resp.permissions;
      this.data = resp.data;
    });
  }
  logout() {
    this.storage.clear('token');
    window.location.reload();
  }
}
