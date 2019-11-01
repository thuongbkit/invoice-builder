import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice } from '../../models/invoice';
import { Router } from '@angular/router';
import { MatSnackBar, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { remove } from 'lodash';
import { of, merge } from 'rxjs';
import { map, startWith, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-invoices-listing',
  templateUrl: './invoices-listing.component.html',
  styleUrls: ['./invoices-listing.component.scss']
})
export class InvoicesListingComponent implements OnInit, AfterViewInit, AfterViewChecked  {

  constructor(private invoiceService: InvoiceService, private snackBar: MatSnackBar, 
                private router: Router, private ref: ChangeDetectorRef) { }

  displayedColumns: string[] = ['item', 'date', 'due', 'qty', 'rate', 'tax', 'action'];
  dataSource = new MatTableDataSource<Invoice>();
  resultsLength = 0;
  isResultsLoading = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() { }

  ngAfterViewChecked() {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    this.ref.detectChanges();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.paginator.page, this.sort.sortChange)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isResultsLoading = true;
          return this.invoiceService.getInvoices({
            page: this.paginator.pageIndex,
            perPage: this.paginator.pageSize,
            sortField: this.sort.active,
            sortDir: this.sort.direction,
            filter: ''
          });
        }),
        map(data => {
          this.isResultsLoading = false;
          this.resultsLength = data['total'];
          return data['docs'];
        }),
        catchError(() => {
          this.isResultsLoading = false;
          this.openSnackBar('Failed to fetch invoices', 'Error');
          return of([]);
        })
      )
      .subscribe(data => {
        this.dataSource.data = data;
      });
  }

  saveBtnHandler() {
    this.router.navigate(['dashboard', 'invoices', 'new']);
  }

  deleteBtnHandler(id: string) {
    this.invoiceService.deleteInvoice(id).subscribe(data => {
      const removedItems = remove(this.dataSource, (item) => {
        return item._id === data._id
      });
      this.dataSource.data = [...this.dataSource.data];
      this.openSnackBar('Invoice deleted', 'Success');
    }, err => {
      this.openSnackBar('Failed to delete invoice', 'Error');
      console.log(err);
    });
  }

  editBtnHandler(id: string) {
    this.router.navigate(['dashboard', 'invoices', id]);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  filterText(filterValue: string) {
    this.isResultsLoading = true;
    filterValue = filterValue.trim();
    this.paginator.pageIndex = 0;
    this.invoiceService.getInvoices({
      page: this.paginator.pageIndex,
      perPage: this.paginator.pageSize,
      sortField: this.sort.active,
      sortDir: this.sort.direction,
      filter: filterValue
    }).subscribe(data => {
      this.dataSource.data = data['docs'];
      this.resultsLength = data['total'];
      this.isResultsLoading = false;
    }, err => {
      this.openSnackBar('Failed to delete invoice', 'Error');
    });
  }

}
