import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-sell',
  imports: [CommonModule, FormsModule],
  templateUrl: './sell.html',
  styleUrl: './sell.css'
})
export class Sell implements OnInit {

  constructor(private apiService:ApiService) {}

  products: any[] = [];
  productId: string = '';
  description: string = '';
  quantity: string = '';
  message: string = '';

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.apiService.getAllProducts().subscribe({
      next:(res:any) => {
        if(res.status === 200){
          this.products = res.products;
        }
      },
      error:(error:any) => {
        this.showMessage(error?.error?.message || error?.message || "Unable to get all products " + error);
      }
    })
  }

  //handle submit
  handleSubmit(): void {
    if (!this.productId || !this.quantity) {
      this.showMessage("All fields are required");
      return;
    }
    // prepare data for submission
    const sellData = {
      productId: this.productId,
      quantity: this.quantity,
      description: this.description
    };

    this.apiService.sellProduct(sellData).subscribe({
      next:(res:any) => {
        if(res.status === 200){
          this.showMessage("Sell added successfully");
          this.resetForm();
        }
      },
      error:(error:any) => {
        this.showMessage(error?.error?.message || error?.message || "Unable to add sell " + error);
      }
    })
  }

  resetForm(): void {
    this.productId = '';
    this.quantity = '';
    this.description = '';
  }

  showMessage(message:string){
    this.message = message;
    setTimeout(() => {
      this.message = ''
    }, 4000)
    
  }

}
