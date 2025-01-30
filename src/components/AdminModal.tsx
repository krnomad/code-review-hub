import { State, Action } from '../types';
import { Dispatch } from 'react';

interface AdminModalProps {
  state: State;
  dispatch: Dispatch<Action>;
  onClose: () => void;
}

// 관리자 인증 모달 컴포넌트
export const AdminModal = ({ state, dispatch, onClose }: AdminModalProps) => {
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (state.adminPassword === '1q2w3e') {
      dispatch({ type: 'SET_ADMIN', payload: true });
      dispatch({ type: 'TOGGLE_ADMIN_MODAL' });
      dispatch({ type: 'SET_ADMIN_PASSWORD', payload: '' });
      dispatch({ type: 'SET_ADMIN_ERROR', payload: '' });
      dispatch({ type: 'SET_SELECTED_TAB', payload: 'adminTabs[0]' });
    } else {
      dispatch({ type: 'SET_ADMIN_ERROR', payload: '잘못된 관리자 비밀번호입니다.' });
    }
  };

  return (
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
  );
}; 