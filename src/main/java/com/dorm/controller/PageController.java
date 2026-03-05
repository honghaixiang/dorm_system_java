package com.dorm.controller;

import org.springframework.stereotype.Controller;

/**
 * 页面控制器 - 已废弃
 * 现在使用 static 文件夹中的静态 HTML 文件
 * 前后端整合后不再需要 Thymeleaf 模板路由
 */
@Controller
public class PageController {
    // 所有路由已移除，现在直接访问 static 文件夹中的 HTML 文件
    // 例如：http://localhost:8080/login.html
}
