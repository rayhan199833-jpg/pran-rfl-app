
export type ExtinguisherType = 'ABC' | 'CO2' | 'Foam';

export interface InspectionRecord {
  id: string;
  timestamp: string;
  extinguisherType: ExtinguisherType;
  pointNumber: string;
  month: string;
  seal: 'Good' | 'Broken' | 'Missing';
  pressure: 'OK' | 'Low' | 'High';
  hosePipe: 'Good' | 'Damaged' | 'Missing';
  safetyPin: 'Present' | 'Missing';
  overallCondition: string;
  supplyDate: string;
  expiryDate: string;
  fireMarshalName: string;
  staffId: string;
  section: string;
  signatureData?: string;
}

export interface User {
  username: string;
  isAuthenticated: boolean;
}
