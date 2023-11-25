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
import { ResetComponent } from './reset/reset.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { NavigationModule } from '@progress/kendo-angular-navigation';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { HttpClientModule } from '@angular/common/http';
import { ListViewModule } from '@progress/kendo-angular-listview';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UploadComponent,
    PdfComponent,
    QrcodeComponent,
    ResetComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AmplifyAuthenticatorModule,
    FormsModule,
    ReactiveFormsModule,
    InputsModule,
    LabelModule,
    ButtonsModule,
    LayoutModule,
    UploadsModule,
    HttpClientModule,
    IndicatorsModule,
    ListViewModule,

    RouterModule.forRoot([
      { path: 'login', component: LoginComponent },
      { path: 'reset', component: ResetComponent },
      { path: 'qrcode', component: QrcodeComponent },
      { path: 'pdf', component: PdfComponent, canActivate: [AuthorizeGuard] },

      {
        path: 'upload',
        component: UploadComponent,
        canActivate: [AuthorizeGuard],
      },
      { path: '', redirectTo: 'upload', pathMatch: 'full' },
    ]),
    GridModule,
    BrowserAnimationsModule,
    NavigationModule,
  ],
  providers: [AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
