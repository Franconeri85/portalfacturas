import { Component, OnInit } from '@angular/core';
import { AppComponentService } from 'src/app/app.component.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  usuario:any;
  constructor(private service: AppComponentService) { }

  ngOnInit(): void {
    this.obtenerUsuario();
  }

  obtenerUsuario(){
    
    let id = localStorage.getItem('id');
    this.service.obtenerUsuario(id).subscribe(
      (res:any) => {
        this.usuario = res.user;
      }
    )
  }
}
