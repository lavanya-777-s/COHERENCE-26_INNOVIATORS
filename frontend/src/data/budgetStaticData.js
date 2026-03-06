export const STATIC_DATA = {
  country: 'India',
  currency: '₹',
  totalBudget: 2500000000000, // 25 lakh crore
  
  states: [
    {
      id: 'mh',
      name: 'Maharashtra',
      allocation: 250000000000, // 2.5 lakh crore
      spent: 180000000000,
      minister: 'Devendra Fadnavis',
      contact: 'devendra@maharashtra.gov.in',
      districts: [
        {
          id: 'mh-pune',
          name: 'Pune',
          allocation: 50000000000,
          spent: 38000000000,
          collector: 'Dr. Suhas Divase',
          contact: 'collector@pune.gov.in',
          wards: [
            {
              id: 'pune-w1',
              name: 'Pune Ward 1 (Kothrud)',
              allocation: 2500000000,
              spent: 2100000000,
              elected: 'Mukta Tilak (INC)',
              voteShare: 54.3
            },
            {
              id: 'pune-w2',
              name: 'Pune Ward 2 (Dhankawadi)',
              allocation: 2800000000,
              spent: 1200000000,
              elected: 'Yogesh Gaikwad (BJP)',
              voteShare: 51.2
            }
          ],
          departments: [
            {
              id: 'mh-pune-health',
              name: 'Health',
              allocated: 6000000000,
              spent: 5800000000,
              projects: [
                {
                  id: 'proj-1',
                  name: 'Hospital Renovation',
                  allocated: 2000000000,
                  spent: 2100000000,
                  status: 'completed',
                  overestimate: true,
                  variance: 100000000,
                  timeline: 'Jan 2024 - Dec 2024'
                },
                {
                  id: 'proj-2',
                  name: 'Medical Equipment Purchase',
                  allocated: 2000000000,
                  spent: 1800000000,
                  status: 'completed',
                  overestimate: false,
                  variance: -200000000,
                  timeline: 'Feb 2024 - Nov 2024'
                }
              ]
            },
            {
              id: 'mh-pune-education',
              name: 'Education',
              allocated: 9000000000,
              spent: 6000000000,
              projects: [
                {
                  id: 'proj-3',
                  name: 'School Construction',
                  allocated: 3000000000,
                  spent: 1500000000,
                  status: 'pending',
                  overestimate: false,
                  variance: -1500000000,
                  timeline: 'Mar 2024 - Dec 2025'
                }
              ]
            },
            {
              id: 'mh-pune-roads',
              name: 'Roads & Infrastructure',
              allocated: 12000000000,
              spent: 14500000000,
              projects: [
                {
                  id: 'proj-4',
                  name: 'Highway Expansion',
                  allocated: 8000000000,
                  spent: 10200000000,
                  status: 'ongoing',
                  overestimate: true,
                  variance: 2200000000,
                  timeline: 'Jan 2024 - Jun 2025'
                }
              ]
            },
            {
              id: 'mh-pune-water',
              name: 'Water & Sanitation',
              allocated: 5000000000,
              spent: 4200000000,
              projects: []
            },
            {
              id: 'mh-pune-agriculture',
              name: 'Agriculture',
              allocated: 3000000000,
              spent: 1800000000,
              projects: []
            }
          ]
        },
        {
          id: 'mh-nagpur',
          name: 'Nagpur',
          allocation: 40000000000,
          spent: 35000000000,
          collector: 'Rajendra Garue',
          contact: 'collector@nagpur.gov.in',
          wards: [
            {
              id: 'nagpur-w1',
              name: 'Nagpur Ward 1',
              allocation: 2000000000,
              spent: 1800000000,
              elected: 'Ameya Khare (BJP)',
              voteShare: 58.5
            }
          ],
          departments: [
            {
              id: 'mh-nagpur-health',
              name: 'Health',
              allocated: 4800000000,
              spent: 4200000000,
              projects: []
            }
          ]
        }
      ]
    },
    {
      id: 'kn',
      name: 'Karnataka',
      allocation: 200000000000,
      spent: 150000000000,
      minister: 'Siddaramaiah',
      contact: 'siddaramaiah@karnataka.gov.in',
      districts: [
        {
          id: 'kn-bangalore',
          name: 'Bangalore',
          allocation: 100000000000,
          spent: 75000000000,
          collector: 'Rakesh Singh',
          contact: 'collector@bangalore.gov.in',
          wards: [
            {
              id: 'blr-w1',
              name: 'Bangalore Central',
              allocation: 5000000000,
              spent: 4000000000,
              elected: 'Rajeev Chandrasekhar (BJP)',
              voteShare: 48.2
            }
          ],
          departments: [
            {
              id: 'kn-blr-health',
              name: 'Health',
              allocated: 12000000000,
              spent: 10000000000,
              projects: []
            },
            {
              id: 'kn-blr-education',
              name: 'Education',
              allocated: 18000000000,
              spent: 15000000000,
              projects: []
            }
          ]
        }
      ]
    }
  ],

  // Parliamentary standard allocation percentages
  departmentPercentages: {
    'Health': 0.12,
    'Education': 0.18,
    'Roads & Infrastructure': 0.25,
    'Water & Sanitation': 0.15,
    'Agriculture': 0.10,
    'Others': 0.20
  },

  // Risk scoring thresholds
  riskThresholds: {
    overestimate: { low: 0.05, medium: 0.15, high: 0.30 },
    underestimate: { low: 0.10, medium: 0.30, high: 0.50 }
  }
};

// Calculate anomalies
export const analyzeAnomalies = (item) => {
  const variance = item.spent - item.allocated;
  const variancePercent = (variance / item.allocated) * 100;
  
  let type = 'normal';
  let risk = 'low';
  let alert = null;

  if (variancePercent > 30) {
    type = 'overestimate';
    risk = 'high';
    alert = `🔴 CRITICAL: Overestimated by ₹${(variance/10000000).toFixed(1)} Cr (${variancePercent.toFixed(1)}%)`;
  } else if (variancePercent > 15) {
    type = 'overestimate';
    risk = 'medium';
    alert = `🟡 MAJOR: Overestimated by ₹${(variance/10000000).toFixed(1)} Cr (${variancePercent.toFixed(1)}%)`;
  } else if (variancePercent > 5) {
    type = 'overestimate';
    risk = 'low';
    alert = `🟠 MINOR: Overestimated by ₹${(variance/10000000).toFixed(1)} Cr (${variancePercent.toFixed(1)}%)`;
  } else if (variancePercent < -50) {
    type = 'underestimate';
    risk = 'high';
    alert = `🔴 CRITICAL: Underestimated by ₹${Math.abs(variance/10000000).toFixed(1)} Cr (${Math.abs(variancePercent).toFixed(1)}%)`;
  } else if (variancePercent < -30) {
    type = 'underestimate';
    risk = 'medium';
    alert = `🟡 MAJOR: Underestimated by ₹${Math.abs(variance/10000000).toFixed(1)} Cr (${Math.abs(variancePercent).toFixed(1)}%)`;
  } else if (variancePercent < -10) {
    type = 'underestimate';
    risk = 'low';
    alert = `🟠 MINOR: Underestimated by ₹${Math.abs(variance/10000000).toFixed(1)} Cr (${Math.abs(variancePercent).toFixed(1)}%)`;
  }

  return {
    type,
    risk,
    alert,
    variance,
    variancePercent: Math.abs(variancePercent)
  };
};