import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SuperCalenderComponent, SuperNGComponent } from '../../projects/super-ng/src/public-api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,SuperNGComponent,SuperCalenderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'my-workspace';
}
