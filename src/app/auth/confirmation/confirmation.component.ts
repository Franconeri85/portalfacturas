import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  constructor( private service: AuthService,private router: Router, private route: ActivatedRoute) { }

  infoUser: any;
  message: string;
  from:any;
  ngOnInit(): void {
    this.from = localStorage.getItem("From");

    if(this.from == 'login')
      this.getUser();
  }


  getUser(){
    let userId = localStorage.getItem('userId');
    this.service.getUser(userId).subscribe(
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
