export interface IMenuResponse {
  id      : number
  name    : string
  url     : string
  icon?   : string
  isOpen? : Boolean
  childs? : any
}