import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { EventListModule } from './event-list/event-list.module';
import { EndUserModule } from './end-user/end-user.module';
import { TeacherModule } from './teacher/teacher.module';
import { PublicResourcesModule } from './public-resources/public-resources.module';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FlexLayoutModule } from '@angular/flex-layout';
//import { RoundRealPipe } from './shared/pipes/round-real.pipe';
//import { EndUserComponent } from './end-user/end-user.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    CoreModule,
    AuthenticationModule,
    EventListModule,
    EndUserModule,
    TeacherModule,
    PublicResourcesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
