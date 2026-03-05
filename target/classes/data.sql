-- 插入默认管理员账号
-- 用户名: admin
-- 密码: admin123
INSERT INTO sys_user (username, password, name, role) 
SELECT 'admin', '$2a$ADMIN$admin123', '系统管理员', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM sys_user WHERE username = 'admin');

-- 插入测试学生数据
INSERT INTO sys_user (username, password, name, student_id, phone, role)
SELECT 'hongxiang', 'ENCODED_password123', '洪翔翔', '2333233022', '15545981139', 'student'
WHERE NOT EXISTS (SELECT 1 FROM sys_user WHERE username = 'hongxiang');

INSERT INTO sys_user (username, password, name, student_id, phone, role)
SELECT 'zhangsan', 'ENCODED_123456', '张三', '2023001001', '13800138001', 'student'
WHERE NOT EXISTS (SELECT 1 FROM sys_user WHERE username = 'zhangsan');

INSERT INTO sys_user (username, password, name, student_id, phone, role)
SELECT 'lisi', 'ENCODED_123456', '李四', '2023001002', '13800138002', 'student'
WHERE NOT EXISTS (SELECT 1 FROM sys_user WHERE username = 'lisi');

INSERT INTO sys_user (username, password, name, student_id, phone, role)
SELECT 'wangwu', 'ENCODED_123456', '王五', '2023001003', '13800138003', 'student'
WHERE NOT EXISTS (SELECT 1 FROM sys_user WHERE username = 'wangwu');

-- 插入测试宿舍数据（包含SVG格式图片）
INSERT INTO dorm (building, room_number, beds, available_beds, facilities, image, created_at)
SELECT '1号楼', '101', 4, 1, '独立卫生间、空调、热水器、书桌', 
       'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=''http://www.w3.org/2000/svg'' width=''400'' height=''300''%3E%3Crect width=''400'' height=''300'' fill=''%23667eea''/%3E%3Ctext x=''50%25'' y=''50%25'' font-size=''32'' fill=''white'' text-anchor=''middle'' dy=''.3em''%3E1-101%3C/text%3E%3C/svg%3E', 
       NOW()
WHERE NOT EXISTS (SELECT 1 FROM dorm WHERE building = '1号楼' AND room_number = '101');

INSERT INTO dorm (building, room_number, beds, available_beds, facilities, image, created_at)
SELECT '1号楼', '102', 4, 4, '独立卫生间、空调、热水器、书桌、阳台', 
       'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=''http://www.w3.org/2000/svg'' width=''400'' height=''300''%3E%3Crect width=''400'' height=''300'' fill=''%23f5576c''/%3E%3Ctext x=''50%25'' y=''50%25'' font-size=''32'' fill=''white'' text-anchor=''middle'' dy=''.3em''%3E1-102%3C/text%3E%3C/svg%3E', 
       NOW()
WHERE NOT EXISTS (SELECT 1 FROM dorm WHERE building = '1号楼' AND room_number = '102');

INSERT INTO dorm (building, room_number, beds, available_beds, facilities, image, created_at)
SELECT '1号楼', '201', 6, 6, '公共卫生间、空调、书桌', 
       'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=''http://www.w3.org/2000/svg'' width=''400'' height=''300''%3E%3Crect width=''400'' height=''300'' fill=''%234facfe''/%3E%3Ctext x=''50%25'' y=''50%25'' font-size=''32'' fill=''white'' text-anchor=''middle'' dy=''.3em''%3E1-201%3C/text%3E%3C/svg%3E', 
       NOW()
WHERE NOT EXISTS (SELECT 1 FROM dorm WHERE building = '1号楼' AND room_number = '201');

INSERT INTO dorm (building, room_number, beds, available_beds, facilities, image, created_at)
SELECT '2号楼', '101', 4, 4, '独立卫生间、空调、热水器、书桌、衣柜', 
       'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=''http://www.w3.org/2000/svg'' width=''400'' height=''300''%3E%3Crect width=''400'' height=''300'' fill=''%2343e97b''/%3E%3Ctext x=''50%25'' y=''50%25'' font-size=''32'' fill=''white'' text-anchor=''middle'' dy=''.3em''%3E2-101%3C/text%3E%3C/svg%3E', 
       NOW()
WHERE NOT EXISTS (SELECT 1 FROM dorm WHERE building = '2号楼' AND room_number = '101');

INSERT INTO dorm (building, room_number, beds, available_beds, facilities, image, created_at)
SELECT '2号楼', '102', 4, 4, '独立卫生间、空调、热水器、书桌', 
       'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=''http://www.w3.org/2000/svg'' width=''400'' height=''300''%3E%3Crect width=''400'' height=''300'' fill=''%23ffa726''/%3E%3Ctext x=''50%25'' y=''50%25'' font-size=''32'' fill=''white'' text-anchor=''middle'' dy=''.3em''%3E2-102%3C/text%3E%3C/svg%3E', 
       NOW()
WHERE NOT EXISTS (SELECT 1 FROM dorm WHERE building = '2号楼' AND room_number = '102');

INSERT INTO dorm (building, room_number, beds, available_beds, facilities, image, created_at)
SELECT '3号楼', '301', 6, 6, '独立卫生间、空调、热水器、书桌、阳台', 
       'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=''http://www.w3.org/2000/svg'' width=''400'' height=''300''%3E%3Crect width=''400'' height=''300'' fill=''%23964ba2''/%3E%3Ctext x=''50%25'' y=''50%25'' font-size=''32'' fill=''white'' text-anchor=''middle'' dy=''.3em''%3E3-301%3C/text%3E%3C/svg%3E', 
       NOW()
