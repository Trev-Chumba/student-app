import { Component, ViewChild } from '@angular/core';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { AuthService } from '../../services/auth.service';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { MatListItem, MatNavList } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-layout',
  imports: [
    MatSidenav,
    MatToolbar,
    MatSidenavContainer,
    MatNavList,
    MatSidenavContent,
    MatIcon,
    RouterOutlet,
    MatListItem,
    RouterLink,
    MatButtonModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  menuItems = [
    { label: 'Home', icon: 'home', route: '/dashboard', isActive: true },
    {
      label: 'Data Generation',
      icon: 'flip_to_front',
      route: '/data-generation',
      isActive: false,
    },
    {
      label: 'Data Processing',
      icon: 'workspaces',
      route: '/data-processing',
      isActive: false,
    },
    {
      label: 'File Upload',
      icon: 'upload',
      route: '/file-upload',
      isActive: false,
    },
    {
      label: 'Student Management',
      icon: 'group',
      route: '/student-management',
      isActive: false,
    },
    {
      label: 'Student Report',
      icon: 'bar_chart',
      route: '/student-report',
      isActive: false,
    },
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleSidenav() {
    this.sidenav.toggle();
  }

  logout() {
    this.authService.logout();
  }

  ngOnInit() {
    // Listen for route changes and update active state
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.menuItems.forEach((item) => {
          item.isActive = this.router.url === item.route;
        });
      }
    });
  }
}
