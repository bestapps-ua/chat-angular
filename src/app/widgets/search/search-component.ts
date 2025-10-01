import { Component } from '@angular/core';
import {IconField} from 'primeng/iconfield';
import {InputText} from 'primeng/inputtext';
import {InputIcon} from 'primeng/inputicon';

@Component({
  selector: 'app-search',
  imports: [
    IconField,
    InputText,
    InputIcon
  ],
  templateUrl: './search-component.html',
  styleUrl: './search-component.css'
})
export class SearchComponent {

}
