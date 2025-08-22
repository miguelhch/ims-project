import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Pagination } from '../pagination/pagination';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-product',
  imports: [CommonModule, Pagination],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product {
  constructor(private apiService: ApiService, private router: Router) {}
  products: any[] = [];
  message: string = '';

  // Pagination
  currentPage: number = 1;
  totalPages: number = 0;
  itemsPerPage: number = 10;

  ngOnInit(): void {
    this.fetchProducts();
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

  // Fetch products

  fetchProducts(): void {
    this.apiService.getAllProducts().subscribe({
      next: (res: any) => {
        const products = res.products || [];
        this.totalPages = Math.ceil(products.length / this.itemsPerPage);
        this.products = products.slice(
          (this.currentPage - 1) * this.itemsPerPage,
          this.currentPage * this.itemsPerPage
        );
      },
      error: (error: any) => {
        this.showMessage(
          error?.error?.message || error?.message || 'Unable to get all products ' + error
        );
      },
    });
  }

  // delete product
  handleDeleteProduct(productId: string): void {
    if (window.confirm('Are you sure you want to delete this product?')) {
      this.apiService.deleteProduct(productId).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.showMessage('Product deleted successfully');
            this.fetchProducts(); // reload products
          }
        },
        error: (error: any) => {
          this.showMessage(
            error?.error?.message || error?.message || 'Unable to delete product ' + error
          );
        },
      });
    }
  }

  //handle page change. navigate to next, previous or specific page
  onPageChange(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Navigation to add product page
  navigateToAddProductPage(): void {
    this.router.navigate(['/add-product']);
  }

  // Navigation to edit product page
  navigateToEditProductPage(productId: string): void {
    this.router.navigate([`/edit-product/${productId}`]);
  }

  showMessage(message: string) {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 4000);
  }
}
