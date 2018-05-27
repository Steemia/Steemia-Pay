import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { MomentModule } from 'angular2-moment';

@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    MomentModule,
    IonicPageModule.forChild(HomePage),
  ],
})
export class HomePageModule {}
