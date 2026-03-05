package com.dorm;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.dorm.mapper")
public class DormSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(DormSystemApplication.class, args);
        System.out.println("\n========================================");
        System.out.println("学生宿舍管理系统启动成功！");
        System.out.println("访问地址: http://localhost:8080/login.html");
        System.out.println("管理员账号: admin / admin123");
        System.out.println("========================================\n");
    }
}
