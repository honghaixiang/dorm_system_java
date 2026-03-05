const API_BASE_URL = '/api';

document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
    loadNotices();
    loadActivities();
    loadMyRegistrations();
    loadFees();
    loadRepairs();
});

// 加载公告
async function loadNotices() {
    try {
        const response = await fetch(`${API_BASE_URL}/notices`, {
            credentials: 'include'
        });
        const data = await response.json();

        if (data.success) {
            const container = document.getElementById('noticesList');
            if (!data.notices || data.notices.length === 0) {
                container.innerHTML = '<div style="text-align: center; padding: 40px; color: #999;">暂无公告</div>';
                return;
            }

            container.innerHTML = '';
            data.notices.forEach(notice => {
                const priorityColors = {
                    'high': '#ff6b6b',
                    'medium': '#ffa726',
                    'low': '#66bb6a'
                };
                const div = document.createElement('div');
                div.style.cssText = `
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 12px;
                    border-left: 4px solid ${priorityColors[notice.priority] || '#667eea'};
                `;
                div.innerHTML = `
                    <h4 style="margin-bottom: 10px; color: #333;">${notice.title}</h4>
                    <p style="color: #666; margin-bottom: 10px;">${notice.content}</p>
                    <small style="color: #999;">${formatDate(notice.createdAt)}</small>
                `;
                container.appendChild(div);
            });
        }
    } catch (error) {
        console.error('加载公告失败:', error);
    }
}

