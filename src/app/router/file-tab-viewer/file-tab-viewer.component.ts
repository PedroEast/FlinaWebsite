import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-file-tab-viewer',
  templateUrl: './file-tab-viewer.component.html',
  styleUrls: ['./file-tab-viewer.component.scss']
})
export class FileTabViewerComponent implements OnInit {
    // yes: boolean = true;
    constructor(
        public dialogRef: MatDialogRef<FileTabViewerComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
        ) {}

    ngOnInit(): void {
    }
    
    onNoClick(): void {
        this.dialogRef.close();
    }
}
