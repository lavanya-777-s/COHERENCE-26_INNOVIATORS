const fs = require('fs');

const csvData = fs.readFileSync('c:/LUMINA-AI/backend/data/budget_data.csv', 'utf8');
const lines = csvData.trim().split('\n').slice(1); // skip header

const country = {
  country: 'Kenya',
  currency: 'KSh',
  totalBudget: 0,
  states: [
    {
      id: 'ke-state',
      name: 'Kenya Provinces',
      allocation: 0,
      spent: 0,
      minister: 'Ministry of Finance',
      contact: 'finance@kenya.gov.ke',
      districts: []
    }
  ],
  departmentPercentages: {
    'Health': 0.25,
    'Education': 0.20,
    'Roads': 0.30,
    'Water': 0.15,
    'Agriculture': 0.10,
    'Others': 0.0
  },
  riskThresholds: {
    overestimate: { low: 0.05, medium: 0.15, high: 0.30 },
    underestimate: { low: 0.10, medium: 0.30, high: 0.50 }
  }
};

const districtsMap = {};
let totalAllocated = 0;
let totalSpent = 0;

for (const line of lines) {
  if (!line.trim()) continue;
  const [dept, districtName, projectName, allocatedStr, spentStr, month] = line.split(',');
  const allocated = parseInt(allocatedStr, 10);
  const spent = parseInt(spentStr, 10);
  
  totalAllocated += allocated;
  totalSpent += spent;

  if (!districtsMap[districtName]) {
    districtsMap[districtName] = {
      id: 'dist-' + districtName.toLowerCase(),
      name: districtName,
      allocation: 0,
      spent: 0,
      collector: 'Governor ' + districtName,
      contact: 'gov@' + districtName.toLowerCase() + '.go.ke',
      wards: [
        {
          id: 'ward-1-' + districtName.toLowerCase(),
          name: districtName + ' Central',
          allocation: 0,
          spent: 0,
          elected: 'Rep 1',
          voteShare: 55.0
        }
      ],
      departmentsMap: {}
    };
  }

  const dist = districtsMap[districtName];
  dist.allocation += allocated;
  dist.spent += spent;
  
  dist.wards[0].allocation += Math.floor(allocated * 0.4);
  dist.wards[0].spent += Math.floor(spent * 0.4);

  if (!dist.departmentsMap[dept]) {
    dist.departmentsMap[dept] = {
      id: 'dept-' + districtName.toLowerCase() + '-' + dept.toLowerCase(),
      name: dept,
      allocated: 0,
      spent: 0,
      projects: []
    };
  }

  const d = dist.departmentsMap[dept];
  d.allocated += allocated;
  d.spent += spent;
  
  const variance = spent - allocated;
  const isOver = variance > 0;
  
  d.projects.push({
    id: 'proj-' + Math.random().toString(36).substr(2, 9),
    name: projectName + ' (' + month + ')',
    allocated: allocated,
    spent: spent,
    status: (spent >= allocated && allocated > 0) ? 'completed' : 'ongoing',
    overestimate: isOver,
    variance: Math.abs(variance),
    timeline: month + ' 2024'
  });
}

// ADD MASSIVE INDIAN DATASET PROGRAMMATICALLY
const state = country.states[0];
state.allocation = totalAllocated;
state.spent = totalSpent;
country.totalBudget += totalAllocated * 1.5; 

for (const dName in districtsMap) {
  const dist = districtsMap[dName];
  const depts = [];
  for (const deptName in dist.departmentsMap) {
    depts.push(dist.departmentsMap[deptName]);
  }
  dist.departments = depts;
  delete dist.departmentsMap;
  state.districts.push(dist);
}

const indianStates = [
  { id: 'mh', name: 'Maharashtra', collectorPrefix: 'Shri.', minWards: 3 },
  { id: 'kn', name: 'Karnataka', collectorPrefix: 'Smt.', minWards: 4 },
  { id: 'gj', name: 'Gujarat', collectorPrefix: 'Shri.', minWards: 3 },
  { id: 'up', name: 'Uttar Pradesh', collectorPrefix: 'Dr.', minWards: 5 },
  { id: 'tn', name: 'Tamil Nadu', collectorPrefix: 'Thiru.', minWards: 4 },
  { id: 'rj', name: 'Rajasthan', collectorPrefix: 'Shri.', minWards: 2 },
  { id: 'wb', name: 'West Bengal', collectorPrefix: 'Smt.', minWards: 3 },
  { id: 'kl', name: 'Kerala', collectorPrefix: 'Dr.', minWards: 2 },
  { id: 'ap', name: 'Andhra Pradesh', collectorPrefix: 'Shri.', minWards: 3 }
];
const indianDistricts = ['Pune', 'Mumbai', 'Nagpur', 'Bangalore', 'Mysore', 'Ahmedabad', 'Surat', 'Lucknow', 'Kanpur', 'Chennai', 'Coimbatore', 'Jaipur', 'Kolkata', 'Kochi', 'Visakhapatnam'];
const departmentsList = ['Health', 'Education', 'Roads', 'Water', 'Agriculture', 'IT Infrastructure'];
const projectSuffixes = ['Phase 1', 'Renovation', 'Expansion', 'Procurement', 'Maintenance', 'Setup', 'Pilot', 'Audit'];

