import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppGuardGuard } from "src/app/app-guard.guard";
import { DevelopLogComponent } from './adminRouter/develop-log/develop-log.component';
import { AppComponent } from './app.component';
import { DataViewerComponent } from './coderRouter/data-viewer/data-viewer.component';
import { FileMakerComponent } from './coderRouter/file-maker/file-maker.component';
import { TableViewerComponent } from './coderRouter/table-viewer/table-viewer.component';
import { UploadFileComponent } from './coderRouter/upload-file/upload-file.component';
import { UserComponent } from './coderRouter/user-viewer/user.component';
import { LayoutComponent } from './common/layout/layout.component';
import { ChildrenRouterComponent } from './router/children-router/children-router.component';
import { HomeComponent } from './userRouter/home/home.component';
import { LoginComponent } from './router/login/login.component';
import { AboutComponent } from './userRouter/about/about.component';
import { DetailComponent } from './userRouter/detail/detail.component';
import { PoetryListComponent } from './userRouter/poetry-list/poetry-list.component';
import { QuestionComponent } from './userRouter/question/question.component';
import { SubmitComponent } from './userRouter/submit/submit.component';
import { AdminMenuComponent } from './adminRouter/admin-menu/admin-menu.component';
import { CoderMenuComponent } from './coderRouter/coder-menu/coder-menu.component';
import { PoetryListDetailComponent } from './userRouter/poetry-list-detail/poetry-list-detail.component';
import { AdminFlowComponent } from './adminRouter/admin-flow/admin-flow.component';
import { AdminPersonComponent } from './adminRouter/admin-person/admin-person.component';
import { AdminWorksComponent } from './adminRouter/admin-works/admin-works.component';
import { AdminEditComponent } from './adminRouter/admin-edit/admin-edit.component';
import { AdminGuard } from 'src/app/admin.guard';
import { CoderGuard } from 'src/app/coder.guard';
import { UserGuard } from 'src/app/user.guard';

const routes: Routes = [
    { path: '', component: AppComponent, canActivate: [AppGuardGuard], canActivateChild:[AppGuardGuard],
    children:[
        { path: 'login', component: LoginComponent },
        { path: 'coder', component: LayoutComponent, canActivate: [CoderGuard], canActivateChild:[CoderGuard],
         children:[
          { path: '', component: CoderMenuComponent },
          { path: 'table-viewer', component: TableViewerComponent },
          { path: 'file-maker', component: FileMakerComponent },
          { path: 'data-viewer', component: DataViewerComponent },
          { path: 'user-viewer', component: UserComponent },
          { path: 'upload-file', component: UploadFileComponent },
        ]},
        { path: 'admin', component: LayoutComponent, canActivate: [AdminGuard], canActivateChild:[AdminGuard],
         children: [
          { path: '', component: AdminMenuComponent},
          { path: 'admin-flow', component: AdminFlowComponent},
          { path: 'admin-person', component: AdminPersonComponent},
          { path: 'admin-works', component: AdminWorksComponent},
          { path: 'admin-edit', component: AdminEditComponent},
          { path: 'develop-log', component: DevelopLogComponent },
          
        ]},
        { path: 'user', component: LayoutComponent, canActivate: [UserGuard], canActivateChild:[UserGuard],
          children: [
          { path: '', component: HomeComponent},
          { path: 'submit', component: SubmitComponent },
          { path: 'detail', component: DetailComponent },
          { path: 'question', component: QuestionComponent },
          { path: 'about', component: AboutComponent },
          { path: 'poetry-list', component: PoetryListComponent },
          { path: 'poetry-detail', component: PoetryListDetailComponent },
        ]},
        { path: '', redirectTo: '/login', pathMatch: 'full'},
   ]},
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
