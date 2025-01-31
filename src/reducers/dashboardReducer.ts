import { State, Action } from '../types';

export const initialState: State = {
  isAdmin: false,
  showAdminAuth: false,
  adminPassword: '',
  adminError: '',
  showAdminModal: false,
  prompt: '',
  pullRequestUrl: '',
  reviewResult: '',
  error: '',
  showReference: false,
  requestForm: {
    projectName: '',
    repositoryUrl: '',
    description: '',
    purpose: '',
    expectedDuration: '3',
    teamSize: ''
  },
  myProjects: [],
  selectedTab: '요청서 작성',
  editingToken: null,
  showSidePanel: false,
  form: {
    project_id: '',
    token: '',
    email: ''
  }
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_ADMIN':
      return { ...state, isAdmin: action.payload };
    case 'SET_ADMIN_PASSWORD':
      return { ...state, adminPassword: action.payload };
    case 'SET_PROMPT':
      return { ...state, prompt: action.payload };
    case 'SET_PULL_REQUEST_URL':
      return { ...state, pullRequestUrl: action.payload };
    case 'SET_REVIEW_RESULT':
      return { ...state, reviewResult: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'TOGGLE_REFERENCE':
      return { ...state, showReference: !state.showReference };
    case 'UPDATE_REQUEST_FORM':
      return { ...state, requestForm: { ...state.requestForm, ...action.payload } };
    case 'SET_SELECTED_TAB':
      return { ...state, selectedTab: action.payload };
    case 'SET_EDITING_TOKEN':
      return { ...state, editingToken: action.payload };
    case 'TOGGLE_SIDE_PANEL':
      return { ...state, showSidePanel: !state.showSidePanel };
    case 'UPDATE_FORM':
      return { ...state, form: { ...state.form, ...action.payload } };
    case 'TOGGLE_ADMIN_MODAL':
      return { ...state, showAdminModal: !state.showAdminModal };
    case 'SET_ADMIN_ERROR':
      return { ...state, adminError: action.payload };
    default:
      return state;
  }
};

const handleAdminAuth = (state: State, password: string): State => {
  if (password === 'demodemo') {
    return {
      ...state,
      isAdmin: true,
      showAdminModal: false,
      adminPassword: '',
      selectedTab: '요청서 관리'
    };
  }
  return {
    ...state,
    adminError: '잘못된 비밀번호입니다.'
  };
}; 