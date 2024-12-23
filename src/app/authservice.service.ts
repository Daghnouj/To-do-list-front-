import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {
  private apiUrl = 'http://127.0.0.1:8000/api';
  constructor(private http: HttpClient,private router: Router) {}

  signin(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signin`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
        }
      })
    );
  }
  

  logout(): Observable<any> {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  
    if (!token) {
      this.router.navigate(['/authentication/login']);
      return new Observable(observer => {
        observer.complete(); // Simule une réponse réussie
      });
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers }).pipe(
      tap({
        next: () => {
          console.log('Logout successful');
        },
        error: (err) => {
          console.warn('Logout failed on server, clearing token locally', err);
        },
        complete: () => {
          localStorage.removeItem('auth_token');
          sessionStorage.removeItem('auth_token');
          this.router.navigate(['/authentication/login']);
        }
      })
    );
  }
  
}
