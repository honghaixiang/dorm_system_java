package com.dorm.entity;

import java.util.Date;

public class Assignment {
    private Long id;
    private Long userId;
    private Long dormId;
    private Integer bedNumber;
    private String status;
    private Date assignedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getDormId() { return dormId; }
    public void setDormId(Long dormId) { this.dormId = dormId; }

    public Integer getBedNumber() { return bedNumber; }
    public void setBedNumber(Integer bedNumber) { this.bedNumber = bedNumber; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Date getAssignedAt() { return assignedAt; }
    public void setAssignedAt(Date assignedAt) { this.assignedAt = assignedAt; }

}
