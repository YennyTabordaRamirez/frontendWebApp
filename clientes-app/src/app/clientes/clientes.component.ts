import { Component, OnInit, Input } from '@angular/core';
import { ClienteService } from './cliente.service';
import { clientes } from './clientes';
import { ModalService } from './detalle/modal.service';
import Swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { PaginatorComponent } from '../paginator/paginator.component';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
})
export class ClientesComponent implements OnInit {
  clientes: clientes[];
  paginator: any;
  clienteSeleccionado: clientes;

  constructor(
    private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      let page: number = +params.get('page'); //este es un string pero como page es number, se le pone un '+' para que lo convierta

      if (!page) {
        page = 0;
      }

      this.clienteService
        .getClientes(page)
        .pipe(
          tap((response) => {
           
            (response.content as clientes[]).forEach((cliente) => {
              
            });
          })
        )
        .subscribe(
          (response) => {
            this.clientes = response.content as clientes[];
            this.paginator = response;
          }
        );
    });

    this.modalService.notificarSubidaFoto.subscribe(cliente => {
      this.clientes = this.clientes.map(clienteOriginal => {
        if(cliente.id == clienteOriginal.id){
          clienteOriginal.foto = cliente.foto;
        }
        return clienteOriginal;
      })
    })
  }

  public delete(cliente: clientes): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success mx-2',
        cancelButton: 'btn btn-danger mx-2',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: '¿Seguro?',
        text: `Va a eliminar al cliente ${cliente.nombre}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'No, cancelar',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.clienteService.delete(cliente.id).subscribe((response) => {
            this.clientes = this.clientes.filter((cli) => cli !== cliente);
            swalWithBootstrapButtons.fire(
              'Eliminado',
              `El cliente ${cliente.nombre} ha sido eliminado`,
              'success'
            );
          });
        }
      });
  }

  abrirModal(cliente: clientes){
    this.clienteSeleccionado = cliente
    this.modalService.abrirModal();

  }
}
