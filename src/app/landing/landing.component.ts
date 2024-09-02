import { NavigationEnd, Router } from '@angular/router';

import { Component } from '@angular/core';
import { routeData } from '../configs/locationCofigs';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent {
  public filteredTilesData: Array<any> = [];
  public navList: Array<any> = [];
  constructor(private router: Router) {}

  public handleClickTile(dataItem: any) {
    this.router.navigate([dataItem.routeId]);
  }

  public async ngOnInit() {
    this.navList = this.router.config;
    this.filteredTilesData = routeData.filter(
      (item) => item.shouldRenderTile === true
    );
  }
}
