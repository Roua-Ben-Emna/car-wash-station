import { IPagination } from "./pagination"

export interface IResponse<T> {
  statusCode : number
  message    : string
  data       : T
}

export interface IResponseWithPagination<T> extends IResponse<T> {
  pagination : IPagination
}