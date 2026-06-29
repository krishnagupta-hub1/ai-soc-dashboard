// Mock Alerts Data
const attackTypes = [
  'Brute Force', 'Port Scan', 'SQL Injection', 'XSS Attack', 'DDoS',
  'Privilege Escalation', 'Malware', 'Data Exfiltration', 'DNS Tunneling',
  'Ransomware', 'Phishing', 'Man-in-the-Middle', 'Zero-Day Exploit',
  'Credential Stuffing', 'Rootkit', 'Cryptojacking',
];

const analysts = ['Alice Chen', 'Bob Martinez', 'Carol Kim', 'David Singh', 'Eve Johnson', 'Unassigned'];
const statuses = ['Open', 'In Progress', 'Investigating', 'Resolved', 'Escalated', 'False Positive'];
const severities = ['Critical', 'High', 'Medium', 'Low'];

function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function ts(daysBack = 7) {
  const now = Date.now();
  const past = now - daysBack * 24 * 60 * 60 * 1000;
  return new Date(past + Math.random() * (now - past)).toISOString();
}

let alertId = 1;
export const mockAlerts = Array.from({ length: 120 }, () => {
  const severity = randomFrom(severities);
  const attack = randomFrom(attackTypes);
  const status = randomFrom(statuses);
  const analyst = randomFrom(analysts);
  const score = Math.floor(Math.random() * 40 + 60);
  const timestamp = ts(7);
  return {
    id: `ALERT-${String(alertId++).padStart(4, '0')}`,
    timestamp,
    severity,
    attackType: attack,
    status,
    analyst,
    confidenceScore: score,
    sourceIp: `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
    targetAsset: randomFrom(['Web Server 01', 'DB Server 02', 'Auth Service', 'API Gateway', 'Load Balancer', 'Admin Portal']),
    description: `${attack} detected with ${score}% confidence. Immediate investigation recommended.`,
    mitre: randomFrom(['T1110', 'T1046', 'T1190', 'T1059', 'T1486', 'T1021', 'T1078', 'T1566']),
    affectedSystems: Math.floor(Math.random() * 10 + 1),
    relatedLogs: Math.floor(Math.random() * 50 + 5),
    firstSeen: ts(14),
    lastSeen: timestamp,
    tags: [attack.toLowerCase().replace(' ', '-'), severity.toLowerCase()],
  };
}).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

export const alertSummary = {
  total: 120,
  open: mockAlerts.filter(a => a.status === 'Open').length,
  critical: mockAlerts.filter(a => a.severity === 'Critical').length,
  inProgress: mockAlerts.filter(a => a.status === 'In Progress').length,
  resolved: mockAlerts.filter(a => a.status === 'Resolved').length,
  falsePositive: mockAlerts.filter(a => a.status === 'False Positive').length,
  escalated: mockAlerts.filter(a => a.status === 'Escalated').length,
};

export const alertTrend = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  return {
    date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    critical: Math.floor(Math.random() * 8),
    high: Math.floor(Math.random() * 15),
    medium: Math.floor(Math.random() * 20),
    low: Math.floor(Math.random() * 25),
  };
});

export const attackDistribution = [
  { name: 'Brute Force', value: 22, color: '#ff3366' },
  { name: 'Port Scan', value: 18, color: '#ffb800' },
  { name: 'SQL Injection', value: 14, color: '#a855f7' },
  { name: 'DDoS', value: 12, color: '#00d4ff' },
  { name: 'Malware', value: 10, color: '#00ff88' },
  { name: 'Phishing', value: 9, color: '#f97316' },
  { name: 'XSS', value: 8, color: '#ec4899' },
  { name: 'Other', value: 7, color: '#64748b' },
];
