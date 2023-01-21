import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html',
  styleUrls: ['./directiva.component.css']
})
export class DirectivaComponent {
  listaCurso: string[] = ['Typescript', 'JavaScript', 'Java SE', 'Spring Boot',
'Angular'];

Habilitar: boolean= true;

setHabilitar(): void {
  this.Habilitar = (this.Habilitar == true)? false : true;
}

constructor() {}

}
