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
import { RouterModule } from '@angular/router';
import { AuthorizeGuard } from './auth.guard';
import { ResetComponent } from './reset/reset.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { IconsModule, SVGIcon } from '@progress/kendo-angular-icons';
import { DialogsModule } from '@progress/kendo-angular-dialog';

import { NavigationModule } from '@progress/kendo-angular-navigation';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { HttpClientModule } from '@angular/common/http';
import { ListViewModule } from '@progress/kendo-angular-listview';
import { EditComponent } from './edit/edit.component';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { NavbarComponent } from './navbar/navbar.component';
import { UserOptionsModalComponent } from './user-options-modal/user-options-modal.component';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { AuthService } from './AuthService';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UploadComponent,
    PdfComponent,
    QrcodeComponent,
    ResetComponent,
    EditComponent,
    NavbarComponent,
    UserOptionsModalComponent,
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
    IconsModule,
    IndicatorsModule,
    IconsModule,
    ListViewModule,
    NotificationModule,
    DialogsModule,
    GridModule,
    BrowserAnimationsModule,
    NavigationModule,
    DropDownsModule,
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent },
      { path: 'reset', component: ResetComponent },
      { path: 'qrcode', component: QrcodeComponent },
      { path: 'pdf', component: PdfComponent, canActivate: [AuthorizeGuard] },
      { path: 'edit', component: EditComponent, canActivate: [AuthorizeGuard] },

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
