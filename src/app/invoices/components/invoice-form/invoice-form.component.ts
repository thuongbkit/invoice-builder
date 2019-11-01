import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { InvoiceService } from '../../services/invoice.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Invoice } from '../../models/invoice';
import { ClientService } from 'src/app/clients/services/client.service';
import { Client } from 'src/app/clients/models/client';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.scss']
})
export class InvoiceFormComponent implements OnInit {
  invoice: Invoice;
  invoiceForm: FormGroup;
  clients: Client[] = [];
  title = 'New Invoice';
  constructor(private fb: FormBuilder, private invoiceService: InvoiceService,
    private snackBar: MatSnackBar, private router: Router, private route: ActivatedRoute, private clientService: ClientService) { }

  ngOnInit() {
    this.createForm();
    this.setInvoiceToForm();
    this.setClients();
  }

  private setClients() {
    this.clientService.getClients()
      .subscribe(clients => {
        this.clients = clients;
      }, err => this.openSnackBar('Failed to get clients', 'Error'));
  }

  createForm() {
    this.invoiceForm = this.fb.group({
      item: ['', Validators.required],
      date: ['', Validators.required],
      due: ['', Validators.required],
      qty: ['', Validators.required],
      client: ['', Validators.required],
      rate: '',
      tax: ''
    });
  }

  setInvoiceToForm() {
    // Get the id of invoice
    this.route.params.subscribe(params => {
      let id = params['id'];
      if (!id) {
        return;
      }
      this.title = 'Edit Invoice';
      // this.invoiceService.getInvoice(id).subscribe(invoice => {
      //   this.invoice = invoice;
      //   this.invoiceForm.patchValue(this.invoice);
      // }, err => {
      //   this.openSnackBar('Failed to get Invoice', 'Error');
      // });
      this.route.data.subscribe((data: { invoice: Invoice }) => {
        this.invoice = data.invoice;
        if (this.invoice.client) {
          this.invoiceForm.patchValue({ client: this.invoice.client._id });
        }
        this.invoiceForm.patchValue({
          item: this.invoice.item,
          qty: this.invoice.qty,
          date: this.invoice.date,
          due: this.invoice.due,
          rate: this.invoice.rate,
          tax: this.invoice.tax,
        });
      });
    });
  }

  onSubmit() {
    // user wants to edit the invoice
    if (this.invoice) {
      this.invoiceService.updateInvoice(this.invoice._id, this.invoiceForm.value).subscribe(data => {
        this.openSnackBar('Invoice updated', 'Success');
        this.router.navigate(['dashboard', 'invoices']);
      }, err => {
        this.openSnackBar('Failed to update invoice', 'Error');
      });
    } else {
      this.invoiceService.createInvoice(this.invoiceForm.value).subscribe(data => {
        this.openSnackBar('Invoice created!', 'Success');
        this.invoiceForm.reset();
        this.router.navigate(['dashboard', 'invoices']);
      },
        err => {
          this.openSnackBar('Failed to create Invoice', 'Error');
          console.log(err);
        }
      );
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  showRequired(control: AbstractControl) {
    const invalid = control.invalid;
    const required = control.errors && control.errors.required;
    const interactedWith = control.dirty || control.touched;
    return invalid && required && interactedWith;
  }

  showLengthControl(control: AbstractControl) {
    const invalid = control.invalid;
    const minLength = control.errors && control.errors.minLength;
    const interactedWith = control.dirty || control.touched;
    return invalid && minLength && interactedWith;
  }

}
