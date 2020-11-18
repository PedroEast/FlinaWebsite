import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { testStr } from 'src/app/util/TestNull';
import { CommonUIService } from '../common-ui.service';
/**
 * 富文本编辑器, 典型的例子是附格式文本
 */
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit{
    isToolBarFlow = false;
    @Output() refresh = new EventEmitter();
    @Input() input;
    constructor(
        private commonUI: CommonUIService,
        private router: Router
    ) { }

    ngOnInit(): void {
    }
   
    undo(event){
        document.execCommand("undo");
        this.stopBubble(event);
    }
    redo(event){
        document.execCommand("redo");
        this.stopBubble(event);
    }
    alignLeft(event){
        document.execCommand("justifyLeft");
        this.stopBubble(event);
    }
    alignCenter(event){
        document.execCommand("justifyCenter");
        this.stopBubble(event);
    }
    alignRight(event){
        document.execCommand("justifyRight");
        this.stopBubble(event);
    }
    bold(event){
        document.execCommand("bold");
        this.stopBubble(event);
    }
    italic(event){
        document.execCommand("italic");
        this.stopBubble(event);
    }
    underlined(event){
        document.execCommand("underline");
        this.stopBubble(event);
    }
    lineHeight1(event){
        lineHeight("20px")
        this.stopBubble(event);
    }
    lineHeight15(event){
        lineHeight("30px")
        this.stopBubble(event);
    }
    lineHeight2(event){
        lineHeight("40px")
        this.stopBubble(event);
    }
    removeFormat(event){
        document.execCommand("removeFormat");
        this.stopBubble(event);
    }
    selectAll(event){
        document.execCommand("selectAll");
        this.stopBubble(event);
    }
    toolbarFlow(event){
        this.isToolBarFlow = !this.isToolBarFlow;
    }
   
    
     // 代理模式
    private log(message: string, action = "") {
        this.commonUI.showSnackBarWith(message, action);
    }
    private stopBubble(event){
        event.stopPropagation();
    }
}

// 设置行距
export const lineHeight = (value) => {
    // 获取当前的选区
    let selection = window.getSelection()
    if (selection.rangeCount === 0) {
      return
    }
    let range = selection.getRangeAt(0)
    // 选中区域的html
    let outSpan = document.createElement('span')
    outSpan.style.cssText = 'line-height: ' + value + ';display: block;'
    outSpan.appendChild(range.cloneContents())
    let content = setLineHeight(outSpan.innerHTML, value)
    // 选取中的纯文本
    let txt = range.extractContents().textContent
    let length = txt.length
    if (length === 0) {
      return
    }
    // 删除被选择的内容
    range.deleteContents()
    // 创建新的元素
    let span = document.createElement('span')
    span.style.cssText = 'line-height: ' + value + ';display: inline-block;'
    // 设置 span 内容
    span.innerHTML = content
    // 在被选择的位置设置行距的元素
    range.insertNode(span)
  }
   
  // 设置指定行距
  function setLineHeight (content, value) {
    let reg = /line-height\s*:\s*(\d+(\.*\d+)?)/ig;
    let c = content.replace(reg, 'line-height: ' + value);
    reg = /margin\s*:\s*(\d+(\.*\d+)?)/ig;
    c = c.replace(reg, "");
    return c;
  }
// // 行距
// export const lineHeight = (value) => {
//     // 选择范围
//     let range = getRange()
//     let txt = range.extractContents().textContent
//     let length = txt.length
//     if (length === 0) {
//       return
//     }
//     // 删除被选择的内容
//     range.deleteContents()
//     // 创建新的元素
//     let span = document.createElement('span')
//     span.style.cssText = 'line-height: ' + value + ';display: inline-block;'
//     // 设置 span 内容
//     span.innerHTML = txt
//     // 在被选择的位置设置行距的元素
//     range.insertNode(span)
//   }