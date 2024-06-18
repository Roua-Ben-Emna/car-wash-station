import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiEndpoint } from '../constants/constants';
import { IResponse, IResponseWithPagination } from '../models/response.model';
import { ISearch, ISort, IUser, IUserCreate, IUserSearch, IUserUpdate } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http : HttpClient
  ) { }

  getById(id : number) : Observable<any> {
    return this.http.get(`${apiEndpoint.UserEndPoint.get}/${id}`)
  }

  getAll(filter? : IUserSearch) : Observable<IResponseWithPagination<IUser[]>> {
    return this.http.get<IResponseWithPagination<IUser[]>>(apiEndpoint.UserEndPoint.get, {
      params : {
        page        : filter?.page || 1,
        perPage     : filter?.perPage || 10,
        sort        : filter?.sort || ISort.DESC,
        sortBy      : filter?.sortBy || 'updatedAt',
        search      : filter?.search || ISearch.NAME,
        searchValue : filter?.searchValue || '',
      }
    })
  }

  create(data : IUserCreate) : Observable<IResponse<IUser>> {
    return this.http.post<IResponse<IUser>>(apiEndpoint.UserEndPoint.create, data)
  }

  update(data : IUserUpdate) : Observable<IResponse<IUser>>{
    return this.http.put<IResponse<IUser>>(`${apiEndpoint.UserEndPoint.update}/${data.id}`, data)
  }

  remove() : Observable<any> {
    return this.http.get(apiEndpoint.UserEndPoint.get)
  }


}
