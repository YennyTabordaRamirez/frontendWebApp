import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'paginator-nav',
  templateUrl: './paginator.component.html'
})
export class PaginatorComponent implements OnInit, OnChanges {

  @Input() paginator: any;
  pages: number[];
  desde: number;
  hasta: number;

  ngOnInit(): void {  
    this.initPaginator(); 
  }

  ngOnChanges( changes: SimpleChanges) {
    let paginadorActualizado = changes['paginator'];

    if (paginadorActualizado.previousValue) {
      this.initPaginator();      
    }      
  }

  private initPaginator(): void{
    this.desde = Math.min(Math.max (1, this.paginator.number-4), this.paginator.totalPages - 5);
    this.hasta = Math.max(Math.min (this.paginator.totalPages, this.paginator.number+4), 6);

    if(this.paginator.totalPages > 5 ){
      this.pages = new Array(this.hasta - this.desde + 1).fill(0).map((_valor, indice) => indice + this.desde);
    } else {
      this.pages = new Array(this.paginator.totalPages).fill(0).map((_valor, indice) => indice+1);
    }

  }

}
