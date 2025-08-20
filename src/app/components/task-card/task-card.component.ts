import { Component, inject, input, linkedSignal, output, Pipe, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from "@angular/material/icon";
import { Task } from '../../../../prisma/client';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { trpcResource } from '@fhss-web-team/frontend-utils';
import { TRPC_CLIENT } from '../../utils/trpc.client';
import { DatePipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-task-card',
  imports: [
    MatIconModule, 
    MatCardModule, 
    MatButtonModule, 
    MatInputModule, 
    MatFormField, 
    FormsModule, 
    DatePipe
  ],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {
  trpc = inject(TRPC_CLIENT)
  deleteTaskEvent = output<string>();

  initialTaskValue = input.required<Task>();
  editMode = signal<boolean>(false);

  newTitle = linkedSignal(() => this.initialTaskValue().title);
  newDescription = linkedSignal(() => this.initialTaskValue().description);
  newStatus = linkedSignal(() => this.initialTaskValue().status);

  taskCardState = trpcResource(this.trpc.tasks.updateTask.mutate, () => ({
    id: this.initialTaskValue().id,
    title: this.newTitle(),
    description: this.newDescription(),
    status: this.newStatus()
  }), { valueComputation: () =>  this.initialTaskValue() });

  save() {
    this.taskCardState.value.update((prevTask) => {
      if(prevTask === undefined) return undefined
      return {
        ...prevTask,
        title: this.newTitle(),
        description: this.newDescription()
      }
    })
    this.taskCardState.refresh();
    this.editMode.set(false)
  }

  cancel() {
    this.newTitle.set(this.taskCardState.value()?.title ?? '')
    this.newDescription.set(this.taskCardState.value()?.description ?? '')
    this.editMode();
  }

  deleteTask() {
    this.deleteTaskEvent.emit(this.initialTaskValue().id);
  }
}

