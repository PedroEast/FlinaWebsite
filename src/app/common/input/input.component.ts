import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

/**
 * 带有清除按钮的文本输入框，典型的例子是短文本输入
 */
@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {
    @Input() lableStr;
    @Input() input;
    constructor() { }

    ngOnInit(): void {
        if(!this.input) this.input = new FormControl("请通过input初始化你的文本框")
    }

}

// 示例
// <app-input [input]="poetryForm.get('title')"></app-input>