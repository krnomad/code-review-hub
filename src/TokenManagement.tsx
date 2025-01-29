import React, { useState, useEffect } from 'react';
import { Trash2, Edit, AlertCircle, CheckCircle, Search, Plus, X } from 'lucide-react';

interface Token {
  project_id: string;
  token: string;
  email: string;
  created_at: string;
  updated_at: string;
  validation_status: 'valid' | 'invalid' | 'pending';
  last_validation_date: string;
  validation_fail_date?: string;
}

// Mock data with more items for pagination
const mockTokens = Array.from({ length: 25 }, (_, i) => ({
  project_id: `project-${i + 1}`,
  token: `token-${i + 1}`,
  email: `dev${i + 1}@company.com`,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  validation_status: ['valid', 'invalid', 'pending'][Math.floor(Math.random() * 3)] as Token['validation_status'],
  last_validation_date: new Date().toISOString(),
  validation_fail_date: Math.random() > 0.5 ? new Date().toISOString() : undefined,
}));

export default function TokenManagement() {
  const [tokens, setTokens] = useState<Token[]>(mockTokens);
  const [editingToken, setEditingToken] = useState<Token | null>(null);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [form, setForm] = useState({
    project_id: '',
    token: '',
    email: ''
  });
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // 검색 필터 상태
  const [filters, setFilters] = useState({
    project_id: '',
    email: '',
    validation_status: '' as '' | 'valid' | 'invalid' | 'pending'
  });

  // 필터링된 토큰 목록
  const filteredTokens = tokens.filter(token => {
    return (
      token.project_id.toLowerCase().includes(filters.project_id.toLowerCase()) &&
      token.email.toLowerCase().includes(filters.email.toLowerCase()) &&
      (filters.validation_status === '' || token.validation_status === filters.validation_status)
    );
  });

  // 현재 페이지의 토큰들
  const currentTokens = filteredTokens.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 총 페이지 수 계산
  const totalPages = Math.ceil(filteredTokens.length / itemsPerPage);

  // Reset current page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingToken) {
      setTokens(tokens.map(t => 
        t.project_id === form.project_id 
          ? { 
              ...t, 
              ...form,
              updated_at: new Date().toISOString(),
              validation_status: 'pending',
              last_validation_date: new Date().toISOString()
            }
          : t
      ));
    } else {
      setTokens([...tokens, {
        ...form,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        validation_status: 'pending',
        last_validation_date: new Date().toISOString()
      } as Token]);
    }
    resetForm();
  };

  const deleteToken = (project_id: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    setTokens(tokens.filter(t => t.project_id !== project_id));
  };

  const editToken = (token: Token) => {
    setEditingToken(token);
    setForm({
      project_id: token.project_id,
      token: token.token,
      email: token.email
    });
    setShowSidePanel(true);
  };

  const resetForm = () => {
    setEditingToken(null);
    setForm({ project_id: '', token: '', email: '' });
    setShowSidePanel(false);
  };

  const getValidationStatusBadge = (status: Token['validation_status']) => {
    switch (status) {
      case 'valid':
        return <span className="flex items-center text-green-600"><CheckCircle size={16} className="mr-1" /> 유효함</span>;
      case 'invalid':
        return <span className="flex items-center text-red-600"><AlertCircle size={16} className="mr-1" /> 유효하지 않음</span>;
      default:
        return <span className="flex items-center text-gray-600">검증 대기중</span>;
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">BitBucket 토큰 관리</h2>
        <button
          onClick={() => {
            setEditingToken(null);
            setForm({ project_id: '', token: '', email: '' });
            setShowSidePanel(true);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center hover:bg-blue-600"
        >
          <Plus size={20} className="mr-2" />
          새 토큰 추가
        </button>
      </div>
      
      {/* 검색 필터 */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Search size={20} className="mr-2" />
          검색 필터
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">프로젝트 ID</label>
            <input
              type="text"
              value={filters.project_id}
              onChange={e => setFilters({ ...filters, project_id: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              placeholder="프로젝트 ID 검색"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">이메일</label>
            <input
              type="text"
              value={filters.email}
              onChange={e => setFilters({ ...filters, email: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              placeholder="이메일 검색"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">유효성 상태</label>
            <select
              value={filters.validation_status}
              onChange={e => setFilters({ ...filters, validation_status: e.target.value as Token['validation_status'] | '' })}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">전체</option>
              <option value="valid">유효함</option>
              <option value="invalid">유효하지 않음</option>
              <option value="pending">검증 대기중</option>
            </select>
          </div>
        </div>
      </div>

      {/* 토큰 목록 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">저장된 토큰</h3>
        {currentTokens.length === 0 ? (
          <div className="text-gray-500">표시할 토큰이 없습니다.</div>
        ) : (
          <div className="space-y-4">
            {currentTokens.map(token => (
              <div key={token.project_id} className="border p-4 rounded-lg bg-white shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">프로젝트 ID: {token.project_id}</div>
                    <div className="text-sm text-gray-500 mt-1">이메일: {token.email}</div>
                    <div className="text-sm text-gray-500">마지막 수정: {new Date(token.updated_at).toLocaleString()}</div>
                    <div className="mt-2 flex items-center space-x-4">
                      {getValidationStatusBadge(token.validation_status)}
                      <span className="text-sm text-gray-500">
                        마지막 검증: {new Date(token.last_validation_date).toLocaleString()}
                      </span>
                    </div>
                    {token.validation_fail_date && (
                      <div className="text-sm text-red-600 mt-1">
                        유효성 검사 실패일: {new Date(token.validation_fail_date).toLocaleString()}
                      </div>
                    )}
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => editToken(token)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => deleteToken(token.project_id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              이전
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 border rounded ${
                  currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              다음
            </button>
          </div>
        )}
      </div>

      {/* 오버레이 */}
      {showSidePanel && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={resetForm}
        />
      )}

      {/* 사이드 패널 */}
      <div
        className={`fixed right-0 top-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          showSidePanel ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">
              {editingToken ? '토큰 수정' : '새 토큰 추가'}
            </h3>
            <button
              onClick={resetForm}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">프로젝트 ID</label>
              <input
                value={form.project_id}
                onChange={e => setForm({ ...form, project_id: e.target.value })}
                type="text"
                required
                disabled={!!editingToken}
                className="w-full px-3 py-2 border rounded"
                placeholder="프로젝트 ID를 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">API 토큰</label>
              <input
                value={form.token}
                onChange={e => setForm({ ...form, token: e.target.value })}
                type="password"
                required
                className="w-full px-3 py-2 border rounded"
                placeholder="BitBucket API 토큰을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">알림 이메일</label>
              <input
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                type="email"
                required
                className="w-full px-3 py-2 border rounded"
                placeholder="알림을 받을 이메일 주소를 입력하세요"
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {editingToken ? '수정' : '추가'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}