package com.lusancode.inventory_management_system.service.impl;

import com.lusancode.inventory_management_system.dto.LoginRequest;
import com.lusancode.inventory_management_system.dto.RegisterRequest;
import com.lusancode.inventory_management_system.dto.Response;
import com.lusancode.inventory_management_system.dto.UserDTO;
import com.lusancode.inventory_management_system.entity.User;
import com.lusancode.inventory_management_system.enums.UserRole;
import com.lusancode.inventory_management_system.exceptions.InvalidCredentialsException;
import com.lusancode.inventory_management_system.exceptions.NotFoundException;
import com.lusancode.inventory_management_system.repository.UserRepository;
import com.lusancode.inventory_management_system.security.JwtUtils;
import com.lusancode.inventory_management_system.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository; // Assuming you have a UserRepository for database operations
    private final PasswordEncoder passwordEncoder; // For encoding passwords
    private final ModelMapper modelMapper; // For mapping between DTOs and entities
    private final JwtUtils jwtUtils; // For JWT token generation and validation

    @Override
    public Response registerUser(RegisterRequest registerRequest) {

        UserRole userRole = UserRole.MANAGER;

        if (registerRequest.getRole() != null) {
            userRole = registerRequest.getRole();
        }
        User userToSave = User.builder()
                .name(registerRequest.getName())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .phoneNumber(registerRequest.getPhoneNumber())
                .role(userRole)
                .build();

        userRepository.save(userToSave);

        return Response.builder()
                .status(200)
                .message("User registered successfully")
                .build();
    }

    @Override
    public Response loginUser(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new NotFoundException("User not found with email: " + loginRequest.getEmail()));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Password is incorrect for user: " + loginRequest.getEmail());
        }
        String token = jwtUtils.generateToken(user.getEmail());
        return Response.builder()
                .status(200)
                .message("Login successful")
                .role(user.getRole())
                .token(token)
                .expirationTime("6 months")
                .build();
    }

    @Override
    @Transactional
    public Response getAllUsers() {
        List<User> users = userRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));

        List<UserDTO> userDTOS = modelMapper.map(users, new TypeToken<List<UserDTO>>() {}.getType());

        userDTOS.forEach(userDTO -> userDTO.setTransactions(null)); // Assuming transactions are not needed here

        return Response.builder()
                .status(200)
                .message("Users retrieved successfully")
                .users(userDTOS)
                .build();
    }

    @Override
    public User getCurrentLoogedInUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found with email: " + email));
        user.setTransactions(null); // Assuming transactions are not needed here

        return user;
    }

    @Override
    public Response updateUser(Long id, UserDTO userDTO) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + id));
        if (userDTO.getEmail() != null) existingUser.setEmail(userDTO.getEmail());
        if (userDTO.getName() != null) existingUser.setName(userDTO.getName());
        if (userDTO.getPhoneNumber() != null) existingUser.setPhoneNumber(userDTO.getPhoneNumber());
        if (userDTO.getRole() != null) existingUser.setRole(userDTO.getRole());

        if(userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }

        userRepository.save(existingUser);

        return Response.builder()
                .status(200)
                .message("User updated successfully")
                .build();
    }

    @Override
    public Response deleteUser(Long id) {

        userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + id));

        userRepository.deleteById(id);

        return Response.builder()
                .status(200)
                .message("User deleted successfully")
                .build();
    }

    @Override
    public Response getUserTransactions(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + id));

        UserDTO userDTO = modelMapper.map(user, UserDTO.class);

        userDTO.getTransactions().forEach(transactionDTO -> {
            transactionDTO.setUser(null); // Avoid circular reference
            transactionDTO.setSupplier(null);
        });

        return Response.builder()
                .status(200)
                .message("User transactions retrieved successfully")
                .user(userDTO)
                .build();
    }
}
