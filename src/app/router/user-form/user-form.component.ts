import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
    roleEnum = ["ROLE_USER","ROLE_ADMIN,ROLE_USER", ];
    levelEnum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    userForm = new FormGroup({
        "id":  new FormControl(""),
        "roles": new FormControl("", Validators.required),
        "username": new FormControl({value: "", disabled: true}, Validators.required),
        "level": new FormControl({value: "",}, Validators.required),
    });
    yes: boolean = true;
    constructor(
      public dialogRef: MatDialogRef<UserFormComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
      ) {}
  
    onNoClick(): void {
      this.dialogRef.close();
    }
    ngOnInit(): void {
        console.log(this.data)
        this.userForm.setValue(this.data)
    }

}
