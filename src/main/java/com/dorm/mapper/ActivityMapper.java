package com.dorm.mapper;

import com.dorm.entity.Activity;
import org.apache.ibatis.annotations.*;
import java.util.List;
import java.util.Map;

@Mapper
public interface ActivityMapper {
    
    @Select("SELECT * FROM sys_activity ORDER BY activity_date DESC")
    List<Activity> findAll();
    
    @Select("SELECT * FROM sys_activity WHERE id = #{id}")
    Activity findById(Long id);
    
    @Insert("INSERT INTO sys_activity (title, description, location, activity_date, max_participants, " +
            "current_participants, image, status, created_at) " +
            "VALUES (#{title}, #{description}, #{location}, #{activityDate}, #{maxParticipants}, " +
            "#{currentParticipants}, #{image}, #{status}, NOW())")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Activity activity);
    
    @Update("UPDATE sys_activity SET title=#{title}, description=#{description}, " +
            "location=#{location}, activity_date=#{activityDate}, max_participants=#{maxParticipants}, " +
            "status=#{status}, image=#{image}, updated_at=NOW() WHERE id=#{id}")
    int update(Activity activity);
    
    @Update("UPDATE sys_activity SET current_participants = current_participants + 1 WHERE id = #{id}")
    int incrementParticipants(Long id);
    
    @Update("UPDATE sys_activity SET current_participants = current_participants - 1 WHERE id = #{id}")
    int decrementParticipants(Long id);
    
    @Delete("DELETE FROM sys_activity WHERE id = #{id}")
    int delete(Long id);
    
    @Select("SELECT COUNT(*) FROM sys_activity WHERE status = 'ongoing'")
    int countOngoing();
}
