import { Component, OnInit } from '@angular/core';
import { columnNavLinksObj, CoderColumnNavLinksObj, AdminColumnNavLinksObj } from 'src/app/config/NavLinkConfig';
import { User } from 'src/app/entity/User';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
    isShowPhoneSidebar: boolean = false;
    columnNav = columnNavLinksObj;
    constructor() { }

    ngOnInit(): void {
        this.setColumnNav();
    }
    setColumnNav() {
        const userStr = window.localStorage.getItem("flina-user-save")
        // console.log(userStr)
        if( userStr){
            const user = JSON.parse(userStr);
            if(user.roles.includes("CODER")){
                this.columnNav = CoderColumnNavLinksObj;
            }else if(user.roles.includes("ADMIN")) {
                this.columnNav = AdminColumnNavLinksObj;
            }else if(user.roles.includes("USER")) {
                this.columnNav = columnNavLinksObj;
            }
        }
    }

    menuClick() {
        // console.log(this.isShowPhoneSidebar);
        this.isShowPhoneSidebar = !this.isShowPhoneSidebar;
        // console.log(this.isShowPhoneSidebar);
    }
    hideSideBar(){
        this.isShowPhoneSidebar = false;
    }
}