WHERE NOT EXISTS (SELECT 1 FROM dorm WHERE building = '3号楼' AND room_number = '301');

-- 多分配几个学生到宿舍
INSERT INTO assignment (user_id, dorm_id, bed_number, status, assigned_at)
SELECT u.id, d.id, 1, 'active', NOW()
FROM sys_user u, dorm d
WHERE u.username = 'hongxiang' 
  AND d.building = '1号楼' 
  AND d.room_number = '101'
  AND NOT EXISTS (SELECT 1 FROM assignment a WHERE a.user_id = u.id AND a.status = 'active');

INSERT INTO assignment (user_id, dorm_id, bed_number, status, assigned_at)
SELECT u.id, d.id, 2, 'active', NOW()
FROM sys_user u, dorm d
WHERE u.username = 'zhangsan' 
  AND d.building = '1号楼' 
  AND d.room_number = '101'
  AND NOT EXISTS (SELECT 1 FROM assignment a WHERE a.user_id = u.id AND a.status = 'active');

INSERT INTO assignment (user_id, dorm_id, bed_number, status, assigned_at)
SELECT u.id, d.id, 3, 'active', NOW()
FROM sys_user u, dorm d
WHERE u.username = 'lisi' 
  AND d.building = '1号楼' 
  AND d.room_number = '101'
  AND NOT EXISTS (SELECT 1 FROM assignment a WHERE a.user_id = u.id AND a.status = 'active');

-- 插入示例公告
INSERT INTO sys_notice (title, content, type, priority, created_at)
SELECT '欢迎使用宿舍管理系统', '这是一个测试公告，欢迎大家使用本系统。系统提供宿舍管理、报修申请、费用查询等功能。', 
       '通知', 'high', NOW()
WHERE NOT EXISTS (SELECT 1 FROM sys_notice WHERE title = '欢迎使用宿舍管理系统');

INSERT INTO sys_notice (title, content, type, priority, created_at)
SELECT '宿舍卫生检查通知', '各位同学请注意，本周五将进行宿舍卫生检查，请大家做好准备。', 
       '活动', 'medium', NOW()
WHERE NOT EXISTS (SELECT 1 FROM sys_notice WHERE title = '宿舍卫生检查通知');

-- 插入示例活动
INSERT INTO sys_activity (title, description, location, activity_date, max_participants, current_participants, status, created_at)
SELECT '宿舍文化节', '展示各宿舍特色文化，增进同学友谊', '学生活动中心', 
       DATEADD('DAY', 7, NOW()), 100, 0, 'ongoing', NOW()
WHERE NOT EXISTS (SELECT 1 FROM sys_activity WHERE title = '宿舍文化节');

INSERT INTO sys_activity (title, description, location, activity_date, max_participants, current_participants, status, created_at)
SELECT '消防安全演练', '提高学生消防安全意识和应急处理能力', '各宿舍楼', 
       DATEADD('DAY', 3, NOW()), 200, 0, 'ongoing', NOW()
WHERE NOT EXISTS (SELECT 1 FROM sys_activity WHERE title = '消防安全演练');

-- 插入测试违规记录
INSERT INTO violation (user_id, type, description, status, created_at)
SELECT u.id, '晚归', '23:30回宿舍，违反宿舍管理规定', 'pending', NOW()
FROM sys_user u
WHERE u.username = 'hongxiang'
AND NOT EXISTS (SELECT 1 FROM violation v WHERE v.user_id = u.id AND v.type = '晚归');

INSERT INTO violation (user_id, type, description, status, created_at)
SELECT u.id, '噪音', '深夜大声喧哗，影响他人休息', 'pending', NOW()
FROM sys_user u
WHERE u.username = 'zhangsan'
AND NOT EXISTS (SELECT 1 FROM violation v WHERE v.user_id = u.id AND v.type = '噪音');

-- 插入测试费用记录
INSERT INTO fee (user_id, type, amount, status, fee_month, created_at)
SELECT u.id, '水费', 50.00, 'unpaid', '2025-01', NOW()
FROM sys_user u
WHERE u.username = 'hongxiang'
AND NOT EXISTS (SELECT 1 FROM fee f WHERE f.user_id = u.id AND f.type = '水费');

INSERT INTO fee (user_id, type, amount, status, fee_month, created_at)
SELECT u.id, '电费', 80.00, 'unpaid', '2025-01', NOW()
FROM sys_user u
WHERE u.username = 'hongxiang'
AND NOT EXISTS (SELECT 1 FROM fee f WHERE f.user_id = u.id AND f.type = '电费' AND f.fee_month = '2025-01');

INSERT INTO fee (user_id, type, amount, status, fee_month, created_at)
SELECT u.id, '电费', 75.00, 'unpaid', '2025-01', NOW()
FROM sys_user u
WHERE u.username = 'zhangsan'
AND NOT EXISTS (SELECT 1 FROM fee f WHERE f.user_id = u.id AND f.type = '电费');

-- 插入测试报修记录
INSERT INTO repair (user_id, dorm_id, description, status, created_at)
SELECT u.id, a.dorm_id, '水龙头漏水，需要维修', 'pending', NOW()
FROM sys_user u
JOIN assignment a ON u.id = a.user_id AND a.status = 'active'
WHERE u.username = 'hongxiang'
AND NOT EXISTS (SELECT 1 FROM repair r WHERE r.user_id = u.id AND r.description LIKE '%水龙头%');
