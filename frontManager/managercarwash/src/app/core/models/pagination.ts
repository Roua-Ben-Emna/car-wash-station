export interface IPagination {
  currentPage : number
  perPage     : number
  totalItems  : number
  totalPages  : number
  links?      : ILinks
  pages       : Array<number>
}

export interface ILinks {
  first : string
  last  : string
  next  : string
  prev  : string
}