import { Component, HostListener, OnInit } from "@angular/core";

@Component({
  selector: "app-layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.scss"]
})
export class LayoutComponent implements OnInit {
  collapedSideBar: boolean;

  constructor() {}

  ngOnInit() {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // Check if screen width is below 992 pixels
    if (window.innerWidth < 992) {
      this.collapedSideBar = true;
    } else {
      this.collapedSideBar = false;
    }
  }
  
  receiveCollapsed($event) {
    this.collapedSideBar = $event;
  }
}
