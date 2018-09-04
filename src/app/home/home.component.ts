import { Component, OnInit } from '@angular/core';
import { AccountService } from './../services/account.service';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

import * as firebase from 'firebase';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private authUser: Observable<firebase.User>;
  private user: firebase.User;
  private account: Account = null;
  isLogged = false;

  constructor(private auth: AngularFireAuth, private accountService: AccountService, private router: Router) {
    this.authUser = this.auth.authState;
    this.authUser.subscribe(user => {
      if (user) {
        this.user = user;
        this.isLogged = true;
        this.accountService.getAccount(user.uid).subscribe(account => {
          if (this.account && !account) {
            this.signOut();
          }
          this.account = account;
        });
      } else {
        this.isLogged = false;
        this.account = null;
        this.router.navigate(['/login']);
      }
    }, error => console.log('Get User Error', error));
  }

  ngOnInit() {
  }

  signOut() {
    this.auth.auth.signOut().catch(error => console.log('Sign Out Error', error));
  }

}
