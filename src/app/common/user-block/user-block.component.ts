import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-block',
  templateUrl: './user-block.component.html',
  styleUrls: ['./user-block.component.scss']
})
export class UserBlockComponent implements OnInit {
    @Input() user;
    constructor(
        private router: Router
    ) { }

    ngOnInit(): void {
        if(!this.user){
            const userStr = window.localStorage.getItem("flina-user-save")
            if( userStr){
                this.user = JSON.parse(userStr);
            }
        }
    }

    mine(){
        this.router.navigate(["/user/detail"])
    }

}
