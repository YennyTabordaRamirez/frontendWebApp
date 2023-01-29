import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  modal: boolean = false;
  private _notificarSubidaFoto = new EventEmitter<any>();


  constructor() { }

  get notificarSubidaFoto(): EventEmitter<any>{
    return this._notificarSubidaFoto;
  }

  abrirModal(){
    this.modal = true;
  }

  cerrarModal(){
    this.modal = false;
  }
}
