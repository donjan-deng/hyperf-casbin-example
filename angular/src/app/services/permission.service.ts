import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  public menuList;
  public nodes;

  constructor(private http: HttpClient) { }

  get() {
    return this.http.get('/admin/permissions').pipe(tap((resp: any) => {
      this.menuList = resp;
      this.nodes = this.buildNode(this.menuList);
    }));
  }
  store(model) {
    return this.http.post('/admin/permissions', model);
  }
  update(model) {
    return this.http.put('/admin/permissions/' + model.id, model);
  }
  buildNode(data) {
    let nodes = [];
    for (const m of data) {
      let node = {
        title: m.display_name,
        key: m.id,
        expanded: true,
        isLeaf: m.child.length === 0,
        data: m
      };
      if (m.child.length > 0) {
        Object.assign(node, { children: this.buildNode(m.child) });
      }
      nodes.push(node);
    }
    return nodes;
  }
}
