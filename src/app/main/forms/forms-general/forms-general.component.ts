import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'carbon-components-angular';
import { AppComponentService } from 'src/app/app.component.service';
import { UsuarioCognitoModel } from '../../models/usuario-cognito.model';

@Component({
  selector: 'app-forms-general',
  templateUrl: './forms-general.component.html',
  styleUrls: ['./forms-general.component.css']
})
export class FormsGeneralComponent implements OnInit {
  public listaUsuarios: any;
  public listaClientes = [];
  public popup: boolean;
  public loading: boolean;
  public userEdit: UsuarioCognitoModel = new UsuarioCognitoModel();
  public cuits = [];

  public NombreEdit: string;
  public companyList = [
  {content: "1"}
  ]
  public rolList: any = [
    {
      content: "Administrador"
    },
    {
      content: "Supervisor"
    },
    {
      content: "Usuario"
    },
  ];
  public showModal: boolean;
  constructor(private service: AppComponentService,private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.obtenerClientes();
    this.obtenerUsuariosPorCompania();
  }
  modal(event){
    this.showModal = event
  }

  obtenerClientes(){
    this.loading = true;
    this.service.obtenerClientes().subscribe((res:any)=>{
      this.loading = false;
      if(res && res.clientes){
        res.clientes.forEach(i => {
          this.listaClientes.push({content: i.rs, key: i.SK})
        });

      }
 
    },
    err =>{
      this.loading = false;

    })
  }

  obtenerUsuariosPorCompania(){
    this.loading = true;
    let company = localStorage.getItem('company');
    this.service.obtenerUsuariosPorCompania(company).subscribe((res:any)=>{
      this.loading = false;

      if(res && res.detalle)
        this.listaUsuarios = res.detalle;
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
  selectRol(event){
    this.userEdit.role = event.item.content
  }
  selectedCompany(event){
    if(event){
      let cuits = this.cuits.find(x => { return x == event.item.key})

      if(!cuits)
        this.cuits.push(event.item.key)
        
    }

  }
  visiblePopup(usuario?){
    debugger
    this.popup = !this.popup;

    if(this.popup){
      this.cuits = usuario.cuits;
      this.userEdit.nombre = usuario.nombre;
      this.userEdit.apellido = usuario.apellido;
      this.userEdit.cuits = usuario.cuits;
      this.userEdit.userid = usuario.userid;
    }
  }
  confirmar(){
    console.log(this.userEdit);
    this.userEdit.cuits = this.cuits;
    this.service.modificarUsuario(this.userEdit).subscribe(res =>{
      this.visiblePopup();
      this.obtenerUsuariosPorCompania();
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
