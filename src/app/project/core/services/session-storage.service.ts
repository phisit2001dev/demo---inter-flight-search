import { Injectable } from "@angular/core";
import { environment } from "@evn/environment";
import { BehaviorSubject, Observable, Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SessionStorageService {

  private subjectIsLogin = new BehaviorSubject<boolean>(false);

  private cvy: string = 'cvy';
  private state: string = 'state';
  private isLogin: boolean = false;
  storageEvent:Subject<any> = new Subject<any>;

  constructor(){

  }
    setProfile(jsonString: any){
        sessionStorage.setItem(environment.keyProfile, JSON.stringify(jsonString));
    }

    getProfile(): string{
        return sessionStorage.getItem(environment.keyProfile);
    }

    removeProfile(){
        sessionStorage.removeItem(environment.keyProfile);
    }

    setCvy(value: string){
        sessionStorage.setItem(this.cvy, value);
    }

    getCvy(): string{
        return sessionStorage.getItem(this.cvy);
    }

    setState(value: string){
        sessionStorage.setItem(this.state, value);
    }

    getState(): string{
        return sessionStorage.getItem(this.state);
    }

    // setCrossCheckKey(val: string){
    //     sessionStorage.setItem(environment.crossCheckKey, val);
    // }

    // getCrossCheckKey(): string{
    //     return sessionStorage.getItem(environment.crossCheckKey);
    // }

    getIsLogin(): boolean{
        return sessionStorage.getItem(environment.keyProfile)? true : false;
    }

    setIsLogin(){
        this.subjectIsLogin.next(true);
    }

    getIsLoginAsObS(){
        return this.subjectIsLogin.asObservable();
    }

    setCriteriaByUrl(url: string, criteria: any){
        sessionStorage.setItem(url, JSON.stringify(criteria));
    }

    getCriteriaByUrl(url: string): string{
        return sessionStorage.getItem(url);
    }

    removeCriteriaByUrl(url: string){
        sessionStorage.removeItem(url);
    }

    clearBrowserStorage() {
        localStorage.clear();
        sessionStorage.clear();
    }


}
