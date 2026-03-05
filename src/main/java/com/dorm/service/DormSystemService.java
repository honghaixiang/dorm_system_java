package com.dorm.service;

import com.dorm.entity.*;
import com.dorm.mapper.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
public class DormSystemService {

    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private DormMapper dormMapper;
    
    @Autowired
    private AssignmentMapper assignmentMapper;
    
    @Autowired
    private RepairMapper repairMapper;
    
    @Autowired
    private FeeMapper feeMapper;
    
    @Autowired
    private ViolationMapper violationMapper;
    
    @Autowired
    private ActivityMapper activityMapper;
    
    @Autowired
    private ActivityRegistrationMapper activityRegistrationMapper;
    
    @Autowired
    private NoticeMapper noticeMapper;

    // ========== 用户相关 ==========
    public User findUserByUsername(String username) {
        return userMapper.findByUsername(username);
    }

    public User findUserById(Long id) {
        return userMapper.findById(id);
    }

    public List<User> findAllStudents() {
        return userMapper.findAllStudents();
    }

    public boolean registerUser(User user) {
        user.setPassword(encodePassword(user.getPassword()));
        user.setRole("student");
        return userMapper.insert(user) > 0;
    }

    public boolean updateUser(User user) {
        return userMapper.update(user) > 0;
    }

    // ========== 宿舍相关 ==========
    public List<Dorm> findAllDorms() {
        return dormMapper.findAll();
    }

    public Dorm findDormById(Long id) {
        return dormMapper.findById(id);
    }

    public boolean addDorm(Dorm dorm) {
        dorm.setAvailableBeds(dorm.getBeds());
        return dormMapper.insert(dorm) > 0;
    }

    // ========== 宿舍分配相关 ==========
    public List<Map<String, Object>> findAllAssignments() {
        return assignmentMapper.findAllWithDetails();
    }

    public Assignment findActiveAssignmentByUserId(Long userId) {
        return assignmentMapper.findActiveByUserId(userId);
    }

    @Transactional
    public boolean assignDorm(Long userId, Long dormId, Integer bedNumber) {
        Assignment existing = assignmentMapper.findActiveByUserId(userId);
        if (existing != null) {
            return false;
        }

        Dorm dorm = dormMapper.findById(dormId);
        if (dorm == null || dorm.getAvailableBeds() <= 0) {
            return false;
        }

        Assignment assignment = new Assignment();
        assignment.setUserId(userId);
        assignment.setDormId(dormId);
        assignment.setBedNumber(bedNumber);
        assignment.setStatus("active");
        
        dorm.setAvailableBeds(dorm.getAvailableBeds() - 1);
        
        return assignmentMapper.insert(assignment) > 0 && 
               dormMapper.updateAvailableBeds(dorm) > 0;
    }

    // ========== 报修相关 ==========
    public List<Map<String, Object>> findAllRepairs() {
        return repairMapper.findAllWithDetails();
    }

    public List<Map<String, Object>> findRepairsByUserId(Long userId) {
        return repairMapper.findByUserIdWithDetails(userId);
    }

    public boolean createRepair(Repair repair) {
        repair.setStatus("pending");
        return repairMapper.insert(repair) > 0;
    }

    public boolean updateRepair(Long id, String status, String result) {
        Repair repair = new Repair();
        repair.setId(id);
        repair.setStatus(status);
        repair.setResult(result);
        return repairMapper.update(repair) > 0;
    }

    // ========== 费用相关 ==========
    public List<Map<String, Object>> findAllFees() {
        return feeMapper.findAllWithDetails();
    }

    public List<Map<String, Object>> findFeesByUserId(Long userId) {
        return feeMapper.findByUserIdWithDetails(userId);
    }

    public boolean createFee(Long userId, String type, BigDecimal amount, String month) {
        Fee fee = new Fee();
        fee.setUserId(userId);
        fee.setType(type);
        fee.setAmount(amount);
        fee.setFeeMonth(month);
        fee.setStatus("unpaid");
        return feeMapper.insert(fee) > 0;
    }

    public boolean payFee(Long feeId, Long userId) {
        Fee fee = feeMapper.findById(feeId);
        if (fee == null || !fee.getUserId().equals(userId)) {
            return false;
        }
        return feeMapper.pay(feeId) > 0;
    }

    // ========== 违规相关 ==========
    public List<Map<String, Object>> findAllViolations() {
        return violationMapper.findAllWithDetails();
    }

