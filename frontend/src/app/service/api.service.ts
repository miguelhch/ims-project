import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import CryptoJS from "crypto-js";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  
  authStatusChanged = new EventEmitter<void>();
  private static BASE_URL = 'http://localhost:8080/api';
  private static ENCRYPTION_KEY = 'my-encryption-key';
  
  
  constructor(private http:HttpClient) {}

  encrytpAndSaveToStorage(key: string, value: string): void {
    const encryptedValue = CryptoJS.AES.encrypt(value, ApiService.ENCRYPTION_KEY).toString();
    localStorage.setItem(key, encryptedValue);
  }

  private getFromStorageAndDecrypt(key: string): any {
    try {
      const encryptedValue = localStorage.getItem(key);
      if (!encryptedValue) return null;
      
      return CryptoJS.AES.decrypt(encryptedValue, ApiService.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
      
    } catch (error) {
      return null;
    }

  }

  private clearAuth(){
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }

  private getHeaders(): HttpHeaders {
    const token = this.getFromStorageAndDecrypt('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // AUTH & USERS API METHODS

  registerUser(body: any): Observable<any> {
    console.log(body);
    return this.http.post(`${ApiService.BASE_URL}/auth/register`, body);
  }

  loginUser(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/auth/login`, body);
  }

  getLoggedInUserInfo(): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/users/current`, {
       headers: this.getHeaders()
      });
  }



  /**CATEGORY ENDPOINTS */
  createCategory(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/categories/add`, body, {
      headers: this.getHeaders()
    });
  }

  getAllCategories(): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/categories/all`, {
      headers: this.getHeaders()
    });
  }

  getCategoryById(id: string): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/categories/${id}`, {
      headers: this.getHeaders()
    });
  }

  updateCategory(id: string, body: any): Observable<any> {
    return this.http.put(`${ApiService.BASE_URL}/categories/update/${id}`, body, {
      headers: this.getHeaders()
    });
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${ApiService.BASE_URL}/categories/delete/${id}`, {
      headers: this.getHeaders()
    });
  }

  /** SUPPLIER API */
  addSupplier(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/suppliers/add`, body, {
      headers: this.getHeaders()
    });
  }

  getAllSuppliers(): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/suppliers/all`, {
      headers: this.getHeaders()
    });
  }

  getSupplierById(id: string): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/suppliers/${id}`, {
      headers: this.getHeaders()
    });
  }

  updateSupplier(id: string, body: any): Observable<any> {
    return this.http.put(`${ApiService.BASE_URL}/suppliers/update/${id}`, body, {
      headers: this.getHeaders()
    });
  }

  deleteSupplier(id: string): Observable<any> {
    return this.http.delete(`${ApiService.BASE_URL}/suppliers/delete/${id}`, {
      headers: this.getHeaders()
    });
  }

  /** PRODUCT API */
  addProduct(formData: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/products/add`, formData, {
      headers: this.getHeaders()
    });
  }
  
  updateProduct(formData: any): Observable<any> {
    return this.http.put(`${ApiService.BASE_URL}/products/update`, formData, {
      headers: this.getHeaders()
    });
  }


  getAllProducts(): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/products/all`, {
      headers: this.getHeaders()
    });
  }

  getProductById(id: string): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/products/${id}`, {
      headers: this.getHeaders()
    });
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${ApiService.BASE_URL}/products/delete/${id}`, {
      headers: this.getHeaders()
    });
  }

  /** TRANSACTIONS API */
  purchaseProduct(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/transactions/purchase`, body, {
      headers: this.getHeaders()
    });
  }

  sellProduct(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/transactions/sell`, body, {
      headers: this.getHeaders()
    });
  }

  getAllTransactions(searchText: string): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/transactions/all`, {
      params: { search: searchText },
      headers: this.getHeaders()
    });
  }

  getTransactionById(id: string): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/transactions/${id}`, {
      headers: this.getHeaders()
    });
  }

  updateTransactionStatus(id: string, status: string): Observable<any> {
    return this.http.put(`${ApiService.BASE_URL}/transactions/update/${id}`, JSON.stringify(status), {
      headers: this.getHeaders().set('Content-Type', 'application/json')
    });
  }

  getTransactionsByMonthAndYear(month: number, year: number): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/transactions/by-month-year`, {
      headers: this.getHeaders(),
      params: { 
        month: month, 
        year: year
      },
    });
  }

  /**AUTHENTICATION CHECKER */

  logout(): void {
    this.clearAuth();
  }

  isAuthenticated(): boolean {
    const token = this.getFromStorageAndDecrypt('token');
    return !!token;
  }

  isAdmin(): boolean {
    const role = this.getFromStorageAndDecrypt('role');
    return role === 'ADMIN';
  }

}
