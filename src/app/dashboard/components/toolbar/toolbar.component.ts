import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { JwtService } from 'src/app/core/services/jwt.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Output() toggleSidenav = new EventEmitter<void>();

  constructor(private jwtService: JwtService, private router: Router, private authService: AuthService) { }

  ngOnInit() {
  }

  toggleSidenavHandler() {
    this.toggleSidenav.emit();
  }

  logout() {
    this.authService.logOut()
      .subscribe(data => {

      }, err => { }
        , () => {
          this.jwtService.destroyToken();
          this.router.navigate(['/login']);
        });
  }
}
