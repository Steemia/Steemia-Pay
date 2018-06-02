import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BarcodePage } from './barcode';
import { NgxQRCodeModule } from 'ngx-qrcode2';

@NgModule({
  declarations: [
    BarcodePage,
  ],
  imports: [
    NgxQRCodeModule,
    IonicPageModule.forChild(BarcodePage),
  ],
})
export class BarcodePageModule {}
