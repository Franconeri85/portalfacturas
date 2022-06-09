import {Component, OnInit} from '@angular/core'


const getSessionStorage = (key) => {
  return sessionStorage.getItem(key)
}

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],
})
export class LoadingComponent implements OnInit {
  private appLoaded: boolean = false;
  public loading: boolean = false;

  constructor() {

  }

  ngOnInit(): void {
  
  }

}
