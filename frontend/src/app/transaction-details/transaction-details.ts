import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-transaction-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-details.html',
  styleUrl: './transaction-details.css'
})
export class TransactionDetails implements OnInit {
  constructor(
    private apiService:ApiService, 
    private route: ActivatedRoute,
    private router: Router
  ) {}

  transactionId: string | null = '';
  transaction: any = null;
  status: string = '';
  message: string = '';

  ngOnInit(): void {
    // extract transaction id from routes
    this.route.params.subscribe(params => {
      this.transactionId = params['transactionId'];
      this.getTransactionDetails();
    });
    
  }

  getImageUrl(relativePath: string): string {
      if (!relativePath) {
        return 'assets/no-image.png'; // fallback if no image
      }
      console.log('relativePath: ', relativePath);
      console.log(environment.apiUrl);
      console.log(`${environment.apiUrl}${relativePath}`);
  
      return `${environment.apiUrl}${relativePath}`;
    }

  getTransactionDetails(): void {
    this.apiService.getTransactionById(this.transactionId!).subscribe({
      next:(res:any) => {
        if(res.status === 200){
          this.transaction = res.transaction;
          this.status = this.transaction.status;
        }
      },
      error:(error:any) => {
        this.showMessage(error?.error?.message || error?.message || "Unable to get transaction details " + error);
      }
    })
  }

  handleUpdateTransactionStatus(status: string): void {
    if(this.transactionId && this.status){
      this.apiService.updateTransactionStatus(this.transactionId, this.status).subscribe({
      next:(result) => {
        this.router.navigate(["/transaction"]);
      },
      error:(error:any) => {
        this.showMessage(error?.error?.message || error?.message || "Unable to update transaction status " + error);
      }
    })
    }
  }

  showMessage(message:string){
    this.message = message;
    setTimeout(() => {
      this.message = ''
    }, 4000)
    
  }

}
