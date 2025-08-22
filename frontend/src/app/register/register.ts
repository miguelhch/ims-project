import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ApiService } from '../service/api.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  constructor(private apiService:ApiService, private router:Router){}

  formData: any = {
    email: '',
    name: '',
    phoneNumber: '',
    password: ''
  };
  message:string | null = null

  async handleSubmit(){
    if(
      !this.formData.email ||
      !this.formData.name ||
      !this.formData.phoneNumber ||
      !this.formData.password
    ){
      this.showMessage("All fields are required");
      return;
    }

    try {
      console.log("calling registerUser method")
      const response: any = await firstValueFrom(
        this.apiService.registerUser(this.formData)
      );
      if (response.status === 200) {
        this.showMessage(response.message);
        this.router.navigate(["/login"]);
      }
    } catch (error:any) {
      console.log(error);
      this.showMessage(error?.error?.message || error?.message || "Unable to register a user " + error);
    }
  }

  showMessage(message:string){
    this.message = message;
    setTimeout(() => {
      this.message = null
    }, 4000)
    
  }

}