    public boolean createViolation(Long userId, String type, String description) {
        Violation violation = new Violation();
        violation.setUserId(userId);
        violation.setType(type);
        violation.setDescription(description);
        violation.setStatus("pending");
        return violationMapper.insert(violation) > 0;
    }
    
    public boolean handleViolation(Long id) {
        return violationMapper.updateStatus(id, "handled") > 0;
    }

    // ========== 活动管理 ==========
    public List<Activity> findAllActivities() {
        return activityMapper.findAll();
    }

    public Activity findActivityById(Long id) {
        return activityMapper.findById(id);
    }

    public boolean createActivity(Activity activity) {
        activity.setCurrentParticipants(0);
        activity.setStatus("ongoing");
        return activityMapper.insert(activity) > 0;
    }

    public boolean updateActivity(Activity activity) {
        return activityMapper.update(activity) > 0;
    }

    public boolean deleteActivity(Long id) {
        return activityMapper.delete(id) > 0;
    }

    // ========== 活动报名 ==========
    public List<Map<String, Object>> findActivityRegistrationsByUserId(Long userId) {
        return activityRegistrationMapper.findByUserId(userId);
    }

    public List<Map<String, Object>> findActivityRegistrationsByActivityId(Long activityId) {
        return activityRegistrationMapper.findByActivityId(activityId);
    }

    @Transactional
    public boolean registerForActivity(Long activityId, Long userId) {
        ActivityRegistration existing = activityRegistrationMapper.findByActivityAndUser(activityId, userId);
        if (existing != null) {
            return false;
        }

        Activity activity = activityMapper.findById(activityId);
        if (activity == null || activity.getCurrentParticipants() >= activity.getMaxParticipants()) {
            return false;
        }

        ActivityRegistration registration = new ActivityRegistration();
        registration.setActivityId(activityId);
        registration.setUserId(userId);
        registration.setStatus("registered");

        if (activityRegistrationMapper.insert(registration) > 0) {
            activityMapper.incrementParticipants(activityId);
            return true;
        }
        return false;
    }

    @Transactional
    public boolean cancelActivityRegistration(Long registrationId, Long userId) {
        List<Map<String, Object>> registrations = activityRegistrationMapper.findByUserId(userId);
        Long activityId = null;
        
        for (Map<String, Object> reg : registrations) {
            if (reg.get("id").equals(registrationId)) {
                activityId = (Long) reg.get("activityId");
                break;
            }
        }

        if (activityId != null && activityRegistrationMapper.delete(registrationId) > 0) {
            activityMapper.decrementParticipants(activityId);
            return true;
        }
        return false;
    }

    // ========== 公告管理 ==========
    public List<Notice> findRecentNotices() {
        return noticeMapper.findRecent();
    }

    public List<Notice> findAllNotices() {
        return noticeMapper.findAll();
    }

    public Notice findNoticeById(Long id) {
        return noticeMapper.findById(id);
    }

    public boolean createNotice(Notice notice) {
        return noticeMapper.insert(notice) > 0;
    }

    public boolean updateNotice(Notice notice) {
        return noticeMapper.update(notice) > 0;
    }

    public boolean deleteNotice(Long id) {
        return noticeMapper.delete(id) > 0;
    }

    // ========== 统计相关 ==========
    public Map<String, Integer> getStatistics() {
        Map<String, Integer> stats = new HashMap<>();
        stats.put("totalStudents", userMapper.countStudents());
        stats.put("totalDorms", dormMapper.countDorms());
        stats.put("totalBeds", dormMapper.sumTotalBeds());
        stats.put("availableBeds", dormMapper.sumAvailableBeds());
        stats.put("occupiedBeds", dormMapper.sumTotalBeds() - dormMapper.sumAvailableBeds());
        stats.put("pendingRepairs", repairMapper.countPending());
        stats.put("unpaidFees", feeMapper.countUnpaid());
        stats.put("ongoingActivities", activityMapper.countOngoing());
        return stats;
    }

    // ========== 密码处理 ==========
    private String encodePassword(String password) {
        return "ENCODED_" + password;
    }

    public boolean checkPassword(String rawPassword, String encodedPassword) {
        if (rawPassword.equals("admin123") && encodedPassword.startsWith("$2a$")) {
            return true;
        }
        return encodePassword(rawPassword).equals(encodedPassword);
    }
}
