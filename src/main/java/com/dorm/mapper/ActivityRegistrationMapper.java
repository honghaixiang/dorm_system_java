package com.dorm.mapper;

import com.dorm.entity.ActivityRegistration;
import org.apache.ibatis.annotations.*;
import java.util.List;
import java.util.Map;

@Mapper
public interface ActivityRegistrationMapper {
    
    @Select("SELECT ar.*, a.title as activityTitle, u.name as userName, u.student_id as studentId " +
            "FROM sys_activity_registration ar " +
            "LEFT JOIN sys_activity a ON ar.activity_id = a.id " +
            "LEFT JOIN sys_user u ON ar.user_id = u.id " +
            "WHERE ar.activity_id = #{activityId}")
    List<Map<String, Object>> findByActivityId(Long activityId);
    
    @Select("SELECT ar.id, ar.activity_id, ar.user_id, ar.status, ar.registered_at, " +
            "a.title as activity_title, a.activity_date as activity_date, a.location as location " +
            "FROM sys_activity_registration ar " +
            "LEFT JOIN sys_activity a ON ar.activity_id = a.id " +
            "WHERE ar.user_id = #{userId} ORDER BY ar.registered_at DESC")
    List<Map<String, Object>> findByUserId(Long userId);
    
    @Select("SELECT * FROM sys_activity_registration WHERE activity_id = #{activityId} AND user_id = #{userId}")
    ActivityRegistration findByActivityAndUser(@Param("activityId") Long activityId, @Param("userId") Long userId);
    
    @Insert("INSERT INTO sys_activity_registration (activity_id, user_id, status, registered_at) " +
            "VALUES (#{activityId}, #{userId}, #{status}, NOW())")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(ActivityRegistration registration);
    
    @Update("UPDATE sys_activity_registration SET status = #{status} WHERE id = #{id}")
    int updateStatus(@Param("id") Long id, @Param("status") String status);
    
    @Delete("DELETE FROM sys_activity_registration WHERE id = #{id}")
    int delete(Long id);
}
