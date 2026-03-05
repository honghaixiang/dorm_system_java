package com.dorm.mapper;

import com.dorm.entity.User;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface UserMapper {
    
    @Select("SELECT * FROM sys_user WHERE username = #{username}")
    User findByUsername(String username);
    
    @Select("SELECT * FROM sys_user WHERE id = #{id}")
    User findById(Long id);
    
    @Select("SELECT * FROM sys_user WHERE role = 'student'")
    List<User> findAllStudents();
    
    @Insert("INSERT INTO sys_user(username, password, name, student_id, phone, role) " +
            "VALUES(#{username}, #{password}, #{name}, #{studentId}, #{phone}, #{role})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(User user);
    
    @Update("UPDATE sys_user SET name = #{name}, phone = #{phone} WHERE id = #{id}")
    int update(User user);
    
    @Select("SELECT COUNT(*) FROM sys_user WHERE role = 'student'")
    int countStudents();
}
