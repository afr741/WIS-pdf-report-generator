import { NavigationEnd, Router } from '@angular/router';

import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent {
  uploadIcon = '../../assets/images/upload-icon.svg';
  editIcon = '../../assets/images/edit-icon.svg';
  reportsIcon = '../../assets/images/reports-icon.svg';

  public navList: Array<any> = [];
  public tilesData: Array<any> = [
    {
      routeId: 'landing',
      label: 'Landing',
      icon: 'landing',
      shouldRenderTile: false,
    },
    {
      routeId: 'reset',
      label: 'Reset',
      icon: 'reset',
      shouldRenderTile: false,
    },
    {
      routeId: 'upload',
      label: 'Upload docs',
      icon: this.uploadIcon,
      shouldRenderTile: true,
    },
    {
      routeId: 'pdf',
      label: 'Past Reports',
      icon: this.reportsIcon,
      shouldRenderTile: true,
    },
    {
      routeId: 'edit',
      label: 'Edit Template',
      icon: this.editIcon,
      shouldRenderTile: true,
    },
  ];
  public filteredTilesData: Array<any> = [];

  constructor(private router: Router) {}

  public handleClickTile(dataItem: any) {
    this.router.navigate([dataItem.routeId]);
    console.log('dataItem', dataItem);
  }

  public async ngOnInit() {
    this.navList = this.router.config;
    this.filteredTilesData = this.tilesData.filter(
      (item) => item.shouldRenderTile === true
    );

    console.log('this navList', this.navList);
  }
}
