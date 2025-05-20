import React, { useState } from 'react';
import { FolderGit2, Search, Settings, BarChart2, AlertCircle, CheckCircle, RotateCcw } from 'lucide-react';
import { PageLayout } from './ui/PageLayout';
import { styles } from '../styles/commonStyles';

interface Project {
  id: string;
  name: string;
  repositoryUrl: string;
  status: 'active' | 'inactive' | 'pending';
  usageCount: number;
  lastActivity: string;
  teamMembers: number;
  startDate: string;
  endDate: string;
  description: string;
}

// Mock data
const mockProjects: Project[] = Array.from({ length: 20 }, (_, i) => ({
  id: `proj-${i + 1}`,
  name: `프로젝트 ${i + 1}`,
  repositoryUrl: `https://bitbucket.org/project-${i + 1}`,
  status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)] as Project['status'],
  usageCount: Math.floor(Math.random() * 1000),
  lastActivity: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  teamMembers: Math.floor(Math.random() * 20) + 1,
  startDate: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  endDate: new Date(Date.now() + Math.random() * 10000000000).toISOString(),
  description: `프로젝트 ${i + 1}의 코드 리뷰 시스템 활용 현황입니다.`
}));

export default function ProjectManagement() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [currentPage, setCurrentPage] = useState(1);
  const initialFilters = {
    name: '',
    status: '' as '' | Project['status'],
    teamMembersRange: '',
  };
  const [filters, setFilters] = useState(initialFilters);

  const itemsPerPage = 5;

  // 필터링된 프로젝트 목록
  const filteredProjects = projects.filter(project => {
    const nameMatch = project.name.toLowerCase().includes(filters.name.toLowerCase());
    const statusMatch = filters.status === '' || project.status === filters.status;
    
    let teamMembersMatch = true;
    if (filters.teamMembersRange) {
      const { teamMembers } = project;
      switch (filters.teamMembersRange) {
        case '1-5':
          teamMembersMatch = teamMembers >= 1 && teamMembers <= 5;
          break;
        case '6-10':
          teamMembersMatch = teamMembers >= 6 && teamMembers <= 10;
          break;
        case '11-20':
          teamMembersMatch = teamMembers >= 11 && teamMembers <= 20;
          break;
        case '21+':
          teamMembersMatch = teamMembers >= 21;
          break;
        default:
          teamMembersMatch = true;
      }
    }

    return nameMatch && statusMatch && teamMembersMatch;
  });

  // 현재 페이지의 프로젝트들
  const currentProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 총 페이지 수
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return <span className={styles.statusBadge('enabled')}>활성</span>;
      case 'inactive':
        return <span className={styles.statusBadge('denied')}>비활성</span>;
      default:
        return <span className={styles.statusBadge('waiting')}>대기중</span>;
    }
  };

  const handleStatusChange = (projectId: string, newStatus: Project['status']) => {
    setProjects(projects.map(proj =>
      proj.id === projectId ? { ...proj, status: newStatus } : proj
    ));
  };

  return (
    <PageLayout
      icon={FolderGit2}
      title="프로젝트 관리"
      description="코드 리뷰 시스템을 사용 중인 프로젝트들의 현황을 관리합니다."
    >
      {/* 검색 필터 */}
      <div className={`${styles.card} mb-6`}>
        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
          <Search className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
          검색 필터
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label htmlFor="projectNameFilter" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              프로젝트명
            </label>
            <input
              id="projectNameFilter"
              type="text"
              value={filters.name}
              onChange={e => setFilters({ ...filters, name: e.target.value })}
              className={styles.input}
              placeholder="프로젝트명으로 검색"
            />
          </div>
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              상태
            </label>
            <select
              id="statusFilter"
              value={filters.status}
              onChange={e => setFilters({ ...filters, status: e.target.value as Project['status'] | '' })}
              className={styles.select}
            >
              <option value="">전체 상태</option>
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
              <option value="pending">대기중</option>
            </select>
          </div>
          <div>
            <label htmlFor="teamMembersFilter" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              팀 구성원 수
            </label>
            <select
              id="teamMembersFilter"
              value={filters.teamMembersRange}
              onChange={e => setFilters({ ...filters, teamMembersRange: e.target.value })}
              className={styles.select}
            >
              <option value="">전체 규모</option>
              <option value="1-5">1-5명</option>
              <option value="6-10">6-10명</option>
              <option value="11-20">11-20명</option>
              <option value="21+">21명 이상</option>
            </select>
          </div>
          <div className="md:col-span-3 flex justify-end mt-2">
            <button
              onClick={() => setFilters(initialFilters)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              필터 초기화
            </button>
          </div>
        </div>
      </div>

      {/* 프로젝트 목록 */}
      <div className="space-y-4">
        {currentProjects.map(project => (
          <div key={project.id} className={styles.card}>
            <div className="flex justify-between items-start">
              <div className="space-y-3 flex-1">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {project.repositoryUrl}
                    </p>
                  </div>
                  {getStatusBadge(project.status)}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">사용 횟수</p>
                    <p className="text-gray-900 dark:text-gray-100 flex items-center">
                      <BarChart2 className="w-4 h-4 mr-1" />
                      {project.usageCount}회
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">팀 구성원</p>
                    <p className="text-gray-900 dark:text-gray-100">
                      {project.teamMembers}명
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">시작일</p>
                    <p className="text-gray-900 dark:text-gray-100">
                      {new Date(project.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">종료 예정일</p>
                    <p className="text-gray-900 dark:text-gray-100">
                      {new Date(project.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-500 dark:text-gray-400">최근 활동</p>
                  <p className="text-gray-900 dark:text-gray-100">
                    {new Date(project.lastActivity).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                {project.status !== 'active' && (
                  <button
                    onClick={() => handleStatusChange(project.id, 'active')}
                    className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/50 rounded-lg"
                    title="활성화"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                )}
                {project.status !== 'inactive' && (
                  <button
                    onClick={() => handleStatusChange(project.id, 'inactive')}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-lg"
                    title="비활성화"
                  >
                    <AlertCircle className="w-5 h-5" />
                  </button>
                )}
                <button
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg"
                  title="설정"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
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
                     text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800
                     min-w-[2.5rem] min-h-[2.5rem] flex items-center justify-center"
          >
            이전
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 border dark:border-gray-700 rounded-lg transition-colors
                         min-w-[2.5rem] min-h-[2.5rem] flex items-center justify-center
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
                     text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800
                     min-w-[2.5rem] min-h-[2.5rem] flex items-center justify-center"
          >
            다음
          </button>
        </div>
      )}
    </PageLayout>
  );
}