import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { LembreteComponent } from './lembrete/lembrete.component';
import { PoModule } from '@po-ui/ng-components';
import { RouterModule } from '@angular/router';
import { PoTemplatesModule } from '@po-ui/ng-templates';
// import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    LembreteComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    PoModule,
    RouterModule.forRoot([]),
    PoTemplatesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
