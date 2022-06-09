import {Component, OnInit} from '@angular/core'
import {
  FormGroup,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators
} from "@angular/forms"
import {Router} from '@angular/router'

import {NotificationService} from "carbon-components-angular"
import { AppComponentService } from 'src/app/app.component.service'
import { AuthService } from '../auth.service'

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.scss']
})
export class AuthLoginComponent implements OnInit {

  public formGroup: FormGroup
  public recordarCuenta: boolean = true;
  public loading = false;
  constructor(protected formBuilder: FormBuilder,
              private router: Router,
              private service: AuthService,
              private appService: AppComponentService,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    }, {updateOn: 'blur'})
  }
  recordar(e){
    this.recordarCuenta = e.checked;
  }


  sendMessage(message: any, data: any) {
    const messageToSend: any = {
        messageType: message,
        payload: data,
    };
    this.appService.changeMessage(messageToSend);
}
  onSubmit() {
    this.formGroup.markAllAsTouched()
    this.loading = true;
    this.service.login({email: this.formGroup.value.email, password: this.formGroup.value.password}).subscribe( (res: any) =>{
      this.loading = false;
      if(this.recordarCuenta){
        localStorage.setItem('tk',res.user.token);
      }else{
        sessionStorage.setItem('tk',res.user.token);
      }
    
      localStorage.setItem('name',res.user.name);
      localStorage.setItem('rol',res.user.user_type_id.name);
      localStorage.setItem('surname',res.user.surname);
      localStorage.setItem('id',res.user._id);
      localStorage.setItem('company',res.user.company);

      this.router.navigate(['/app']);
    },
    err =>{
      this.loading = false;
      this.toast("error", "Error al iniciar sesión", err.error.message);
    })
    // setTimeout(() => {
    //   this.router.navigate(['/app'])
    // }, 500);
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
  isValid(name) {
    const instance = this.formGroup.get(name)
    return instance.invalid && (instance.dirty || instance.touched)
  }
}
