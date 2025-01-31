import { State, Action } from '../types';
import { Dispatch } from 'react';
import { FileText, Send } from 'lucide-react';
import { PageLayout } from './ui/PageLayout';
import { styles } from '../styles/commonStyles';

interface RequestFormProps {
  state: State;
  dispatch: Dispatch<Action>;
}

// 요청서 작성 폼 컴포넌트
export const RequestForm = ({ state, dispatch }: RequestFormProps) => {
  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('요청서가 제출되었습니다. 관리자 검토 후 승인될 예정입니다.');
    dispatch({ 
      type: 'UPDATE_REQUEST_FORM', 
      payload: {
        projectName: '',
        repositoryUrl: '',
        description: '',
        purpose: '',
        expectedDuration: '3',
        teamSize: ''
      }
    });
  };

  return (
    <PageLayout
      icon={FileText}
      title="코드 리뷰 시스템 사용 요청"
      description="프로젝트에 대한 정보를 입력하여 코드 리뷰 시스템 사용을 요청하세요."
    >
      <div className={styles.card}>
        <form onSubmit={handleRequestSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
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
              className={styles.input}
              placeholder="프로젝트 이름을 입력하세요"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
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
              className={styles.input}
              placeholder="https://bitbucket.org/..."
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              프로젝트 설명
            </label>
            <textarea
              required
              value={state.requestForm.description}
              onChange={(e) => dispatch({ 
                type: 'UPDATE_REQUEST_FORM', 
                payload: { description: e.target.value }
              })}
              className={`${styles.input} h-24 resize-none`}
              placeholder="프로젝트에 대한 간단한 설명을 입력하세요"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              사용 목적
            </label>
            <textarea
              required
              value={state.requestForm.purpose}
              onChange={(e) => dispatch({ 
                type: 'UPDATE_REQUEST_FORM', 
                payload: { purpose: e.target.value }
              })}
              className={`${styles.input} h-24 resize-none`}
              placeholder="코드 리뷰 시스템을 어떤 목적으로 사용하실 예정인지 설명해주세요"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                예상 사용 기간 (개월)
              </label>
              <select
                value={state.requestForm.expectedDuration}
                onChange={(e) => dispatch({ 
                  type: 'UPDATE_REQUEST_FORM', 
                  payload: { expectedDuration: e.target.value }
                })}
                className={styles.select}
              >
                <option value="3">3개월</option>
                <option value="6">6개월</option>
                <option value="12">12개월</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
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
                className={styles.input}
                placeholder="팀 인원 수"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50/50 text-blue-600 rounded-xl ring-1 ring-blue-100
                     hover:bg-blue-100/50 transition-colors duration-200"
          >
            <Send className="w-4 h-4" />
            요청서 제출
          </button>
        </form>
      </div>
    </PageLayout>
  );
}; 