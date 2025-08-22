package com.lusancode.inventory_management_system.service;

import com.lusancode.inventory_management_system.dto.ProductDTO;
import com.lusancode.inventory_management_system.dto.Response;
import com.lusancode.inventory_management_system.dto.SupplierDTO;
import org.springframework.web.multipart.MultipartFile;

public interface ProductService {

    Response saveProduct(ProductDTO productDTO, MultipartFile imageFile);
    Response updateProduct(ProductDTO productDTO, MultipartFile imageFile);
    Response getAllProducts();
    Response getProductById(Long id);
    Response deleteProduct(Long id);
}
