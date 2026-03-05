const API_BASE_URL = '/api';

document.addEventListener('DOMContentLoaded', () => {
    loadStatistics();
    loadNotices();
    loadActivities();
    loadDorms();
    loadAssignments();
    loadRepairs();
    loadFees();
    loadFeeStatistics();  // 加载费用统计
    loadViolations();     // 加载违规记录
    loadStudentsForDropdowns();
});

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

// ========== 统计数据 ==========
async function loadStatistics() {
    try {
        const response = await fetch(`${API_BASE_URL}/statistics`, {
            credentials: 'include'
        });
        const data = await response.json();

        if (data.success) {
            const stats = data.statistics;
            document.getElementById('totalStudents').textContent = stats.totalStudents || 0;
            document.getElementById('totalDorms').textContent = stats.totalDorms || 0;
            document.getElementById('availableBeds').textContent = stats.availableBeds || 0;
            document.getElementById('pendingRepairs').textContent = stats.pendingRepairs || 0;
        }
    } catch (error) {
        console.error('加载统计数据失败:', error);
    }
}

// ========== 公告管理 ==========
async function loadNotices() {
    try {
        const response = await fetch(`${API_BASE_URL}/notices/all`, {
            credentials: 'include'
        });
        const data = await response.json();

        if (data.success) {
            const tbody = document.querySelector('#noticesTable tbody');
            tbody.innerHTML = '';

            if (!data.notices || data.notices.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: #999;">暂无公告</td></tr>';
                return;
            }

            data.notices.forEach(notice => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${notice.title}</td>
                    <td>${notice.content.substring(0, 50)}...</td>
                    <td>${notice.type}</td>
                    <td>${notice.priority}</td>
                    <td>${formatDate(notice.createdAt || notice.created_at)}</td>
                    <td>
                        <button class="btn-action btn-info" onclick="deleteNotice(${notice.id})">删除</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (error) {
        console.error('加载公告失败:', error);
    }
}

function showAddNoticeModal() {
    document.getElementById('addNoticeModal').classList.add('active');
}

document.getElementById('addNoticeForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const noticeData = {
        title: document.getElementById('noticeTitle').value,
        content: document.getElementById('noticeContent').value,
        type: document.getElementById('noticeType').value,
        priority: document.getElementById('noticePriority').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/notices`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(noticeData)
        });

        const data = await response.json();
        if (data.success) {
            alert('公告发布成功');
            closeModal('addNoticeModal');
            loadNotices();
            e.target.reset();
        } else {
            alert(data.message || '发布失败');
        }
    } catch (error) {
        console.error('发布公告失败:', error);
        alert('发布失败');
    }
});

async function deleteNotice(id) {
    if (!confirm('确认删除此公告？')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/notices/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        const data = await response.json();
        if (data.success) {
            alert('删除成功');
            loadNotices();
        } else {
            alert(data.message || '删除失败');
        }
    } catch (error) {
        console.error('删除失败:', error);
        alert('删除失败');
    }
}

// ========== 活动管理 ==========
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
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${activity.title}</td>
                    <td>${activity.location || '-'}</td>
                    <td>${formatDate(activity.activityDate || activity.activity_date)}</td>
                    <td>${activity.currentParticipants || activity.current_participants || 0}/${activity.maxParticipants || activity.max_participants || 0}</td>
                    <td><span class="status-badge ${activity.status}">${activity.status === 'ongoing' ? '进行中' : '已结束'}</span></td>
                    <td>
                        <button class="btn-action btn-info" onclick="deleteActivity(${activity.id})">删除</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (error) {
        console.error('加载活动失败:', error);
    }
}

function showAddActivityModal() {
    document.getElementById('addActivityModal').classList.add('active');
}

document.getElementById('addActivityForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const activityData = {
        title: document.getElementById('activityTitle').value,
        description: document.getElementById('activityDescription').value,
        location: document.getElementById('activityLocation').value,
        activityDate: new Date(document.getElementById('activityDate').value),
        maxParticipants: parseInt(document.getElementById('activityMaxParticipants').value)
    };

    try {
        const response = await fetch(`${API_BASE_URL}/activities`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(activityData)
        });

        const data = await response.json();
        if (data.success) {
            alert('活动创建成功');
            closeModal('addActivityModal');
            loadActivities();
            e.target.reset();
        } else {
            alert(data.message || '创建失败');
        }
    } catch (error) {
        console.error('创建活动失败:', error);
        alert('创建失败');
    }
});

async function deleteActivity(id) {
    if (!confirm('确认删除此活动？')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/activities/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        const data = await response.json();
        if (data.success) {
            alert('删除成功');
            loadActivities();
        } else {
            alert(data.message || '删除失败');
        }
    } catch (error) {
        console.error('删除失败:', error);
        alert('删除失败');
    }
}

// ========== 宿舍管理 ==========
async function loadDorms() {
    try {
        const response = await fetch(`${API_BASE_URL}/dorms`, {
            credentials: 'include'
        });
        const data = await response.json();

        if (data.success) {
            const tbody = document.querySelector('#dormsTable tbody');
            tbody.innerHTML = '';

            if (!data.dorms || data.dorms.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: #999;">暂无宿舍</td></tr>';
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
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (error) {
        console.error('加载宿舍列表失败:', error);
    }
}

function showAddDormModal() {
    document.getElementById('addDormModal').classList.add('active');
}

document.getElementById('addDormForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const dormData = {
        building: document.getElementById('dormBuilding').value,
        roomNumber: document.getElementById('dormRoom').value,
        beds: parseInt(document.getElementById('dormBeds').value),
        facilities: document.getElementById('dormFacilities').value,
        image: document.getElementById('dormImage').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/dorms`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(dormData)
        });

        const data = await response.json();
        if (data.success) {
            alert('添加成功');
            closeModal('addDormModal');
            loadDorms();
            loadStatistics();
            e.target.reset();
        } else {
            alert(data.message || '添加失败');
        }
    } catch (error) {
        console.error('添加宿舍失败:', error);
        alert('添加失败');
    }
});

