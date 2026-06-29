// Mock Threat Intelligence Data

export const mitreAttackTechniques = [
  { id: 'T1110', name: 'Brute Force', tactic: 'Credential Access', severity: 'High', detected: true, count: 23, description: 'Adversaries may use brute force techniques to gain access to accounts when passwords are unknown or obtained from previous breaches.' },
  { id: 'T1046', name: 'Network Service Discovery', tactic: 'Discovery', severity: 'Medium', detected: true, count: 15, description: 'Adversaries may attempt to get a listing of services running on remote hosts to identify exploitable vulnerabilities.' },
  { id: 'T1190', name: 'Exploit Public-Facing Application', tactic: 'Initial Access', severity: 'Critical', detected: true, count: 8, description: 'Adversaries may attempt to take advantage of a weakness in an Internet-facing computer or program using software, data, or commands.' },
  { id: 'T1059', name: 'Command and Scripting Interpreter', tactic: 'Execution', severity: 'High', detected: false, count: 0, description: 'Adversaries may abuse command and script interpreters to execute commands, scripts, or binaries.' },
  { id: 'T1486', name: 'Data Encrypted for Impact', tactic: 'Impact', severity: 'Critical', detected: true, count: 3, description: 'Adversaries may encrypt data on target systems or on large numbers of systems in a network to interrupt availability.' },
  { id: 'T1021', name: 'Remote Services', tactic: 'Lateral Movement', severity: 'High', detected: true, count: 12, description: 'Adversaries may use valid accounts to log into a service specifically designed to accept remote connections.' },
  { id: 'T1078', name: 'Valid Accounts', tactic: 'Defense Evasion', severity: 'High', detected: true, count: 19, description: 'Adversaries may obtain and abuse credentials of existing accounts as a means of gaining Initial Access.' },
  { id: 'T1566', name: 'Phishing', tactic: 'Initial Access', severity: 'Medium', detected: true, count: 31, description: 'Adversaries may send phishing messages to gain access to victim systems.' },
  { id: 'T1055', name: 'Process Injection', tactic: 'Defense Evasion', severity: 'High', detected: false, count: 0, description: 'Adversaries may inject code into processes in order to evade process-based defenses.' },
  { id: 'T1071', name: 'Application Layer Protocol', tactic: 'Command and Control', severity: 'Medium', detected: true, count: 7, description: 'Adversaries may communicate using OSI application layer protocols to avoid detection.' },
  { id: 'T1083', name: 'File and Directory Discovery', tactic: 'Discovery', severity: 'Low', detected: true, count: 42, description: 'Adversaries may enumerate files and directories or search in specific locations of a host.' },
  { id: 'T1133', name: 'External Remote Services', tactic: 'Persistence', severity: 'High', detected: true, count: 6, description: 'Adversaries may leverage external-facing remote services to initially access within a network.' },
];

export const cisaAdvisories = [
  { id: 'AA24-001', title: 'Russian State-Sponsored Cyber Actors Target Critical Infrastructure', date: '2026-06-15', severity: 'Critical', cvss: 9.8, affectedSystems: ['Firewalls', 'VPNs', 'SCADA'], description: 'CISA and FBI warn of Russian cyber actors exploiting vulnerabilities in enterprise network infrastructure.' },
  { id: 'AA24-002', title: 'Chinese State-Sponsored Hackers Actively Exploit Network Vulnerabilities', date: '2026-06-10', severity: 'High', cvss: 8.5, affectedSystems: ['Web Servers', 'Email Systems'], description: 'PRC state-sponsored cyber actors continue to exploit vulnerabilities in widely used software.' },
  { id: 'AA24-003', title: 'Ransomware Group Targets Healthcare Sector', date: '2026-06-08', severity: 'Critical', cvss: 9.1, affectedSystems: ['Windows Servers', 'Backup Systems'], description: 'Active ransomware campaign targeting healthcare organizations. Immediate patching required.' },
  { id: 'AA24-004', title: 'Supply Chain Attack via Compromised Software Updates', date: '2026-06-01', severity: 'High', cvss: 8.2, affectedSystems: ['Software Vendors', 'Enterprise Networks'], description: 'Threat actors are inserting malicious code into legitimate software update mechanisms.' },
  { id: 'AA24-005', title: 'Critical Zero-Day in Enterprise VPN Products', date: '2026-05-28', severity: 'Critical', cvss: 10.0, affectedSystems: ['Cisco ASA', 'Palo Alto', 'Fortinet'], description: 'Zero-day vulnerability actively exploited in the wild. Emergency patch available.' },
];

