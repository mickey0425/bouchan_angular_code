import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar.component';

@Component({
  selector: 'app-tentative',
  templateUrl: './tentative.component.html',
  styleUrls: ['./tentative.component.css']
})
export class TentativeComponent extends SidebarComponent implements OnInit {

  ngOnInit() {
    console.log('onInit');
  }

}
