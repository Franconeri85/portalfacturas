import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'carbon-components-angular';
import { AppComponentService } from 'src/app/app.component.service';

@Component({
  selector: 'app-forms-general',
  templateUrl: './forms-general.component.html',
  styleUrls: ['./forms-general.component.css']
})
export class FormsGeneralComponent implements OnInit {
  public listaUsuarios: any;
  public loading: boolean;

  constructor(private service: AppComponentService,private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.obtenerUsuariosPorCompania();
  }


  obtenerUsuariosPorCompania(){
    this.loading = true;
    let company = localStorage.getItem('company');
    this.service.obtenerUsuariosPorCompania(company).subscribe((res:any)=>{
      this.loading = false;

      this.listaUsuarios = res.users;
    },
    err =>{
      this.loading = false;

    })
  }
  borrarUsuario(id){
    let idUsuarioLogueado = localStorage.getItem('id');
    
    if(id == idUsuarioLogueado){
      this.toast("No puedes borrarte tu mismo.", 5000);
      return;
    }


    this.loading = true;

    this.service.borrarUsuario(id).subscribe((res:any)=>{
      this.loading = false;
      this.obtenerUsuariosPorCompania();
    },
    err =>{
      this.loading = false;

    })
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
