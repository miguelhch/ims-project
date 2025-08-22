package com.lusancode.inventory_management_system.service;

import com.lusancode.inventory_management_system.dto.CategoryDTO;
import com.lusancode.inventory_management_system.dto.Response;

public interface CategoryService {

    Response createCategory(CategoryDTO categoryDTO);
    Response getAllCategories();
    Response getCategoryById(Long id);
    Response updateCategory(Long id, CategoryDTO categoryDTO);
    Response deleteCategory(Long id);
}
