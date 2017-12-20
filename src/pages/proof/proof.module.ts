import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProofPage } from './proof';

@NgModule({
  declarations: [
    ProofPage,
  ],
  imports: [
    IonicPageModule.forChild(ProofPage),
  ],
  exports: [
    ProofPage
  ]
})
export class ProofPageModule {}
