import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './pages/ui-components/lists/lists.component';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'http://localhost:8000/api/tasks';  // URL de votre backend Laravel

  constructor(private http: HttpClient) { }

  // Récupérer toutes les tâches
  getTasks(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Récupérer une tâche spécifique
  getTask(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Créer une tâche
  createTask(task: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, task, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  // Mettre à jour une tâche
  updateTask(id: number, task: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, task, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  // Supprimer une tâche
  deleteTask(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  markTaskAsCompleted(taskId: number): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${taskId}/complete`, {});
  }
  
  
}
