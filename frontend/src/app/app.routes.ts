import { Routes } from '@angular/router';
import { GuardService } from './service/guard.service';
import { LoginComponent } from './login/login.component';
import { Register } from './register/register';
import { Category } from './category/category';
import { Supplier } from './supplier/supplier';
import { AddEditSupplier } from './add-edit-supplier/add-edit-supplier';
import { Product } from './product/product';
import { AddEditProduct } from './add-edit-product/add-edit-product';
import { Purchase } from './purchase/purchase';
import { Sell } from './sell/sell';
import { Transaction } from './transaction/transaction';
import { TransactionDetails } from './transaction-details/transaction-details';
import { Profile } from './profile/profile';
import { Dashboard } from './dashboard/dashboard';

export const routes: Routes = [

    {path: "login", component: LoginComponent},
    {path: "register", component: Register},

    {path: "category", component: Category, canActivate:[GuardService], data: {requiresAdmin: true}},

    {path: "supplier", component: Supplier, canActivate:[GuardService], data: {requiresAdmin: true}},
    {path: "edit-supplier/:supplierId", component: AddEditSupplier, canActivate:[GuardService], data: {requiresAdmin: true}},
    {path: "add-supplier", component: AddEditSupplier, canActivate:[GuardService], data: {requiresAdmin: true}},

    {path: "product", component: Product, canActivate:[GuardService], data: {requiresAdmin: true}},
    {path: "edit-product/:productId", component: AddEditProduct, canActivate:[GuardService], data: {requiresAdmin: true}},
    {path: "add-product", component: AddEditProduct, canActivate:[GuardService], data: {requiresAdmin: true}},
    
    {path: "purchase", component: Purchase, canActivate:[GuardService]},
    {path: "sell", component: Sell, canActivate:[GuardService]},
    {path: "transaction", component: Transaction, canActivate:[GuardService]},
    {path: "transaction/:transactionId", component: TransactionDetails, canActivate:[GuardService]},
    
    {path: "profile", component: Profile, canActivate:[GuardService]},
    {path: "dashboard", component: Dashboard, canActivate:[GuardService]},
    
    
    // WIDE CARD
    {path: "", redirectTo: "/login", pathMatch: 'full'},
    //{path: "**", redirectTo: "dashboard"}


];
