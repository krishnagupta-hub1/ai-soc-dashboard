// Mock Anomaly Detection Data
function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function ts(hoursBack = 48) {
  const now = Date.now();
  const past = now - hoursBack * 60 * 60 * 1000;
  return new Date(past + Math.random() * (now - past)).toISOString();
}

const attackCategories = [
  'Brute Force', 'Port Scan', 'SQL Injection', 'DDoS', 'Malware',
  'Privilege Escalation', 'Data Exfiltration', 'DNS Tunneling',
  'Credential Stuffing', 'Zero-Day Exploit', 'Normal',
];

const models = ['BERT-SOC', 'XGBoost', 'Ensemble'];

let anomId = 1;
export const mockAnomalies = Array.from({ length: 80 }, () => {
  const category = randomFrom(attackCategories);
  const isNormal = category === 'Normal';
  const confidence = isNormal
    ? Math.random() * 0.15 + 0.85
    : Math.random() * 0.35 + 0.62;
  const model = randomFrom(models);
  return {
    id: `ANOM-${String(anomId++).padStart(4, '0')}`,
    timestamp: ts(48),
    category,
    isAnomaly: !isNormal,
    confidence: parseFloat(confidence.toFixed(4)),
    model,
    sourceIp: `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
    logCount: Math.floor(Math.random() * 200 + 10),
    features: {
      requestRate: parseFloat((Math.random() * 1000).toFixed(1)),
      uniquePorts: Math.floor(Math.random() * 65535),
      payloadSize: Math.floor(Math.random() * 50000),
      errorRate: parseFloat((Math.random() * 100).toFixed(1)),
      entropy: parseFloat((Math.random() * 8).toFixed(3)),
    },
    classifications: attackCategories.slice(0, 5).reduce((acc, cat) => {
      acc[cat] = parseFloat((Math.random()).toFixed(4));
      return acc;
    }, {}),
    processingTime: parseFloat((Math.random() * 150 + 10).toFixed(1)),
    alertGenerated: !isNormal && confidence > 0.75,
  };
}).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

export const modelPerformance = {
  bert: {
    name: 'BERT-SOC Transformer',
    accuracy: 0.9743,
    precision: 0.9612,
    recall: 0.9821,
    f1: 0.9715,
    auc: 0.9934,
    latency: '45ms',
    status: 'Active',
  },
  xgboost: {
    name: 'XGBoost Classifier',
    accuracy: 0.9521,
    precision: 0.9388,
    recall: 0.9612,
    f1: 0.9498,
    auc: 0.9787,
    latency: '8ms',
    status: 'Active',
  },
  ensemble: {
    name: 'Ensemble Model',
    accuracy: 0.9812,
    precision: 0.9701,
    recall: 0.9886,
    f1: 0.9793,
    auc: 0.9956,
    latency: '53ms',
    status: 'Active',
  },
};

export const anomalyTimeline = Array.from({ length: 48 }, (_, i) => {
  const d = new Date();
  d.setHours(d.getHours() - (47 - i));
  return {
    time: `${String(d.getHours()).padStart(2,'0')}:00`,
    anomalies: Math.floor(Math.random() * 12),
    normal: Math.floor(Math.random() * 40 + 20),
    confidence: parseFloat((Math.random() * 0.2 + 0.78).toFixed(3)),
  };
});

export const categoryDistribution = [
  { name: 'Brute Force', count: 18, color: '#ff3366' },
  { name: 'Port Scan', count: 14, color: '#ffb800' },
  { name: 'SQL Injection', count: 11, color: '#a855f7' },
  { name: 'DDoS', count: 9, color: '#00d4ff' },
  { name: 'Malware', count: 8, color: '#00ff88' },
  { name: 'Data Exfiltration', count: 7, color: '#f97316' },
  { name: 'Normal', count: 13, color: '#64748b' },
];
