import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadComponent } from './upload/upload.component';
import { PdfComponent } from './pdf/pdf.component';
import { LoginComponent } from './login/login.component';
const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'upload',
    component: UploadComponent,
  },
  {
    path: 'pdf',
    component: PdfComponent,
  },
  {
    path: '*',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
