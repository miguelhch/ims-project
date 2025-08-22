import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-purchase',
  imports: [CommonModule, FormsModule],
  templateUrl: './purchase.html',
  styleUrl: './purchase.css'
})
export class Purchase implements OnInit {

  constructor(private apiService:ApiService) {}

  products: any[] = [];
  suppliers: any[] = [];
  productId: string = '';
  supplierId: string = '';
  description: string = '';
  quantity: string = '';
  message: string = '';

  ngOnInit(): void {
    this.fetchProductsAndSuppliers();
  }

  fetchProductsAndSuppliers(): void {
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
    this.apiService.getAllSuppliers().subscribe({
      next:(res:any) => {
        if(res.status === 200){
          this.suppliers = res.suppliers;
        }
      },
      error:(error:any) => {
        this.showMessage(error?.error?.message || error?.message || "Unable to get all suppliers " + error);
      }
    })
  }

  // handle submit
  handleSubmit(): void {
    if (!this.productId || !this.supplierId || !this.quantity) {
      this.showMessage("All fields are required");
      return;
    }
    // prepare data for submission
    const purchaseData = {
      productId: this.productId,
      supplierId: this.supplierId,
      quantity: this.quantity,
      description: this.description
    };

    this.apiService.purchaseProduct(purchaseData).subscribe({
      next:(res:any) => {
        if(res.status === 200){
          this.showMessage("Purchase added successfully");
          this.resetForm();
        }
      },
      error:(error:any) => {
        this.showMessage(error?.error?.message || error?.message || "Unable to add purchase " + error);
      }
    })
  }

  resetForm(): void {
    this.productId = '';
    this.supplierId = '';
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
