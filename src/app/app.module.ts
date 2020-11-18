import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG, HammerModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http"
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { AppRoutingModule } from "src/app/app-routing.module";
import { MaterialModule } from "src/app/app-material.module";
import { AppComponent } from "src/app/app.component";

import { FileMakerComponent } from './coderRouter/file-maker/file-maker.component';
import { TableViewerComponent } from './coderRouter/table-viewer/table-viewer.component';
import { DataViewerComponent } from './coderRouter/data-viewer/data-viewer.component';
import { UserComponent } from './coderRouter/user-viewer/user.component';


import { LoginComponent } from './router/login/login.component';
import { UploadConfirmComponent } from './router/upload-confirm/upload-confirm.component';
import { DeleteConfirmComponent } from './router/delete-confirm/delete-confirm.component';
import { FileTabViewerComponent } from './router/file-tab-viewer/file-tab-viewer.component';
import { ChildrenRouterComponent } from './router/children-router/children-router.component';
import { DevelopLogComponent } from './adminRouter/develop-log/develop-log.component';
import { DelevopLogFormComponent } from './router/delevop-log-form/delevop-log-form.component';
import { UserFormComponent } from './router/user-form/user-form.component';
import { EditorComponent } from './common/editor/editor.component';
import { UploadFileComponent } from './coderRouter/upload-file/upload-file.component';
import { ProgressCircleComponent } from './common/progress-circle/progress-circle.component';
import { PrimaryButtonComponent } from './common/primary-button/primary-button.component';
import { HomeComponent } from './userRouter/home/home.component';
import { SubmitComponent } from './userRouter/submit/submit.component';
import { ColumnNavComponent } from './common/column-nav/column-nav.component';
import { InputComponent } from './common/input/input.component';
import { SelectComponent } from './common/select/select.component';
import { HeaderComponent } from './common/header/header.component';
import { LayoutComponent } from './common/layout/layout.component';
import { AboutComponent } from './userRouter/about/about.component';
import { DetailComponent } from './userRouter/detail/detail.component';
import { PoetryListComponent } from './userRouter/poetry-list/poetry-list.component';
import { QuestionComponent } from './userRouter/question/question.component';
import { RouterBlockComponent } from './common/router-block/router-block.component';
import { AdminMenuComponent } from './adminRouter/admin-menu/admin-menu.component';
import { CoderMenuComponent } from './coderRouter/coder-menu/coder-menu.component';
import { UserBlockComponent } from './common/user-block/user-block.component';
import { CircleButtonComponent } from './common/circle-button/circle-button.component';
import { PoetryListDetailComponent } from './userRouter/poetry-list-detail/poetry-list-detail.component';
import { AdminWorksComponent } from './adminRouter/admin-works/admin-works.component';
import { AdminPersonComponent } from './adminRouter/admin-person/admin-person.component';
import { AdminFlowComponent } from './adminRouter/admin-flow/admin-flow.component';
import { AdminEditComponent } from './adminRouter/admin-edit/admin-edit.component';
import { AdminEditPreviewComponent } from './adminRouter/admin-edit/admin-edit-preview/admin-edit-preview.component';
import { AdminEditorComponent } from './adminRouter/admin-edit/admin-editor/admin-editor.component';


export class MyHammerConfig extends HammerGestureConfig  {
  overrides = <any>{
      'swipe': {velocity: 0.4, threshold: 20} // override default settings
  }
}


@NgModule({
  declarations: [
    AppComponent,
    // router
    ChildrenRouterComponent,

    LoginComponent,
    UploadConfirmComponent,
    DeleteConfirmComponent,
    FileTabViewerComponent,
    UserComponent,
    DevelopLogComponent,
    DelevopLogFormComponent,
    UserFormComponent,
    
    // coderRouter
    FileMakerComponent,
    TableViewerComponent,
    DataViewerComponent,
    EditorComponent,
    UploadFileComponent,
    ProgressCircleComponent,
    PrimaryButtonComponent,
    HomeComponent,
    SubmitComponent,
    ColumnNavComponent,
    InputComponent,
    SelectComponent,
    HeaderComponent,
    LayoutComponent,
    AboutComponent,
    DetailComponent,
    PoetryListComponent,
    QuestionComponent,
    RouterBlockComponent,
    AdminMenuComponent,
    CoderMenuComponent,
    UserBlockComponent,
    CircleButtonComponent,
    PoetryListDetailComponent,
    AdminWorksComponent,
    AdminPersonComponent,
    AdminFlowComponent,
    AdminEditComponent,
    AdminEditPreviewComponent,
    AdminEditorComponent,
  
  
  
  ],
  imports: [
    BrowserModule,
    HammerModule,
    AppRoutingModule,   
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers:  [
    { 
        provide: HAMMER_GESTURE_CONFIG, 
        useClass: MyHammerConfig 
    },
    {
        provide: LocationStrategy,
        useClass: HashLocationStrategy
    }
  ], // use our custom hammerjs config,  
  bootstrap: [AppComponent]
})
export class AppModule {
}
