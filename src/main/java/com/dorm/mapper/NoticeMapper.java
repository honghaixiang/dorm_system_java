package com.dorm.mapper;

import com.dorm.entity.Notice;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface NoticeMapper {
    
    @Select("SELECT * FROM sys_notice ORDER BY created_at DESC LIMIT 10")
    List<Notice> findRecent();
    
    @Select("SELECT * FROM sys_notice ORDER BY created_at DESC")
    List<Notice> findAll();
    
    @Select("SELECT * FROM sys_notice WHERE id = #{id}")
    Notice findById(Long id);
    
    @Insert("INSERT INTO sys_notice (title, content, type, priority, created_at) " +
            "VALUES (#{title}, #{content}, #{type}, #{priority}, NOW())")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Notice notice);
    
    @Update("UPDATE sys_notice SET title=#{title}, content=#{content}, " +
            "type=#{type}, priority=#{priority} WHERE id=#{id}")
    int update(Notice notice);
    
    @Delete("DELETE FROM sys_notice WHERE id = #{id}")
    int delete(Long id);
}
