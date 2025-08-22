package com.lusancode.inventory_management_system.service.impl;

import com.lusancode.inventory_management_system.dto.ProductDTO;
import com.lusancode.inventory_management_system.dto.Response;
import com.lusancode.inventory_management_system.entity.Category;
import com.lusancode.inventory_management_system.entity.Product;
import com.lusancode.inventory_management_system.exceptions.NotFoundException;
import com.lusancode.inventory_management_system.repository.CategoryRepository;
import com.lusancode.inventory_management_system.repository.ProductRepository;
import com.lusancode.inventory_management_system.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;
    private final CategoryRepository categoryRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    public Response saveProduct(ProductDTO productDTO, MultipartFile imageFile) {
        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new NotFoundException("Category not found with id: " + productDTO.getCategoryId()));

        Product productToSave = Product.builder()
                .name(productDTO.getName())
                .sku(productDTO.getSku())
                .price(productDTO.getPrice())
                .stockQuantity(productDTO.getStockQuantity())
                .description(productDTO.getDescription())
                .category(category)
                .build();

        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = saveImage(imageFile);
            productToSave.setImageUrl(imageUrl);
        }

        productRepository.save(productToSave);

        return Response.builder()
                .status(200)
                .message("Product saved successfully")
                .build();
    }

    @Override
    public Response updateProduct(ProductDTO productDTO, MultipartFile imageFile) {
        Product existingProduct = productRepository.findById(productDTO.getProductId())
                .orElseThrow(() -> new NotFoundException("Product not found with id: " + productDTO.getProductId()));

        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = saveImage(imageFile);
            existingProduct.setImageUrl(imageUrl);
        }

        if (productDTO.getCategoryId() != null && productDTO.getCategoryId() > 0) {
            Category category = categoryRepository.findById(productDTO.getCategoryId())
                    .orElseThrow(() -> new NotFoundException("Category not found with id: " + productDTO.getCategoryId()));
            existingProduct.setCategory(category);
        }

        if (productDTO.getName() != null && !productDTO.getName().isBlank())
            existingProduct.setName(productDTO.getName());

        if (productDTO.getSku() != null && !productDTO.getSku().isBlank())
            existingProduct.setSku(productDTO.getSku());

        if (productDTO.getDescription() != null && !productDTO.getDescription().isBlank())
            existingProduct.setDescription(productDTO.getDescription());

        if (productDTO.getPrice() != null && productDTO.getPrice().compareTo(BigDecimal.ZERO) >= 0)
            existingProduct.setPrice(productDTO.getPrice());

        if (productDTO.getStockQuantity() != null && productDTO.getStockQuantity() >= 0)
            existingProduct.setStockQuantity(productDTO.getStockQuantity());

        productRepository.save(existingProduct);

        return Response.builder()
                .status(200)
                .message("Product updated successfully")
                .build();
    }

    @Override
    public Response getAllProducts() {
        List<Product> products = productRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
        List<ProductDTO> productDTOS = modelMapper.map(products, new TypeToken<List<ProductDTO>>() {}.getType());

        return Response.builder()
                .status(200)
                .message("Products retrieved successfully")
                .products(productDTOS)
                .build();
    }

    @Override
    public Response getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found with id: " + id));

        ProductDTO productDTO = modelMapper.map(product, ProductDTO.class);

        return Response.builder()
                .status(200)
                .message("Product retrieved successfully")
                .product(productDTO)
                .build();
    }

    @Override
    public Response deleteProduct(Long id) {
        productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found with id: " + id));

        productRepository.deleteById(id);

        return Response.builder()
                .status(200)
                .message("Product deleted successfully")
                .build();
    }

    private String saveImage(MultipartFile imageFile) {
        if (!imageFile.getContentType().startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }

        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
            log.info("Directory created at: {}", uploadDir);
        }

        String uniqueFileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
        String imagePath = directory.getAbsolutePath() + File.separator + uniqueFileName;

        try {
            imageFile.transferTo(new File(imagePath));
        } catch (Exception e) {
            throw new IllegalArgumentException("Error occurred while saving image: " + e.getMessage());
        }

        // return only the relative URL, not the filesystem path
        return "/images/" + uniqueFileName;
    }
}
