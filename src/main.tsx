import React, { useReducer } from 'react';
import TokenManagement from './components/TokenManagement';
import MyProjects from './components/MyProjects';
import Guide from './components/Guide';
import { reducer, initialState } from './reducers/dashboardReducer';
import { AdminModal, RequestForm, PromptTest } from './components';
import RequestManagement from './components/RequestManagement';
import ProjectManagement from './components/ProjectManagement';
import Statistics from './components/Statistics';

const CodeReviewDashboard: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const adminTabs = ['요청서 관리', '프로젝트 관리', '통계', '토큰 관리'];
  const userTabs = ['요청서 작성', 'Prompt 테스트', '내 프로젝트', '사용 가이드'];
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
          <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => dispatch({ type: 'SET_SELECTED_TAB', payload: tab })}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex-shrink-0
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
      case '요청서 관리':
        return <RequestManagement />;
      case '프로젝트 관리':
        return <ProjectManagement />;
      case '내 프로젝트':
        // log
        console.log('내 프로젝트');
        return <MyProjects />;
      case '사용 가이드':
        return <Guide />;
      case '통계':
        return <Statistics />;
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