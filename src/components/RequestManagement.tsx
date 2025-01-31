import React, { useState } from 'react';
import { ClipboardList, CheckCircle, XCircle, Clock, Search } from 'lucide-react';
import { PageLayout } from './ui/PageLayout';
import { styles } from '../styles/commonStyles';

interface Request {
  id: string;
  projectName: string;
  repositoryUrl: string;
  description: string;
  purpose: string;
  expectedDuration: string;
  teamSize: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  updatedAt: string;
}

// Mock data
const mockRequests: Request[] = Array.from({ length: 15 }, (_, i) => ({
  id: `req-${i + 1}`,
  projectName: `프로젝트 ${i + 1}`,
  repositoryUrl: `https://bitbucket.org/project-${i + 1}`,
  description: `프로젝트 ${i + 1}에 대한 설명입니다.`,
  purpose: `코드 품질 향상 및 개발 생산성 증대`,
  expectedDuration: ['3', '6', '12'][Math.floor(Math.random() * 3)],
  teamSize: String(Math.floor(Math.random() * 10) + 1),
  status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)] as Request['status'],
  submittedAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  updatedAt: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
}));

export default function RequestManagement() {
  const [requests, setRequests] = useState<Request[]>(mockRequests);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    projectName: '',
    status: '' as '' | Request['status']
  });

  const itemsPerPage = 5;

  // 필터링된 요청 목록
  const filteredRequests = requests.filter(request => {
    return (
      request.projectName.toLowerCase().includes(filters.projectName.toLowerCase()) &&
      (filters.status === '' || request.status === filters.status)
    );
  });

  // 현재 페이지의 요청들
  const currentRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 총 페이지 수
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const handleStatusChange = (requestId: string, newStatus: Request['status']) => {
    setRequests(requests.map(req =>
      req.id === requestId
        ? { ...req, status: newStatus, updatedAt: new Date().toISOString() }
        : req
    ));
  };

  const getStatusBadge = (status: Request['status']) => {
    switch (status) {
      case 'approved':
        return <span className={styles.statusBadge('enabled')}>승인됨</span>;
      case 'rejected':
        return <span className={styles.statusBadge('denied')}>거절됨</span>;
      default:
        return <span className={styles.statusBadge('waiting')}>검토중</span>;
    }
  };

  return (
    <PageLayout
      icon={ClipboardList}
      title="요청서 관리"
      description="코드 리뷰 시스템 사용 요청서를 관리합니다."
    >
      {/* 검색 필터 */}
      <div className={`${styles.card} mb-6`}>
        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
          <Search className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
          검색 필터
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              프로젝트명
            </label>
            <input
              type="text"
              value={filters.projectName}
              onChange={e => setFilters({ ...filters, projectName: e.target.value })}
              className={styles.input}
              placeholder="프로젝트명으로 검색"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              상태
            </label>
            <select
              value={filters.status}
              onChange={e => setFilters({ ...filters, status: e.target.value as Request['status'] | '' })}
              className={styles.select}
            >
              <option value="">전체</option>
              <option value="pending">검토중</option>
              <option value="approved">승인됨</option>
              <option value="rejected">거절됨</option>
            </select>
          </div>
        </div>
      </div>

      {/* 요청서 목록 */}
      <div className="space-y-4">
        {currentRequests.map(request => (
          <div key={request.id} className={styles.card}>
            <div className="flex justify-between items-start">
              <div className="space-y-3 flex-1">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {request.projectName}
                  </h3>
                  {getStatusBadge(request.status)}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">저장소 URL</p>
                    <p className="text-gray-900 dark:text-gray-100">{request.repositoryUrl}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">팀 규모</p>
                    <p className="text-gray-900 dark:text-gray-100">{request.teamSize}명</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">예상 사용 기간</p>
                    <p className="text-gray-900 dark:text-gray-100">{request.expectedDuration}개월</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">제출일</p>
                    <p className="text-gray-900 dark:text-gray-100">
                      {new Date(request.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">설명</p>
                  <p className="text-gray-900 dark:text-gray-100">{request.description}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">사용 목적</p>
                  <p className="text-gray-900 dark:text-gray-100">{request.purpose}</p>
                </div>
              </div>

              {request.status === 'pending' && (
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleStatusChange(request.id, 'approved')}
                    className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/50 rounded-lg"
                    title="승인"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleStatusChange(request.id, 'rejected')}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-lg"
                    title="거절"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border dark:border-gray-700 rounded-lg disabled:opacity-50
                     text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            이전
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 border dark:border-gray-700 rounded-lg transition-colors
                ${currentPage === page
                  ? 'bg-blue-500 dark:bg-blue-600 text-white border-blue-500 dark:border-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border dark:border-gray-700 rounded-lg disabled:opacity-50
                     text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            다음
          </button>
        </div>
      )}
    </PageLayout>
  );
} 