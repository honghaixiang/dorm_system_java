package com.dorm.mapper;

import com.dorm.entity.Dorm;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface DormMapper {
    
    @Insert("INSERT INTO dorm (building, room_number, beds, available_beds, facilities, image, created_at) " +
            "VALUES (#{building}, #{roomNumber}, #{beds}, #{availableBeds}, #{facilities}, #{image}, NOW())")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Dorm dorm);
    
    @Select("SELECT * FROM dorm WHERE id = #{id}")
    Dorm findById(Long id);
    
    @Select("SELECT * FROM dorm ORDER BY building, room_number")
    List<Dorm> findAll();
    
    @Update("UPDATE dorm SET available_beds = #{availableBeds} WHERE id = #{id}")
    int updateAvailableBeds(Dorm dorm);
    
    @Select("SELECT COUNT(*) FROM dorm")
    int countDorms();
    
    @Select("SELECT SUM(beds) FROM dorm")
    Integer sumTotalBeds();
    
    @Select("SELECT SUM(available_beds) FROM dorm")
    Integer sumAvailableBeds();
}
