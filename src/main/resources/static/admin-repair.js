// ========== 完整的报修管理功能 ==========

let currentRepairId = null;

// 重新加载报修列表（更完整的显示）
async function loadRepairs() {
    try {
        const response = await fetch(`${API_BASE_URL}/repairs/all`, {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success) {
            const tbody = document.querySelector('#repairsTable tbody');
            tbody.innerHTML = '';
            
            if (!data.repairs || data.repairs.length === 0) {
                tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 40px; color: #999;">暂无报修记录</td></tr>';
                return;
            }
            
            data.repairs.forEach(repair => {
                const tr = document.createElement('tr');
                const statusText = {
                    'pending': '待审核',
                    'approved': '已批准',
                    'rejected': '已拒绝',
                    'assigned': '已分配',
                    'processing': '维修中',
                    'completed': '已完成'
                };
                
                tr.innerHTML = `
                    <td>${repair.studentName || repair.student_name || '-'}</td>
                    <td>${repair.studentId || repair.student_id || '-'}</td>
                    <td>${repair.dorm || '未分配宿舍'}</td>
                    <td style="max-width: 200px;">${repair.description}</td>
                    <td><span class="status-badge ${repair.status}">${statusText[repair.status] || repair.status}</span></td>
                    <td>${repair.workerName || repair.worker_name || '-'}</td>
                    <td style="max-width: 150px;">${repair.result || '-'}</td>
                    <td>${formatDate(repair.createdAt || repair.created_at)}</td>
                    <td style="min-width: 280px;">
                        ${repair.status === 'pending' ? `
                            <button class="btn-action btn-success" onclick="reviewRepair(${repair.id})">审核</button>
                        ` : ''}
                        ${repair.status === 'approved' ? `
                            <button class="btn-action btn-info" onclick="assignRepair(${repair.id})">分配任务</button>
                        ` : ''}
                        ${repair.status === 'assigned' || repair.status === 'processing' ? `
                            <button class="btn-action btn-warning" onclick="feedbackRepair(${repair.id})">反馈结果</button>
                        ` : ''}
                        ${repair.status === 'completed' ? `
                            <span style="color: #28a745; font-weight: 600;">✓ 已完成</span>
                        ` : ''}
                        ${repair.status === 'rejected' ? `
                            <span style="color: #dc3545; font-weight: 600;">✗ 已拒绝</span>
                        ` : ''}
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (error) {
        console.error('加载报修记录失败:', error);
    }
}

// 审核报修
function reviewRepair(id) {
    currentRepairId = id;
    
    // 显示报修详情（这里可以通过API获取详细信息）
    document.getElementById('repairReviewDetails').innerHTML = `
        <div style="background: #f8f9fa; padding: 20px; border-radius: 12px;">
            <h4 style="margin-bottom: 15px; color: #667eea;">报修详情</h4>
            <p style="color: #666; line-height: 1.8;">请选择审核决定...</p>
        </div>
    `;
    
    // 监听审核决定变化
    const select = document.getElementById('reviewDecision');
    select.onchange = function() {
        const rejectGroup = document.getElementById('rejectReasonGroup');
        rejectGroup.style.display = this.value === 'reject' ? 'block' : 'none';
    };
    
    document.getElementById('reviewRepairModal').classList.add('active');
}

// 提交审核
async function submitReview() {
    const decision = document.getElementById('reviewDecision').value;
    const rejectReason = document.getElementById('rejectReason').value;
    
    if (decision === 'reject' && !rejectReason) {
        alert('请填写拒绝原因');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/repairs/${currentRepairId}/review`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                decision: decision,
                reason: rejectReason
            })
        });
        
        const data = await response.json();
        if (data.success) {
            alert(decision === 'approve' ? '审核通过' : '已拒绝报修');
            closeModal('reviewRepairModal');
            loadRepairs();
            loadStatistics();
        } else {
            alert(data.message || '审核失败');
        }
    } catch (error) {
        console.error('审核失败:', error);
        alert('审核失败');
    }
}

// 分配维修任务
function assignRepair(id) {
    currentRepairId = id;
    document.getElementById('assignRepairModal').classList.add('active');
}

document.getElementById('assignRepairForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const assignData = {
        workerName: document.getElementById('repairWorkerName').value,
        workerPhone: document.getElementById('repairWorkerPhone').value,
        estimatedTime: document.getElementById('estimatedTime').value,
        note: document.getElementById('assignNote').value
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/repairs/${currentRepairId}/assign`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(assignData)
        });
        
        const data = await response.json();
        if (data.success) {
            alert('维修任务已分配');
            closeModal('assignRepairModal');
            loadRepairs();
            e.target.reset();
        } else {
            alert(data.message || '分配失败');
        }
    } catch (error) {
        console.error('分配失败:', error);
        alert('分配失败');
    }
});

// 维修反馈
function feedbackRepair(id) {
    currentRepairId = id;
    document.getElementById('feedbackRepairModal').classList.add('active');
}

document.getElementById('feedbackRepairForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const feedbackData = {
        result: document.getElementById('repairResult').value,
        description: document.getElementById('resultDescription').value,
        duration: document.getElementById('repairDuration').value,
        cost: document.getElementById('repairCost').value
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/repairs/${currentRepairId}/feedback`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(feedbackData)
        });
        
        const data = await response.json();
        if (data.success) {
            alert('维修结果已反馈');
            closeModal('feedbackRepairModal');
            loadRepairs();
            e.target.reset();
        } else {
            alert(data.message || '反馈失败');
        }
    } catch (error) {
        console.error('反馈失败:', error);
        alert('反馈失败');
    }
});