// ========== 宿舍分配 ==========
async function loadAssignments() {
    try {
        const response = await fetch(`${API_BASE_URL}/assignments`, {
            credentials: 'include'
        });
        const data = await response.json();

        if (data.success) {
            const tbody = document.querySelector('#assignmentsTable tbody');
            tbody.innerHTML = '';

            if (!data.assignments || data.assignments.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px; color: #999;">暂无分配记录</td></tr>';
                return;
            }

            data.assignments.forEach(assignment => {
                const studentName = assignment.studentName || assignment.student_name || assignment.STUDENT_NAME || '-';
                const studentId   = assignment.studentId   || assignment.student_id   || assignment.STUDENT_ID   || '-';
                const building    = assignment.building    || assignment.BUILDING    || '-';
                const roomNumber  = assignment.roomNumber  || assignment.room_number  || assignment.ROOM_NUMBER  || '-';
                const bedNumber   = assignment.bedNumber   || assignment.bed_number   || assignment.BED_NUMBER   || '-';
                const assignedAt  = assignment.assignedAt  || assignment.assigned_at  || assignment.ASSIGNED_AT;
                const status      = assignment.status      || assignment.STATUS       || 'ended';

                const tr = document.createElement('tr');
                tr.innerHTML = `
        <td>${studentName}</td>
        <td>${studentId}</td>
        <td>${building}</td>
        <td>${roomNumber}</td>
        <td>${bedNumber}</td>
        <td>${formatDate(assignedAt)}</td>
        <td>
            <span class="status-badge ${status}">
                ${status === 'active' ? '使用中' : '已结束'}
            </span>
        </td>
    `;
                tbody.appendChild(tr);
            });


        }
    } catch (error) {
        console.error('加载分配记录失败:', error);
    }
}

function showAssignModal() {
    document.getElementById('assignModal').classList.add('active');
    loadDormsForDropdown();
}

async function loadDormsForDropdown() {
    try {
        const response = await fetch(`${API_BASE_URL}/dorms`, {
            credentials: 'include'
        });
        const data = await response.json();

        if (data.success) {
            const select = document.getElementById('assignDorm');
            select.innerHTML = '<option value="">请选择宿舍</option>';

            data.dorms.forEach(dorm => {
                const availableBeds = dorm.availableBeds || dorm.available_beds || 0;
                if (availableBeds > 0) {
                    const option = document.createElement('option');
                    option.value = dorm.id;
                    option.textContent = `${dorm.building} - ${dorm.roomNumber || dorm.room_number} (剩余${availableBeds}床位)`;
                    select.appendChild(option);
                }
            });
        }
    } catch (error) {
        console.error('加载宿舍列表失败:', error);
    }
}

