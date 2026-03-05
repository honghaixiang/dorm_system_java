package com.dorm.mapper;

import com.dorm.entity.Violation;
import org.apache.ibatis.annotations.*;
import java.util.List;
import java.util.Map;

@Mapper
public interface ViolationMapper {
    
    @Select("SELECT v.*, u.name as student_name, u.student_id " +
            "FROM violation v " +
            "JOIN sys_user u ON v.user_id = u.id " +
            "ORDER BY v.created_at DESC")
    List<Map<String, Object>> findAllWithDetails();
    
    @Insert("INSERT INTO violation(user_id, type, description, status) " +
            "VALUES(#{userId}, #{type}, #{description}, #{status})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Violation violation);
    
    @Update("UPDATE violation SET status = #{status} WHERE id = #{id}")
    int updateStatus(@Param("id") Long id, @Param("status") String status);
}
