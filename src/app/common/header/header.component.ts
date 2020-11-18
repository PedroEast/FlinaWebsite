import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { userHeaderNavLinksObj, adminHeaderNavLinksObj, coderHeaderNavLinksObj } from 'src/app/config/NavLinkConfig';
/**
 * 网站头部，接收一个导航列表和用户信息，发送一个菜单按钮被选中，用户按钮被选中的事件
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    @Input() navList;
    @Input() user;
    @Output() menuClick = new EventEmitter();
    @Output() userClick = new EventEmitter();
    @Output() navClick = new EventEmitter();
    constructor(
        private router: Router
    ) { }

    ngOnInit(): void {
        if(!this.navList && !this.user){
            
            const userStr = window.localStorage.getItem("flina-user-save")
            if( userStr){
                this.user = JSON.parse(userStr);
                if(this.user.roles.includes("CODER")){
                    this.navList = coderHeaderNavLinksObj;
                }else if(this.user.roles.includes("ADMIN")) {
                    this.navList = adminHeaderNavLinksObj;
                }else if(this.user.roles.includes("USER")) {
                    this.navList = userHeaderNavLinksObj;
                }
            }
        }
    }

    menu(event){
        event.stopPropagation();
        this.menuClick.emit();
    }

    mine(){
        this.router.navigate(["/user/detail"])
    }

    nav(event) {
        event.stopPropagation();
        this.navClick.emit();
    }
}
