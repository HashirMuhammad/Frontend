import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { LoginService } from "../../../feature/user/login.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  public pushRightClass: string;
  user: any;

  constructor(
    public router: Router,
    private loginService: LoginService) {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd && window.innerWidth <= 992 && this.isToggled()) {
        this.toggleSidebar();
      }
    });
  }

  ngOnInit(): void {
    this.user = localStorage.getItem("currentUserName")
    this.pushRightClass = "push-right";
  }

  isToggled(): boolean {
    const dom: Element = document.querySelector("body");
    return dom.classList.contains(this.pushRightClass);
  }

  toggleSidebar(): void  {
    const dom: any = document.querySelector("body");
    dom.classList.toggle(this.pushRightClass);
  }
  onLoggedout(): void  {
   this.loginService.logout();
  }
}
