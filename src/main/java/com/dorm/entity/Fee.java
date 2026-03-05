package com.dorm.entity;

import java.math.BigDecimal;
import java.util.Date;

public class Fee {
    private Long id;
    private Long userId;
    private String type;
    private BigDecimal amount;
    private String status;
    private String feeMonth;
    private Date paidAt;
    private Date createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getFeeMonth() { return feeMonth; }
    public void setFeeMonth(String feeMonth) { this.feeMonth = feeMonth; }

    public Date getPaidAt() { return paidAt; }
    public void setPaidAt(Date paidAt) { this.paidAt = paidAt; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

}
