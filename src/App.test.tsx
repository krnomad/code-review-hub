import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders admin mode button', () => {
    render(<App />);
    const adminButton = screen.getByText('관리자 모드');
    expect(adminButton).toBeInTheDocument();
  });

  test('renders request form tab by default', () => {
    render(<App />);
    const requestFormTab = screen.getByText('요청서 작성');
    expect(requestFormTab).toBeInTheDocument();
  });

  test('renders form title', () => {
    render(<App />);
    const formTitle = screen.getByText('코드 리뷰 시스템 사용 요청서');
    expect(formTitle).toBeInTheDocument();
  });
});
