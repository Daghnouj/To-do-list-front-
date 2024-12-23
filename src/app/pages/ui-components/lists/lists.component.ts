import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { TaskService } from 'src/app/task.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


export interface Task {
  id: number;
  title: string;
  description: string;
  priority: number;
  due_date: Date | string;
  status?: string;
}

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [
    MatListModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MaterialModule,
    CommonModule,
  ],
  providers: [DatePipe],
  templateUrl: './lists.component.html',
})
export class AppListsComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  priorityOptions = [1, 2, 3, 4, 5];
  newTask: Task = { id: 0, title: '', description: '', priority: 3, due_date: '' };
  editableTask: Task | null = null;  
  currentTask: Task = { id: 0, title: '', description: '', priority: 3, due_date: '' };
  successMessage: string | null = null;
  showCreateForm: boolean = false;
  searchQuery: string = ''; 

  constructor(private taskService: TaskService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe(
      (tasks: Task[]) => {
        this.tasks = tasks.map((task: Task) => ({
          ...task,
          due_date: new Date(task.due_date),
        }));
        this.filteredTasks = [...this.tasks]; // Initialiser les tâches filtrées
        console.log('Tâches récupérées:', this.tasks);
      },
      (error) => {
        console.error('Erreur lors de la récupération des tâches', error);
        this.successMessage = 'Failed to load tasks. Please try again later.';
        setTimeout(() => (this.successMessage = null), 3000);
      }
    );
  }

  createTask(): void {
    if (this.currentTask.title && this.currentTask.priority && this.currentTask.due_date) {
      const dueDate = new Date(this.currentTask.due_date);
      this.currentTask.due_date = dueDate.toISOString().split('T')[0]; // YYYY-MM-DD

      this.taskService.createTask(this.currentTask).subscribe(
        (task) => {
          task.due_date = new Date(task.due_date);
          this.tasks.push(task);
          this.currentTask = { id: 0, title: '', description: '', priority: 5 , due_date: '' };
          this.successMessage = 'Task created successfully!';
          setTimeout(() => (this.successMessage = null), 3000);
          this.showCreateForm = false;
          this.filterTasks(); // Filtrer après la création de la tâche
        },
        (error) => {
          console.error('Erreur lors de la création de la tâche', error);
          this.successMessage = 'Failed to create task. Please try again later.';
          setTimeout(() => (this.successMessage = null), 3000);
        }
      );
    } else {
      this.successMessage = 'Please fill in all required fields.';
      setTimeout(() => (this.successMessage = null), 3000);
    }
  }

  editTask(task: Task): void {
    this.editableTask = { ...task }; // Set task to editable mode
    this.currentTask = { ...task }; // Populate currentTask with the task data
    this.showCreateForm = true;  // Show the form for editing
  }

  updateTask(): void {
    if (this.currentTask) {
      this.taskService.updateTask(this.currentTask.id, this.currentTask).subscribe(
        (updatedTask) => {
          const index = this.tasks.findIndex((task) => task.id === this.currentTask?.id);
          if (index !== -1) {
            updatedTask.due_date = new Date(updatedTask.due_date);
            this.tasks[index] = updatedTask;
          }
          this.successMessage = 'Task updated successfully!';
          setTimeout(() => (this.successMessage = null), 3000);
          this.editableTask = null;
          this.showCreateForm = false;
          this.filterTasks(); // Filtrer après la mise à jour de la tâche
        },
        (error) => {
          console.error('Erreur lors de la mise à jour de la tâche', error);
          this.successMessage = 'Failed to update task. Please try again later.';
          setTimeout(() => (this.successMessage = null), 3000);
        }
      );
    }
  }

  cancelEditing(): void {
    this.editableTask = null;  // Reset the editable task
    this.showCreateForm = false;  // Hide the form
  }

  deleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe(
      () => {
        this.tasks = this.tasks.filter((task) => task.id !== taskId);
        this.successMessage = 'Task deleted successfully!';
        setTimeout(() => (this.successMessage = null), 3000);
        this.filterTasks(); // Filtrer après la suppression de la tâche
      },
      (error) => {
        console.error('Erreur lors de la suppression de la tâche', error);
        this.successMessage = 'Failed to delete task. Please try again later.';
        setTimeout(() => (this.successMessage = null), 3000);
      }
    );
  }

  // Fonction de filtrage des tâches selon la requête de recherche
  filterTasks(): void {
    if (this.searchQuery) {
      this.filteredTasks = this.tasks.filter((task) =>
        task.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredTasks = [...this.tasks]; // Restaure toutes les tâches si la recherche est vide
    }
  }
  markAsCompleted(task: Task): void {
    this.taskService.markTaskAsCompleted(task.id).subscribe(
      (updatedTask: Task) => {
        const index = this.tasks.findIndex((t) => t.id === updatedTask.id);
        if (index !== -1) {
          this.tasks[index].status = 'completed'; // Mettez à jour le statut localement
        }
        this.successMessage = 'Task marked as completed!';
        setTimeout(() => (this.successMessage = null), 3000);
        this.filterTasks(); // Mettre à jour la vue filtrée
      },
      (error) => {
        console.error('Erreur lors du marquage de la tâche comme terminée', error);
        this.successMessage = 'Failed to mark task as completed. Please try again later.';
        setTimeout(() => (this.successMessage = null), 3000);
      }
    );
  }
  
}
