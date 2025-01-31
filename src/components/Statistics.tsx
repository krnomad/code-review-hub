// import React, { useState } from 'react';
import { ChartPie, Calendar, Users, GitBranch, Clock, MessageSquare, CheckCircle2, GitPullRequest } from 'lucide-react';
import { PageLayout } from './ui/PageLayout';
import { styles } from '../styles/commonStyles';
import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  ResponsiveContainer,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend
} from 'recharts';

// Mock data
const dailyUsage = Array.from({ length: 7 }, (_, i) => ({
  date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
  reviews: Math.floor(Math.random() * 50) + 10,
  projects: Math.floor(Math.random() * 10) + 1,
  comments: Math.floor(Math.random() * 200) + 50,
  approvals: Math.floor(Math.random() * 30) + 5,
}));

const projectStats = [
  { name: '활성', value: 15, color: '#22c55e' },
  { name: '대기중', value: 8, color: '#eab308' },
  { name: '비활성', value: 5, color: '#ef4444' },
];

const topProjects = [
  { name: '프로젝트 A', reviews: 156 },
  { name: '프로젝트 B', reviews: 132 },
  { name: '프로젝트 C', reviews: 98 },
  { name: '프로젝트 D', reviews: 85 },
  { name: '프로젝트 E', reviews: 74 },
];

const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
  const date = new Date();
  date.setMonth(date.getMonth() - (5 - i));
  return {
    month: date.toLocaleString('default', { month: 'short' }),
    reviews: Math.floor(Math.random() * 500) + 200,
    users: Math.floor(Math.random() * 50) + 20,
  };
});

const hourlyDistribution = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}시`,
  reviews: Math.floor(Math.random() * 30) + (i >= 9 && i <= 18 ? 20 : 5), // 업무 시간대 가중치
}));

const languageStats = [
  { name: 'JavaScript', value: 456, color: '#f7df1e' },
  { name: 'TypeScript', value: 389, color: '#3178c6' },
  { name: 'Python', value: 234, color: '#3776ab' },
  { name: 'Java', value: 178, color: '#007396' },
  { name: 'Go', value: 145, color: '#00add8' },
];

const reviewerStats = [
  { name: '김리뷰', reviews: 156, comments: 423, approvals: 89 },
  { name: '이코드', reviews: 132, comments: 356, approvals: 76 },
  { name: '박개발', reviews: 98, comments: 289, approvals: 65 },
  { name: '최테크', reviews: 85, comments: 234, approvals: 52 },
  { name: '정깃헙', reviews: 74, comments: 198, approvals: 45 },
].sort((a, b) => b.reviews - a.reviews);

const reviewMetrics = [
  { name: '평균 리뷰 시간', value: '2.5시간', icon: Clock },
  { name: '평균 코멘트 수', value: '8.3개', icon: MessageSquare },
  { name: '승인율', value: '78%', icon: CheckCircle2 },
  { name: '수정 요청률', value: '45%', icon: GitPullRequest },
];

const monthlyLanguageTrend = Array.from({ length: 6 }, (_, i) => {
  const date = new Date();
  date.setMonth(date.getMonth() - (5 - i));
  return {
    month: date.toLocaleString('default', { month: 'short' }),
    JavaScript: Math.floor(Math.random() * 100) + 50,
    TypeScript: Math.floor(Math.random() * 100) + 40,
    Python: Math.floor(Math.random() * 100) + 30,
    Java: Math.floor(Math.random() * 100) + 20,
    Go: Math.floor(Math.random() * 100) + 10,
  };
});

const reviewSizeDistribution = [
  { size: '< 50 lines', count: 234, color: '#22c55e' },
  { size: '50-200 lines', count: 345, color: '#3b82f6' },
  { size: '200-500 lines', count: 167, color: '#eab308' },
  { size: '500-1000 lines', count: 56, color: '#ef4444' },
  { size: '> 1000 lines', count: 23, color: '#7c3aed' },
];

export default function Statistics() {
  // const [dateRange, setDateRange] = useState('week'); // week, month, year

  const totalReviews = dailyUsage.reduce((sum, day) => sum + day.reviews, 0);
  const totalProjects = projectStats.reduce((sum, status) => sum + status.value, 0);
  const activeUsers = Math.floor(Math.random() * 50) + 30;

  return (
    <PageLayout
      icon={ChartPie}
      title="통계"
      description="코드 리뷰 시스템의 사용 현황과 통계를 확인합니다."
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className={styles.card}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">총 리뷰 수</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalReviews}</h3>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <GitBranch className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        <div className={styles.card}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">활성 프로젝트</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalProjects}</h3>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        <div className={styles.card}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">활성 사용자</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{activeUsers}</h3>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Review Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {reviewMetrics.map(({ name, value, icon: Icon }) => (
          <div key={name} className={styles.card}>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{name}</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hourly Distribution */}
      <div className={`${styles.card} mb-6`}>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">시간대별 리뷰 분포</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="reviews" fill="#3b82f6" name="리뷰 수" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Language Stats and Review Size Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className={styles.card}>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">언어별 분포</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={languageStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {languageStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.card}>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">리뷰 크기 분포</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reviewSizeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {reviewSizeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Reviewers */}
      <div className={`${styles.card} mb-6`}>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">리뷰어 순위</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reviewerStats} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip />
              <Legend />
              <Bar dataKey="reviews" name="리뷰 수" fill="#3b82f6" />
              <Bar dataKey="comments" name="코멘트 수" fill="#22c55e" />
              <Bar dataKey="approvals" name="승인 수" fill="#eab308" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Language Trends */}
      <div className={styles.card}>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">언어별 리뷰 추이</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyLanguageTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.entries(monthlyLanguageTrend[0])
                .filter(([key]) => key !== 'month')
                .map(([key, _], index) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={languageStats[index]?.color}
                    name={key}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts */}
      <div className="space-y-6">
        {/* Daily Usage Chart */}
        <div className={styles.card}>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">일일 사용 현황</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyUsage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="reviews" stroke="#3b82f6" name="리뷰 수" />
                <Line type="monotone" dataKey="projects" stroke="#22c55e" name="프로젝트 수" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Status Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={styles.card}>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">프로젝트 상태 분포</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {projectStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Projects */}
          <div className={styles.card}>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">상위 프로젝트</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProjects}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="reviews" fill="#3b82f6" name="리뷰 수" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className={styles.card}>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">월간 추이</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="reviews" stroke="#3b82f6" name="리뷰 수" />
                <Line yAxisId="right" type="monotone" dataKey="users" stroke="#8b5cf6" name="사용자 수" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </PageLayout>
  );
} 