export const historicalIncidents = [
  { id: 'INC-2024-001', title: 'SolarWinds-style Supply Chain Compromise', date: '2024-12-13', type: 'Supply Chain', severity: 'Critical', impact: 'Nation-state level attack affecting 18,000+ organizations', resolved: true },
  { id: 'INC-2024-002', title: 'Colonial Pipeline Ransomware Attack', date: '2024-05-07', type: 'Ransomware', severity: 'Critical', impact: 'US fuel supply disruption for 5 days', resolved: true },
  { id: 'INC-2023-001', title: 'MOVEit Transfer SQL Injection', date: '2023-06-01', type: 'SQL Injection', severity: 'Critical', impact: '2,500+ organizations affected, 64M+ records stolen', resolved: true },
  { id: 'INC-2023-002', title: 'Log4Shell Mass Exploitation', date: '2023-12-09', type: 'Zero-Day', severity: 'Critical', impact: 'Hundreds of millions of Java applications vulnerable', resolved: false },
  { id: 'INC-2022-001', title: 'Uber Internal Systems Breach', date: '2022-09-15', type: 'Social Engineering', severity: 'High', impact: 'Full internal network access, HackerOne data exposed', resolved: true },
];

export const securityPlaybooks = [
  {
    id: 'PB-001',
    title: 'Brute Force Attack Response',
    category: 'Authentication',
    steps: [
      'Identify the source IP(s) of failed login attempts',
      'Block the offending IP addresses at the firewall',
      'Lock compromised accounts and force password resets',
      'Enable CAPTCHA or MFA on affected login portals',
      'Review and audit all successful logins from flagged IPs',
      'Generate incident report and notify affected users',
    ],
    automatable: true,
    estimatedTime: '15-30 min',
  },
  {
    id: 'PB-002',
    title: 'DDoS Mitigation Playbook',
    category: 'Network',
    steps: [
      'Activate upstream DDoS scrubbing service',
      'Implement rate limiting on edge routers',
      'Null-route the most aggressive source IPs',
      'Scale up compute resources to absorb traffic',
      'Engage CDN provider for traffic distribution',
      'Document attack vectors and report to ISP',
    ],
    automatable: false,
    estimatedTime: '30-60 min',
  },
  {
    id: 'PB-003',
    title: 'Ransomware Incident Response',
    category: 'Malware',
    steps: [
      'Immediately isolate infected systems from network',
      'Disable all external and internal network access',
      'Identify the ransomware variant via sandbox analysis',
      'Restore from the last known clean backup',
      'Reset all credentials and revoke active sessions',
      'Conduct full forensic investigation before reconnection',
      'Report to law enforcement and regulatory bodies',
    ],
    automatable: false,
    estimatedTime: '4-72 hours',
  },
  {
    id: 'PB-004',
    title: 'SQL Injection Response',
    category: 'Application',
    steps: [
      'Identify the vulnerable endpoint from WAF logs',
      'Immediately block malicious IP at application layer',
      'Review database query logs for data access patterns',
      'Check for data exfiltration attempts',
      'Apply input validation and parameterized queries',
      'Conduct full application security audit',
    ],
    automatable: true,
    estimatedTime: '20-45 min',
  },
];

export const vulnerabilities = [
  { cve: 'CVE-2024-12345', cvss: 9.8, severity: 'Critical', product: 'Apache Log4j 2.x', description: 'Remote code execution via JNDI injection', patched: false, exploited: true },
  { cve: 'CVE-2024-11223', cvss: 8.1, severity: 'High', product: 'OpenSSL 3.0.x', description: 'Buffer overflow in X.509 certificate verification', patched: true, exploited: false },
  { cve: 'CVE-2024-09876', cvss: 7.5, severity: 'High', product: 'nginx 1.25.x', description: 'HTTP/2 CONTINUATION frame flood DoS', patched: true, exploited: true },
  { cve: 'CVE-2024-08765', cvss: 9.1, severity: 'Critical', product: 'Windows Server 2022', description: 'LDAP RCE via malformed request', patched: false, exploited: false },
  { cve: 'CVE-2024-07654', cvss: 6.5, severity: 'Medium', product: 'MySQL 8.0.x', description: 'Privilege escalation via stored procedure', patched: true, exploited: false },
  { cve: 'CVE-2024-06543', cvss: 10.0, severity: 'Critical', product: 'Cisco IOS XE', description: 'Unauthenticated RCE in web management interface', patched: false, exploited: true },
];

export const threatActors = [
  { name: 'APT28 (Fancy Bear)', origin: 'Russia', motivation: 'Espionage', techniques: ['T1566', 'T1078', 'T1021'], active: true },
  { name: 'APT41 (Double Dragon)', origin: 'China', motivation: 'Espionage + Financial', techniques: ['T1190', 'T1059', 'T1055'], active: true },
  { name: 'Lazarus Group', origin: 'North Korea', motivation: 'Financial + Disruption', techniques: ['T1486', 'T1566', 'T1078'], active: true },
  { name: 'Sandworm', origin: 'Russia', motivation: 'Disruption', techniques: ['T1486', 'T1059', 'T1190'], active: false },
];
