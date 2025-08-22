package com.lusancode.inventory_management_system.service.impl;

import com.lusancode.inventory_management_system.dto.Response;
import com.lusancode.inventory_management_system.dto.TransactionDTO;
import com.lusancode.inventory_management_system.dto.TransactionRequest;
import com.lusancode.inventory_management_system.entity.Product;
import com.lusancode.inventory_management_system.entity.Supplier;
import com.lusancode.inventory_management_system.entity.Transaction;
import com.lusancode.inventory_management_system.entity.User;
import com.lusancode.inventory_management_system.enums.TransactionStatus;
import com.lusancode.inventory_management_system.enums.TransactionType;
import com.lusancode.inventory_management_system.exceptions.NameValueRequiredException;
import com.lusancode.inventory_management_system.exceptions.NotFoundException;
import com.lusancode.inventory_management_system.repository.ProductRepository;
import com.lusancode.inventory_management_system.repository.SupplierRepository;
import com.lusancode.inventory_management_system.repository.TransactionRepository;
import com.lusancode.inventory_management_system.service.TransactionService;
import com.lusancode.inventory_management_system.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final ModelMapper modelMapper;
    private final SupplierRepository supplierRepository;
    private final UserService userService;
    private final ProductRepository productRepository;


    @Override
    public Response restockInventory(TransactionRequest transactionRequest) {

        Long productId = transactionRequest.getProductId();
        Long supplierId = transactionRequest.getSupplierId();
        Integer quantity = transactionRequest.getQuantity();

        if(supplierId == null)
            throw new NameValueRequiredException("Supplier ID is required");

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product not found with id: "));

        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new NotFoundException("Supplier not found with id: " + supplierId));

        User user = userService.getCurrentLoogedInUser();

        // update the stock quantity and re-save
        product.setStockQuantity(product.getStockQuantity() + quantity);
        productRepository.save(product);

        // Create a new transaction record
        Transaction transaction = Transaction.builder()
                .transactionType(TransactionType.PURCHASE)
                .status(TransactionStatus.COMPLETED)
                .product(product)
                .user(user)
                .supplier(supplier)
                .totalProducts(quantity)
                .totalPrice(product.getPrice().multiply( BigDecimal.valueOf(quantity)))
                .description(transactionRequest.getDescription())
                .build();

        transactionRepository.save(transaction);
        log.info("Inventory restocked for product ID: {}, quantity: {}", productId, quantity);
        return Response.builder()
                .status(200)
                .message("Inventory restocked successfully")
                .build();
    }

    @Override
    public Response sell(TransactionRequest transactionRequest) {

        Long productId = transactionRequest.getProductId();
        Integer quantity = transactionRequest.getQuantity();


        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product not found with id: "));


        User user = userService.getCurrentLoogedInUser();

        // update the stock quantity and re-save
        product.setStockQuantity(product.getStockQuantity() - quantity);
        productRepository.save(product);

        // Create a new transaction record
        Transaction transaction = Transaction.builder()
                .transactionType(TransactionType.SALE)
                .status(TransactionStatus.COMPLETED)
                .product(product)
                .user(user)
                .totalProducts(quantity)
                .totalPrice(product.getPrice().multiply( BigDecimal.valueOf(quantity)))
                .description(transactionRequest.getDescription())
                .build();
        transactionRepository.save(transaction);
        return Response.builder()
                .status(200)
                .message("Product sold successfully")
                .build();
    }

    @Override
    public Response returnToSupplier(TransactionRequest transactionRequest) {


        Long productId = transactionRequest.getProductId();
        Long supplierId = transactionRequest.getSupplierId();
        Integer quantity = transactionRequest.getQuantity();

        if(supplierId == null)
            throw new NameValueRequiredException("Supplier ID is required");

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product not found with id: " + productId));

        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new NotFoundException("Supplier not found with id: " + supplierId));

        User user = userService.getCurrentLoogedInUser();

        // update the stock quantity and re-save
        product.setStockQuantity(product.getStockQuantity() - quantity);
        productRepository.save(product);

        // Create a new transaction record
        Transaction transaction = Transaction.builder()
                .transactionType(TransactionType.RETURN_TO_SUPPLIER)
                .status(TransactionStatus.PROCESSING)
                .product(product)
                .user(user)
                .totalProducts(quantity)
                .totalPrice(BigDecimal.ZERO)
                .description(transactionRequest.getDescription())
                .build();
        transactionRepository.save(transaction);
        return Response.builder()
                .status(200)
                .message("Product return to supplier initiated successfully")
                .build();
    }

    @Override
    public Response getAllTransactions(int page, int size, String searchText) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<Transaction> transactionPage = transactionRepository.searchTransactions(searchText, pageable);

        List<TransactionDTO> transactionDTOS = modelMapper
                .map(transactionPage.getContent(), new TypeToken<List<TransactionDTO>>() {}.getType());

        transactionDTOS.forEach(transactionDTOItem -> {
            transactionDTOItem.setUser(null);
            transactionDTOItem.setProduct(null);
            transactionDTOItem.setSupplier(null);
        });

        return Response.builder()
                .status(200)
                .message("Transactions retrieved successfully")
                .transactions(transactionDTOS)
                //.totalPages(transactionPage.getTotalPages())
                //.totalElements(transactionPage.getTotalElements())
                .build();
    }

    @Override
    public Response getTransactionById(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Transaction not found with id: " + id));

        TransactionDTO transactionDTO = modelMapper.map(transaction, TransactionDTO.class);
        transactionDTO.getUser().setTransactions(null); // Assuming you don't want to expose user details

        return Response.builder()
                .status(200)
                .message("Transaction retrieved successfully")
                .transaction(transactionDTO)
                .build();
    }

    @Override
    public Response getAllTransactionByMonthAndYear(int month, int year) {

        List<Transaction> transactions = transactionRepository.findAllByMonthAndYear(month, year);

        List<TransactionDTO> transactionDTOS = modelMapper
                .map(transactions, new TypeToken<List<TransactionDTO>>() {}.getType());

        transactionDTOS.forEach(transactionDTOItem -> {
            transactionDTOItem.setUser(null);
            transactionDTOItem.setProduct(null);
            transactionDTOItem.setSupplier(null);
        });

        return Response.builder()
                .status(200)
                .message("Transactions retrieved successfully")
                .transactions(transactionDTOS)
                .build();
    }

    @Override
    public Response UpdateTransactionStatus(Long transactionId, TransactionStatus transactionStatus) {

        Transaction existingTransaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new NotFoundException("Transaction not found with id: " + transactionId));

        existingTransaction.setStatus(transactionStatus);
        existingTransaction.setUpdatedAt(LocalDateTime.now());

        transactionRepository.save(existingTransaction);

        return Response.builder()
                .status(200)
                .message("Transaction status updated successfully")
                .build();
    }
}
