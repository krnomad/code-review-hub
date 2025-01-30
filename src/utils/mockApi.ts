// API 모의 함수들
interface MockApiResponse {
  error: boolean;
  errorType?: string;
  result?: string;
}

export const mockApiCall = (): Promise<MockApiResponse> => {
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