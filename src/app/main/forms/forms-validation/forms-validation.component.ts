import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'carbon-components-angular';
import { AppComponentService } from 'src/app/app.component.service';

@Component({
  selector: 'app-forms-validation',
  templateUrl: './forms-validation.component.html',
  styleUrls: ['./forms-validation.component.css']
})
export class FormsValidationComponent implements OnInit {
  public listaCompanias = [];
  public loading: boolean;

  constructor(private service: AppComponentService,private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.obtenerCompanias();
  }

  obtenerCompanias(){
    this.loading = true;
    debugger
    let clientes = JSON.parse(localStorage.getItem('cuits'));

    clientes.forEach(cliente => {
      this.service.obtenerClientes(cliente).subscribe((res:any)=>{
        this.loading = false;
        if(res && res.detalle){
          res.detalle.forEach(i => {
                 this.listaCompanias.push({
            cuit: cliente,
            nombre: i.rs
          });
          });
  
        }
   
      },
      err =>{
        this.loading = false;
  
      })

    });
  }
  
  borrarCompania(id){
    let idCompania = localStorage.getItem('company');
    
    if(id == idCompania){
      this.toast("No puedes borrar la compañía a la que perteneces.", 5000);
      return;
    }


    this.loading = true;

    this.service.borrarUsuario(id).subscribe((res:any)=>{
      this.loading = false;
      this.obtenerCompanias();
    },
    err =>{
      this.loading = false;

    })
  }
  editarCompania(id){

  }

  toast(detalle, duracion){
    this.notificationService.showToast({
      type: "error",
      title: "Algo salió mal",
      subtitle: detalle,
      caption: "",
      target: "#notificationHolder3",
      message: "message",
      duration: duracion,
    })
  }
}
