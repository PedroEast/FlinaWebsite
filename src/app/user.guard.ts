import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from './entity/User';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate, CanActivateChild {
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.isUser();
    }
        
    canActivateChild(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return true;
    }
    isUser(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        let flag = false;
        const userStr = window.localStorage.getItem("flina-user-save")
        if( userStr){
            const user: User = JSON.parse(userStr);
            if(user.roles.includes("ROLE_USER")){
                flag = true;
            }
        }
        return flag;
    }
    
}
