import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsListingComponent } from './components/clients-listing/clients-listing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material.module';
import { ClientService } from './services/client.service';
import { FormDialogComponent } from './components/form-dialog/form-dialog.component';



@NgModule({
  declarations: [ClientsListingComponent, FormDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    ClientsListingComponent
  ],
  providers: [ClientService],
  entryComponents: [FormDialogComponent]
})
export class ClientsModule { }
