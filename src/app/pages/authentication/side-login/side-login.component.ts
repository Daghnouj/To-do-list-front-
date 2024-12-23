import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { MatButtonModule } from '@angular/material/button';
import { AuthserviceService } from 'src/app/authservice.service';

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {
  constructor(private router: Router, private authService: AuthserviceService) {}

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.valid) {
      const credentials = {
        email: this.form.value.name,  // Assure-toi que le backend attend 'email', pas 'uname'
        password: this.form.value.password,
      };
  
      // Appel au service AuthService pour envoyer les données à l'API
      this.authService.signin(credentials).subscribe(
        (response) => {
          // Si la connexion est réussie, stocke le token et redirige
          localStorage.setItem('token', response.token);
          console.log('Login successful', response);
          this.router.navigate(['/ui-components/lists']);
        },
        (error) => {
          console.error('Login failed', error);
          // Affiche un message d'erreur si la connexion échoue
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
  logout() {
    this.authService.logout().subscribe(() => {
      // La déconnexion a réussi, l'utilisateur est redirigé vers la page de connexion
      console.log('Logged out successfully');
    }, (error) => {
      console.error('Logout failed', error);
    });
  }
  
}
