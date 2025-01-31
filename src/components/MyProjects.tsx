import React, { useState, useMemo } from 'react';
import { Project, ProjectStatus } from '../types';
import { format } from 'date-fns';
import { LayoutGrid, Search, X } from 'lucide-react';
import { PageLayout } from './ui/PageLayout';
import { styles } from '../styles/commonStyles';

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    projectName: '코드 리뷰 시스템',
    repositoryUrl: 'https://github.com/team/code-review',
    description: 'AI 기반 코드 리뷰 자동화 시스템',
    purpose: '코드 품질 향상 및 리뷰 프로세스 개선',
    expectedDuration: '6',
    teamSize: '8',
    status: 'enabled',
    lastUpdated: new Date('2024-03-15'),
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2', 
    projectName: '결제 시스템 개선',
    repositoryUrl: 'https://github.com/team/payment',
    description: '기존 결제 시스템 성능 개선 프로젝트',
    purpose: '결제 속도 및 안정성 향상',
    expectedDuration: '3',
    teamSize: '5',
    status: 'working',
    lastUpdated: new Date('2024-03-14'),
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '3',
    projectName: '회원 관리 시스템',
    repositoryUrl: 'https://github.com/team/user-management',
    description: '신규 회원 관리 시스템 개발',
    purpose: '회원 데이터 관리 효율화',
    expectedDuration: '12',
    teamSize: '10',
    status: 'waiting',
    lastUpdated: new Date('2024-03-10'),
    createdAt: new Date('2024-03-10'),
  },
  {
    id: '4',
    projectName: '모바일 앱 리뉴얼',
    repositoryUrl: 'https://github.com/team/mobile-app',
    description: '기존 모바일 앱 UI/UX 개선',
    purpose: '사용자 경험 개선',
    expectedDuration: '6',
    teamSize: '7',
    status: 'accepted',
    lastUpdated: new Date('2024-03-12'),
    createdAt: new Date('2024-02-20'),
  },
  {
    id: '5',
    projectName: '데이터 분석 플랫폼',
    repositoryUrl: 'https://github.com/team/data-analytics',
    description: '실시간 데이터 분석 플랫폼 구축',
    purpose: '데이터 기반 의사결정 지원',
    expectedDuration: '12',
    teamSize: '15',
    status: 'denied',
    lastUpdated: new Date('2024-03-01'),
    createdAt: new Date('2024-02-15'),
    denyReason: '현재 리소스 부족으로 인한 거절',
  },
  {
    id: '6',
    projectName: '보안 시스템 강화',
    repositoryUrl: 'https://github.com/team/security',
    description: '전사 보안 시스템 강화 프로젝트',
    purpose: '보안 취약점 개선',
    expectedDuration: '3',
    teamSize: '4',
    status: 'cancelled',
    lastUpdated: new Date('2024-02-28'),
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '7',
    projectName: '검색 엔진 최적화',
    repositoryUrl: 'https://github.com/team/search-engine',
    description: '검색 성능 개선 프로젝트',
    purpose: '검색 속도 및 정확도 향상',
    expectedDuration: '6',
    teamSize: '6',
    status: 'working',
    lastUpdated: new Date('2024-03-13'),
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '8',
    projectName: '채팅 시스템',
    repositoryUrl: 'https://github.com/team/chat',
    description: '실시간 채팅 시스템 개발',
    purpose: '실시간 커뮤니케이션 지원',
    expectedDuration: '6',
    teamSize: '5',
    status: 'enabled',
    lastUpdated: new Date('2024-03-08'),
    createdAt: new Date('2023-12-01'),
  },
  {
    id: '9',
    projectName: '알림 시스템',
    repositoryUrl: 'https://github.com/team/notification',
    description: '푸시 알림 시스템 구축',
    purpose: '사용자 참여율 향상',
    expectedDuration: '3',
    teamSize: '3',
    status: 'denied',
    lastUpdated: new Date('2024-02-25'),
    createdAt: new Date('2024-02-10'),
    denyReason: '유사 프로젝트 진행 중',
  },
  {
    id: '10',
    projectName: '로깅 시스템',
    repositoryUrl: 'https://github.com/team/logging',
    description: '중앙 집중식 로깅 시스템 구축',
    purpose: '시스템 모니터링 개선',
    expectedDuration: '4',
    teamSize: '4',
    status: 'waiting',
    lastUpdated: new Date('2024-03-11'),
    createdAt: new Date('2024-03-11'),
  },
];

