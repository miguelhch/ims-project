import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-add-edit-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-edit-product.html',
  styleUrl: './add-edit-product.css'
})
export class AddEditProduct implements OnInit {

  constructor(
    private apiService:ApiService, 
    private route: ActivatedRoute,
    private router: Router
  ) {}

  productId:string | null = null;
  name: string = '';
  sku: string = '';
  price: string = '';
  stockQuantity: string = '';
  categoryId: string = '';
  description: string = '';
  imageFile: File | null = null;
  imageUrl: string = '';
  isEditing: boolean = false;
  categories: any[]  = [] ;
  message: string = '';
  

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('productId');
    this.fetchCategories();
    if (this.productId) {
      this.isEditing = true;
      this.fetchProductById(this.productId);
    }
  }

  // Get all categories
  fetchCategories(): void {
    this.apiService.getAllCategories().subscribe({
      next:(res:any) => {
        if(res.status === 200){
          this.categories = res.categories;
        }
      },
      error:(error:any) => {
        this.showMessage(error?.error?.message || error?.message || "Unable to get all categories " + error);
      }
    })
  }

  // Get product by id
  fetchProductById(productId: string): void {
    this.apiService.getProductById(productId).subscribe({
      next:(res:any) => {
        if(res.status === 200){
          const product = res.product;
          this.name = product.name;
          this.sku = product.sku;
          this.price = product.price;
          this.stockQuantity = product.stockQuantity;
          this.categoryId = product.categoryId;
          this.description = product.description;
          this.imageFile = product.imageFile;
          this.imageUrl = product.imageUrl;
        } else{
          this.showMessage(res.message);
        }
    
      },
      error:(error:any) => {
        this.showMessage(error?.error?.message || error?.message || "Unable to get product by id " + error);
      }
    })
  }

  handleImageChange(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input?.files) {
      this.imageFile = input.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        this.imageUrl = reader.result as string;
      }
      reader.readAsDataURL(this.imageFile);
    }
  }

  handleSubmit(event: Event): void {
    event.preventDefault
    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('sku', this.sku);
    formData.append('price', this.price);
    formData.append('stockQuantity', this.stockQuantity);
    formData.append('categoryId', this.categoryId);
    formData.append('description', this.description);
    
    if (this.imageFile) {
      formData.append('imageFile', this.imageFile);
    }

    if (this.isEditing) {
      formData.append("productId", this.productId!);
      this.apiService.updateProduct(formData).subscribe({
        next:(res:any) => {
          if(res.status === 200){
            this.showMessage("Product updated successfully");
            this.router.navigate(["/product"]);
          }
        },
        error:(error:any) => {
          this.showMessage(error?.error?.message || error?.message || "Unable to update product " + error);
        }
      })
    } else {
      this.apiService.addProduct(formData).subscribe({
        next:(res:any) => {
          if(res.status === 200){
            this.showMessage("Product added successfully");
            this.router.navigate(["/product"]);
          }
        },
        error:(error:any) => {
          this.showMessage(error?.error?.message || error?.message || "Unable to add product " + error);
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
