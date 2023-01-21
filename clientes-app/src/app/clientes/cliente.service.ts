import { Injectable } from '@angular/core';
import { CLIENTES } from './clientes.json';
import { clientes } from './clientes';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  constructor(private http: HttpClient,
              private router: Router) {}

  private urlEndPoint: string = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  getClientes(): Observable<clientes[]> {
    //return of(CLIENTES);
    //return this.http.get<clientes[]>(this.urlEndPoint);
    return this.http
      .get(this.urlEndPoint)
      .pipe(map((response) => response as clientes[]));
  }

  create(cliente: clientes): Observable<clientes[]> {
    return this.http.post<clientes[]>(this.urlEndPoint, cliente, {headers: this.httpHeaders,})
    .pipe(
      catchError( e=> {

        if(e.status==400){
          return throwError(e);
        }
        console.error(e.error.mensaje);

        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  getClienteById(id): Observable<clientes> {
    return this.http.get(`${this.urlEndPoint}/${id}`)
    .pipe(map((response) => response as clientes))
    .pipe(
      catchError( e=> {
        this.router.navigate(['/clientes'])
        console.log(e.error.mensaje);
        swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  update(cliente: clientes): Observable<clientes> {
    return this.http.put<clientes>(`${this.urlEndPoint}/${cliente.id}`,cliente,{ headers: this.httpHeaders })
    .pipe(
      catchError( e=> {

        if(e.status==400){ //Manejo distinto por ser 400 - spring validation
          return throwError(e);
        }
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<clientes>{
    return this.http.delete<clientes>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders })
    .pipe(
      catchError( e=> {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
}
