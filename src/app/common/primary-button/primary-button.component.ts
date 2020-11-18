import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Event } from '@angular/router';

/**
 * 主要按钮是每一个页面上的核心功能按钮, 典型例子是接收点击事件
 */
@Component({
  selector: 'app-primary-button',
  templateUrl: './primary-button.component.html',
  styleUrls: ['./primary-button.component.scss']
})
export class PrimaryButtonComponent implements OnInit {
    @Input() buttonStr: string;
    @Output() click = new EventEmitter();
    constructor() { }

    ngOnInit(): void {
        if(!this.buttonStr) this.buttonStr = "请通过buttonStr命名你的按钮"
    }

    onBtnClick(event){
        event.stopPropagation();
        this.click.emit();
    }
}

// 示例
// <app-primary-button buttonStr="立即投稿" (click)="routerSubmit()"></app-primary-button>