indianStates.forEach((st, sIdx) => {
  const stateObj = {
    id: st.id,
    name: st.name,
    allocation: 0,
    spent: 0,
    minister: 'Gov of ' + st.name,
    contact: 'contact@' + st.name.toLowerCase().replace(' ', '') + '.gov.in',
    districts: []
  };

  // Add 3-5 random districts to each state
  const distCount = Math.floor(Math.random() * 3) + 3;
  for (let d = 0; d < distCount; d++) {
    const distName = indianDistricts[(sIdx * 3 + d) % indianDistricts.length] + ' (Z' + d + ')';
    const distObj = {
      id: st.id + '-' + d,
      name: distName,
      allocation: 0,
      spent: 0,
      collector: st.collectorPrefix + ' Collector ' + distName.split(' ')[0],
      contact: 'dm@' + distName.toLowerCase().split(' ')[0] + '.nic.in',
      wards: [],
      departments: []
    };

    // Add Wards
    for (let w = 0; w < st.minWards; w++) {
      distObj.wards.push({
        id: 'w-' + distName.toLowerCase().split(' ')[0] + '-' + w,
        name: 'Ward ' + (w + 1),
        allocation: 0,
        spent: 0,
        elected: 'Corporator ' + (w + 1),
        voteShare: (40 + Math.random() * 20).toFixed(1)
      });
    }

    // Add Departments
    departmentsList.forEach(deptName => {
      const deptObj = {
        id: 'dept-' + st.id + '-' + d + '-' + deptName.toLowerCase(),
        name: deptName,
        allocated: 0,
        spent: 0,
        projects: []
      };

      // Massive Projects (3 to 6 per department per district)
      const projCount = Math.floor(Math.random() * 4) + 3;
      for (let p = 0; p < projCount; p++) {
        // Base allocation between 50L to 15Cr
        const rawAlloc = Math.floor(Math.random() * 150000000) + 5000000;
        
        // Randomize variance: 50% on track, 20% severely underestimated, 30% overestimated
        const roll = Math.random();
        let rawSpent = rawAlloc;
        if (roll < 0.20) rawSpent = rawAlloc * (1.1 + Math.random() * 0.5); // 10% to 60% over budget
        else if (roll > 0.70) rawSpent = rawAlloc * (0.4 + Math.random() * 0.5); // 10% to 60% under budget
        else rawSpent = rawAlloc * (0.9 + Math.random() * 0.2); // Within acceptable limits
        
        rawSpent = Math.floor(rawSpent);
        const pVariance = rawSpent - rawAlloc;

        deptObj.projects.push({
          id: 'proj-' + Math.random().toString(36).substr(2, 9),
          name: deptName + ' ' + projectSuffixes[Math.floor(Math.random() * projectSuffixes.length)],
          allocated: rawAlloc,
          spent: rawSpent,
          status: (rawSpent >= rawAlloc && rawAlloc > 0) ? 'completed' : 'ongoing',
          overestimate: pVariance > 0,
          variance: Math.abs(pVariance),
          timeline: ['Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024'][Math.floor(Math.random() * 5)]
        });

        deptObj.allocated += rawAlloc;
        deptObj.spent += rawSpent;
      }

      distObj.departments.push(deptObj);
      distObj.allocation += deptObj.allocated;
      distObj.spent += deptObj.spent;
      
      // Distribute district spent to wards arbitrarily
      distObj.wards.forEach(w => {
        w.allocation += Math.floor(deptObj.allocated / distObj.wards.length);
        w.spent += Math.floor(deptObj.spent / distObj.wards.length);
      });
    });

    stateObj.districts.push(distObj);
    stateObj.allocation += distObj.allocation;
    stateObj.spent += distObj.spent;
  }
  
  country.states.push(stateObj);
  country.totalBudget += stateObj.allocation;
});

const fileContent = `export const STATIC_DATA = ${JSON.stringify(country, null, 2)};

export const analyzeAnomalies = (item) => {
  const variance = item.spent - item.allocated;
  const variancePercent = item.allocated > 0 ? (variance / item.allocated) * 100 : 0;
  
  let type = 'normal';
  let risk = 'low';
  let alert = null;

  if (variancePercent > 30) {
    type = 'overestimate';
    risk = 'high';
    alert = \`🔴 CRITICAL: Overestimated by \${(variance/100000).toFixed(1)}L (\${variancePercent.toFixed(1)}%)\`;
  } else if (variancePercent > 15) {
    type = 'overestimate';
    risk = 'medium';
    alert = \`🟡 MAJOR: Overestimated by \${(variance/100000).toFixed(1)}L (\${variancePercent.toFixed(1)}%)\`;
  } else if (variancePercent > 5) {
    type = 'overestimate';
    risk = 'low';
    alert = \`🟠 MINOR: Overestimated by \${(variance/100000).toFixed(1)}L (\${variancePercent.toFixed(1)}%)\`;
  } else if (variancePercent < -50) {
    type = 'underestimate';
    risk = 'high';
    alert = \`🔴 CRITICAL: Underestimated by \${Math.abs(variance/100000).toFixed(1)}L (\${Math.abs(variancePercent).toFixed(1)}%)\`;
  } else if (variancePercent < -30) {
    type = 'underestimate';
    risk = 'medium';
    alert = \`🟡 MAJOR: Underestimated by \${Math.abs(variance/100000).toFixed(1)}L (\${Math.abs(variancePercent).toFixed(1)}%)\`;
  } else if (variancePercent < -10) {
    type = 'underestimate';
    risk = 'low';
    alert = \`🟠 MINOR: Underestimated by \${Math.abs(variance/100000).toFixed(1)}L (\${Math.abs(variancePercent).toFixed(1)}%)\`;
  }

  return {
    type,
    risk,
    alert,
    variance,
    variancePercent: Math.abs(variancePercent)
  };
};
`;

fs.writeFileSync('c:/LUMINA-AI/frontend/src/data/budgetStaticData.js', fileContent);
console.log('Done mapping CSV and massive dummy data to JS obj format!');
console.log('Done mapping CSV to JS obj format!');
