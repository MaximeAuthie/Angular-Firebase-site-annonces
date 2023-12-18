import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { EditAuthInfosComponent } from './edit-auth-infos/edit-auth-infos.component';


@NgModule({
  declarations: [
    AccountComponent,
    EditProfileComponent,
    EditAuthInfosComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule
  ]
})
export class AccountModule { }
