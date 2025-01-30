// 모든 인터페이스와 타입 정의
export interface Project {
  id: number;
  name: string;
  status: 'approved' | 'pending' | 'rejected';
  requestDate: string;
  expiryDate?: string;
  reviewCount?: number;
  rejectReason?: string;
}

export interface RequestFormType {
  projectName: string;
  repositoryUrl: string;
  description: string;
  purpose: string;
  expectedDuration: string;
  teamSize: string;
}

export interface Token {
  project_id: string;
  token: string;
  email: string;
  created_at: string;
  updated_at: string;
  validation_status: 'valid' | 'invalid' | 'pending';
  last_validation_date: string;
  validation_fail_date?: string;
}

export interface State {
  isAdmin: boolean;
  showAdminAuth: boolean;
  adminPassword: string;
  adminError: string;
  showAdminModal: boolean;
  prompt: string;
  pullRequestUrl: string;
  reviewResult: string;
  error: string;
  showReference: boolean;
  requestForm: RequestFormType;
  myProjects: Project[];
  selectedTab: string;
  editingToken: Token | null;
  showSidePanel: boolean;
  form: {
    project_id: string;
    token: string;
    email: string;
  };
}

export type Action =
  | { type: 'SET_ADMIN'; payload: boolean }
  | { type: 'SET_ADMIN_PASSWORD'; payload: string }
  | { type: 'SET_PROMPT'; payload: string }
  | { type: 'SET_PULL_REQUEST_URL'; payload: string }
  | { type: 'SET_REVIEW_RESULT'; payload: string }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'TOGGLE_REFERENCE' }
  | { type: 'UPDATE_REQUEST_FORM'; payload: Partial<RequestFormType> }
  | { type: 'SET_SELECTED_TAB'; payload: string }
  | { type: 'SET_EDITING_TOKEN'; payload: Token | null }
  | { type: 'TOGGLE_SIDE_PANEL' }
  | { type: 'UPDATE_FORM'; payload: Partial<State['form']> }
  | { type: 'TOGGLE_ADMIN_MODAL' }
  | { type: 'SET_ADMIN_ERROR'; payload: string }; 