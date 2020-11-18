import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { coderColumnNavLinksObj } from 'src/app/config/NavLinkConfig';

@Component({
  selector: 'app-coder-menu',
  templateUrl: './coder-menu.component.html',
  styleUrls: ['./coder-menu.component.scss']
})
export class CoderMenuComponent implements OnInit {
    routes = coderColumnNavLinksObj;
    constructor(
        private router: Router
    ) { }

    ngOnInit(): void {
    }

    routerUser(){
        this.router.navigate(['/user/detail'])
    }
}
