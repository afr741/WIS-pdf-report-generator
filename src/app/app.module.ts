import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconsModule, SVGIcon } from '@progress/kendo-angular-icons';

import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './AuthService';
import { AuthorizeGuard } from './auth.guard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { EditComponent } from './edit/edit.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { HttpClientModule } from '@angular/common/http';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { LandingComponent } from './landing/landing.component';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { ListViewModule } from '@progress/kendo-angular-listview';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NavigationModule } from '@progress/kendo-angular-navigation';
import { NgModule } from '@angular/core';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { PdfComponent } from './pdf/pdf.component';
import { QrcodeComponent } from './qrcode/qrcode.component';
import { ResetComponent } from './reset/reset.component';
import { RouterModule } from '@angular/router';
import { UploadComponent } from './upload/upload.component';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { UserOptionsModalComponent } from './user-options-modal/user-options-modal.component';

const routeInfo: any = [
  { path: 'login', component: LoginComponent },
  { path: 'reset', component: ResetComponent },
  { path: 'qrcode', component: QrcodeComponent },
  { path: 'pdf', component: PdfComponent, canActivate: [AuthorizeGuard] },
  {
    path: 'landing',
    component: LandingComponent,
    canActivate: [AuthorizeGuard],
  },
  { path: 'edit', component: EditComponent, canActivate: [AuthorizeGuard] },

  {
    path: 'upload',
    component: UploadComponent,
    canActivate: [AuthorizeGuard],
  },
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UploadComponent,
    PdfComponent,
    LandingComponent,
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
    RouterModule.forRoot(routeInfo),
  ],
  providers: [AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
