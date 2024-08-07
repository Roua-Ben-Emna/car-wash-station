import { Injectable} from "@angular/core";

const TOKEN = "I_token";
const USERID = "I_user";
const USERROLE = "I_role";
const USERFIRSTNAME = "I_firstname"
const USERLASTNAME ="I_lastname"
const USEREMAIL ="I_email"
const USERTELPHONE ="I_telephone"

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    constructor(){}

    saveUserId(userId:any){
        window.localStorage.removeItem(USERID);
        window.localStorage.setItem(USERID,userId);
    }

    saveUserRole(role:any){
        window.localStorage.removeItem(USERROLE);
        window.localStorage.setItem(USERROLE,role);
    }

    saveToken(token:any){
        window.localStorage.removeItem(TOKEN);
        window.localStorage.setItem(TOKEN,token);
    }
    saveUserFirstname(firstname :any) {
        window.localStorage.removeItem(USERFIRSTNAME);
        window.localStorage.setItem(USERFIRSTNAME,firstname);
    }
    saveUserLastname(lastname : any){
        window.localStorage.removeItem(USERLASTNAME);
        window.localStorage.setItem(USERLASTNAME,lastname);
    }
    saveUserEmail(email : any ){
        window.localStorage.removeItem(USEREMAIL);
        window.localStorage.setItem(USEREMAIL,email);
    }
    saveUserTelephone(telephone :any){
        window.localStorage.removeItem(USERTELPHONE);
        window.localStorage.setItem(USERTELPHONE,telephone);
    }
    static getToken() : string | null{
        return localStorage.getItem(TOKEN)
    }
    
    static hasToken() : boolean{
        if (this.getToken() === null) {
            return false;
        }   
        return true;
    }


    static getUserRole() : string | null {
        const user = this.getUser();
        if( user == null) {
            return '';
        }
        return user.role;
    }


    static getUser() {
        const userId = localStorage.getItem(USERID);
        const role = localStorage.getItem(USERROLE);
        const userFirstname = localStorage.getItem(USERFIRSTNAME);
        const userLastname = localStorage.getItem(USERLASTNAME);
        const userEmail = localStorage.getItem(USEREMAIL);
        const userTelephone = localStorage.getItem(USERTELPHONE);
        if (userId && role && userFirstname && userLastname && userEmail && userTelephone) {
            return { 
                id: userId,
                role: role,
                firstname: userFirstname,
                lastname: userLastname,
                email: userEmail,
                telephone: userTelephone
                 };
        } else {
            return { 
                id: null,
                role: null,
                firstname: null,
                lastname: null,
                email: null,
                telephone: null
            };
        }
    }

   
    static isManagerLoggedIn() : boolean {
        if(this.getToken() === null){
            return false;
        }
        const role: string | null = this.getUserRole();
        return role == "MANAGER" ;
        
    }

    static isAdminLoggedIn() : boolean {
        if(this.getToken() === null){
            return false;
        }
        const role: string | null = this.getUserRole();
        return role == "ADMIN" ;
        
    }

    static signOut(){
        window.localStorage.clear();
    }
    updateUser(data: any) {
        if (data.firstname) {
            this.saveUserFirstname(data.firstname);
        }
        if (data.lastname) {
            this.saveUserLastname(data.lastname);
        }
        if (data.telephone) {
            this.saveUserTelephone(data.telephone);
        }
        // No need to update email as it's not changed
    }
    static getItem(key: string): string | null {
        return localStorage.getItem(key);
      }
    
      static setItem(key: string, value: string): void {
        localStorage.setItem(key, value);
      }
}