import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client';
import { MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';
import { FormDialogComponent } from '../form-dialog/form-dialog.component';
import { mergeMap, filter } from 'rxjs/operators';
import { remove } from 'lodash';
 
@Component({
  selector: 'app-clients-listing',
  templateUrl: './clients-listing.component.html',
  styleUrls: ['./clients-listing.component.scss']
})
export class ClientsListingComponent implements OnInit {

  constructor(private clientService: ClientService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'action'];
  dataSource = new MatTableDataSource<Client>();
  isResultsLoading = false;

  ngOnInit() {
    this.isResultsLoading = true;
    this.clientService.getClients().subscribe(data => {
      this.dataSource.data = data;
    }, err => this.errorHandler(err, 'Opps!, something went wrong'), () => {
      this.isResultsLoading = false;
    });
  }

  saveBtnHandler() {

  }

  openDialog(clientId: string): void {

    const options = {
      width: '600px',
      height: '350px',
      data: {}
    };

    if (clientId) {
      options.data = { clientId: clientId };
    }

    const dialogRef = this.dialog.open(FormDialogComponent, options);


    dialogRef.afterClosed()
    .pipe(filter(clientParam => typeof clientParam === 'object'), mergeMap((result: any) => {
      return clientId ? this.clientService.updateClient(clientId, result) : this.clientService.createClient(result);
    }))
    .subscribe(client => {
      let successMsg = '';
      if (clientId) {
        const index  = this.dataSource.data.findIndex(client => client._id === clientId);
        this.dataSource.data[index] = client;
        successMsg = 'Client updated';
      } else {
        this.dataSource.data.push(client);
        successMsg = 'Client created';
      }
      this.dataSource.data = [...this.dataSource.data];
      this.successHandler(successMsg, 'Success');
    }, err => this.errorHandler(err, 'Failed to create client'));
  }

  editBtnHandler(clientId: string) {

  }

  deleteBtnHandler(clientId: string) {
    this.clientService.deleteClient(clientId).subscribe(data => {
      const removedItems = remove(this.dataSource.data, (item) => {
        return item._id === data._id
      });
      this.dataSource.data = [...this.dataSource.data];
      this.successHandler('Client deleted', 'Success');
    }, err => {
      this.errorHandler(err, 'Failed to delete client');
      console.log(err);
    });
  }

  private errorHandler(error: any, message: string) {
    console.error(error);
    this.isResultsLoading = false;
    this.snackBar.open(message, 'Error', {
      duration: 2000
    });
  }

  private successHandler(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
