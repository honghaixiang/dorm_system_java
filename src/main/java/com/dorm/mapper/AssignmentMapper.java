package com.dorm.mapper;

import com.dorm.entity.Assignment;
import org.apache.ibatis.annotations.*;
import java.util.List;
import java.util.Map;

@Mapper
public interface AssignmentMapper {
    
    @Select("SELECT a.id, a.user_id, a.dorm_id, a.bed_number, a.status, a.assigned_at, " +
            "u.name as student_name, u.student_id as student_id, " +
            "d.building as building, d.room_number as room_number " +
            "FROM assignment a " +
            "JOIN sys_user u ON a.user_id = u.id " +
            "JOIN dorm d ON a.dorm_id = d.id " +
            "WHERE a.status = 'active'")
    List<Map<String, Object>> findAllWithDetails();
    
    @Select("SELECT * FROM assignment WHERE user_id = #{userId} AND status = 'active'")
    Assignment findActiveByUserId(Long userId);
    
    @Insert("INSERT INTO assignment(user_id, dorm_id, bed_number, status) " +
            "VALUES(#{userId}, #{dormId}, #{bedNumber}, #{status})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Assignment assignment);
    
    @Update("UPDATE assignment SET status = 'moved_out' WHERE user_id = #{userId}")
    int deactivateByUserId(Long userId);
}
