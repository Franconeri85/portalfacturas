import {Component, OnInit} from '@angular/core'
import {
  FormGroup,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators
} from "@angular/forms"
import {Router} from '@angular/router'
import { Auth } from 'aws-amplify'

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
  async onSubmit() {
    this.formGroup.markAllAsTouched()
    this.loading = true;

    try{
      debugger
      // var _user:any = await Auth.signIn(this.formGroup.value.email.toString(), this.formGroup.value.password.toString());
      var _user:any = await Auth.signIn(this.formGroup.value.email, this.formGroup.value.password)
      debugger
      var tokens = _user.signInUserSession;
      localStorage.setItem('name',_user.attributes.given_name);
      localStorage.setItem('surname',_user.attributes.family_name);
      localStorage.setItem('email',_user.attributes.email);
      localStorage.setItem('userId', _user.attributes.sub);

      let user = Auth.currentUserInfo();
      console.log(user);
      // {
      //   "username": "...",
      //   "attributes": {
      //     "sub": "...",
      //     "email_verified": true,
      //     "phone_number_verified": true,
      //     "phone_number": "...",
      //     "email": "..."
      //   }
      // }
      // var tokens = user.signInUserSession;
      this.loading = false;
      
      if( tokens != null ) {
        console.log('Usuario autenticado');
        localStorage.setItem("From","login");
        this.router.navigate(['/auth/basic/confirmacion']);
      }

    }catch (error){
      this.loading = false;
      console.log(error);
      this.toast("error","Error al iniciar sesión", error.message)
    }

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
