import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';

export interface Category {
  id: string;
  name: string;
}


@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category.html',
  styleUrl: './category.css'
})

export class Category implements OnInit {
  categories: Category[] = [];
  categoryName: string = '';
  message: string | null = '';
  isEditing: boolean = false;
  editingCategoryId: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit():void {
    this.getCategories();
  }

  // GET ALL CATEGORIES
  getCategories(): void {
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

  // ADD CATEGORY
  addCategory(): void {
    if(!this.categoryName){
      this.showMessage("Category name is required");
      return;
    }

    this.apiService.createCategory({name: this.categoryName}).subscribe({
      next:(res:any) => {
        if(res.status === 200){
          this.showMessage("Category added successfully");
          this.categoryName = '';
          this.getCategories();
        }
      },
      error:(error:any) => {
        this.showMessage(error?.error?.message || error?.message || "Unable to add a category " + error);
      }
    })
  }

  // EDIT CATEGORY
  editCategory(): void {
    if(!this.editingCategoryId || !this.categoryName){
      return;
    }

    this.apiService.updateCategory(this.editingCategoryId, {name: this.categoryName}).subscribe({
      next:(res:any) => {
        if(res.status === 200){
          this.showMessage("Category updated successfully");
          this.categoryName = '';
          this.isEditing = false;
          this.getCategories();
        }
      },
      error:(error:any) => {

        this.showMessage(error?.error?.message || error?.message || "Unable to update a category " + error);
      }
    })
    
  }

  // set the category to edit
  handleEditCategory(category: Category): void {
    this.isEditing = true;
    this.editingCategoryId = category.id;
    this.categoryName = category.name;
  }


  // DELETE CATEGORY
  handleDeleteCategory(categoryId: string): void {
    if (window.confirm("Are you sure you want to delete this category?")) {
      this.apiService.deleteCategory(categoryId).subscribe({
        next:(res:any) => {
          if(res.status === 200){
            this.showMessage("Category deleted successfully");
            this.getCategories(); // reload categories
          }
        },
        error:(error:any) => {
          this.showMessage(error?.error?.message || error?.message || "Unable to delete a category " + error);
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
