import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { LocalStorageService } from "../storage-service/local-storage.service";

const BASIC_URL = environment["BASIC_URL"]
export const AUTH_HEADER = "authorization"
@Injectable({
    providedIn: 'root'
})

export class UserService {
    constructor(private http: HttpClient,private storageService: LocalStorageService) {

    }

    getUserById(userId: number): Observable<any> {
        return this.http.get<any>(`${BASIC_URL}api/auth/user/${userId}`);
    }
    updateUser(userId: number, user: any): Observable<any> {
        return this.http.put<any>(`${BASIC_URL}api/auth/user/${userId}`, user);
    }
         
    resetPassword(token: string, newPassword: string): Observable<any> {
        const url = `${BASIC_URL}api/auth/reset-password?token=${token}`;
        const body = {
            newPassword: newPassword
        };
        return this.http.post<any>(url, body);
    }

    resetPasswordRequest(email: string): Observable<any> {
        return this.http.post<any>(`${BASIC_URL}api/auth/password-reset-request`, { email });
    }

    getUsers(): Observable<any[]> {
        return this.http.get<any[]>(`${BASIC_URL}api/auth/getUsers`);
    }
    disableUserAccount(userId: number): Observable<any> {
        const url = `${BASIC_URL}api/auth/user/disable/${userId}`;
        return this.http.put<any>(url, null);
    }

    deleteUser(userId: number): Observable<any> {
        return this.http.delete(`${BASIC_URL}api/auth/user/delete/${userId}`);
    }

}