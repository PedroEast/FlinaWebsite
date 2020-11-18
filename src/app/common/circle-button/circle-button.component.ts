import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-circle-button',
  templateUrl: './circle-button.component.html',
  styleUrls: ['./circle-button.component.scss']
})
export class CircleButtonComponent implements OnInit {
    @Input() bottom: string;
    @Input() right: string;
    @Input() buttonStr: string;
    @Output() click = new EventEmitter();
    constructor() { }

    ngOnInit(): void {
        if(!this.buttonStr) this.buttonStr = "fa fa-laptop-house";
        if(!this.bottom) this.bottom = "40px"
        if(!this.right) this.right = "40px"
    }

    onBtnClick(event){
        event.stopPropagation();
        this.click.emit();
    }
}
