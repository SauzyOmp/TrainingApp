import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';
import { ByuHeaderComponent, HeaderConfig } from '@fhss-web-team/frontend-utils';

@Component({
  selector: 'app-byu-layout',
  imports: [RouterOutlet, ByuHeaderComponent],
  templateUrl: './byu.layout.html',
  styleUrl: './byu.layout.scss'
})
export class ByuLayout {
  headerConfig: HeaderConfig = {
    title: { text: 'The TO-DO of To-Do\'s', path: '/' },
    menu: [
      { text: 'Home', path: '/' },
      { text: 'My Lists', path: '/lists' },
      { text: 'My Tasks', path: '/tasks' }
    ],
  };
}
