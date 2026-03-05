package com.dorm.mapper;

import com.dorm.entity.Fee;
import org.apache.ibatis.annotations.*;
import java.util.List;
import java.util.Map;

@Mapper
public interface FeeMapper {
    
    @Select("SELECT f.*, u.name as student_name, u.student_id " +
            "FROM fee f " +
            "JOIN sys_user u ON f.user_id = u.id " +
            "ORDER BY f.created_at DESC")
    List<Map<String, Object>> findAllWithDetails();
    
    @Select("SELECT f.*, u.name as student_name, u.student_id " +
            "FROM fee f " +
            "JOIN sys_user u ON f.user_id = u.id " +
            "WHERE f.user_id = #{userId} " +
            "ORDER BY f.created_at DESC")
    List<Map<String, Object>> findByUserIdWithDetails(Long userId);
    
    @Select("SELECT * FROM fee WHERE id = #{id}")
    Fee findById(Long id);
    
    @Insert("INSERT INTO fee(user_id, type, amount, status, fee_month) " +
            "VALUES(#{userId}, #{type}, #{amount}, #{status}, #{feeMonth})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Fee fee);
    
    @Update("UPDATE fee SET status = 'paid', paid_at = CURRENT_TIMESTAMP WHERE id = #{id}")
    int pay(Long id);
    
    @Select("SELECT COUNT(*) FROM fee WHERE status = 'unpaid'")
    int countUnpaid();
}
