import type { Project } from '@/types';

export const DEMO_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Whitefield Residency — Tower C',
    location: 'Whitefield, Bengaluru',
    stage: 'Superstructure',
    percentComplete: 62,
    docs: [
      { no: 'STR-GA-014', title: 'General Arrangement — Typical Floor', rev: 'C', cat: 'Drawings', status: 'approved', by: 'R. Iyer', date: '2026-08-14' },
      { no: 'STR-COL-021', title: 'Column Schedule — Floor 9–14', rev: 'B', cat: 'Drawings', status: 'review', by: 'R. Iyer', date: '2026-08-29' },
      { no: 'MEP-SHD-118', title: 'Shaft Coordination — Shop Drawing', rev: 'B', cat: 'Drawings', status: 'approved', by: 'S. Naik', date: '2026-08-02' },
      { no: 'QAQC-ITP-009', title: 'ITP — RCC Slab Pour, Floor 12', rev: 'A', cat: 'QA/QC', status: 'approved', by: 'C. Prasangi', date: '2026-08-30' },
      { no: 'QAQC-NCR-022', title: 'NCR — Rebar Cover Deviation, Floor 11', rev: 'A', cat: 'QA/QC', status: 'hold', by: 'C. Prasangi', date: '2026-09-01' },
      { no: 'QAQC-MTR-045', title: 'Material Test Report — Cement Batch 45', rev: '-', cat: 'QA/QC', status: 'approved', by: 'Lab (TÜV)', date: '2026-08-27' },
      { no: 'CON-SUB-004', title: 'Subcontract — Rebar Fabrication & Fixing', rev: '1', cat: 'Contracts', status: 'approved', by: 'Procurement', date: '2026-06-11' },
      { no: 'PR-AUG-2026', title: 'Monthly Progress Report — August', rev: '-', cat: 'Progress Reports', status: 'approved', by: 'Planning Team', date: '2026-09-01' },
    ],
    rfis: [
      { id: 'RFI-118', subject: 'Beam-Column Junction Detail, Grid D4', status: 'Open', assignedTo: 'Ekaa Studio', ballInCourt: 'Consultant', due: '2026-09-10', createdAt: '2026-08-15', updatedAt: '2026-08-15' },
      { id: 'RFI-112', subject: 'Waterproofing Detail at Lift Pit', status: 'Closed', assignedTo: 'M. Fernandes', ballInCourt: '—', due: '2026-08-19', createdAt: '2026-07-20', updatedAt: '2026-08-19' },
      { id: 'RFI-120', subject: 'Rebar Lap Length Query — Transfer Slab', status: 'Answered', assignedTo: 'R. Iyer', ballInCourt: 'Site Team', due: '2026-09-05', createdAt: '2026-08-20', updatedAt: '2026-08-28' },
    ],
    submittals: [
      { id: 'SUB-041', title: 'Ready-Mix Concrete Mix Design — M40', spec: '03 30 00', status: 'Approved', due: '2026-08-20', createdAt: '2026-08-01', updatedAt: '2026-08-15' },
      { id: 'SUB-045', title: 'Aluminium Window Shop Drawings', spec: '08 51 13', status: 'Revise & Resubmit', due: '2026-09-08', createdAt: '2026-08-10', updatedAt: '2026-08-25' },
      { id: 'SUB-048', title: 'Elevator Technical Data Sheet', spec: '14 20 00', status: 'Pending', due: '2026-09-12', createdAt: '2026-08-15', updatedAt: '2026-08-15' },
    ],
    issues: [
      { id: 'ISS-201', title: 'Missing edge protection — Floor 12', type: 'Safety', priority: 'High', status: 'Open', location: 'Floor 12, Grid C', assignedTo: 'Safety Officer', date: '2026-09-02', createdAt: '2026-09-02', updatedAt: '2026-09-02' },
      { id: 'ISS-198', title: 'Honeycombing observed — Column C4, Floor 9', type: 'Quality', priority: 'Medium', status: 'In Progress', location: 'Floor 9, Column C4', assignedTo: 'C. Prasangi', date: '2026-08-30', createdAt: '2026-08-30', updatedAt: '2026-08-30' },
      { id: 'ISS-190', title: 'Clash: HVAC duct vs beam soffit', type: 'Design', priority: 'Medium', status: 'Closed', location: 'Floor 8 Corridor', assignedTo: 'MEP Consultant', date: '2026-08-22', createdAt: '2026-08-22', updatedAt: '2026-08-28' },
    ],
    dailyLogs: [
      { date: '2026-09-05', weather: 'Clear', temperature: '29°C', manpower: 142, summary: 'Slab reinforcement Floor 13 completed 70%; shuttering for Floor 13 columns started.', delays: 'None', createdAt: '2026-09-05' },
      { date: '2026-09-04', weather: 'Light rain', temperature: '26°C', manpower: 118, summary: 'Concrete pour for Floor 12 slab completed. Curing in progress.', delays: '2 hrs — rain in afternoon', createdAt: '2026-09-04' },
      { date: '2026-09-03', weather: 'Clear', temperature: '30°C', manpower: 135, summary: 'Formwork removal Floor 11; MEP first-fix ongoing Floor 8–9.', delays: 'None', createdAt: '2026-09-03' },
    ],
    photos: [],
    createdAt: '2026-01-15',
    updatedAt: '2026-09-05',
  },
  {
    id: 'p2',
    name: 'KR Puram Commercial Block',
    location: 'KR Puram, Bengaluru',
    stage: 'Finishing',
    percentComplete: 81,
    docs: [
      { no: 'ARC-GFC-201', title: 'GFC — Facade Elevation, North Block', rev: 'D', cat: 'Drawings', status: 'approved', by: 'Ekaa Studio', date: '2026-07-20' },
      { no: 'INT-SHD-076', title: 'Shop Drawing — Lobby Cladding Layout', rev: 'A', cat: 'Drawings', status: 'review', by: 'Ekaa Studio', date: '2026-08-28' },
      { no: 'QAQC-ITP-031', title: 'ITP — External Tile Cladding', rev: 'B', cat: 'QA/QC', status: 'approved', by: 'V. Reddy', date: '2026-08-15' },
      { no: 'QAQC-NCR-009', title: 'NCR — Paint Finish, Level 3 Corridor', rev: 'A', cat: 'QA/QC', status: 'rejected', by: 'J. Kumar', date: '2026-08-22' },
      { no: 'CON-CLT-002', title: 'Client Agreement — Variation Order 2', rev: '2', cat: 'Contracts', status: 'approved', by: 'Mamatha M.', date: '2026-07-02' },
      { no: 'PR-AUG-2026', title: 'Monthly Progress Report — August', rev: '-', cat: 'Progress Reports', status: 'approved', by: 'Planning Team', date: '2026-09-01' },
    ],
    rfis: [
      { id: 'RFI-064', subject: 'Lift Lobby Ceiling Height Clash', status: 'Closed', assignedTo: 'J. Kumar', ballInCourt: '—', due: '2026-07-30', createdAt: '2026-07-01', updatedAt: '2026-07-30' },
      { id: 'RFI-071', subject: 'Facade Bracket Fixing Detail', status: 'Open', assignedTo: 'Ekaa Studio', ballInCourt: 'Consultant', due: '2026-09-11', createdAt: '2026-08-20', updatedAt: '2026-08-20' },
    ],
    submittals: [
      { id: 'SUB-018', title: 'Vitrified Tile Sample — Lobby Flooring', spec: '09 30 00', status: 'Approved as Noted', due: '2026-08-05', createdAt: '2026-07-15', updatedAt: '2026-08-05' },
      { id: 'SUB-022', title: 'Fire-Rated Door Data Sheet', spec: '08 11 00', status: 'Pending', due: '2026-09-09', createdAt: '2026-08-20', updatedAt: '2026-08-20' },
    ],
    issues: [
      { id: 'ISS-142', title: 'Paint finish inconsistency — Level 3 corridor', type: 'Quality', priority: 'Medium', status: 'Open', location: 'Level 3 Corridor', assignedTo: 'J. Kumar', date: '2026-08-22', createdAt: '2026-08-22', updatedAt: '2026-08-22' },
      { id: 'ISS-139', title: 'Signage clash with sprinkler head', type: 'Design', priority: 'Low', status: 'Closed', location: 'Level 1 Lobby', assignedTo: 'MEP Consultant', date: '2026-08-10', createdAt: '2026-08-10', updatedAt: '2026-08-15' },
    ],
    dailyLogs: [
      { date: '2026-09-05', weather: 'Clear', temperature: '28°C', manpower: 64, summary: 'Facade cladding Block B level 4 completed; snag list review for Level 1 lobby.', delays: 'None', createdAt: '2026-09-05' },
      { date: '2026-09-04', weather: 'Clear', temperature: '29°C', manpower: 58, summary: 'Painting works Level 3 rework after NCR; flooring Level 2 handed over.', delays: 'None', createdAt: '2026-09-04' },
    ],
    photos: [],
    createdAt: '2026-02-01',
    updatedAt: '2026-09-05',
  },
  {
    id: 'p3',
    name: 'Devanahalli Logistics Park',
    location: 'Devanahalli, Bengaluru',
    stage: 'Foundation',
    percentComplete: 24,
    docs: [
      { no: 'STR-GA-002', title: 'General Arrangement — Foundation Layout', rev: 'A', cat: 'Drawings', status: 'approved', by: 'R. Iyer', date: '2026-06-18' },
      { no: 'GEO-SIR-001', title: 'Soil Investigation Report', rev: '-', cat: 'QA/QC', status: 'approved', by: 'Geo-Lab Pvt Ltd', date: '2026-05-30' },
      { no: 'QAQC-ITP-002', title: 'ITP — Pile Load Test', rev: 'A', cat: 'QA/QC', status: 'review', by: 'C. Prasangi', date: '2026-08-31' },
      { no: 'CON-MAIN-001', title: 'Main Contract Agreement', rev: '1', cat: 'Contracts', status: 'approved', by: 'Legal', date: '2026-05-02' },
    ],
    rfis: [
      { id: 'RFI-007', subject: 'Pile Cap Reinforcement Detail', status: 'Open', assignedTo: 'R. Iyer', ballInCourt: 'Structural Consultant', due: '2026-09-09', createdAt: '2026-08-15', updatedAt: '2026-08-15' },
    ],
    submittals: [
      { id: 'SUB-003', title: 'Pile Driving Method Statement', spec: '31 62 00', status: 'Approved', due: '2026-06-25', createdAt: '2026-06-01', updatedAt: '2026-06-20' },
    ],
    issues: [
      { id: 'ISS-011', title: 'Groundwater seepage — Pit 4', type: 'Safety', priority: 'High', status: 'In Progress', location: 'Pile Cap Pit 4', assignedTo: 'Site Engineer', date: '2026-08-27', createdAt: '2026-08-27', updatedAt: '2026-08-27' },
    ],
    dailyLogs: [
      { date: '2026-09-05', weather: 'Overcast', temperature: '27°C', manpower: 76, summary: 'Pile driving Zone B ongoing, 6 of 20 piles cast. Dewatering at Pit 4 continuing.', delays: '1 hr — pump maintenance', createdAt: '2026-09-05' },
    ],
    photos: [],
    createdAt: '2026-04-01',
    updatedAt: '2026-09-05',
  },
];

export function getProjectById(id: string): Project | undefined {
  return DEMO_PROJECTS.find(p => p.id === id);
}

export function getAllProjects(): Project[] {
  return DEMO_PROJECTS;
}