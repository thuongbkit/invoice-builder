import { Client } from '../../clients/models/client';

export interface Invoice {
    _id: string;
    item: string;
    qty: number;
    date: Date;
    due: Date;
    tax: number;
    rate: number;
    client: Client;
}

export interface InvoicePaginationRsp {
    docs: Invoice[];
    total: number;
    page: number;
    pages: number;
    limit: number;
}