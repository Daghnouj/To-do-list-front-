import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { HttpClient } from '@angular/common/http';  
import { environment } from 'src/environments/environment';  

@Component({
  selector: 'app-side-register',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './side-register.component.html',
})
export class AppSideRegisterComponent {
  constructor(private router: Router, private http: HttpClient) {}

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(6)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.valid) {
      // Mettez à jour le nom du champ de 'uname' à 'name' pour correspondre à l'API Laravel
      const formData = {
        name: this.form.value.name,  // 'name' au lieu de 'uname'
        email: this.form.value.email,
        password: this.form.value.password,
      };
  
      this.http.post(`${environment.apiUrl}/signup`, formData).subscribe(
        (response) => {
          console.log('User registered successfully', response);
          this.router.navigate(['/authentication/login']);
        },
        (error) => {
          console.error('Registration failed', error);
        }
      );
    }
  }
  
  
}
