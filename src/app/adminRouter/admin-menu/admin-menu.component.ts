import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { adminColumnNavLinksObj } from 'src/app/config/NavLinkConfig';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.scss']
})
export class AdminMenuComponent implements OnInit {
    routes = adminColumnNavLinksObj;

    constructor(  
         private router: Router
    ) { }

    ngOnInit(): void {
    }

    routerUser(){
        this.router.navigate(['/user/detail'])
    }

}
