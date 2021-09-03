import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  public list = [];
  constructor(private http: HttpClient) { }

  store(model) {
    return this.http.post('/admin/roles', model);
  }
  update(model) {
    return this.http.put('/admin/roles/' + model.id, model);
  }
  get(params) {
    const httpParams = new HttpParams({ fromObject: params });
    return this.http.get('/admin/roles', { params: httpParams }).pipe(tap((resp: any) => {
      this.list = [];
      for (let r of resp.data) {
        this.list.push({
          label: r.name,
          value: r.id
        });
      }
    }));
  }
}
