import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { LocalStorageService } from "../storage-service/local-storage.service";
import { map, tap } from "rxjs/operators";
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from "../../../environments/environment";


const BASIC_URL = "http://localhost:8090/"
export const AUTH_HEADER = "authorization"
@Injectable({
    providedIn: 'root'
})

export class AuthService {
  constructor(private http: HttpClient,
        private storageService: LocalStorageService,
        ) { }

    register(signupDTO:any):Observable<any>{
        return this.http.post<[]>(BASIC_URL + "api/auth/sign-up",signupDTO)
    }

   

    login(email: string, password: string) {
        return this.http.post<any>(BASIC_URL + "api/auth/authenticate", { email, password }, { observe: 'response' })
          .pipe(
            tap(_ => this.log("User Authentication")),
            map((res: HttpResponse<any>) => {
              this.storageService.saveUserId(res.body.userId);
              this.storageService.saveUserRole(res.body.role);
              this.storageService.saveUserFirstname(res.body.firstname);
              this.storageService.saveUserLastname(res.body.lastname);
              this.storageService.saveUserEmail(res.body.email);
              this.storageService.saveUserTelephone(res.body.telephone);
              const tokenLength = res.headers.get(AUTH_HEADER)?.length;
              const bearerToken = res.headers.get(AUTH_HEADER)?.substring(7, tokenLength);
              this.storageService.saveToken(bearerToken);
              return res;
            }),
            catchError(error => {
                if (error.status === 401 && error.error && error.error.message) {
                }
                return throwError(error);
              })
            );
    }
    
    log(message:string): void {
        console.log(`User Auth Service: ${message}"`)
    }
}