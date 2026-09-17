const express = require('express');
const User = require('../models/User');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/dashboard/employee
// @desc    Get employee specific dashboard data (Accessible by employee & manager)
router.get('/employee', verifyToken, async (req, res) => {
  try {
    const userRole = req.user.role;

    return res.json({
      success: true,
      role: userRole,
      data: {
        welcomeMessage: `Welcome to the Employee Portal, ${req.user.name}!`,
        assignedProjects: [
          { id: 'PRJ-101', title: 'Internal Tool Optimization', priority: 'High', status: 'In Progress' },
          { id: 'PRJ-104', title: 'MongoDB Auth Module Refactor', priority: 'Medium', status: 'Review' },
          { id: 'PRJ-108', title: 'Q3 Quality Assurance Sprint', priority: 'Low', status: 'Pending' },
        ],
        recentAnnouncements: [
          { id: 1, title: 'Company All-Hands Meeting', date: 'Sept 25, 2026', author: 'Leadership Team' },
          { id: 2, title: 'New Employee Benefits Update', date: 'Sept 20, 2026', author: 'HR Dept' },
        ],
        attendanceStatus: 'Active - Clocked In (09:00 AM)',
      },
    });
  } catch (error) {
    console.error('Employee dashboard error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving employee data.' });
  }
});

// @route   GET /api/dashboard/manager
// @desc    Get manager specific dashboard data & team members (Only accessible by manager)
router.get('/manager', verifyToken, requireRole('manager'), async (req, res) => {
  try {
    // Fetch all registered users from MongoDB
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    const totalUsers = users.length;
    const employeeCount = users.filter((u) => u.role === 'employee').length;
    const managerCount = users.filter((u) => u.role === 'manager').length;

    return res.json({
      success: true,
      role: req.user.role,
      data: {
        welcomeMessage: `Executive Manager Control Center - Hello, ${req.user.name}`,
        stats: {
          totalUsers,
          employeeCount,
          managerCount,
          activeProjects: 8,
          pendingApprovals: 3,
        },
        teamMembers: users,
        managerAlerts: [
          { id: 1, message: '3 Timesheet approvals awaiting review', severity: 'warning' },
          { id: 2, message: 'Quarterly performance appraisal cycle open', severity: 'info' },
        ],
      },
    });
  } catch (error) {
    console.error('Manager dashboard error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving manager data.' });
  }
});

module.exports = router;
