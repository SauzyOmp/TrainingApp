import { Component, input, signal } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-task-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {
  initialTaskValue = input.required<Task>();
  editMode = signal<boolean>(false);
}
