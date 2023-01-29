import { Injectable } from '@angular/core';
import { formatDate, DatePipe } from '@angular/common';
import { clientes } from './clientes';
import { Observable, of, throwError } from 'rxjs';
import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Region } from './region';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private urlEndPoint: string = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router) {}

  getRegiones(): Observable<Region[]>{
    return this.http.get<Region[]>(this.urlEndPoint + '/regiones');    
  }

  getClientes(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {
        (response.content as clientes[]).forEach((cliente) => {});
      }),
      map((response: any) => {
        (response.content as clientes[]).map((cliente) => {
          cliente.nombre = cliente.nombre.toUpperCase();
          //se comentaron las siguientes 3 lineas para ponerlo glogal en el proyecyo, primero en el appModule y luego con un pipe en el template de cliente
          //cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US') esta es una forma pa la fecha
          //let datePipe = new DatePipe('es-CO');
          //cliente.createAt = datePipe.transform(cliente.createAt, 'EEE dd, MMM yyyy' /*fullDate*/ /*'dd/MM/yyyy'*/) //formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US')
          return cliente;
        });
        return response;
      }),
      tap((response) => {
        (response.content as clientes[]).forEach((cliente) => {});
      })
    );
  }

  create(cliente: clientes): Observable<clientes[]> {
    return this.http
      .post<clientes[]>(this.urlEndPoint, cliente, {
        headers: this.httpHeaders,
      })
      .pipe(
        catchError((e) => {
          if (e.status == 400) {
            return throwError(e);
          }
          console.error(e.error.mensaje);

          swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(e);
        })
      );
  }

  getClienteById(id): Observable<clientes> {
    return this.http
      .get(`${this.urlEndPoint}/${id}`)
      .pipe(map((response) => response as clientes))
      .pipe(
        catchError((e) => {
          this.router.navigate(['/clientes']);
          console.log(e.error.mensaje);
          swal.fire('Error al editar', e.error.mensaje, 'error');
          return throwError(e);
        })
      );
  }

  update(cliente: clientes): Observable<clientes> {
    return this.http
      .put<clientes>(`${this.urlEndPoint}/${cliente.id}`, cliente, {
        headers: this.httpHeaders,
      })
      .pipe(
        catchError((e) => {
          if (e.status == 400) {
            //Manejo distinto por ser 400 - spring validation
            return throwError(e);
          }
          console.error(e.error.mensaje);
          swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(e);
        })
      );
  }

  delete(id: number): Observable<clientes> {
    return this.http
      .delete<clientes>(`${this.urlEndPoint}/${id}`, {
        headers: this.httpHeaders,
      })
      .pipe(
        catchError((e) => {
          console.error(e.error.mensaje);
          swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(e);
        })
      );
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('id', id);

    const req = new HttpRequest(
      'POST',
      `${this.urlEndPoint}/upload`,
      formData,
      {
        reportProgress: true,
      }
    );

    return this.http.request(req);
  }
}