const STATUS_LABELS: Record<ProjectStatus, string> = {
  waiting: '대기중',
  accepted: '승인됨',
  working: '작업중',
  enabled: '활성화됨',
  denied: '거절됨',
  cancelled: '취소됨',
};

const MyProjects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = useMemo(() => {
    return MOCK_PROJECTS.filter(project => {
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      const matchesSearch = project.projectName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [statusFilter, searchTerm]);

  const handleCancelRequest = (projectId: string) => {
    // Implement cancel request logic
    console.log('Cancel request for project:', projectId);
  };

  return (
    <PageLayout
      icon={LayoutGrid}
      title="내 프로젝트"
      description="요청한 프로젝트의 상태를 확인하고 관리할 수 있습니다."
    >
      <div className={`${styles.card} mb-6`}>
        <div className="flex gap-4">
          <div className="w-48">
            <select
              className={styles.select}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'all')}
            >
              <option value="all">모든 상태</option>
              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="프로젝트 이름으로 검색"
              className={`${styles.input} pl-10`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {filteredProjects.map(project => (
          <div
            key={project.id}
            className={styles.card}
            onClick={() => setSelectedProject(project)}
          >
            <div className={styles.cardHoverLine} />
            <div className="flex items-center gap-4">
              <span className={styles.statusBadge(project.status)}>
                {STATUS_LABELS[project.status]}
              </span>
              <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                {project.projectName}
              </h3>
              <span className="text-sm text-gray-500 ml-auto">
                최종 수정: {format(project.lastUpdated, 'yyyy-MM-dd HH:mm')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-1/3 bg-white shadow-lg transform transition-transform duration-300 ease-in-out overflow-y-auto
                   ${selectedProject ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {selectedProject && (
          <div className="p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className={styles.statusBadge(selectedProject.status)}>
                  {STATUS_LABELS[selectedProject.status]}
                </span>
                <h3 className="text-2xl font-semibold text-gray-900">{selectedProject.projectName}</h3>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedProject(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-2">Repository URL</label>
                <a
                  href={selectedProject.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                >
                  {selectedProject.repositoryUrl}
                </a>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 block mb-2">설명</label>
                <p className="text-gray-900">{selectedProject.description}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 block mb-2">목적</label>
                <p className="text-gray-900">{selectedProject.purpose}</p>
              </div>

              <div className="flex gap-8">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-500 block mb-2">예상 기간</label>
                  <p className="text-gray-900">{selectedProject.expectedDuration}개월</p>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-500 block mb-2">팀 규모</label>
                  <p className="text-gray-900">{selectedProject.teamSize}명</p>
                </div>
              </div>

              {selectedProject.status === 'denied' && selectedProject.denyReason && (
                <div className="bg-red-50/50 p-4 rounded-xl ring-1 ring-red-100">
                  <label className="text-sm font-medium text-red-800 block mb-2">거절 사유</label>
                  <p className="text-red-700">{selectedProject.denyReason}</p>
                </div>
              )}

              {selectedProject.status !== 'denied' && (
                <button
                  onClick={() => handleCancelRequest(selectedProject.id)}
                  className="w-full px-4 py-2.5 mt-4 bg-red-50/50 text-red-600 rounded-xl ring-1 ring-red-100
                           hover:bg-red-100/50 transition-colors duration-200"
                >
                  취소 요청
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default MyProjects; 