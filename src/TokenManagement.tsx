import React, { useState, useEffect } from 'react';
import { Trash2, Edit, AlertCircle, CheckCircle, Search } from 'lucide-react';

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

// Mock data for demonstration
const mockTokens = [
  {
    project_id: "project-1",
    token: "xyz789",
    email: "dev1@company.com",
    created_at: "2024-01-20T10:00:00Z",
    updated_at: "2024-01-20T10:00:00Z",
    validation_status: "valid",
    last_validation_date: "2024-01-28T10:00:00Z"
  },
  {
    project_id: "project-2",
    token: "abc123",
    email: "dev2@company.com",
    created_at: "2024-01-21T15:30:00Z",
    updated_at: "2024-01-22T09:15:00Z",
    validation_status: "invalid",
    last_validation_date: "2024-01-28T10:00:00Z",
    validation_fail_date: "2024-01-28T10:00:00Z"
  }
] as Token[];

export default function TokenManagement() {
  const [tokens, setTokens] = useState<Token[]>(mockTokens);
  const [editingToken, setEditingToken] = useState<Token | null>(null);
  const [form, setForm] = useState({
    project_id: '',
    token: '',
    email: ''
  });
  
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
  };

  const resetForm = () => {
    setEditingToken(null);
    setForm({ project_id: '', token: '', email: '' });
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">BitBucket 토큰 관리</h2>
      
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
        {filteredTokens.length === 0 ? (
          <div className="text-gray-500">표시할 토큰이 없습니다.</div>
        ) : (
          <div className="space-y-4">
            {filteredTokens.map(token => (
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
      </div>

      {/* 토큰 추가/수정 폼 */}
      <div className="border p-6 rounded-lg bg-white shadow">
        <h3 className="text-xl font-semibold mb-4">
          {editingToken ? '토큰 수정' : '새 토큰 추가'}
        </h3>
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
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {editingToken ? '수정' : '추가'}
            </button>
            {editingToken && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                취소
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}