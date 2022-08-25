import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core'
import {FormBuilder, FormGroup, Validators} from "@angular/forms"
import {Router} from "@angular/router"
import {NotificationService} from "carbon-components-angular"
import { AuthService } from '../auth.service';
import { UsuarioModel } from '../../main/models/usuario.model';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-auth-signup',
  templateUrl: './auth-signup.component.html',
  styleUrls: ['./auth-signup.component.scss']
})
export class AuthSignupComponent implements OnInit {

  @Input() esRegistro:boolean = true;
  @Output() refresh: EventEmitter<boolean> = new EventEmitter();
  @Output() cerrarModal: EventEmitter<boolean> = new EventEmitter();
  public formGroup: FormGroup;
  public companyList = [
    {
      content: "South Trade Network"
    }
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
  public companySelected: any;
  public rolSelected: any;
  infoUser: any;
  message: string;
  public loading = false;

  constructor(protected formBuilder: FormBuilder,
              private router: Router,
              private service: AuthService,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    // this.obtenerRoles();
    // this.obtenerCompañias();
    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.required,]],
      surname: ['', [Validators.required,]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['',],
      password: ['', Validators.required],
      condition: [true],
    }, {updateOn: 'blur'})
  }

  selectedCompany(e){
    this.companySelected = e.item._id;
  }
  selectedRol(e){
    debugger
    this.rolSelected = e.item._id;
  }
  cerrar(){
    this.router.navigate(['/auth/basic/signin'])
    // this.cerrarModal.emit(false);
  }
  async onSubmit() {
    this.loading = true;
    
    this.formGroup.markAllAsTouched();
    console.log(this.formGroup.value);

    // if(!this.rolSelected){
    //   this.toast("error", "Algo anda mal", "Debe elegir un rol.");
    //   return;
    // }
    // if(!this.companySelected){
    //   this.toast("error", "Algo anda mal", "Debe elegir una compañía.");
    //   return;
    // }


    let body: UsuarioModel = new UsuarioModel();
    body.surname = this.formGroup.value.surname;
    body.name = this.formGroup.value.name;
    body.email = this.formGroup.value.email;
    body.phone = this.formGroup.value.phone;
    body.password = this.formGroup.value.password;
    // body.company = this.companySelected;
    body.user_type_id = this.rolSelected;

    debugger
    const user:any = await Auth.signUp({
      username: body.email,
      password: body.password,
      attributes: {
        email: body.email,
        given_name: body.name,
        family_name:  body.surname
      },
    
    })
    this.loading = true;

    console.log(user);
    if(user && !user.userSub)
      this.toast('error','Hubo un problema','El E-mail ingresado no existe.')

    this.createUser(body, user.userSub);
   

    // this.service.guardarUsuario(body).subscribe(res => {
    //   this.toast("success", "Exito", "Se registró el usuario correctamente");
    //   if(this.esRegistro)
    //     this.router.navigate(['/auth/basic/signin']);
    //   else
    //     this.refresh.emit(true)
    // },
    // err => {
    //   this.toast("error", "Algo anda mal", err.error.message);

    // }
    // )
    /*this.router.navigate(['/auth/basic/signin'])*/
  
  }

  createUser(user, idUser){
    localStorage.setItem('userId',idUser);
    debugger
    this.infoUser = {
      userid: idUser,
      nombre:  user.name,
      apellido:  user.surname,
      email:  user.email
    }
    this.service.createUser(this.infoUser).subscribe(
      (response: any) =>{
        // this.message = response.detalle;
        localStorage.setItem("From","register");
        this.router.navigate(['/auth/basic/confirmacion']);
      },
      err => {
        debugger
        if(err.error.codError == 306){
          this.toast('error','Hubo un problema',err.error.detalleError)
        }
          // this.getUser();

      }
    )
  }

  toast(type, title, subtitle){
    this.notificationService.showToast({
      type: type,
      title: title,
      subtitle: subtitle,
      target: "body",
      message: "message",
      duration: 5000,
    });
  }
  obtenerCompañias(){
    this.service.obtenerCompanias().subscribe( (res:any) => {
      var output = res.map( s => {
        if ( s.hasOwnProperty("name") )
        {
           s.content = s.name;
           delete s.name;   
        }
        return s;
      });
      this.companyList = output;
    })
    
  }
  obtenerRoles(){
    this.service.obtenerRoles().subscribe( (res:any) => {
      var output = res.map( s => {
        if ( s.hasOwnProperty("name") )
        {
           s.content = s.name;
           delete s.name;   
        }
        return s;
      });
      this.rolList = output;
    })
    
  }
  isValid(name) {
    const instance = this.formGroup.get(name)
    return instance.invalid && (instance.dirty || instance.touched)
  }

}