async function loadActivities() {
    try {
        const response = await fetch(`${API_BASE_URL}/activities`, {
            credentials: 'include'
        });
        const data = await response.json();

        if (data.success) {
            const tbody = document.querySelector('#activitiesTable tbody');
            tbody.innerHTML = '';

            if (!data.activities || data.activities.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: #999;">暂无活动</td></tr>';
                return;
            }

            data.activities.forEach(activity => {
                const title    = activity.title || activity.TITLE || '-';
                const location = activity.location || activity.LOCATION || '-';
                const date     = activity.activityDate || activity.activity_date || activity.ACTIVITY_DATE;
                const current  = activity.currentParticipants || activity.current_participants || activity.CURRENT_PARTICIPANTS || 0;
                const max      = activity.maxParticipants || activity.max_participants || activity.MAX_PARTICIPANTS || 0;
                const status   = activity.status || activity.STATUS || 'ended';
                const id       = activity.id || activity.ID;

                const tr = document.createElement('tr');
                const isFull = current >= max;
                tr.innerHTML = `
                    <td>${title}</td>
                    <td>${location}</td>
                    <td>${formatDate(date)}</td>
                    <td>${current}/${max}</td>
                    <td><span class="status-badge ${status}">${status === 'ongoing' ? '进行中' : '已结束'}</span></td>
                    <td>
                        ${!isFull && status === 'ongoing' ?
                    `<button class="btn-action btn-success" onclick="registerActivity(${id})">立即报名</button>`
                    : '<span style="color: #999;">已满/已结束</span>'}
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (error) {
        console.error('加载活动列表失败:', error);
    }
}

// 报名活动
async function registerActivity(activityId) {
    if (!confirm('确认报名此活动？')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/activities/${activityId}/register`, {
            method: 'POST',
            credentials: 'include'
        });

        const data = await response.json();
        if (data.success) {
            alert('报名成功！');
            loadActivities();
            loadMyRegistrations();
        } else {
            alert(data.message || '报名失败');
        }
    } catch (error) {
        console.error('报名失败:', error);
        alert('报名失败');
    }
}

// 加载我的报名
async function loadMyRegistrations() {
    try {
        const response = await fetch(`${API_BASE_URL}/activities/my-registrations`, {
            credentials: 'include'
        });
        const data = await response.json();

        if (data.success) {
            const tbody = document.querySelector('#myRegistrationsTable tbody');
            tbody.innerHTML = '';

            if (!data.registrations || data.registrations.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: #999;">暂无报名记录</td></tr>';
                return;
            }

            data.registrations.forEach(reg => {
                const title        = reg.activityTitle || reg.activity_title || reg.ACTIVITY_TITLE || '-';
                const location     = reg.location || reg.LOCATION || '-';
                const activityDate = reg.activityDate || reg.activity_date || reg.ACTIVITY_DATE;
                const registeredAt = reg.registeredAt || reg.registered_at || reg.REGISTERED_AT;
                const status       = reg.status || reg.STATUS || 'registered';
                const id           = reg.id || reg.ID;

                const tr = document.createElement('tr');
                tr.innerHTML = `
        <td>${title}</td>
        <td>${location}</td>
        <td>${formatDate(activityDate)}</td>
        <td>${formatDate(registeredAt)}</td>
        <td><span class="status-badge ${status}">${status === 'registered' ? '已报名' : '已取消'}</span></td>
        <td>
            ${status === 'registered' ?
                    `<button class="btn-action btn-cancel" onclick="cancelRegistration(${id})">取消报名</button>`
                    : '-'}
        </td>
    `;
                tbody.appendChild(tr);
            });

        }
    } catch (error) {
        console.error('加载报名记录失败:', error);
    }
}

// 取消报名
async function cancelRegistration(regId) {
    if (!confirm('确认取消报名？')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/registrations/${regId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        const data = await response.json();
        if (data.success) {
            alert('取消成功');
            loadActivities();
            loadMyRegistrations();
        } else {
            alert(data.message || '取消失败');
        }
    } catch (error) {
        console.error('取消失败:', error);
        alert('取消失败');
    }
}

// 加载个人信息
async function loadProfile() {
    try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
            credentials: 'include'
        });
        const data = await response.json();

        if (data.success) {
            const user = data.user;
            const dorm = data.dorm;

            // 显示用户名
            document.getElementById('userName').textContent = user.name;
            document.getElementById('userStudentId').textContent = user.studentId || user.student_id;
            document.getElementById('userAvatar').textContent = user.name ? user.name.charAt(0) : 'S';

            // 显示个人资料
            document.getElementById('profileName').textContent = user.name;
            document.getElementById('profileStudentId').textContent = user.studentId || user.student_id;
            document.getElementById('profilePhone').textContent = user.phone;

            // 显示宿舍信息
            const dormInfo = document.getElementById('dormInfo');
            if (dorm) {
                dormInfo.innerHTML = `
                    <div style="display: flex; justify-content: space-between; padding: 12px; background: #f8f9fa; border-radius: 8px;">
                        <span style="color: #666;">楼栋：</span>
                        <strong>${dorm.building}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 12px; background: #f8f9fa; border-radius: 8px;">
                        <span style="color: #666;">房间号：</span>
                        <strong>${dorm.roomNumber || dorm.room_number}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 12px; background: #f8f9fa; border-radius: 8px;">
                        <span style="color: #666;">床位号：</span>
                        <strong>${dorm.bedNumber || dorm.bed_number}</strong>
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error('加载个人信息失败:', error);
    }
}

// 查看宿舍详情
async function showDormDetails(dormId) {
    try {
        const response = await fetch(`${API_BASE_URL}/dorms/${dormId}`, {
            credentials: 'include'
        });
        const data = await response.json();

        if (data.success && data.dorm) {
            const dorm = data.dorm;
            alert(`宿舍详情：\n\n楼栋：${dorm.building}\n房间号：${dorm.roomNumber || dorm.room_number}\n总床位：${dorm.beds}\n可用床位：${dorm.availableBeds || dorm.available_beds}\n设施：${dorm.facilities || '暂无'}\n\n${dorm.image ? '查看宿舍图片功能开发中...' : '暂无宿舍图片'}`);
        }
    } catch (error) {
        console.error('加载宿舍详情失败:', error);
    }
}
// 加载费用记录（兼容大写字段）
async function loadFees() {
    try {
        const response = await fetch(`${API_BASE_URL}/fees`, {
            credentials: 'include'
        });
        const data = await response.json();

        if (data.success) {
            const tbody = document.querySelector('#feesTable tbody');
            tbody.innerHTML = '';

            if (!data.fees || data.fees.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: #999;">暂无费用记录</td></tr>';
                return;
            }

            data.fees.forEach(fee => {
                const type      = fee.type || fee.TYPE || '-';
                const amountRaw = (fee.amount !== undefined && fee.amount !== null)
                    ? fee.amount
                    : fee.AMOUNT;
                const amount    = amountRaw != null ? '¥' + amountRaw : '-';
                const month     = fee.feeMonth || fee.month || fee.fee_month || fee.FEE_MONTH || '-';
                const status    = fee.status || fee.STATUS || 'unpaid';
                const createdAt = fee.createdAt || fee.created_at || fee.CREATED_AT;
                const id        = fee.id || fee.ID;

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${type}</td>
                    <td>${amount}</td>
                    <td>${month}</td>
                    <td><span class="status-badge ${status}">${status === 'paid' ? '已缴' : '未缴'}</span></td>
                    <td>${formatDate(createdAt)}</td>
                    <td>
                        ${status === 'unpaid' ?
                    `<button class="btn-action btn-success" onclick="payFee(${id})">缴费</button>`
                    : '已缴费'}
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (error) {
        console.error('加载费用记录失败:', error);
    }
}


// 缴费
async function payFee(feeId) {
    if (!confirm('确认缴费？')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/fees/${feeId}/pay`, {
            method: 'PUT',
            credentials: 'include'
        });

        const data = await response.json();
        if (data.success) {
            alert('缴费成功');
            loadFees();
        } else {
            alert(data.message || '缴费失败');
        }
    } catch (error) {
        console.error('缴费失败:', error);
        alert('缴费失败');
    }
}

/// 加载报修记录（兼容大写字段）
async function loadRepairs() {
    try {
        const response = await fetch(`${API_BASE_URL}/repairs`, {
            credentials: 'include'
        });
        const data = await response.json();

        if (data.success) {
            const tbody = document.querySelector('#repairsTable tbody');
            tbody.innerHTML = '';

            if (!data.repairs || data.repairs.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: #999;">暂无报修记录</td></tr>';
                return;
            }

            data.repairs.forEach(repair => {
                const dorm        = repair.dorm || repair.DORM || '未分配宿舍';
                const repairType  = repair.repair_type || repair.REPAIR_TYPE || repair.type || repair.TYPE || '-';
                const description = repair.description || repair.DESCRIPTION || '未填写';
                const status      = repair.status || repair.STATUS || 'pending';
                const result      = repair.result || repair.RESULT || '-';
                const createdAt   = repair.createdAt || repair.created_at || repair.CREATED_AT;

                const statusText = {
                    pending: '待处理',
                    processing: '处理中',
                    completed: '已处理'
                };

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${dorm}</td>
                    <td>${repairType}</td>
                    <td>${description}</td>
                    <td><span class="status-badge ${status}">${statusText[status] || status}</span></td>
                    <td>${status === 'completed' ? '已处理' : result}</td>
                    <td>${formatDate(createdAt)}</td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (error) {
        console.error('加载报修记录失败:', error);
    }
}



// 显示报修Modal
function showRepairModal() {
    document.getElementById('repairModal').classList.add('active');
}

// 关闭Modal
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// 提交报修 - 添加报修类型
document.getElementById('repairForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const repairType = document.getElementById('repairType').value;
    const description = document.getElementById('repairDescription').value;

    try {
        const response = await fetch(`${API_BASE_URL}/repairs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ 
                type: repairType,
                description: description 
            })
        });

        const data = await response.json();
        if (data.success) {
            alert('报修申请已提交');
            closeModal('repairModal');
            loadRepairs();
            document.getElementById('repairForm').reset();
        } else {
            alert(data.message || '提交失败');
        }
    } catch (error) {
        console.error('提交报修失败:', error);
        alert('提交失败');
    }
});

// 退出登录
async function logout() {
    try {
        const response = await fetch(`${API_BASE_URL}/logout`, {
            method: 'POST',
            credentials: 'include'
        });

        const data = await response.json();
        if (data.success) {
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('退出失败:', error);
    }
}

// 格式化日期
function formatDate(dateStr) {
    if (!dateStr) return '-';
    try {
        const date = new Date(dateStr);
        return date.toLocaleString('zh-CN');
    } catch (e) {
        return dateStr;
    }
}

// 关闭modal点击外部
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
}

// ========== 个人信息编辑 ==========
function showEditProfileModal() {
    // 加载当前信息到表单
    document.getElementById('editName').value = document.getElementById('profileName').textContent;
    document.getElementById('editPhone').value = document.getElementById('profilePhone').textContent;
    document.getElementById('editProfileModal').classList.add('active');
}

document.getElementById('editProfileForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const profileData = {
        name: document.getElementById('editName').value,
        phone: document.getElementById('editPhone').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/profile/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(profileData)
        });

        const data = await response.json();
        if (data.success) {
            alert('个人信息更新成功');
            closeModal('editProfileModal');
            loadProfile();
        } else {
            alert(data.message || '更新失败');
        }
    } catch (error) {
        console.error('更新个人信息失败:', error);
        alert('更新失败');
    }
});

// ========== 宿舍浏览 ==========
async function loadAllDorms() {
    try {
        const response = await fetch(`${API_BASE_URL}/dorms`, {
            credentials: 'include'
        });
        const data = await response.json();

        if (data.success) {
            const tbody = document.querySelector('#allDormsTable tbody');
            tbody.innerHTML = '';

            if (!data.dorms || data.dorms.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: #999;">暂无宿舍信息</td></tr>';
                return;
            }

            data.dorms.forEach(dorm => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${dorm.building}</td>
                    <td>${dorm.roomNumber || dorm.room_number}</td>
                    <td>${dorm.beds}</td>
                    <td>${dorm.availableBeds || dorm.available_beds}</td>
                    <td>${dorm.facilities || '-'}</td>
                    <td>
                        <button class="btn-action btn-info" onclick="showDormDetailModal(${dorm.id})">查看详情</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (error) {
        console.error('加载宿舍列表失败:', error);
    }
}

// 显示宿舍详情Modal
async function showDormDetailModal(dormId) {
    try {
        const response = await fetch(`${API_BASE_URL}/dorms/${dormId}`, {
            credentials: 'include'
        });
        const data = await response.json();

        if (data.success && data.dorm) {
            const dorm = data.dorm;
            const content = document.getElementById('dormDetailContent');
            
            // 检查图片URL是否有效（必须以http开头）
            const hasValidImage = dorm.image && (dorm.image.startsWith('http://') || dorm.image.startsWith('https://'));
            
            content.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 20px;">
                    ${hasValidImage ? `
                        <div style="text-align: center;">
                            <img src="${dorm.image}" alt="宿舍图片" 
                                 style="max-width: 100%; max-height: 300px; border-radius: 12px; object-fit: cover;"
                                 onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                            <div style="display: none; padding: 40px; background: #f8f9fa; border-radius: 12px; color: #999;">
                                图片加载失败
                            </div>
                        </div>
                    ` : `
                        <div style="text-align: center; padding: 40px; background: #f8f9fa; border-radius: 12px; color: #999;">
                            暂无宿舍图片
                        </div>
                    `}
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                        <div style="padding: 15px; background: #f8f9fa; border-radius: 8px;">
                            <div style="color: #666; margin-bottom: 5px;">楼栋</div>
                            <div style="font-size: 18px; font-weight: bold;">${dorm.building}</div>
                        </div>
                        <div style="padding: 15px; background: #f8f9fa; border-radius: 8px;">
                            <div style="color: #666; margin-bottom: 5px;">房间号</div>
                            <div style="font-size: 18px; font-weight: bold;">${dorm.roomNumber || dorm.room_number}</div>
                        </div>
                        <div style="padding: 15px; background: #f8f9fa; border-radius: 8px;">
                            <div style="color: #666; margin-bottom: 5px;">总床位</div>
                            <div style="font-size: 18px; font-weight: bold;">${dorm.beds}</div>
                        </div>
                        <div style="padding: 15px; background: #f8f9fa; border-radius: 8px;">
                            <div style="color: #666; margin-bottom: 5px;">可用床位</div>
                            <div style="font-size: 18px; font-weight: bold; color: ${(dorm.availableBeds || dorm.available_beds) > 0 ? '#66bb6a' : '#f44336'};">
                                ${dorm.availableBeds || dorm.available_beds}
                            </div>
                        </div>
                    </div>
                    <div style="padding: 15px; background: #f8f9fa; border-radius: 8px;">
                        <div style="color: #666; margin-bottom: 10px;">设施配置</div>
                        <div style="font-size: 16px;">${dorm.facilities || '暂无设施信息'}</div>
                    </div>
                </div>
            `;
            document.getElementById('dormDetailModal').classList.add('active');
        }
    } catch (error) {
        console.error('加载宿舍详情失败:', error);
        alert('加载失败');
    }
}

// 页面加载时调用
document.addEventListener('DOMContentLoaded', function() {
    loadAllDorms();
});
