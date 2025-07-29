import { Component } from '@angular/core';
import { ByuHeaderComponent, HeaderConfig } from '@fhss-web-team/frontend-utils';

@Component({
  selector: 'app-home',
  imports: [ByuHeaderComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss'
})
export class HomePage {
  headerConfig: HeaderConfig = {
    title: {
      text: 'Starter App',
      path: ''
    }
  }
}
