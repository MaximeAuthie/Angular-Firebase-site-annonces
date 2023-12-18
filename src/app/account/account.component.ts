import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../interfaces/user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {

  currentUserSubsciption!: Subscription;
  currentUser!: User;

  constructor(private AuthService: AuthService) {
  }

  ngOnInit(): void {
    this.initCurrentUser();
  }

  initCurrentUser(): void {
    this.currentUserSubsciption = this.AuthService.currentUserSubject.subscribe({
      next: (user) => this.currentUser = <User>user,
      error: console.error
    })
  }

  ngOnDestroy(): void {
      this.currentUserSubsciption.unsubscribe();
  }
}
