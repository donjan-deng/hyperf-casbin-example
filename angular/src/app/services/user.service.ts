import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  store(model) {
    return this.http.post('/admin/users', model);
  }
  update(model) {
    return this.http.put('/admin/users/' + model.id, model);
  }
  get(params) {
    const httpParams = new HttpParams({ fromObject: params });
    return this.http.get('/admin/users', { params: httpParams });
  }
  roles(id, roles) {
    return this.http.put(
      `/admin/users/${id}/roles`,
      { roles }
    );
  }
}
