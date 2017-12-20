import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProofnPage } from './proofn';

@NgModule({
  declarations: [
    ProofnPage,
  ],
  imports: [
    IonicPageModule.forChild(ProofnPage),
  ],
  exports: [
    ProofnPage
  ]
})
export class ProofnPageModule {}
