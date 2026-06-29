// Mock Root Cause Analysis Data

export const rcaIncidents = [
  {
    id: 'INC-2026-0041',
    alertId: 'ALERT-0032',
    title: 'Brute Force Attack Leading to Credential Compromise',
    attackType: 'Brute Force + Credential Theft',
    severity: 'Critical',
    timestamp: '2026-06-29T18:45:00Z',
    status: 'Investigating',
    confidence: 0.94,
    rootCause: `The attack originated from a botnet of 47 IP addresses across Russia and China. The threat actor automated password spraying against the VPN gateway using a list of 2.3 million credentials obtained from the RockYou2024 breach database. 

The attack succeeded due to three compounding vulnerabilities:
1. Multi-factor authentication was not enforced on the VPN service
2. Account lockout policy allowed 500 attempts before triggering
3. The affected user "jdoe@corp.com" was using a password matching the breach database

After successful authentication at 18:23 UTC, the attacker moved laterally to the internal HR database server within 4 minutes using the compromised credentials, exfiltrating 12,000 employee records before detection.`,
    attackChain: [
      { step: 1, phase: 'Reconnaissance', description: 'Port scan of 192.168.1.0/24 subnet to identify VPN gateway (TCP/443, TCP/1194)', timestamp: '2026-06-29T16:30:00Z', mitre: 'T1046', severity: 'low' },
      { step: 2, phase: 'Initial Access', description: 'Automated credential stuffing attack against VPN login - 23,000 attempts in 47 minutes', timestamp: '2026-06-29T17:36:00Z', mitre: 'T1110.004', severity: 'high' },
      { step: 3, phase: 'Credential Access', description: 'Successful authentication as jdoe@corp.com after 23,441st attempt', timestamp: '2026-06-29T18:23:00Z', mitre: 'T1078', severity: 'critical' },
      { step: 4, phase: 'Lateral Movement', description: 'RDP connection established to DB-SERVER-02 using compromised credentials', timestamp: '2026-06-29T18:27:00Z', mitre: 'T1021.001', severity: 'critical' },
      { step: 5, phase: 'Exfiltration', description: 'SQL dump of HR_EMPLOYEES table - 12,847 records transferred to external IP 185.220.101.45', timestamp: '2026-06-29T18:38:00Z', mitre: 'T1048', severity: 'critical' },
      { step: 6, phase: 'Detection', description: 'IDS/IPS detected anomalous data transfer volume and triggered ALERT-0032', timestamp: '2026-06-29T18:45:00Z', mitre: null, severity: 'info' },
    ],
    relatedEvidence: [
      { type: 'Log', id: 'LOG-00234', description: '23,441 failed authentication attempts from 47 IPs in 47 minutes', severity: 'high' },
      { type: 'Log', id: 'LOG-00235', description: 'Successful VPN auth jdoe@corp.com from 185.220.101.45 at 18:23 UTC', severity: 'critical' },
      { type: 'Log', id: 'LOG-00236', description: 'RDP session initiated from VPN to DB-SERVER-02 at 18:27 UTC', severity: 'critical' },
      { type: 'Log', id: 'LOG-00237', description: 'Large SQL query on HR_EMPLOYEES - 12,847 rows returned', severity: 'critical' },
      { type: 'NetFlow', id: 'NF-00891', description: '847MB outbound transfer to 185.220.101.45 (TOR exit node)', severity: 'critical' },
      { type: 'Alert', id: 'ALERT-0029', description: 'Prior port scan from same IP range 2 hours earlier', severity: 'medium' },
    ],
    similarIncidents: [
      { id: 'INC-2025-0128', title: 'Credential Stuffing Attack on SSH Gateway', similarity: 0.91, date: '2025-11-14', outcome: 'Blocked' },
      { id: 'INC-2025-0094', title: 'VPN Credential Compromise via Password Spray', similarity: 0.87, date: '2025-08-22', outcome: 'Detected late' },
      { id: 'INC-2024-0213', title: 'RockYou2024 Credential Database Exploitation', similarity: 0.82, date: '2024-12-01', outcome: 'Data breach' },
    ],
    ragSources: [
      { source: 'MITRE ATT&CK v14', relevance: 0.96, type: 'Knowledge Base' },
      { source: 'CISA Advisory AA24-001', relevance: 0.89, type: 'Advisory' },
      { source: 'Historical Incident INC-2025-0094', relevance: 0.87, type: 'Historical' },
      { source: 'Security Playbook PB-001', relevance: 0.93, type: 'Playbook' },
    ],
    llmAnalysis: `Based on analysis of 6 related log events, 1 NetFlow record, and correlation with 3 similar historical incidents, this incident represents a sophisticated, multi-stage attack leveraging exposed credentials from the RockYou2024 breach database.

The root cause is a combination of: (1) absence of MFA on the VPN endpoint, (2) overly permissive account lockout policy, and (3) reuse of compromised credentials. The threat actor demonstated OSINT proficiency by first scanning for exposed services before launching the credential attack.

The data exfiltration to a TOR exit node (185.220.101.45) indicates the attacker had pre-planned exfiltration infrastructure, suggesting an organized threat group rather than an opportunistic attacker.

Confidence: 94% | Model: GPT-4o-RAG | Retrieved Documents: 4`,
  },
  {
    id: 'INC-2026-0040',
    alertId: 'ALERT-0028',
    title: 'SQL Injection Attack on Customer Portal',
    attackType: 'SQL Injection + Data Exfiltration',
    severity: 'High',
    timestamp: '2026-06-29T14:22:00Z',
    status: 'Resolved',
    confidence: 0.89,
    rootCause: `A SQL injection vulnerability in the /api/v2/users/search endpoint allowed an unauthenticated attacker to dump the customer database. The vulnerability existed because user input was directly concatenated into SQL queries without sanitization.`,
    attackChain: [
      { step: 1, phase: 'Reconnaissance', description: 'Automated scanning of API endpoints using SQLMap tool', timestamp: '2026-06-29T13:45:00Z', mitre: 'T1595', severity: 'medium' },
      { step: 2, phase: 'Initial Access', description: 'SQL injection payload detected in search parameter: \' OR 1=1--', timestamp: '2026-06-29T14:10:00Z', mitre: 'T1190', severity: 'high' },
      { step: 3, phase: 'Collection', description: 'Database schema enumeration - 14 tables identified', timestamp: '2026-06-29T14:15:00Z', mitre: 'T1213', severity: 'high' },
      { step: 4, phase: 'Exfiltration', description: '45,000 customer records exported via time-based blind injection', timestamp: '2026-06-29T14:22:00Z', mitre: 'T1048', severity: 'critical' },
    ],
    relatedEvidence: [],
    similarIncidents: [],
    ragSources: [],
    llmAnalysis: 'SQL injection attack exploiting unparameterized query in customer API. Immediate patching required.',
  },
];
