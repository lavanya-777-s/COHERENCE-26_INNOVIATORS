// backend/routes/budget.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const router = express.Router();

// Helper: Parse CSV
function parseCSV() {
  return new Promise((resolve, reject) => {
    const results = [];
    const csvPath = path.join(__dirname, '../data/budget_data.csv');
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => results.push(row))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

// @route GET /api/budget/summary
// @desc  Total budget, spent, remaining, anomalies
router.get('/summary', async (req, res) => {
  try {
    const data = await parseCSV();

    let totalAllocated = 0;
    let totalSpent = 0;
    let atRisk = 0;

    data.forEach(row => {
      const allocated = parseFloat(row.budget_allocated) || 0;
      const spent = parseFloat(row.amount_spent) || 0;
      totalAllocated += allocated;
      totalSpent += spent;
      // Anomaly: spent > allocated (leakage!)
      if (spent > allocated) {
        atRisk += (spent - allocated);
      }
    });

    res.json({
      totalBudget: Math.round(totalAllocated / 100000), // convert to lakhs
      allocated: Math.round(totalAllocated / 100000),
      spent: Math.round(totalSpent / 100000),
      atRisk: Math.round(atRisk / 100000),
      utilizationRate: Math.round((totalSpent / totalAllocated) * 100)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route GET /api/budget/departments
// @desc  Department wise breakdown with risk score
router.get('/departments', async (req, res) => {
  try {
    const data = await parseCSV();

    // Group by department
    const deptMap = {};
    data.forEach(row => {
      const dept = row.department;
      const allocated = parseFloat(row.budget_allocated) || 0;
      const spent = parseFloat(row.amount_spent) || 0;

      if (!deptMap[dept]) {
        deptMap[dept] = { allocated: 0, spent: 0 };
      }
      deptMap[dept].allocated += allocated;
      deptMap[dept].spent += spent;
    });

    const departments = Object.entries(deptMap).map(([name, vals]) => {
      const overSpent = vals.spent > vals.allocated;
      const underUtilized = vals.spent < vals.allocated * 0.3;

      // Risk Score Logic
      let riskScore = 1;
      if (overSpent) riskScore = Math.min(10, Math.round((vals.spent / vals.allocated) * 5));
      else if (underUtilized) riskScore = 6;

      return {
        name,
        budget: Math.round(vals.allocated / 100000),
        spent: Math.round(vals.spent / 100000),
        percentage: Math.round((vals.spent / vals.allocated) * 100),
        riskScore,
        status: overSpent ? 'anomaly' : underUtilized ? 'warning' : 'normal'
      };
    });

    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route GET /api/budget/anomalies
// @desc  Transactions where spent > allocated (leakage detected)
router.get('/anomalies', async (req, res) => {
  try {
    const data = await parseCSV();

    const anomalies = data
      .filter(row => parseFloat(row.amount_spent) > parseFloat(row.budget_allocated))
      .map(row => {
        const allocated = parseFloat(row.budget_allocated);
        const spent = parseFloat(row.amount_spent);
        const overBy = spent - allocated;
        const riskScore = Math.min(10, parseFloat(((spent / allocated) * 5).toFixed(1)));

        return {
          department: row.department,
          district: row.district,
          project: row.project_name,
          month: row.month,
          allocated: Math.round(allocated / 1000),
          spent: Math.round(spent / 1000),
          overBy: Math.round(overBy / 1000),
          riskScore,
          reason: `Overspent by ₹${Math.round(overBy / 1000)}K (${Math.round((overBy / allocated) * 100)}% over budget)`
        };
      });

    res.json(anomalies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route GET /api/budget/public
// @desc  Public citizen dashboard data
router.get('/public', async (req, res) => {
  try {
    const data = await parseCSV();

    let totalAllocated = 0;
    let totalSpent = 0;
    const deptMap = {};

    data.forEach(row => {
      const allocated = parseFloat(row.budget_allocated) || 0;
      const spent = parseFloat(row.amount_spent) || 0;
      totalAllocated += allocated;
      totalSpent += spent;

      if (!deptMap[row.department]) {
        deptMap[row.department] = { allocated: 0, spent: 0 };
      }
      deptMap[row.department].allocated += allocated;
      deptMap[row.department].spent += spent;
    });

    const departments = Object.entries(deptMap).map(([name, vals]) => ({
      name,
      allocated: Math.round(vals.allocated / 100000),
      spent: Math.round(vals.spent / 100000),
      percentage: Math.round((vals.spent / vals.allocated) * 100)
    }));

    // Leakages for public view (simplified)
    const leakages = data
      .filter(row => parseFloat(row.amount_spent) > parseFloat(row.budget_allocated))
      .slice(0, 5)
      .map(row => ({
        department: row.department,
        project: row.project_name,
        amount: Math.round((parseFloat(row.amount_spent) - parseFloat(row.budget_allocated)) / 1000),
        risk: parseFloat(row.amount_spent) > parseFloat(row.budget_allocated) * 1.3 ? 'High' : 'Medium'
      }));

    res.json({
      totalBudget: Math.round(totalAllocated / 100000),
      spent: Math.round(totalSpent / 100000),
      utilizationRate: Math.round((totalSpent / totalAllocated) * 100),
      departments,
      leakages
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;