import { Component } from '@angular/core';
import { ClienteService } from './cliente.service';
import { clientes } from './clientes';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { Region } from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})
export class FormComponent {
  public cliente: clientes = new clientes();
  public titulo: string = 'Crear cliente';
  public errores: string[];
  regiones : Region[];


  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.cargarCliente();
  }

  public cargarCliente(): void {
    this.activatedRoute.params.subscribe((params) => {
      let id = params['id'];
      if (id) {
        this.clienteService
          .getClienteById(id)
          .subscribe((cliente) => (this.cliente = cliente));
      }
    });
    this.clienteService.getRegiones().subscribe(
      regiones => {
        this.regiones = regiones;
      }
    )
  }

  public crear(): void {
    console.log("Entrè")
    this.clienteService
      .create(this.cliente)
      .subscribe((responseNuevoCliente) => {
        console.log("Entrè")
        this.router.navigate(['/clientes']);
        swal.fire({
          title: 'Nuevo cliente',
          text: `cliente ${this.cliente.nombre} creado con éxito`,
          timer: 4000,
        })
      },
      err => {
        console.log("Entrè")
        this.errores = err.error.errors as string[];
        console.error("Código del error desde el backend " + err.status);
        console.error(err.error.errors);
      });
  }

  public update(): void {
    this.clienteService
      .update(this.cliente)
      .subscribe((responseClienteModificado) => {
        this.router.navigate(['/clientes']);
        swal.fire({
          title: 'Editar cliente',
          text: `cliente ${this.cliente.nombre} modificado con éxito`,
          timer: 4000,
        })
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error('Código del error desde el backend' + err.status);
        console.error(err.error.errors);
      });
  }

  compararRegion(objetoDelFor: Region, objetoDeLaclase: Region): boolean{

    if(objetoDelFor === undefined && objetoDeLaclase === undefined){
      return true;
    }

    //return (objetoDelFor === null || objetoDeLaclase === null)? false : objetoDelFor === objetoDeLaclase;      
    return objetoDelFor && objetoDeLaclase ? objetoDelFor.id === objetoDeLaclase.id : objetoDelFor === objetoDeLaclase;


  }
  
}
