package com.lusancode.inventory_management_system.repository;

import com.lusancode.inventory_management_system.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
