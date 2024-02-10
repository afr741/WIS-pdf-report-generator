import { Component } from '@angular/core';
import { bellIcon, menuIcon, SVGIcon } from '@progress/kendo-svg-icons';
// const logo = require('../../assets/images/wis-logo.jpeg').default as string;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  public menuIcon: SVGIcon = menuIcon;
  public bellIcon: SVGIcon = bellIcon;
  // public wisLogo: any = logo;
  public kendokaAvatar =
    'https://www.telerik.com/kendo-angular-ui-develop/components/navigation/appbar/assets/kendoka-angular.png';
}
