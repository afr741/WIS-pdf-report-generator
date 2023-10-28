import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UploadComponent } from './upload/upload.component';
import { PdfComponent } from './pdf/pdf.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QrcodeComponent } from './qrcode/qrcode.component';
import { AuthService } from './AuthService';
import { RouterModule } from '@angular/router';
import { AuthorizeGuard } from './auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UploadComponent,
    PdfComponent,
    QrcodeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AmplifyAuthenticatorModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent },
      { path: 'qrcode', component: QrcodeComponent },
      { path: 'pdf', component: PdfComponent, canActivate: [AuthorizeGuard] },

      {
        path: 'upload',
        component: UploadComponent,
        canActivate: [AuthorizeGuard],
      },
      { path: '', redirectTo: 'upload', pathMatch: 'full' },
    ]),
  ],
  providers: [AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