document.getElementById('assignForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const assignData = {
        userId: document.getElementById('assignStudent').value,
        dormId: document.getElementById('assignDorm').value,
        bedNumber: parseInt(document.getElementById('assignBed').value)
    };

    try {
        const response = await fetch(`${API_BASE_URL}/assignments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(assignData)
        });

        const data = await response.json();
        if (data.success) {
            alert('分配成功');
            closeModal('assignModal');
            loadAssignments();
            loadDorms();
            loadStatistics();
            e.target.reset();
        } else {
            alert(data.message || '分配失败');
        }
    } catch (error) {
        console.error('分配失败:', error);
        alert('分配失败');
    }
});

// ========== 报修管理 ==========
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
                tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px; color: #999;">暂无报修记录</td></tr>';
                return;
            }

            data.repairs.forEach(repair => {
                const tr = document.createElement('tr');
                const statusText = {
                    'pending': '待处理',
                    'processing': '处理中',
                    'completed': '已完成'
                };

                tr.innerHTML = `
                    <td>${repair.studentName || repair.student_name || '-'}</td>
                    <td>${repair.studentId || repair.student_id || '-'}</td>
                    <td>${repair.dorm || '-'}</td>
                    <td>${repair.description}</td>
                    <td><span class="status-badge ${repair.status}">${statusText[repair.status] || repair.status}</span></td>
                    <td>${formatDate(repair.createdAt || repair.created_at)}</td>
                    <td>
                        ${repair.status === 'pending' ? `
                            <button class="btn-action btn-success" onclick="updateRepairStatus(${repair.id}, 'processing')">处理中</button>
                            <button class="btn-action btn-info" onclick="updateRepairStatus(${repair.id}, 'completed')">完成</button>
                        ` : repair.status === 'processing' ? `
                            <button class="btn-action btn-info" onclick="updateRepairStatus(${repair.id}, 'completed')">完成</button>
                        ` : '-'}
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (error) {
        console.error('加载报修记录失败:', error);
    }
}

async function updateRepairStatus(id, status) {
    const statusText = { 'processing': '开始处理', 'completed': '标记完成' };
    if (!confirm(`确认${statusText[status]}？`)) return;

    try {
        const response = await fetch(`${API_BASE_URL}/repairs/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ status, result: status === 'completed' ? '已处理完成' : '正在处理中' })
        });

        const data = await response.json();
        if (data.success) {
            alert('状态更新成功');
            loadRepairs();
            loadStatistics();
        } else {
            alert(data.message || '更新失败');
        }
    } catch (error) {
        console.error('更新状态失败:', error);
        alert('更新失败');
    }
}


// ========== 费用管理 ==========
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
                tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px; color: #999;">暂无费用记录</td></tr>';
                return;
            }

            data.fees.forEach(fee => {
                const studentName = fee.studentName || fee.student_name || fee.STUDENT_NAME || '-';
                const studentId   = fee.studentId || fee.student_id || fee.STUDENT_ID || '-';
                const type        = fee.type || fee.TYPE || '-';
                const amountRaw   = (fee.amount !== undefined && fee.amount !== null)
                    ? fee.amount
                    : fee.AMOUNT;
                const amount      = amountRaw != null ? '¥' + amountRaw : '-';
                const month       = fee.feeMonth || fee.month || fee.fee_month || fee.FEE_MONTH || '-';
                const status      = fee.status || fee.STATUS || 'unpaid';
                const createdAt   = fee.createdAt || fee.created_at || fee.CREATED_AT;

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${studentName}</td>
                    <td>${studentId}</td>
                    <td>${type}</td>
                    <td>${amount}</td>
                    <td>${month}</td>
                    <td><span class="status-badge ${status}">${status === 'paid' ? '已缴' : '未缴'}</span></td>
                    <td>${formatDate(createdAt)}</td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (error) {
        console.error('加载费用记录失败:', error);
    }
}



function showAddFeeModal() {
    // 加载学生列表
    loadStudentsForDropdowns();
    document.getElementById('addFeeModal').classList.add('active');
}

document.getElementById('addFeeForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const feeData = {
        userId: document.getElementById('feeStudent').value,
        type: document.getElementById('feeType').value,
        amount: parseFloat(document.getElementById('feeAmount').value),
        month: document.getElementById('feeMonth').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/fees`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(feeData)
        });

        const data = await response.json();
        if (data.success) {
            alert('添加成功');
            closeModal('addFeeModal');
            loadFees();
            loadFeeStatistics(); // 更新费用统计
            e.target.reset();
        } else {
            alert(data.message || '添加失败');
        }
    } catch (error) {
        console.error('添加费用失败:', error);
        alert('添加失败');
    }
});

