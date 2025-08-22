import { Component, OnInit} from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-supplier',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './supplier.html',
  styleUrl: './supplier.css'
})
export class Supplier implements OnInit {
  constructor(private apiService:ApiService, private router:Router) {}

  suppliers: any[] = [];
  message: string = '';

  ngOnInit(): void {
    this.getSuppliers();
  }

  getSuppliers(): void {
    this.apiService.getAllSuppliers().subscribe({
      next:(res:any) => {
        if(res.status === 200){
          this.suppliers = res.suppliers;
        }else{
          this.showMessage(res.message);
        }
      },
      error:(error:any) => {
        this.showMessage(error?.error?.message || error?.message || "Unable to get all suppliers " + error);
      }
    })
  }

  // Navigation to add supplier page
  navigateToAddSupplierPage():void{
    this.router.navigate(['/add-supplier']);
  }

  // Navigation to edit supplier page
  navigateToEditSupplierPage(supplierId: string): void {
    this.router.navigate([`/edit-supplier/${supplierId}`]);
  }

  handleDeleteSupplier(supplierId: string): void {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      this.apiService.deleteSupplier(supplierId).subscribe({
        next:(res:any) => {
          if(res.status === 200){
            this.showMessage("Supplier deleted successfully");
            this.getSuppliers(); // reload suppliers
          }
        },
        error:(error:any) => {
          this.showMessage(error?.error?.message || error?.message || "Unable to delete supplier " + error);
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
