import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthserviceService } from 'src/app/authservice.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, NgScrollbarModule, MaterialModule, MatButtonModule],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})

export class HeaderComponent {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  constructor(private authService: AuthserviceService, private router: Router) {}

  // Méthode de déconnexion
  logout(): void {
    this.authService.logout().subscribe(
      () => {
        console.log('Logged out successfully');
        this.navigateToLogin();
      },
      (error) => {
        console.error('Logout failed', error.message);
        // Optionnel : Affichez un message utilisateur ou redirigez
      }
    );
  }
  
  

  navigateToLogin(): void {
    this.router.navigate(['/authentication/login']);
  }
}
