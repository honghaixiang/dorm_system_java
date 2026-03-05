package com.dorm.mapper;

import com.dorm.entity.Repair;
import org.apache.ibatis.annotations.*;
import java.util.List;
import java.util.Map;

@Mapper
public interface RepairMapper {

    // 以下方法在 RepairMapper.xml 中定义，所以不需要注解
    List<Map<String, Object>> findAllWithDetails();

    int insert(Repair repair);

    int update(Repair repair);

    int countPending();

    // 以下方法只在Java中定义，使用注解
    @Select("SELECT r.*, u.name as student_name, u.student_id, " +
            "CONCAT(d.building, '-', d.room_number) as dorm " +
            "FROM repair r " +
            "JOIN sys_user u ON r.user_id = u.id " +
            "LEFT JOIN assignment a ON r.user_id = a.user_id AND a.status = 'active' " +
            "LEFT JOIN dorm d ON a.dorm_id = d.id " +
            "WHERE r.user_id = #{userId} " +
            "ORDER BY r.created_at DESC")
    List<Map<String, Object>> findByUserIdWithDetails(Long userId);
}