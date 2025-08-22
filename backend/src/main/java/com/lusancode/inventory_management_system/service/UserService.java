package com.lusancode.inventory_management_system.service;

import com.lusancode.inventory_management_system.dto.LoginRequest;
import com.lusancode.inventory_management_system.dto.RegisterRequest;
import com.lusancode.inventory_management_system.dto.Response;
import com.lusancode.inventory_management_system.dto.UserDTO;
import com.lusancode.inventory_management_system.entity.User;

public interface UserService {

    Response registerUser(RegisterRequest registerRequest);
    Response loginUser(LoginRequest loginRequest);
    Response getAllUsers();
    User getCurrentLoogedInUser();
    Response updateUser(Long id, UserDTO userDTO);
    Response deleteUser(Long id);
    Response getUserTransactions(Long id);
}
