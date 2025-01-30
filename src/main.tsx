import React, { useState, useReducer } from 'react';
import { Lock, Copy, Book, AlertCircle, FileText, CheckCircle, XCircle, Clock, Plus } from 'lucide-react';
import TokenManagement from './TokenManagement';
import { Alert, AlertDescription } from './components/ui/alert';
import { reducer, initialState } from './reducers/dashboardReducer';
import { AdminModal, RequestForm, PromptTest } from './components';
import { mockApiCall } from './utils/mockApi';

// 프로젝트 데이터 타입 정의
interface Project {
  id: number;
  name: string;
  status: 'approved' | 'pending' | 'rejected';
  requestDate: string;
  expiryDate?: string;
  reviewCount?: number;
  rejectReason?: string;
}

// 요청서 데이터 타입 정의
interface RequestForm {
  projectName: string;
  repositoryUrl: string;
  description: string;
  purpose: string;
  expectedDuration: string;
  teamSize: string;
}

// 토큰 데이터 타입 정의
interface Token {
  project_id: string;
  token: string;
  email: string;
  created_at: string;
  updated_at: string;
  validation_status: 'valid' | 'invalid' | 'pending';
  last_validation_date: string;
  validation_fail_date?: string;
}

// 상태 타입 정의
interface State {
  isAdmin: boolean;
  showAdminAuth: boolean;
  adminPassword: string;
  prompt: string;
  pullRequestUrl: string;
  reviewResult: string;
  error: string;
  showReference: boolean;
  requestForm: RequestForm;
  myProjects: Project[];
  selectedTab: string;
  editingToken: Token | null;
  showSidePanel: boolean;
  form: {
    project_id: string;
    token: string;
    email: string;
  };
  showAdminModal: boolean;
  adminError: string;
}

// 액션 타입 정의
type Action =
  | { type: 'SET_ADMIN'; payload: boolean }
  | { type: 'SET_ADMIN_PASSWORD'; payload: string }
  | { type: 'SET_PROMPT'; payload: string }
  | { type: 'SET_PULL_REQUEST_URL'; payload: string }
  | { type: 'SET_REVIEW_RESULT'; payload: string }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'TOGGLE_REFERENCE' }
  | { type: 'UPDATE_REQUEST_FORM'; payload: Partial<RequestForm> }
  | { type: 'SET_SELECTED_TAB'; payload: string }
  | { type: 'SET_EDITING_TOKEN'; payload: Token | null }
  | { type: 'TOGGLE_SIDE_PANEL' }
  | { type: 'UPDATE_FORM'; payload: Partial<State['form']> }
  | { type: 'TOGGLE_ADMIN_MODAL' }
  | { type: 'SET_ADMIN_ERROR'; payload: string };

const CodeReviewDashboard: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const adminTabs = ['요청서 관리', '프로젝트 관리', '통계', '토큰 관리'];
  const userTabs = ['요청서 작성', 'Prompt 테스트', '내 프로젝트', '사용 가이드'];

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('요청서가 제출되었습니다. 관리자 검토 후 승인될 예정입니다.');
    dispatch({ type: 'UPDATE_REQUEST_FORM', payload: {
      projectName: '',
      repositoryUrl: '',
      description: '',
      purpose: '',
      expectedDuration: '3',
      teamSize: ''
    }});
  };

  const handleTestReview = async () => {
    dispatch({ type: 'SET_ERROR', payload: '' });
    dispatch({ type: 'SET_REVIEW_RESULT', payload: '' });

    try {
      const response = await mockApiCall();
      
      if (response.error) {
        switch (response.errorType) {
          case 'SYSTEM_ERROR':
            dispatch({ type: 'SET_ERROR', payload: '코드 리뷰 시스템에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.' });
            break;
          case 'NO_TOKEN':
            dispatch({ type: 'SET_ERROR', payload: '해당 프로젝트에 대한 요청서가 필요합니다. 먼저 요청서를 작성해주세요.' });
            break;
          case 'INVALID_TOKEN':
            dispatch({ type: 'SET_ERROR', payload: 'BitBucket 토큰이 유효하지 않습니다. 관리자에게 문의해주세요.' });
            break;
          default:
            dispatch({ type: 'SET_ERROR', payload: '알 수 없는 오류가 발생했습니다.' });
        }
        return;
      }

      dispatch({ type: 'SET_REVIEW_RESULT', payload: response.result || '' });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: '서버와의 통신 중 오류가 발생했습니다.' });
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (state.adminPassword === '1q2w3e') {
      dispatch({ type: 'SET_ADMIN', payload: true });
      dispatch({ type: 'TOGGLE_ADMIN_MODAL' });
      dispatch({ type: 'SET_ADMIN_PASSWORD', payload: '' });
      dispatch({ type: 'SET_ADMIN_ERROR', payload: '' });
      dispatch({ type: 'SET_SELECTED_TAB', payload: adminTabs[0] });
    } else {
      dispatch({ type: 'SET_ADMIN_ERROR', payload: '잘못된 관리자 비밀번호입니다.' });
    }
  };

  const handleAdminModeClick = () => {
    if (state.isAdmin) {
      dispatch({ type: 'SET_ADMIN', payload: false });
      dispatch({ type: 'SET_SELECTED_TAB', payload: userTabs[0] });
    } else {
      dispatch({ type: 'TOGGLE_ADMIN_MODAL' });
    }
  };

  const renderTabs = () => {
    const tabs = state.isAdmin ? adminTabs : userTabs;
    
    return (
      <div className="mb-6">
        <div className="border-b">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => dispatch({ type: 'SET_SELECTED_TAB', payload: tab })}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${state.selectedTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (state.selectedTab) {
      case '요청서 작성':
        return <RequestForm state={state} dispatch={dispatch} />;
      case 'Prompt 테스트':
        return <PromptTest state={state} dispatch={dispatch} />;
      case '토큰 관리':
        return <TokenManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleAdminModeClick}
          className="text-blue-600 hover:text-blue-800"
        >
          {state.isAdmin ? '관리자 모드 해제' : '관리자 모드'}
        </button>
      </div>

      {state.showAdminModal && (
        <AdminModal
          state={state}
          dispatch={dispatch}
          onClose={() => {
            dispatch({ type: 'TOGGLE_ADMIN_MODAL' });
            dispatch({ type: 'SET_ADMIN_PASSWORD', payload: '' });
            dispatch({ type: 'SET_ADMIN_ERROR', payload: '' });
          }}
        />
      )}

      {renderTabs()}
      {renderContent()}
    </div>
  );
};

export default CodeReviewDashboard;