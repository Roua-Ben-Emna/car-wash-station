export interface ILogin {
  email    : string
  password : string
}

export interface ILoginResponse {
  statusCode : number
  message    : string
  data       : ILoginData
}

export interface ILoginData  {
  id          : number
  name        : string
  email       : string
  accessToken : string
  roleId      : number
  createdAt   : number
  updatedAt   : number
}