// 加载学生列表到下拉框
async function loadStudentsForDropdowns() {
    try {
        const response = await fetch(`${API_BASE_URL}/students`, {
            credentials: 'include'
        });
        const data = await response.json();

        if (data.success) {
            const assignSelect = document.getElementById('assignStudent');
            const feeSelect = document.getElementById('feeStudent');

            assignSelect.innerHTML = '<option value="">请选择学生</option>';
            feeSelect.innerHTML = '<option value="">请选择学生</option>';

            data.students.forEach(student => {
                const option1 = document.createElement('option');
                option1.value = student.id;
                option1.textContent = `${student.name} (${student.studentId || student.student_id})`;
                assignSelect.appendChild(option1);

                const option2 = document.createElement('option');
                option2.value = student.id;
                option2.textContent = `${student.name} (${student.studentId || student.student_id})`;
                feeSelect.appendChild(option2);
            });
        }
    } catch (error) {
        console.error('加载学生列表失败:', error);
    }
}

// ========== 通用函数 ==========
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

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

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
}

// ========== 违规管理 ==========
async function loadViolations() {
    try {
        const response = await fetch(`${API_BASE_URL}/violations`, {
            credentials: 'include'
        });
        const data = await response.json();

        if (data.success) {
            const tbody = document.querySelector('#violationsTable tbody');
            tbody.innerHTML = '';

            if (!data.violations || data.violations.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px; color: #999;">暂无违规记录</td></tr>';
                return;
            }

            data.violations.forEach(violation => {
                const violationId = violation.id || violation.ID;
                const studentName = violation.studentName || violation.student_name || violation.STUDENT_NAME || '-';
                const studentId   = violation.studentId   || violation.student_id   || violation.STUDENT_ID   || '-';
                const type        = violation.type        || violation.TYPE         || '-';
                const desc        = violation.description || violation.DESCRIPTION  || '-';
                const status      = violation.status      || violation.STATUS       || 'handled';
                const createdAt   = violation.createdAt   || violation.created_at   || violation.CREATED_AT;

                const tr = document.createElement('tr');
                tr.innerHTML = `
        <td>${studentName}</td>
        <td>${studentId}</td>
        <td>${type}</td>
        <td>${desc}</td>
        <td>
            <span class="status-badge ${status}">
                ${status === 'pending' ? '待处理' : '已处理'}
            </span>
        </td>
        <td>${formatDate(createdAt)}</td>
        <td>
            ${status === 'pending' ?
                    `<button class="btn-action btn-success" onclick="handleViolation(${violationId})">标记已处理</button>`
                    : '<span style="color: #28a745;">✓ 已处理</span>'}
        </td>
    `;
                tbody.appendChild(tr);
            });

        }
    } catch (error) {
        console.error('加载违规记录失败:', error);
    }
}

function showAddViolationModal() {
    // 加载学生列表
    loadStudentsForViolation();
    document.getElementById('addViolationModal').classList.add('active');
}

async function loadStudentsForViolation() {
    try {
        const response = await fetch(`${API_BASE_URL}/students`, {
            credentials: 'include'
        });
        const data = await response.json();

        if (data.success) {
            const select = document.getElementById('violationStudent');
            select.innerHTML = '<option value="">请选择学生</option>';

            data.students.forEach(student => {
                const option = document.createElement('option');
                option.value = student.id;
                option.textContent = `${student.name} (${student.studentId || student.student_id})`;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('加载学生列表失败:', error);
    }
}

document.getElementById('addViolationForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const violationData = {
        userId: document.getElementById('violationStudent').value,
        type: document.getElementById('violationType').value,
        description: document.getElementById('violationDescription').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/violations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(violationData)
        });

        const data = await response.json();
        if (data.success) {
            alert('违规记录添加成功');
            closeModal('addViolationModal');
            loadViolations();
            e.target.reset();
        } else {
            alert(data.message || '添加失败');
        }
    } catch (error) {
        console.error('添加违规记录失败:', error);
        alert('添加失败');
    }
});

