import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ControlComponent } from './sidebar/control/control.component';
import { SearchComponent } from './sidebar/search/search.component';
import { ServingComponent } from './sidebar/serving/serving.component';
import { SettingComponent } from './sidebar/setting/setting.component';
import { TentativeComponent } from './sidebar/tentative/tentative.component';

import { environment } from './../environments/environment';
import { AppRoutingModule } from './app-routing.module';

import { AccountService } from './services/account.service';
import { GoogleMapService} from './services/google-map.service';
import { FileService } from './services/file.service';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AuthMethods, AuthProvider, AuthProviderWithCustomConfig, FirebaseUIAuthConfig, FirebaseUIModule } from 'firebaseui-angular';

const phoneCustomConfig: AuthProviderWithCustomConfig = {
  provider: AuthProvider.Phone,
  customConfig: {
    defaultCountry: 'TW'
  }
};

const firebaseUIAuthConfig: FirebaseUIAuthConfig = {
  providers: [
    AuthProvider.Google,
    AuthProvider.Password,
    phoneCustomConfig
  ],
  method: AuthMethods.Popup,
  tos: 'horinglih-cbf0e.firebaseapp.com'
};

const googlemap = {
  apiKey: 'AIzaSyBTa7AreozsyRJlW5EEBdvfxMYd7hkeN5c',
  language: 'zh-TW'
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SidebarComponent,
    ControlComponent,
    SearchComponent,
    ServingComponent,
    SettingComponent,
    TentativeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebase),
    FirebaseUIModule.forRoot(firebaseUIAuthConfig),
    AgmCoreModule.forRoot(googlemap)
  ],
  providers: [AccountService, GoogleMapService, FileService],
  bootstrap: [AppComponent]
})
export class AppModule { }
