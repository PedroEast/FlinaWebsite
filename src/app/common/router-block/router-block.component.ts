import { Component, Input, OnInit } from '@angular/core';

/**
 * 路由块，典型的例子是微信列表菜单
 */
@Component({
  selector: 'app-router-block',
  templateUrl: './router-block.component.html',
  styleUrls: ['./router-block.component.scss']
})
export class RouterBlockComponent implements OnInit {
    @Input() route;
    constructor() { }

    ngOnInit(): void {
        if( !this.route) this.route = null;
    }

}
