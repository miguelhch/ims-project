package com.lusancode.inventory_management_system.service;

import com.lusancode.inventory_management_system.dto.CategoryDTO;
import com.lusancode.inventory_management_system.dto.Response;
import com.lusancode.inventory_management_system.dto.TransactionDTO;
import com.lusancode.inventory_management_system.dto.TransactionRequest;
import com.lusancode.inventory_management_system.enums.TransactionStatus;

public interface TransactionService {

    Response restockInventory(TransactionRequest transactionRequest);
    Response sell(TransactionRequest transactionRequest);
    Response returnToSupplier(TransactionRequest transactionRequest);
    Response getAllTransactions(int page, int size, String searchText);
    Response getTransactionById(Long id);
    Response getAllTransactionByMonthAndYear(int month, int year);
    Response UpdateTransactionStatus(Long transactionId, TransactionStatus transactionStatus);
}