async function handleViolation(id) {
    if (!confirm('确认标记为已处理？')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/violations/${id}/handle`, {
            method: 'PUT',
            credentials: 'include'
        });

        const data = await response.json();
        if (data.success) {
            alert('处理成功');
            loadViolations();
        } else {
            alert(data.message || '处理失败');
        }
    } catch (error) {
        console.error('处理失败:', error);
        alert('处理失败');
    }
}

// ========== 费用统计 ==========
async function loadFeeStatistics() {
    try {
        const response = await fetch(`${API_BASE_URL}/fees/statistics`, {
            credentials: 'include'
        });
        const data = await response.json();

        if (data.success) {
            const stats = data.statistics;
            document.getElementById('totalFeeAmount').textContent = `¥${stats.totalAmount || 0}`;
            document.getElementById('paidFeeAmount').textContent = `¥${stats.paidAmount || 0}`;
            document.getElementById('unpaidFeeAmount').textContent = `¥${stats.unpaidAmount || 0}`;

            const paymentRate = stats.totalAmount > 0
                ? ((stats.paidAmount / stats.totalAmount) * 100).toFixed(1)
                : 0;
            document.getElementById('feePaymentRate').textContent = `${paymentRate}%`;
        }
    } catch (error) {
        console.error('加载费用统计失败:', error);
    }
}

// 导出费用报表为CSV
async function exportFeeReport() {
    try {
        const response = await fetch(`${API_BASE_URL}/fees`, {
            credentials: 'include'
        });
        const data = await response.json();

        if (data.success && data.fees && data.fees.length > 0) {
            // 构建CSV内容
            let csvContent = '\uFEFF'; // BOM for UTF-8
            csvContent += '学生姓名,学号,费用类型,金额,月份,状态,创建时间\n';

            data.fees.forEach(fee => {
                const studentName = fee.student_name || fee.STUDENT_NAME || fee.studentName || '-';
                const studentId = fee.student_id || fee.STUDENT_ID || fee.studentId || '-';
                const type = fee.type || fee.TYPE || '-';
                const amount = fee.amount || fee.AMOUNT || 0;
                const month = fee.month || fee.MONTH || '-';
                const status = (fee.status || fee.STATUS) === 'paid' ? '已缴' : '未缴';
                const createdAt = formatDate(fee.created_at || fee.CREATED_AT || fee.createdAt);

                csvContent += `${studentName},${studentId},${type},¥${amount},${month},${status},${createdAt}\n`;
            });

            // 添加统计信息
            const statsResponse = await fetch(`${API_BASE_URL}/fees/statistics`, {
                credentials: 'include'
            });
            const statsData = await statsResponse.json();
            
            if (statsData.success) {
                const stats = statsData.statistics;
                csvContent += '\n统计信息\n';
                csvContent += `总收费金额,¥${stats.totalAmount || 0}\n`;
                csvContent += `已缴金额,¥${stats.paidAmount || 0}\n`;
                csvContent += `未缴金额,¥${stats.unpaidAmount || 0}\n`;
                const rate = stats.totalAmount > 0 ? ((stats.paidAmount / stats.totalAmount) * 100).toFixed(1) : 0;
                csvContent += `缴费率,${rate}%\n`;
            }

            // 创建下载
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `费用报表_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            alert('报表导出成功！');
        } else {
            alert('暂无费用数据可导出');
        }
    } catch (error) {
        console.error('导出报表失败:', error);
        alert('导出失败，请重试');
    }
}

// ========== 完整的报修管理功能 ==========

let currentRepairId = null;

// 加载报修列表 - 格式与违规管理完全一致
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
                tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 40px; color: #999;">暂无报修记录</td></tr>';
                return;
            }

            data.repairs.forEach(repair => {
                const repairId    = repair.id           || repair.ID           || 0;
                const studentName = repair.student_name || repair.STUDENT_NAME || '-';
                const studentId   = repair.student_id   || repair.STUDENT_ID   || '-';
                const dormInfo    = repair.dorm         || repair.DORM         || '未分配宿舍';
                const repairType  = repair.repair_type  || repair.REPAIR_TYPE  || '-';
                const description = repair.description  || repair.DESCRIPTION  || '-';
                const status      = repair.status       || repair.STATUS       || 'pending';
                const createdAt   = repair.created_at   || repair.CREATED_AT;

                const tr = document.createElement('tr');
                tr.innerHTML = `
        <td>${studentName}</td>
        <td>${studentId}</td>
        <td>${dormInfo}</td>
        <td>${repairType}</td>
        <td>${description}</td>
        <td>
            <span class="status-badge ${status}">
                ${status === 'pending' ? '待处理' : '已处理'}
            </span>
        </td>
        <td>${status === 'completed' ? '已处理' : '-'}</td>
        <td>${formatDate(createdAt)}</td>
        <td>
            ${status === 'pending' ?
                    `<button class="btn-action btn-success" onclick="handleRepair(${repairId})">处理</button>`
                    : '<span style="color: #28a745;">✓ 已处理</span>'}
        </td>
    `;
                tbody.appendChild(tr);
            });
        }
    } catch (error) {
        console.error('加载报修记录失败:', error);
    }
}

// 处理报修 - 直接标记为已处理
async function handleRepair(id) {
    if (!confirm('确认处理此报修申请？')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/repairs/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                status: 'completed',
                result: '已处理'
            })
        });

        const data = await response.json();
        if (data.success) {
            alert('处理成功');
            loadRepairs();
            loadStatistics();
        } else {
            alert(data.message || '处理失败');
        }
    } catch (error) {
        console.error('处理失败:', error);
        alert('处理失败');
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
