import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

/**
 * This is a progress circle which has two function, the one is show itself, the another is hide itself.
 *
 */
@Component({
  selector: 'app-progress-circle',
  templateUrl: './progress-circle.component.html',
  styleUrls: ['./progress-circle.component.scss']
})
export class ProgressCircleComponent implements OnInit {
    // The variable named isShow controls the progress showing at the web page.
    // 其他页面如果想要控制本组件，应持有变量 isProgressCircleShow 变量
    // When father conponent's isProgressCircleShow changes, the isShow will change.
    @Input() isShow: boolean = true;
    constructor() { }
    
    ngOnInit(): void {
    }

}

// 参考示例
// isProgressCircleShow: boolean = false;
// <app-progress-circle [isShow]="isProgressCircleShow"></app-progress-circle>

// notice: 注入变量的变化，将直接导致子组件的变化，子组件不需要实现 onChange() 方法