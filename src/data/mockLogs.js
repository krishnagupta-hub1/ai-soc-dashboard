// Mock Logs Data - 500+ entries
const sources = ['Apache Server', 'Nginx Server', 'Windows Auth', 'Cisco Firewall', 'AWS CloudTrail', 'MySQL DB', 'Redis Cache', 'Load Balancer', 'IDS/IPS', 'VPN Gateway'];
const severities = ['critical', 'high', 'medium', 'low', 'info'];
const eventTypes = ['Authentication', 'Network', 'System', 'Application', 'Database', 'Firewall'];
const messages = [
  'Failed login attempt from IP 192.168.1.105',
  'Port scan detected from 10.0.0.45',
  'SQL injection attempt blocked',
  'Unauthorized API access attempt',
  'Brute force attack detected - 500 attempts in 60s',
  'DDoS traffic spike detected - 50k req/s',
  'Privilege escalation attempt',
  'Malware signature detected in file upload',
  'Suspicious outbound connection to 185.220.101.45',
  'Buffer overflow attempt detected',
  'Cross-site scripting (XSS) payload blocked',
  'Directory traversal attempt blocked',
  'Unusual data exfiltration pattern detected',
  'SSH brute force from 103.24.77.88',
  'Rootkit signature detected on host',
  'Certificate validation failure',
  'Anomalous process execution detected',
  'Firewall rule violation - blocked TCP/443',
  'DNS tunneling attempt detected',
  'Crypto mining process detected',
  'Normal HTTP GET /api/users',
  'Successful authentication user@corp.com',
  'System backup completed successfully',
  'SSL certificate renewed',
  'Health check passed',
  'Config file updated by admin',
  'User session created - user123',
  'Normal database query executed',
  'Log rotation completed',
  'Service restarted successfully',
];

const ips = [
  '192.168.1.105', '10.0.0.45', '185.220.101.45', '103.24.77.88',
  '172.16.0.23', '10.10.10.5', '192.168.100.50', '45.33.32.156',
  '198.51.100.14', '203.0.113.42', '10.0.1.100', '172.31.0.5',
];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomTimestamp(daysBack = 7) {
  const now = Date.now();
  const past = now - daysBack * 24 * 60 * 60 * 1000;
  return new Date(past + Math.random() * (now - past));
}

let logId = 1;
export const mockLogs = Array.from({ length: 500 }, () => {
  const severity = randomFrom(severities);
  const source = randomFrom(sources);
  const type = randomFrom(eventTypes);
  const message = randomFrom(messages);
  const ip = randomFrom(ips);
  const ts = randomTimestamp(7);
  return {
    id: `LOG-${String(logId++).padStart(5, '0')}`,
    timestamp: ts.toISOString(),
    source,
    severity,
    type,
    message,
    sourceIp: ip,
    destIp: randomFrom(ips),
    port: Math.floor(Math.random() * 65535),
    protocol: randomFrom(['TCP', 'UDP', 'HTTP', 'HTTPS', 'SSH', 'FTP']),
    user: randomFrom(['admin', 'root', 'user123', 'john.doe', 'svc_account', 'anonymous', null]),
    bytes: Math.floor(Math.random() * 100000),
    duration: Math.floor(Math.random() * 5000),
    country: randomFrom(['US', 'CN', 'RU', 'DE', 'FR', 'BR', 'IN', 'GB', 'NL', 'KP']),
    rawLog: `[${ts.toISOString()}] ${source} - ${severity.toUpperCase()} - ${message} SrcIP=${ip}`,
  };
}).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

export const logStats = {
  total: 500,
  bySeverity: {
    critical: mockLogs.filter(l => l.severity === 'critical').length,
    high: mockLogs.filter(l => l.severity === 'high').length,
    medium: mockLogs.filter(l => l.severity === 'medium').length,
    low: mockLogs.filter(l => l.severity === 'low').length,
    info: mockLogs.filter(l => l.severity === 'info').length,
  },
  bySource: sources.map(s => ({ source: s, count: mockLogs.filter(l => l.source === s).length })),
  byType: eventTypes.map(t => ({ type: t, count: mockLogs.filter(l => l.type === t).length })),
};

export const logTrendData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2,'0')}:00`,
  critical: Math.floor(Math.random() * 15),
  high: Math.floor(Math.random() * 30),
  medium: Math.floor(Math.random() * 50),
  low: Math.floor(Math.random() * 80),
}));
