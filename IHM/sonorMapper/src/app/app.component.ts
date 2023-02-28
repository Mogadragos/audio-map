import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public location: any;

  ngOnInit() {
    this.location = { lat: 45.65360127314423, lng: 0.14909613400699348 };
    console.log(location);
  }
}
