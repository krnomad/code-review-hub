import { State, Action } from '../types';
import { Dispatch } from 'react';
import { Bot, Send, GitPullRequest, RefreshCw } from 'lucide-react';
import { PageLayout } from './ui/PageLayout';
import { styles } from '../styles/commonStyles';

interface PromptTestProps {
  state: State;
  dispatch: Dispatch<Action>;
}

export const PromptTest = ({ state, dispatch }: PromptTestProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement review request logic
    console.log('Review requested:', state.prompt, state.pullRequestUrl);
  };

  return (
    <PageLayout
      icon={Bot}
      title="AI 코드 리뷰 테스트"
      description="AI 코드 리뷰 시스템을 테스트해보세요. Pull Request URL을 입력하거나 직접 프롬프트를 작성하여 리뷰를 요청할 수 있습니다."
    >
      <div className="space-y-6">
        <div className={styles.card}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Pull Request URL
              </label>
              <div className="relative">
                <GitPullRequest className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  value={state.pullRequestUrl}
                  onChange={(e) => dispatch({ type: 'SET_PULL_REQUEST_URL', payload: e.target.value })}
                  className={`${styles.input} pl-10`}
                  placeholder="https://github.com/owner/repo/pull/123"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                커스텀 프롬프트 (선택사항)
              </label>
              <textarea
                value={state.prompt}
                onChange={(e) => dispatch({ type: 'SET_PROMPT', payload: e.target.value })}
                className={`${styles.input} h-32 resize-none`}
                placeholder="특정 관점에서의 리뷰가 필요한 경우 프롬프트를 직접 작성해주세요."
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50/50 text-blue-600 rounded-xl ring-1 ring-blue-100
                         hover:bg-blue-100/50 transition-colors duration-200"
              >
                <Send className="w-4 h-4" />
                리뷰 요청
              </button>
              <button
                type="button"
                onClick={() => {
                  dispatch({ type: 'SET_PROMPT', payload: '' });
                  dispatch({ type: 'SET_PULL_REQUEST_URL', payload: '' });
                }}
                className="px-4 py-2.5 bg-gray-50/50 text-gray-600 rounded-xl ring-1 ring-gray-100
                         hover:bg-gray-100/50 transition-colors duration-200"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {state.reviewResult && (
          <div className={`${styles.card} !p-8`}>
            <h3 className="text-lg font-medium text-gray-900 mb-4">리뷰 결과</h3>
            <div className="bg-gray-50/50 rounded-xl p-4 ring-1 ring-gray-100">
              <pre className="whitespace-pre-wrap text-gray-700 font-mono text-sm">
                {state.reviewResult}
              </pre>
            </div>
          </div>
        )}

        {state.error && (
          <div className="bg-red-50/50 p-4 rounded-xl ring-1 ring-red-100">
            <p className="text-red-600">{state.error}</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}; 