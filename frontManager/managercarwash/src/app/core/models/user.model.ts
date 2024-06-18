export interface IUser {
  id        : number
  name      : string
  email     : string
  gender    : string
  phone     : string
  birthDate : string
  avatar    : string
  createdAt : number
  updatedAt : number
}

export interface IUserCreate {
  name     : string
  email    : string
  password : string
}

export interface IUserUpdate {
  id       : number
  name     : string
  email    : string
  password : string
}

export interface IUserSearch {
  page         : number
  perPage      : number
  search      : ISearch
  searchValue? : string
  sort         : ISort
  sortBy       : string
}

export enum ISearch {
  NAME  = 'name',
  EMAIL = 'email'
}

export enum ISort {
  ASC  = 'asc',
  DESC = 'desc'
}