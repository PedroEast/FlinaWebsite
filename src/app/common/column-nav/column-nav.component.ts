import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NavLinkDataDefined } from 'src/app/bean/Defined';
/**
 * 纵向导航器, 典型的例子是二级导航
 */
@Component({
  selector: 'app-column-nav',
  templateUrl: './column-nav.component.html',
  styleUrls: ['./column-nav.component.scss']
})
export class ColumnNavComponent implements OnInit {
    @Input() isShowPhoneSidebar: boolean = false;
    @Input() routes: NavLinkDataDefined[];
    @Input() user;
    @Output() setClose = new EventEmitter();
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

    listItemClick(event){
        event.stopPropagation();
        this.isShowPhoneSidebar = false;
        this.setClose.emit();
    }
    btnClick() {
        this.router.navigate(['/user/submit'])
    }
   

}
