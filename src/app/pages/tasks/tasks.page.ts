import { Component, inject, signal, viewChild } from '@angular/core';
import { TRPC_CLIENT } from '../../utils/trpc.client';
import { trpcResource } from '@fhss-web-team/frontend-utils';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { TaskCardComponent } from '../../components/task-card/task-card.component';
import { MatIconModule } from "@angular/material/icon";
import { NewTaskCardComponent } from '../../components/new-task-card/new-task-card.component';

@Component({
  selector: 'app-tasks',
  imports: [
    MatProgressSpinnerModule,
    MatPaginator,
    TaskCardComponent,
    MatIconModule,
    NewTaskCardComponent
],
  templateUrl: './tasks.page.html',
  styleUrl: './tasks.page.scss'
})
export class TasksPage {
  trpc = inject(TRPC_CLIENT);

  PAGE_SIZE = 12;
  pageOffset = signal(0);
  showCreate = signal(false);

  taskResource = trpcResource(
    this.trpc.tasks.getTasksByUser.mutate,
    () => ({
      pageSize: this.PAGE_SIZE,
      pageOffset: this.pageOffset(),
    }),
    { autoRefresh: true }
  );

  async taskCreated() {
    this.showCreate.set(false);
    await this.taskResource.refresh();
  }

  handlePageEvent(e: PageEvent) {
    this.pageOffset.set(e.pageIndex * e.pageSize);
  }

  paginator = viewChild.required(MatPaginator)
  async deleteTask(id: string){
    // manually call our delete procedure. No need for a trpcResource in this case
    await this.trpc.tasks.deleteTask.mutate({id});
    await this.taskResource.refresh();

    // if we are not on the first page. And if we just deleted the last task on the current page. 
    if ( this.pageOffset() != 0 && this.taskResource.value()?.data.length === 0 ){
      this.paginator().previousPage();
    }
  }
}
