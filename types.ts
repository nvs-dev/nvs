
export enum CaseStatus {
  COLD_CASE = 'Cold Case',
  CLOSED = 'Closed',
  ACTIVE = 'Active'
}

export interface CrimeRecord {
  id: string;
  criminalName: string;
  crimeSceneArea: string;
  investigationProcess: string;
  status: CaseStatus;
  dateCreated: string;
  category: string;
}

export interface User {
  id: string;
  username: string;
  role: 'Agent' | 'Admin';
}
