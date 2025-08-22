package com.lusancode.inventory_management_system.service;

import com.lusancode.inventory_management_system.dto.CategoryDTO;
import com.lusancode.inventory_management_system.dto.Response;
import com.lusancode.inventory_management_system.dto.SupplierDTO;

public interface SupplierService {

    Response addSupplier(SupplierDTO supplierDTO);
    Response updateSupplier(Long id, SupplierDTO supplierDTO);
    Response getAllSuppliers();
    Response getSupplierById(Long id);
    Response deleteSupplier(Long id);
}
