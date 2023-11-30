import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../AuthService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  public email: string = '';

  constructor(private authService: AuthService, public router: Router) {}

  ngOnInit() {
    this.email = '';

    // Auth.currentAuthenticatedUser()
    //   .then((user) => {
    //     this.email = user.attributes.email;
    //   })
    //   .catch(() => console.log('Not signed in'));
  }

  async onLogoutClick() {
    await this.authService
      .onSignOut()
      .then(() => this.router.navigate(['/login']));
  }
}
