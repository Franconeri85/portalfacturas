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

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.scss']
})
export class AuthLoginComponent implements OnInit {

  public formGroup: FormGroup

  constructor(protected formBuilder: FormBuilder,
              private router: Router,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      email: ['ejemplo@gmail.com', [Validators.required, Validators.email]],
      password: ['xYzXxXzY', Validators.required],
    }, {updateOn: 'blur'})
  }

  onSubmit() {
    this.formGroup.markAllAsTouched()
    this.notificationService.showToast({
      type: "success",
      title: "Inicio de sesión",
      subtitle: "El inicio de sesión fue satisfactorio.",
      caption: "",
      target: "#notificationHolder",
      message: "message",
      duration: 2000,
    })
    // setTimeout(() => {
    //   this.router.navigate(['/app'])
    // }, 500);
  }

  isValid(name) {
    const instance = this.formGroup.get(name)
    return instance.invalid && (instance.dirty || instance.touched)
  }
}
