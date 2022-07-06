import {BrowserModule} from '@angular/platform-browser'
import {NgModule} from '@angular/core'
import {FlexLayoutModule} from '@angular/flex-layout'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {NgxMdModule} from "ngx-md"

import {CoreModule} from "./core/core.module"
import {SharedModule} from './shared/shared.module'

import {
  HttpClientModule,
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HTTP_INTERCEPTORS
} from '@angular/common/http'

import {AppRoutingModule} from './app-routing.module'
import {AppComponent} from './app.component'
import {StoreModule} from '@ngrx/store'
import {reducers, metaReducers} from './store/app.reducers'
import {StoreDevtoolsModule} from '@ngrx/store-devtools'
import {environment} from '../environments/environment'
import {EffectsModule} from '@ngrx/effects'
import {AppEffects} from './store/app.effects'
import {AppComponentService} from './app.component.service'
import {LoadingComponent} from './main/loading/loading.component'

import Amplify, {Auth} from 'aws-amplify'
import { FormsModule } from '@angular/forms'

Amplify.configure({
  Auth:{
    mandatorySignIn: true,
    region: 'us-east-1',
    userPoolId: 'us-east-1_HIuvAgQLq',
    userPoolWebClientId: '4ovgsi6201duj2jmm307mop3g3',
    authenticationFlowType: 'USER_PASSWORD_AUTH'
  }
})

@NgModule({
  declarations: [
    AppComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    FlexLayoutModule,
    CoreModule,
    HttpClientModule,
    SharedModule,
    StoreModule.forRoot(reducers, {metaReducers}),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([AppEffects]),
    NgxMdModule.forRoot(),
  ],
  providers: [AppComponentService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
