import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../pagination/pagination';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction',
  imports: [Pagination, CommonModule, FormsModule],
  templateUrl: './transaction.html',
  styleUrl: './transaction.css',
})
export class Transaction implements OnInit {
  constructor(private apiService: ApiService, private router: Router) {}

  transactions: any[] = [];
  message: string = '';
  searchInput: string = '';
  valueToSearch: string = '';
  currentPage: number = 1;
  totalPages: number = 0;
  itemsPerPage: number = 10;

  ngOnInit(): void {
    this.fetchTransactions();
  }

  // Fetch transactions
  fetchTransactions(): void {
    this.loadTransactions();
  }

  // Load transactions
  loadTransactions(): void {
    this.apiService.getAllTransactions(this.valueToSearch).subscribe({
      next: (res: any) => {
        const transactions = res.transactions || [];
        this.totalPages = Math.ceil(transactions.length / this.itemsPerPage);
        this.transactions = transactions.slice(
          (this.currentPage - 1) * this.itemsPerPage,
          this.currentPage * this.itemsPerPage
        );
      },
      error: (error: any) => {
        this.showMessage(
          error?.error?.message || error?.message || 'Unable to get all transactions ' + error
        );
      },
    });
  }

  //handle search
  handleSearch(searchInput: string): void {
    this.currentPage = 1;
    this.valueToSearch = searchInput;
    this.loadTransactions();
  }

  // Navigate to transaction details page
  navigateToTransactionDetailsPage(transactionId: string): void {
    this.router.navigate([`/transaction/${transactionId}`]);
  }

  // handle page change. navigate to next, previous or specific page
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadTransactions();
  }

  showMessage(message: string) {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 4000);
  }
}
