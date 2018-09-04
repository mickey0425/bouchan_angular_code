import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';

import { Account } from './../model/account';
import { AccountService } from './../services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private authUser: Observable<firebase.User>;
  private account: Observable<Account>;

  constructor(private auth: AngularFireAuth, private router: Router, private accountService: AccountService) {
    this.authUser = auth.authState;
    this.authUser.subscribe(user => {
      if (user) {
        this.account = this.accountService.getAccount(user.uid);
        this.account.subscribe(account => {
          if (!account) {
            this.accountService.createAccount(user)
              .then(() => this.router.navigate(['/home']))
              .catch(error => console.log('Create Account Error', error));
          } else {
            this.router.navigate(['/home']);
          }
        });
      }
    });
  }

  ngOnInit() {
  }

}
