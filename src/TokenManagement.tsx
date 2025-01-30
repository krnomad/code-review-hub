import React, { useState } from 'react';
import { Lock, Copy, Book, AlertCircle, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '../src/components/ui/alert';

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

const CodeReviewDashboard: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showAdminAuth, setShowAdminAuth] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [pullRequestUrl, setPullRequestUrl] = useState<string>('');
  const [reviewResult, setReviewResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showReference, setShowReference] = useState<boolean>(false);

  // 요청서 관련 상태
  const [requestForm, setRequestForm] = useState<RequestForm>({
    projectName: '',
    repositoryUrl: '',
    description: '',
    purpose: '',
    expectedDuration: '3',
    teamSize: ''
  });

  // 목업 프로젝트 데이터
  const [myProjects] = useState<Project[]>([
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
  ]);

  // 탭 관리
  const adminTabs = ['BitBucket 토큰 관리', '요청서 관리', '프로젝트 관리'];
  const userTabs = ['요청서 작성', 'Prompt 테스트', '내 프로젝트'];
  const [selectedTab, setSelectedTab] = useState<string>(userTabs[0]);

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 여기서 요청서 제출 API 호출
    alert('요청서가 제출되었습니다. 관리자 검토 후 승인될 예정입니다.');
    setRequestForm({
      projectName: '',
      repositoryUrl: '',
      description: '',
      purpose: '',
      expectedDuration: '3',
      teamSize: ''
    });
  };

  const getStatusBadge = (status: 'approved' | 'pending' | 'rejected') => {
    switch (status) {
      case 'approved':
        return (
          <span className="flex items-center text-green-600">
            <CheckCircle className="w-4 h-4 mr-1" />
            승인됨
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center text-red-600">
            <XCircle className="w-4 h-4 mr-1" />
            거절됨
          </span>
        );
      default:
        return (
          <span className="flex items-center text-yellow-600">
            <Clock className="w-4 h-4 mr-1" />
            검토중
          </span>
        );
    }
  };

  const handleTestReview = async () => {
    setError('');
    setReviewResult('');

    try {
      // API 호출 시뮬레이션
      const response = await mockApiCall();
      
      if (response.error) {
        switch (response.errorType) {
          case 'SYSTEM_ERROR':
            setError('코드 리뷰 시스템에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
            break;
          case 'NO_TOKEN':
            setError('해당 프로젝트에 대한 요청서가 필요합니다. 먼저 요청서를 작성해주세요.');
            break;
          case 'INVALID_TOKEN':
            setError('BitBucket 토큰이 유효하지 않습니다. 관리자에게 문의해주세요.');
            break;
          default:
            setError('알 수 없는 오류가 발생했습니다.');
        }
        return;
      }

      setReviewResult(response.result || '');
    } catch (err) {
      setError('서버와의 통신 중 오류가 발생했습니다.');
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

  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt);
  };

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'admin123') {
      setIsAdmin(true);
      setShowAdminAuth(false);
      setSelectedTab(adminTabs[0]);
    } else {
      setError('잘못된 관리자 비밀번호입니다.');
    }
  };

  const renderContent = () => {
    switch (selectedTab) {
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
                  value={requestForm.projectName}
                  onChange={(e) => setRequestForm({...requestForm, projectName: e.target.value})}
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
                  value={requestForm.repositoryUrl}
                  onChange={(e) => setRequestForm({...requestForm, repositoryUrl: e.target.value})}
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
                  value={requestForm.description}
                  onChange={(e) => setRequestForm({...requestForm, description: e.target.value})}
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
                  value={requestForm.purpose}
                  onChange={(e) => setRequestForm({...requestForm, purpose: e.target.value})}
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
                    value={requestForm.expectedDuration}
                    onChange={(e) => setRequestForm({...requestForm, expectedDuration: e.target.value})}
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
                    value={requestForm.teamSize}
                    onChange={(e) => setRequestForm({...requestForm, teamSize: e.target.value})}
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
                  value={pullRequestUrl}
                  onChange={(e) => setPullRequestUrl(e.target.value)}
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
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full px-3 py-2 border rounded h-32"
                    placeholder="프롬프트를 입력하세요..."
                  />
                  <div className="absolute right-2 top-2 space-x-2">
                    <button
                      onClick={copyPrompt}
                      className="p-2 text-gray-500 hover:text-gray-700 rounded"
                      title="복사"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowReference(!showReference)}
                      className="p-2 text-gray-500 hover:text-gray-700 rounded"
                      title="레퍼런스"
                    >
                      <Book className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {showReference && (
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

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {reviewResult && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">리뷰 결과</h3>
                <pre className="bg-gray-50 p-4 rounded whitespace-pre-wrap">
                  {reviewResult}
                </pre>
              </div>
            )}
          </div>
        );

      case '내 프로젝트':
        return (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">내 프로젝트 목록</h2>
              <div className="space-y-4">
                {myProjects.map(project => (
                  <div key={project.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium">{project.name}</h3>
                        <div className="mt-2 text-sm text-gray-500">
                          요청일: {project.requestDate}
                        </div>
                        {project.expiryDate && (
                          <div className="text-sm text-gray-500">
                            만료일: {project.expiryDate}
                          </div>
                        )}
                        {project.status === 'approved' && (
                          <div className="mt-2 text-sm">
                            총 리뷰 횟수: {project.reviewCount}회
                          </div>
                        )}
                        {project.status === 'rejected' && (
                          <div className="mt-2 text-sm text-red-600">
                            거절 사유: {project.rejectReason}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        {getStatusBadge(project.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderTabs = () => {
    const tabs = isAdmin ? adminTabs : userTabs;
    
    return (
      <div className="mb-6">
        <div className="border-b">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${selectedTab === tab
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

  return (
    <div className="container mx-auto p-4">
      {renderTabs()}
      {renderContent()}
    </div>
  );
};

export default CodeReviewDashboard;