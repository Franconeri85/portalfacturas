import {Injectable} from '@angular/core'
import {Subject} from "rxjs"
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})


export class AppComponentService {
  
  urlBackend: string = "https://cxx6ga8e8b.execute-api.us-west-2.amazonaws.com/Dev/";
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
  obtenerClientes(){
    return this.http.get(this.urlBackend + 'Clientes/', this.httpOptions);
  }
  obtenerComprobantes(){
    return this.http.get('https://cxx6ga8e8b.execute-api.us-west-2.amazonaws.com/Dev/Comprobantes/?entorno=DEV&amp;webservice=wsfe&amp;cuitEmisor=30711727074&amp;ptoVta=1000&amp;fechaDesde=20220501', this.httpOptions);

  }
}