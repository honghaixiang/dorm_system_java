package com.dorm.controller;

import com.dorm.entity.*;
import com.dorm.service.DormSystemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api")
public class ApiController {

    @Autowired
    private DormSystemService service;

    // ========== 统一返回格式 ==========
    private Map<String, Object> success(Object data) {
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("data", data);
        return result;
    }

    private Map<String, Object> success(String message) {
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", message);
        return result;
    }

    private Map<String, Object> error(String message) {
        Map<String, Object> result = new HashMap<>();
        result.put("success", false);
        result.put("message", message);
        return result;
    }

    private boolean isAdmin(HttpSession session) {
        String role = (String) session.getAttribute("role");
        return "admin".equals(role);
    }

    // ========== 用户认证相关 ==========

    // 注册
    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody User user) {
        if (service.findUserByUsername(user.getUsername()) != null) {
            return error("用户名已存在");
        }
        boolean result = service.registerUser(user);
        return result ? success("注册成功") : error("注册失败");
    }

    // 登录
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> params, HttpSession session) {
        String username = params.get("username");
        String password = params.get("password");

        User user = service.findUserByUsername(username);
        if (user == null) {
            return error("用户名或密码错误");
        }

        if (!service.checkPassword(password, user.getPassword())) {
            return error("用户名或密码错误");
        }

        session.setAttribute("userId", user.getId());
        session.setAttribute("username", user.getUsername());
        session.setAttribute("role", user.getRole());

        Map<String, Object> result = success("登录成功");
        result.put("role", user.getRole());
        return result;
    }

    // 登出
    @PostMapping("/logout")
    public Map<String, Object> logout(HttpSession session) {
        session.invalidate();
        return success("登出成功");
    }

    // ========== 个人信息管理 ==========

    // 获取个人信息
    @GetMapping("/profile")
    public Map<String, Object> getProfile(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return error("未登录");
        }

        User user = service.findUserById(userId);
        Assignment assignment = service.findActiveAssignmentByUserId(userId);

        Map<String, Object> userData = new HashMap<>();
        userData.put("name", user.getName());
        userData.put("student_id", user.getStudentId());
        userData.put("phone", user.getPhone());
        userData.put("username", user.getUsername());

        Map<String, Object> dormInfo = null;
        if (assignment != null) {
            Dorm dorm = service.findDormById(assignment.getDormId());
            if (dorm != null) {
                dormInfo = new HashMap<>();
                dormInfo.put("building", dorm.getBuilding());
                dormInfo.put("room_number", dorm.getRoomNumber());
                dormInfo.put("bed_number", assignment.getBedNumber());
            }
        }

        Map<String, Object> result = success("success");
        result.put("user", userData);
        result.put("dorm", dormInfo);
        return result;
    }

    // 更新个人信息
    @PutMapping("/profile")
    public Map<String, Object> updateProfile(@RequestBody Map<String, String> params, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return error("未登录");
        }

        User user = service.findUserById(userId);
        user.setName(params.get("name"));
        user.setPhone(params.get("phone"));

        boolean result = service.updateUser(user);
        return result ? success("更新成功") : error("更新失败");
    }

    // ========== 宿舍管理 ==========

    // 获取宿舍列表
    @GetMapping("/dorms")
    public Map<String, Object> getDorms() {
        List<Dorm> dorms = service.findAllDorms();
        List<Map<String, Object>> dormList = new ArrayList<>();

        for (Dorm dorm : dorms) {
            Map<String, Object> dormData = new HashMap<>();
            dormData.put("id", dorm.getId());
            dormData.put("building", dorm.getBuilding());
            dormData.put("room_number", dorm.getRoomNumber());
            dormData.put("beds", dorm.getBeds());
            dormData.put("available_beds", dorm.getAvailableBeds());
            dormData.put("facilities", dorm.getFacilities());
            dormData.put("image", dorm.getImage());
            dormList.add(dormData);
        }

        Map<String, Object> result = success("success");
        result.put("dorms", dormList);
        return result;
    }

    // 获取单个宿舍详情
    @GetMapping("/dorms/{id}")
    public Map<String, Object> getDormDetail(@PathVariable Long id) {
        Dorm dorm = service.findDormById(id);
        if (dorm == null) {
            return error("宿舍不存在");
        }

        Map<String, Object> dormData = new HashMap<>();
        dormData.put("id", dorm.getId());
        dormData.put("building", dorm.getBuilding());
        dormData.put("roomNumber", dorm.getRoomNumber());
        dormData.put("room_number", dorm.getRoomNumber());
        dormData.put("beds", dorm.getBeds());
        dormData.put("availableBeds", dorm.getAvailableBeds());
        dormData.put("available_beds", dorm.getAvailableBeds());
        dormData.put("facilities", dorm.getFacilities());
        dormData.put("image", dorm.getImage());

        Map<String, Object> result = success("success");
        result.put("dorm", dormData);
        return result;
    }

    // 添加宿舍
    @PostMapping("/dorms")
    public Map<String, Object> addDorm(@RequestBody Dorm dorm, HttpSession session) {
        if (!isAdmin(session)) {
            return error("无权限");
        }
        boolean result = service.addDorm(dorm);
        return result ? success("添加成功") : error("添加失败");
    }

    // ========== 宿舍分配管理 ==========

    // 获取分配记录
    @GetMapping("/assignments")
    public Map<String, Object> getAssignments(HttpSession session) {
        if (!isAdmin(session)) {
            return error("无权限");
        }

        List<Map<String, Object>> assignments = service.findAllAssignments();

        Map<String, Object> result = success("success");
        result.put("assignments", assignments);
        return result;
    }

    // 分配宿舍
    @PostMapping("/assignments")
    public Map<String, Object> assignDorm(@RequestBody Map<String, Object> params, HttpSession session) {
        if (!isAdmin(session)) {
            return error("无权限");
        }

        Long userId = Long.parseLong(params.get("userId").toString());
        Long dormId = Long.parseLong(params.get("dormId").toString());
        Integer bedNumber = Integer.parseInt(params.get("bedNumber").toString());

        boolean result = service.assignDorm(userId, dormId, bedNumber);
        return result ? success("分配成功") : error("分配失败");
    }

    // ========== 报修管理 ==========

    // 获取报修记录
    @GetMapping("/repairs")
    public Map<String, Object> getRepairs(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return error("未登录");
        }

        List<Map<String, Object>> repairs;
        if (isAdmin(session)) {
            repairs = service.findAllRepairs();
        } else {
            repairs = service.findRepairsByUserId(userId);
        }

        // 处理H2返回的大写字段名，确保前端能正确读取
        for (Map<String, Object> repair : repairs) {
            // 处理id字段
            if (repair.get("id") == null && repair.get("ID") != null) {
                repair.put("id", repair.get("ID"));
            }
            // 处理dorm字段
            if (repair.get("dorm") == null) {
                if (repair.get("DORM") != null) {
                    repair.put("dorm", repair.get("DORM"));
                } else {
                    repair.put("dorm", "未分配宿舍");
                }
            }
            // 处理student_name字段
            if (repair.get("student_name") == null && repair.get("STUDENT_NAME") != null) {
                repair.put("student_name", repair.get("STUDENT_NAME"));
            }
            // 处理student_id字段
            if (repair.get("student_id") == null && repair.get("STUDENT_ID") != null) {
                repair.put("student_id", repair.get("STUDENT_ID"));
            }
            // 处理repair_type字段
            if (repair.get("repair_type") == null && repair.get("REPAIR_TYPE") != null) {
                repair.put("repair_type", repair.get("REPAIR_TYPE"));
            }
            // 处理description字段
            if (repair.get("description") == null && repair.get("DESCRIPTION") != null) {
                repair.put("description", repair.get("DESCRIPTION"));
            }
            // 处理status字段
            if (repair.get("status") == null && repair.get("STATUS") != null) {
                repair.put("status", repair.get("STATUS"));
            }
            // 处理result字段
            if (repair.get("result") == null && repair.get("RESULT") != null) {
                repair.put("result", repair.get("RESULT"));
            }
            // 处理created_at字段
            if (repair.get("created_at") == null && repair.get("CREATED_AT") != null) {
                repair.put("created_at", repair.get("CREATED_AT"));
            }
        }

        Map<String, Object> result = success("success");
        result.put("repairs", repairs);
        return result;
    }

    // 提交报修
    @PostMapping("/repairs")
    public Map<String, Object> createRepair(@RequestBody Map<String, String> params, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return error("未登录");
        }

        Assignment assignment = service.findActiveAssignmentByUserId(userId);

        Repair repair = new Repair();
        repair.setUserId(userId);
        repair.setDormId(assignment != null ? assignment.getDormId() : null);
        repair.setRepairType(params.get("type"));
        repair.setDescription(params.get("description"));

        boolean result = service.createRepair(repair);
        return result ? success("报修申请已提交") : error("提交失败");
    }

    // 更新报修状态
    @PutMapping("/repairs/{id}")
    public Map<String, Object> updateRepair(@PathVariable Long id,
                                            @RequestBody Map<String, String> params,
                                            HttpSession session) {
        if (!isAdmin(session)) {
            return error("无权限");
        }

        String status = params.get("status");
        String result = params.get("result");

        boolean success = service.updateRepair(id, status, result);
        return success ? success("更新成功") : error("更新失败");
    }

    // 审核报修
    @PutMapping("/repairs/{id}/review")
    public Map<String, Object> reviewRepair(@PathVariable Long id,
                                            @RequestBody Map<String, String> reviewData,
                                            HttpSession session) {
        if (!isAdmin(session)) {
            return error("无权限");
        }

        String decision = reviewData.get("decision");
        String reason = reviewData.get("reason");

        String status = "approve".equals(decision) ? "approved" : "rejected";
        String result = "approve".equals(decision) ? "审核通过，等待分配维修人员" : "审核不通过：" + reason;

        boolean success = service.updateRepair(id, status, result);
        return success ? success("审核成功") : error("审核失败");
    }

    // 分配维修任务
    @PutMapping("/repairs/{id}/assign")
    public Map<String, Object> assignRepair(@PathVariable Long id,
                                            @RequestBody Map<String, String> assignData,
                                            HttpSession session) {
        if (!isAdmin(session)) {
            return error("无权限");
        }

        String workerName = assignData.get("workerName");
        String workerPhone = assignData.get("workerPhone");
        String estimatedTime = assignData.get("estimatedTime");
        String note = assignData.get("note");

        String result = String.format("已分配给维修人员：%s (电话：%s)，预计维修时间：%s。%s",
                workerName, workerPhone, estimatedTime, note != null ? note : "");

        boolean success = service.updateRepair(id, "assigned", result);
        return success ? success("分配成功") : error("分配失败");
    }

    // 反馈维修结果
    @PutMapping("/repairs/{id}/feedback")
    public Map<String, Object> feedbackRepair(@PathVariable Long id,
                                              @RequestBody Map<String, String> feedbackData,
                                              HttpSession session) {
        if (!isAdmin(session)) {
            return error("无权限");
        }

        String result = feedbackData.get("result");
        String description = feedbackData.get("description");
        String duration = feedbackData.get("duration");
        String cost = feedbackData.get("cost");

        String resultText = String.format("维修结果：%s。详细说明：%s。耗时：%s小时，费用：%s元",
                getResultText(result), description,
                duration != null ? duration : "未填写",
                cost != null ? cost : "0");

        boolean success = service.updateRepair(id, "completed", resultText);
        return success ? success("反馈成功") : error("反馈失败");
    }

    private String getResultText(String result) {
        switch (result) {
            case "success": return "维修成功";
            case "failed": return "维修失败";
            case "partial": return "部分维修";
            case "needParts": return "需要配件";
            default: return result;
        }
    }

    // ========== 费用管理 ==========

    // 获取费用记录
    @GetMapping("/fees")
    public Map<String, Object> getFees(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return error("未登录");
        }

        List<Map<String, Object>> fees;
        if (isAdmin(session)) {
            fees = service.findAllFees();
        } else {
            fees = service.findFeesByUserId(userId);
        }

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        for (Map<String, Object> fee : fees) {
            if (fee.get("dueDate") != null) {
                fee.put("due_date", sdf.format((Date)fee.get("dueDate")));
            }
        }

        Map<String, Object> result = success("success");
        result.put("fees", fees);
        return result;
    }

    // 创建费用
    @PostMapping("/fees")
    public Map<String, Object> createFee(@RequestBody Map<String, Object> params, HttpSession session) {
        if (!isAdmin(session)) {
            return error("无权限");
        }

        Long userId = Long.parseLong(params.get("userId").toString());
        String type = params.get("type").toString();
        BigDecimal amount = new BigDecimal(params.get("amount").toString());
        String month = params.get("month").toString();

        boolean result = service.createFee(userId, type, amount, month);
        return result ? success("创建成功") : error("创建失败");
    }

    // 缴费
    @PutMapping("/fees/{id}/pay")
    public Map<String, Object> payFee(@PathVariable Long id, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return error("未登录");
        }

        boolean result = service.payFee(id, userId);
        return result ? success("缴费成功") : error("缴费失败");
    }

    // 获取费用统计
    @GetMapping("/fees/statistics")
    public Map<String, Object> getFeeStatistics(HttpSession session) {
        if (!isAdmin(session)) {
            return error("无权限");
        }

        List<Map<String, Object>> allFees = service.findAllFees();

        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal paidAmount = BigDecimal.ZERO;
        BigDecimal unpaidAmount = BigDecimal.ZERO;

        for (Map<String, Object> fee : allFees) {
            // 兼容H2大写字段名
            Object amountObj = fee.get("amount");
            if (amountObj == null) amountObj = fee.get("AMOUNT");
            
            Object statusObj = fee.get("status");
            if (statusObj == null) statusObj = fee.get("STATUS");
            
            if (amountObj != null) {
                BigDecimal amount;
                if (amountObj instanceof BigDecimal) {
                    amount = (BigDecimal) amountObj;
                } else {
                    amount = new BigDecimal(amountObj.toString());
                }
                
                String status = statusObj != null ? statusObj.toString() : "unpaid";

                totalAmount = totalAmount.add(amount);
                if ("paid".equals(status)) {
                    paidAmount = paidAmount.add(amount);
                } else {
                    unpaidAmount = unpaidAmount.add(amount);
                }
            }
        }

        Map<String, Object> statistics = new HashMap<>();
        statistics.put("totalAmount", totalAmount);
        statistics.put("paidAmount", paidAmount);
        statistics.put("unpaidAmount", unpaidAmount);

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("statistics", statistics);
        return result;
    }

    // ========== 违规管理 ==========

    // 获取违规记录
    @GetMapping("/violations")
    public Map<String, Object> getViolations(HttpSession session) {
        if (!isAdmin(session)) {
            return error("无权限");
        }

        List<Map<String, Object>> violations = service.findAllViolations();
        
        // 处理H2返回的大写字段名
        for (Map<String, Object> violation : violations) {
            if (violation.get("id") == null && violation.get("ID") != null) {
                violation.put("id", violation.get("ID"));
            }
            if (violation.get("student_name") == null && violation.get("STUDENT_NAME") != null) {
                violation.put("student_name", violation.get("STUDENT_NAME"));
            }
            if (violation.get("student_id") == null && violation.get("STUDENT_ID") != null) {
                violation.put("student_id", violation.get("STUDENT_ID"));
            }
            if (violation.get("type") == null && violation.get("TYPE") != null) {
                violation.put("type", violation.get("TYPE"));
            }
            if (violation.get("description") == null && violation.get("DESCRIPTION") != null) {
                violation.put("description", violation.get("DESCRIPTION"));
            }
            if (violation.get("status") == null && violation.get("STATUS") != null) {
                violation.put("status", violation.get("STATUS"));
            }
            if (violation.get("created_at") == null && violation.get("CREATED_AT") != null) {
                violation.put("created_at", violation.get("CREATED_AT"));
            }
        }

        Map<String, Object> result = success("success");
        result.put("violations", violations);
        return result;
    }

    // 创建违规记录
    @PostMapping("/violations")
    public Map<String, Object> createViolation(@RequestBody Map<String, Object> params, HttpSession session) {
        if (!isAdmin(session)) {
            return error("无权限");
        }

        Long userId = Long.parseLong(params.get("userId").toString());
        String type = params.get("type").toString();
        String description = params.get("description").toString();

        boolean result = service.createViolation(userId, type, description);
        return result ? success("创建成功") : error("创建失败");
    }
    
    // 处理违规记录 - 标记为已处理
    @PutMapping("/violations/{id}/handle")
    public Map<String, Object> handleViolation(@PathVariable Long id, HttpSession session) {
        if (!isAdmin(session)) {
            return error("无权限");
        }

        boolean result = service.handleViolation(id);
        return result ? success("处理成功") : error("处理失败");
    }

    // ========== 活动管理 ==========

    // 获取活动列表
    @GetMapping("/activities")
    public Map<String, Object> getActivities() {
        List<Activity> activities = service.findAllActivities();
        List<Map<String, Object>> activityList = new ArrayList<>();

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        for (Activity activity : activities) {
            Map<String, Object> activityData = convertActivity(activity);
            if (activity.getActivityDate() != null) {
                activityData.put("activity_date", sdf.format(activity.getActivityDate()));
            }
            activityList.add(activityData);
        }

        Map<String, Object> result = success("success");
        result.put("activities", activityList);
        return result;
    }

    // 创建活动
    @PostMapping("/activities")
    public Map<String, Object> createActivity(@RequestBody Activity activity, HttpSession session) {
        if (!isAdmin(session)) {
            return error("无权限");
        }

        boolean result = service.createActivity(activity);
        return result ? success("创建成功") : error("创建失败");
    }

    // 更新活动
    @PutMapping("/activities/{id}")
    public Map<String, Object> updateActivity(@PathVariable Long id,
                                              @RequestBody Activity activity,
                                              HttpSession session) {
        if (!isAdmin(session)) {
            return error("无权限");
        }

        activity.setId(id);
        boolean result = service.updateActivity(activity);
        return result ? success("更新成功") : error("更新失败");
    }

    // 删除活动
    @DeleteMapping("/activities/{id}")
    public Map<String, Object> deleteActivity(@PathVariable Long id, HttpSession session) {
        if (!isAdmin(session)) {
            return error("无权限");
        }

        boolean result = service.deleteActivity(id);
        return result ? success("删除成功") : error("删除失败");
    }

    // 报名活动
    @PostMapping("/activities/{id}/register")
    public Map<String, Object> registerActivity(@PathVariable Long id, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return error("未登录");
        }

        boolean result = service.registerForActivity(id, userId);
        return result ? success("报名成功") : error("报名失败");
    }

    // 获取我的活动报名
    @GetMapping("/activities/my-registrations")
    public Map<String, Object> getMyActivityRegistrations(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return error("未登录");
        }

        List<Map<String, Object>> registrations = service.findActivityRegistrationsByUserId(userId);
        
        // 规范化字段名，确保前端能正确读取
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        for (Map<String, Object> reg : registrations) {
            // 处理活动标题
            if (reg.get("activity_title") == null && reg.get("ACTIVITY_TITLE") != null) {
                reg.put("activity_title", reg.get("ACTIVITY_TITLE"));
            }
            // 处理活动日期
            if (reg.get("activity_date") == null && reg.get("ACTIVITY_DATE") != null) {
                reg.put("activity_date", reg.get("ACTIVITY_DATE"));
            }
            // 处理地点
            if (reg.get("location") == null && reg.get("LOCATION") != null) {
                reg.put("location", reg.get("LOCATION"));
            }
            // 处理报名时间
            if (reg.get("registered_at") == null && reg.get("REGISTERED_AT") != null) {
                reg.put("registered_at", reg.get("REGISTERED_AT"));
            }
        }

        Map<String, Object> result = success("success");
        result.put("registrations", registrations);
        return result;
    }

    // 取消活动报名
    @DeleteMapping("/activities/registrations/{id}")
    public Map<String, Object> cancelActivityRegistration(@PathVariable Long id, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return error("未登录");
        }

        boolean result = service.cancelActivityRegistration(id, userId);
        return result ? success("取消成功") : error("取消失败");
    }

    // 获取活动参与者列表
    @GetMapping("/activities/{id}/participants")
    public Map<String, Object> getActivityParticipants(@PathVariable Long id, HttpSession session) {
        if (!isAdmin(session)) {
            return error("无权限");
        }

        List<Map<String, Object>> participants = service.findActivityRegistrationsByActivityId(id);

        Map<String, Object> result = success("success");
        result.put("participants", participants);
        return result;
    }

    // ========== 公告管理 ==========

    // 获取公告列表
    @GetMapping("/notices")
    public Map<String, Object> getNotices() {
        List<Notice> notices = service.findAllNotices();
        List<Map<String, Object>> noticeList = new ArrayList<>();

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        for (Notice notice : notices) {
            Map<String, Object> noticeData = convertNotice(notice);
            if (notice.getCreatedAt() != null) {
                noticeData.put("created_at", sdf.format(notice.getCreatedAt()));
            }
            noticeList.add(noticeData);
        }

        Map<String, Object> result = success("success");
        result.put("notices", noticeList);
        return result;
    }

    // 获取全部公告 (为管理员页面服务)
    @GetMapping("/notices/all")
    public Map<String, Object> getAllNotices(HttpSession session) {
        List<Notice> notices = service.findAllNotices();
        List<Map<String, Object>> noticeList = new ArrayList<>();

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        for (Notice notice : notices) {
            Map<String, Object> noticeData = convertNotice(notice);
            if (notice.getCreatedAt() != null) {
                noticeData.put("created_at", sdf.format(notice.getCreatedAt()));
            }
            noticeList.add(noticeData);
        }

        Map<String, Object> result = success("success");
        result.put("notices", noticeList);
        return result;
    }

    // 获取最近公告
    @GetMapping("/notices/recent")
    public Map<String, Object> getRecentNotices() {
        List<Notice> notices = service.findRecentNotices();
        List<Map<String, Object>> noticeList = new ArrayList<>();

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        for (Notice notice : notices) {
            Map<String, Object> noticeData = convertNotice(notice);
            if (notice.getCreatedAt() != null) {
                noticeData.put("created_at", sdf.format(notice.getCreatedAt()));
            }
            noticeList.add(noticeData);
        }

        Map<String, Object> result = success("success");
        result.put("notices", noticeList);
        return result;
    }

    // 发布公告
    @PostMapping("/notices")
    public Map<String, Object> createNotice(@RequestBody Notice notice, HttpSession session) {
        if (!isAdmin(session)) {
            return error("无权限");
        }

        boolean result = service.createNotice(notice);
        return result ? success("发布成功") : error("发布失败");
    }

    // 更新公告
    @PutMapping("/notices/{id}")
    public Map<String, Object> updateNotice(@PathVariable Long id,
                                            @RequestBody Notice notice,
                                            HttpSession session) {
        if (!isAdmin(session)) {
            return error("无权限");
        }

        notice.setId(id);
        boolean result = service.updateNotice(notice);
        return result ? success("更新成功") : error("更新失败");
    }

    // 删除公告
    @DeleteMapping("/notices/{id}")
    public Map<String, Object> deleteNotice(@PathVariable Long id, HttpSession session) {
        if (!isAdmin(session)) {
            return error("无权限");
        }

        boolean result = service.deleteNotice(id);
        return result ? success("删除成功") : error("删除失败");
    }

    // ========== 学生管理 ==========

    // 获取学生列表
    @GetMapping("/students")
    public Map<String, Object> getStudents(HttpSession session) {
        if (!isAdmin(session)) {
            return error("无权限");
        }

        List<User> students = service.findAllStudents();
        List<Map<String, Object>> studentList = new ArrayList<>();

        for (User student : students) {
            Map<String, Object> studentData = new HashMap<>();
            studentData.put("id", student.getId());
            studentData.put("username", student.getUsername());
            studentData.put("name", student.getName());
            studentData.put("student_id", student.getStudentId());
            studentData.put("phone", student.getPhone());
            studentData.put("role", student.getRole());
            studentList.add(studentData);
        }

        Map<String, Object> result = success("success");
        result.put("students", studentList);
        return result;
    }

    // ========== 统计数据 ==========

    // 获取统计信息
    @GetMapping("/statistics")
    public Map<String, Object> getStatistics(HttpSession session) {
        if (!isAdmin(session)) {
            return error("无权限");
        }

        Map<String, Integer> stats = service.getStatistics();

        Map<String, Object> result = success("success");
        result.put("statistics", stats);
        return result;
    }

    // ========== 辅助方法 ==========

    private Map<String, Object> convertActivity(Activity activity) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", activity.getId());
        map.put("title", activity.getTitle());
        map.put("description", activity.getDescription());
        map.put("location", activity.getLocation());
        map.put("activityDate", activity.getActivityDate());
        map.put("maxParticipants", activity.getMaxParticipants());
        map.put("currentParticipants", activity.getCurrentParticipants());
        map.put("status", activity.getStatus());
        map.put("createdAt", activity.getCreatedAt());
        return map;
    }

    private Map<String, Object> convertNotice(Notice notice) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", notice.getId());
        map.put("title", notice.getTitle());
        map.put("content", notice.getContent());
        map.put("type", notice.getType());
        map.put("priority", notice.getPriority());
        map.put("createdAt", notice.getCreatedAt());
        return map;
    }
}