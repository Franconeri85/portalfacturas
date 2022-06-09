import {Injectable} from '@angular/core'
import {BehaviorSubject, Observable, Subject} from "rxjs"
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})


export class AppComponentService {
  
  urlBackend: string = "https://cxx6ga8e8b.execute-api.us-west-2.amazonaws.com/Dev/";
  urlUsuarios: string = "http://localhost:5000/api/";
  httpOptions;
  public $callbackClick = new Subject()

  constructor( private http: HttpClient ) {
    this.httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json", "x-api-key": "niFLSX2cOK4FEffs9q4iX9MgeBLblbFs2sbM6nLu" })
    };
  }


  obtenerTablero(entorno, webservice, compania, year, month ){

    //return this.http.get('assets/response.json', this.httpOptions);
    return this.http.get(this.urlBackend + `/tablero?entorno=${entorno}&cuit=30711727074&webservice=${webservice}&fecha=${year}${month}01`, this.httpOptions);

  }
  getData(){

  }
  obtenerUsuario(id){
    return this.http.get(this.urlUsuarios + 'users/'+id, this.httpOptions);

  }
  obtenerClientes(){
    return this.http.get(this.urlBackend + 'Clientes/', this.httpOptions);
  }
  obtenerComprobantes(){
    return this.http.get(this.urlBackend + 'Comprobantes/?entorno=DEV&amp;webservice=wsfe&amp;cuitEmisor=30711727074&amp;ptoVta=1000&amp;fechaDesde=20220501', this.httpOptions);

  }

  obtenerTokenValido(){
    let token = localStorage.getItem('tk');
    return this.http.get(this.urlUsuarios + 'users/validateToken/'+token, this.httpOptions);
  }
  messageSource = new BehaviorSubject<any>({
    messageType: 'message',
    payload: 'something',
  });
  currentMessage: Observable<any> = this.messageSource.asObservable();
  changeMessage(message: any) {
      this.messageSource.next(message);
  }

  obtenerUsuariosPorCompania(company){
    return this.http.get(this.urlUsuarios + 'users/byCompany/'+company, this.httpOptions);
    
  }
  borrarUsuario(id){
    return this.http.delete(this.urlUsuarios + 'users/'+id, this.httpOptions);

  }
  obtenerCompanias(){
    return this.http.get(this.urlUsuarios + 'company', this.httpOptions);
    
  }
}