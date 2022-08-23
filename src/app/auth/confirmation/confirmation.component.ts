import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  constructor( private service: AuthService,private router: Router) { }

  infoUser: any;
  message: string;
  ngOnInit(): void {
    this.createUser();
  }

  createUser(){
    this.infoUser = {
      userid: localStorage.getItem('userId'),
      nombre:  localStorage.getItem('name'),
      apellido:  localStorage.getItem('surname'),
      email:  localStorage.getItem('email')
    }
    this.service.createUser(this.infoUser).subscribe(
      (response: any) =>{
        this.message = response.detalle
      },
      err => {
        debugger
        this.message = "Espere un momento para revisar si está asociado a algún cliente."
        if(err.error.codError == 306)
          this.getUser();

      }
    )
  }
  getUser(){
    this.service.getUser(this.infoUser.userid).subscribe(
      (response:any) =>{
        if(response.detalle[0].cuits && response.detalle[0].cuits.length > 0){
          debugger
          localStorage.setItem('rol', response.detalle[0].role);
          let cuits = response.detalle[0].cuits;
          if(cuits.length == 1)
            localStorage.setItem('cuits', `[${cuits}]`);
          else
            localStorage.setItem('cuits', cuits);


          this.router.navigate(['/app']);
        }else{
          this.message = "Hay pendiente una aprobación de un administrador para poder ingresar."
        }
      }
    )

  }
  atras(){
    debugger
    this.router.navigate(['/auth/basic/signin'])

  }
}
