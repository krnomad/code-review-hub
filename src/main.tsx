import React, { useState, useReducer } from 'react';
import { Lock, Copy, Book, AlertCircle, FileText, CheckCircle, XCircle, Clock, Plus } from 'lucide-react';
import TokenManagement from './TokenManagement';
import { Alert, AlertDescription } from './components/ui/alert';

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

// 리듀서 함수
const reducer = (state: State, action: Action): State => {
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

const mockApiCall = (): Promise<{ error: boolean; errorType?: string; result?: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const random = Math.random();
      if (random < 0.25) {
        resolve({ error: true, errorType: 'SYSTEM_ERROR' });
      } else if (random < 0.5) {
        resolve({ error: true, errorType: 'NO_TOKEN' });
      } else if (random < 0.75) {
        resolve({ error: true, errorType: 'INVALID_TOKEN' });
      } else {
        resolve({
          error: false,
          result: '코드 리뷰 결과가 여기에 표시됩니다...'
        });
      }
    }, 1000);
  });
};

const CodeReviewDashboard: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, {
    isAdmin: false,
    showAdminAuth: false,
    adminPassword: '',
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
    myProjects: [
      {
        id: 1,
        name: "프로젝트 A",
        status: "approved",
        requestDate: "2025-01-15",
        expiryDate: "2025-07-15",
        reviewCount: 25
      },
      {
        id: 2,
        name: "프로젝트 B",
        status: "pending",
        requestDate: "2025-01-28",
        reviewCount: 0
      },
      {
        id: 3,
        name: "프로젝트 C",
        status: "rejected",
        requestDate: "2025-01-20",
        rejectReason: "프로젝트 정보 불충분"
      }
    ],
    selectedTab: '요청서 작성',
    editingToken: null,
    showSidePanel: false,
    form: {
      project_id: '',
      token: '',
      email: ''
    },
    showAdminModal: false,
    adminError: ''
  });

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
        return (
          <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              코드 리뷰 시스템 사용 요청서
            </h2>
            <form onSubmit={handleRequestSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  프로젝트 이름
                </label>
                <input
                  type="text"
                  required
                  value={state.requestForm.projectName}
                  onChange={(e) => dispatch({ 
                    type: 'UPDATE_REQUEST_FORM', 
                    payload: { projectName: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="프로젝트 이름을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Repository URL
                </label>
                <input
                  type="url"
                  required
                  value={state.requestForm.repositoryUrl}
                  onChange={(e) => dispatch({ 
                    type: 'UPDATE_REQUEST_FORM', 
                    payload: { repositoryUrl: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="https://bitbucket.org/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  프로젝트 설명
                </label>
                <textarea
                  required
                  value={state.requestForm.description}
                  onChange={(e) => dispatch({ 
                    type: 'UPDATE_REQUEST_FORM', 
                    payload: { description: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded h-24"
                  placeholder="프로젝트에 대한 간단한 설명을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사용 목적
                </label>
                <textarea
                  required
                  value={state.requestForm.purpose}
                  onChange={(e) => dispatch({ 
                    type: 'UPDATE_REQUEST_FORM', 
                    payload: { purpose: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded h-24"
                  placeholder="코드 리뷰 시스템을 어떤 목적으로 사용하실 예정인지 설명해주세요"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    예상 사용 기간 (개월)
                  </label>
                  <select
                    value={state.requestForm.expectedDuration}
                    onChange={(e) => dispatch({ 
                      type: 'UPDATE_REQUEST_FORM', 
                      payload: { expectedDuration: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="3">3개월</option>
                    <option value="6">6개월</option>
                    <option value="12">12개월</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    팀 규모 (명)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={state.requestForm.teamSize}
                    onChange={(e) => dispatch({ 
                      type: 'UPDATE_REQUEST_FORM', 
                      payload: { teamSize: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="팀 인원 수"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                요청서 제출
              </button>
            </form>
          </div>
        );

      case 'Prompt 테스트':
        return (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  BitBucket PR URL
                </label>
                <input
                  type="text"
                  value={state.pullRequestUrl}
                  onChange={(e) => dispatch({ type: 'SET_PULL_REQUEST_URL', payload: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="https://bitbucket.org/..."
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prompt
                </label>
                <div className="relative">
                  <textarea
                    value={state.prompt}
                    onChange={(e) => dispatch({ type: 'SET_PROMPT', payload: e.target.value })}
                    className="w-full px-3 py-2 border rounded h-32"
                    placeholder="프롬프트를 입력하세요..."
                  />
                  <div className="absolute right-2 top-2 space-x-2">
                    <button
                      onClick={() => {
                        const text = state.prompt;
                        navigator.clipboard.writeText(text);
                      }}
                      className="p-2 text-gray-500 hover:text-gray-700 rounded"
                      title="복사"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => dispatch({ type: 'TOGGLE_REFERENCE' })}
                      className="p-2 text-gray-500 hover:text-gray-700 rounded"
                      title="레퍼런스"
                    >
                      <Book className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {state.showReference && (
                <div className="mb-4 p-4 bg-gray-50 rounded">
                  <h3 className="font-medium mb-2">Prompt 레퍼런스</h3>
                  <div className="text-sm text-gray-600">
                    레퍼런스 내용이 여기에 표시됩니다...
                  </div>
                </div>
              )}

              <button
                onClick={handleTestReview}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                테스트 실행
              </button>
            </div>

            {state.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}

            {state.reviewResult && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">리뷰 결과</h3>
                <pre className="bg-gray-50 p-4 rounded whitespace-pre-wrap">
                  {state.reviewResult}
                </pre>
              </div>
            )}
          </div>
        );

      case '토큰 관리':
        return <TokenManagement />;

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* 관리자 모드 버튼 */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleAdminModeClick}
          className="text-blue-600 hover:text-blue-800"
        >
          {state.isAdmin ? '관리자 모드 해제' : '관리자 모드'}
        </button>
      </div>

      {/* 관리자 모드 전환 모달 */}
      {state.showAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">관리자 인증</h3>
            <form onSubmit={handleAdminLogin}>
              <input
                type="password"
                value={state.adminPassword}
                onChange={(e) => dispatch({ type: 'SET_ADMIN_PASSWORD', payload: e.target.value })}
                className="w-full px-3 py-2 border rounded mb-4"
                placeholder="관리자 비밀번호를 입력하세요"
              />
              {state.adminError && (
                <p className="text-red-500 text-sm mb-4">{state.adminError}</p>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    dispatch({ type: 'TOGGLE_ADMIN_MODAL' });
                    dispatch({ type: 'SET_ADMIN_PASSWORD', payload: '' });
                    dispatch({ type: 'SET_ADMIN_ERROR', payload: '' });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  확인
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {renderTabs()}
      {renderContent()}
    </div>
  );
};

export default CodeReviewDashboard;