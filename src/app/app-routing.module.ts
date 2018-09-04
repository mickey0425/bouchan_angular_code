import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { SearchComponent } from './sidebar/search/search.component';
import { TentativeComponent } from './sidebar/tentative/tentative.component';
import { ControlComponent } from './sidebar/control/control.component';
import { ServingComponent } from './sidebar/serving/serving.component';
import { LoginComponent } from './login/login.component';
import { SettingComponent } from './sidebar/setting/setting.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  { path: 'home', component: HomeComponent },
  { path: 'search/:subItem', component: SearchComponent},
  { path: 'tentative/:subItem', component: TentativeComponent},
  { path: 'control/:subItem', component: ControlComponent},
  { path: 'serving/:subItem', component: ServingComponent},
  { path: 'setting/:subItem', component: SettingComponent},
  { path: '**', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  declarations: [],
  exports: [RouterModule]
})
export class AppRoutingModule { }
