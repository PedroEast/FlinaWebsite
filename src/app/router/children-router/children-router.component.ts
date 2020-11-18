import { Component, OnInit } from '@angular/core';
import { NavLinkDataDefined } from 'src/app/bean/Defined';

import { User } from 'src/app/entity/User';

@Component({
  selector: 'app-children-router',
  templateUrl: './children-router.component.html',
  styleUrls: ['./children-router.component.scss']
})
export class ChildrenRouterComponent implements OnInit {
    user: User;
    headerLinks: NavLinkDataDefined[] = [];
    footerLinks: NavLinkDataDefined[] = [];
    constructor() { }

    ngOnInit(): void {
        const userStr = window.localStorage.getItem("flina-user-save")
        
        if( userStr){
            this.user = JSON.parse(userStr);
            if(this.user.roles.includes("CODER")){
                
            }else if(this.user.roles.includes("ADMIN")) {
               
            }else if(this.user.roles.includes("USER")) {
              
            }
        }
    }
    mine(){
        
    }

}
