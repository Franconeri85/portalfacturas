import {Injectable} from '@angular/core'
import {Subject} from "rxjs"
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  
  urlBackend: string = "https://cxx6ga8e8b.execute-api.us-west-2.amazonaws.com/Dev/";
  httpOptions;
  public $callbackClick = new Subject()

  constructor( private http: HttpClient ) {
    this.httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json", "x-api-key": "niFLSX2cOK4FEffs9q4iX9MgeBLblbFs2sbM6nLu" })
    };
  }

  public guardarUsuario(body){
    debugger
    return this.http.post(this.urlBackend + `users/guardarUsuario`, body, this.httpOptions);
  }
  public obtenerCompanias(){
    return this.http.get(this.urlBackend + `company`, this.httpOptions);
  }
  public obtenerRoles(){
    return this.http.get(this.urlBackend + `userTypes`, this.httpOptions);
  }
  public login(body){
    return this.http.post(this.urlBackend + `users/login`, body, this.httpOptions);
  }

  public createUser(body){
    return this.http.post(this.urlBackend + 'usuarios/', body, this.httpOptions)
  }
  public getUser(user){
    return this.http.get(this.urlBackend + 'usuarios/'+user, this.httpOptions)
  }
}