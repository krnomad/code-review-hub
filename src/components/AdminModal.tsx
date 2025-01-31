import { State, Action } from '../types';
import { Dispatch } from 'react';
import { styles } from '../styles/commonStyles';

interface AdminModalProps {
  state: State;
  dispatch: Dispatch<Action>;
  onClose: () => void;
}

// 관리자 인증 모달 컴포넌트
export const AdminModal = ({ state, dispatch, onClose }: AdminModalProps) => {
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (state.adminPassword === 'demodemo') {
      dispatch({ type: 'SET_ADMIN', payload: true });
      dispatch({ type: 'TOGGLE_ADMIN_MODAL' });
      dispatch({ type: 'SET_ADMIN_PASSWORD', payload: '' });
      dispatch({ type: 'SET_ADMIN_ERROR', payload: '' });
      dispatch({ type: 'SET_SELECTED_TAB', payload: '요청서 관리' });
    } else {
      dispatch({ type: 'SET_ADMIN_ERROR', payload: '잘못된 관리자 비밀번호입니다.' });
    }
  };

  return (
    <>
      {/* Fixed overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="bg-white p-6 rounded-lg w-96 shadow-xl pointer-events-auto">
          <h3 className="text-lg font-semibold mb-4">관리자 인증</h3>
          <form onSubmit={handleAdminLogin}>
            <input
              type="password"
              value={state.adminPassword}
              onChange={(e) => dispatch({ type: 'SET_ADMIN_PASSWORD', payload: e.target.value })}
              className={styles.input}
              placeholder="관리자 비밀번호를 입력하세요"
              autoFocus
            />
            {state.adminError && (
              <p className="text-red-500 text-sm mt-2">{state.adminError}</p>
            )}
            <div className="flex justify-end space-x-2 mt-4">
              <button
                type="button"
                onClick={onClose}
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
    </>
  );
}; 