import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

/**
 * 选择器, 典型的例子是列举选择
 */
@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {
    @Input() input;
    @Input() enum;
    constructor() { }

    ngOnInit(): void {
        if(!this.input) this.input = new FormControl("1")
    }

}

// 示例
// <app-select [input]="poetryForm.get('style')" [enum]="styleEnum"></app-select>
