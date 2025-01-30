import { State, Action } from '../types';
import { Dispatch } from 'react';
import { Copy, Book, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { mockApiCall } from '../utils/mockApi';

interface PromptTestProps {
  state: State;
  dispatch: Dispatch<Action>;
}

// 프롬프트 테스트 컴포넌트
export const PromptTest = ({ state, dispatch }: PromptTestProps) => {
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

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        {/* URL 입력 */}
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

        {/* Prompt 입력 */}
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
                onClick={() => navigator.clipboard.writeText(state.prompt)}
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

        {/* 레퍼런스 표시 */}
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

      {/* 에러 메시지 */}
      {state.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {/* 결과 표시 */}
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
}; 