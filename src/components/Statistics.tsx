import React, { useState } from 'react';
import { ChartPie, Calendar, Users, GitBranch, Clock, MessageSquare, CheckCircle2, GitPullRequest, ChevronUp, ChevronDown } from 'lucide-react';
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

// Mock data (assuming it's the same as provided)
const dailyUsage = Array.from({ length: 7 }, (_, i) => ({
  date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' }),
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
  reviews: Math.floor(Math.random() * 30) + (i >= 9 && i <= 18 ? 20 : 5),
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
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    summaryCards: true, // As per instruction, this might not be collapsible, but state is included for consistency
    reviewMetrics: true,
    hourlyDistribution: true,
    languageAndSizeDistribution: true,
    topReviewers: true,
    languageTrends: true,
    dailyUsage: true,
    projectStatusAndTopProjects: true,
    monthlyTrend: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const totalReviews = dailyUsage.reduce((sum, day) => sum + day.reviews, 0);
  const totalProjects = projectStats.reduce((sum, status) => sum + status.value, 0);
  const activeUsers = reviewerStats.length; // Example: Number of listed reviewers

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (!percent || percent < 0.04) return null; 
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6; // Adjusted for better positioning
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" fontSize="10px" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const pieTooltipFormatter = (value: number, name: string, entry: any) => {
    const total = entry.payload?.totalForPercentCalc;
    if (total) {
      const percentage = ((value / total) * 100).toFixed(1);
      return [`${value} (${percentage}%)`, name];
    }
    return [value, name];
  };
  
  const legendFormatter = (value: string, entry: any) => {
    const { payload, color } = entry;
    if (payload && typeof payload.value !== 'undefined' && payload.name) {
        const itemValue = payload.value;
        const itemName = payload.name;
        const totalForPercent = payload.totalForPercentCalc;
        if (typeof totalForPercent !== 'undefined' && totalForPercent > 0) { // Check if totalForPercent is valid
            const percentage = ((itemValue / totalForPercent) * 100).toFixed(1);
            return <span style={{ color, fontSize: '12px' }}>{`${itemName}: ${itemValue} (${percentage}%)`}</span>;
        }
        return <span style={{ color, fontSize: '12px' }}>{`${itemName}: ${itemValue}`}</span>;
    }
    return <span style={{ color, fontSize: '12px' }}>{value}</span>;
  };

  const languageStatsTotal = languageStats.reduce((sum, entry) => sum + entry.value, 0);
  const languageStatsWithTotal = languageStats.map(entry => ({ ...entry, totalForPercentCalc: languageStatsTotal }));

  const reviewSizeDistributionTotal = reviewSizeDistribution.reduce((sum, entry) => sum + entry.count, 0);
  const reviewSizeDistributionWithTotal = reviewSizeDistribution.map(entry => ({ ...entry, value: entry.count, name: entry.size, totalForPercentCalc: reviewSizeDistributionTotal }));
  
  const projectStatsTotal = projectStats.reduce((sum, entry) => sum + entry.value, 0);
  const projectStatsWithTotal = projectStats.map(entry => ({ ...entry, totalForPercentCalc: projectStatsTotal }));

  const SectionHeader: React.FC<{ title: string; sectionKey: string; }> = ({ title, sectionKey }) => (
    <button
      onClick={() => toggleSection(sectionKey)}
      className="flex justify-between items-center w-full text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4"
    >
      {title}
      {openSections[sectionKey] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
    </button>
  );

  return (
    <PageLayout
      icon={ChartPie}
      title="통계"
      description="코드 리뷰 시스템의 사용 현황과 통계를 확인합니다."
    >
      {/* Summary Cards Section (Not collapsible as per instruction, but structure is similar) */}
      <div className={`${styles.card} mb-6`}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">요약</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`${styles.card} bg-white dark:bg-gray-800 shadow-sm`}>
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
            <div className={`${styles.card} bg-white dark:bg-gray-800 shadow-sm`}>
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">활성 프로젝트</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{projectStatsWithTotal.find(p=>p.name === "활성")?.value || 0}</h3>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                </div>
            </div>
            <div className={`${styles.card} bg-white dark:bg-gray-800 shadow-sm`}>
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
      </div>
      
      {/* Review Metrics Section */}
      <div className={`${styles.card} mb-6`}>
        <SectionHeader title="리뷰 주요 지표" sectionKey="reviewMetrics" />
        {openSections.reviewMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reviewMetrics.map(({ name, value, icon: Icon }) => (
              <div key={name} className={`${styles.card} bg-white dark:bg-gray-800 shadow-sm`}>
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
        )}
      </div>

      {/* Hourly Distribution Section */}
      <div className={`${styles.card} mb-6`}>
        <SectionHeader title="시간대별 리뷰 분포" sectionKey="hourlyDistribution" />
        {openSections.hourlyDistribution && (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyDistribution} margin={{ top: 5, right: 20, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" name="시간" tick={{fontSize: 12}} />
                <YAxis name="리뷰 수" tick={{fontSize: 12}} />
                <Tooltip formatter={(value: number) => [value, "리뷰 수"]} labelFormatter={(label: string) => `${label} 리뷰`} />
                <Legend verticalAlign="bottom" layout="horizontal" wrapperStyle={{fontSize: '12px', paddingTop: '10px'}} formatter={legendFormatter} />
                <Bar dataKey="reviews" fill="#3b82f6" name="리뷰 수" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Language Stats and Review Size Distribution Section */}
      <div className={`${styles.card} mb-6`}>
        <SectionHeader title="언어별 및 리뷰 크기별 분포" sectionKey="languageAndSizeDistribution" />
        {openSections.languageAndSizeDistribution && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`${styles.card} bg-white dark:bg-gray-800 shadow-sm pt-4`}>
              <h3 className="text-md font-semibold mb-2 text-center text-gray-700 dark:text-gray-300">언어별 분포</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={languageStatsWithTotal}
                      cx="50%"
                      cy="45%" // Adjusted for legend
                      labelLine={false}
                      label={renderCustomizedLabel}
                      innerRadius={50} // Adjusted
                      outerRadius={90} // Adjusted
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                    >
                      {languageStatsWithTotal.map((entry, index) => (
                        <Cell key={`cell-lang-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={pieTooltipFormatter} />
                    <Legend verticalAlign="bottom" layout="horizontal" align="center" iconSize={10} wrapperStyle={{fontSize: '10px', marginTop: '10px', lineHeight: '1.2em'}} formatter={legendFormatter}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={`${styles.card} bg-white dark:bg-gray-800 shadow-sm pt-4`}>
              <h3 className="text-md font-semibold mb-2 text-center text-gray-700 dark:text-gray-300">리뷰 크기 분포</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reviewSizeDistributionWithTotal}
                      cx="50%"
                      cy="45%" // Adjusted for legend
                      labelLine={false}
                      label={renderCustomizedLabel}
                      innerRadius={50} // Adjusted
                      outerRadius={90} // Adjusted
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                    >
                      {reviewSizeDistributionWithTotal.map((entry, index) => (
                        <Cell key={`cell-size-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={pieTooltipFormatter} />
                    <Legend verticalAlign="bottom" layout="horizontal" align="center" iconSize={10} wrapperStyle={{fontSize: '10px', marginTop: '10px', lineHeight: '1.2em'}} formatter={legendFormatter}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Top Reviewers Section */}
      <div className={`${styles.card} mb-6`}>
        <SectionHeader title="리뷰어 순위" sectionKey="topReviewers" />
        {openSections.topReviewers && (
          <div className="h-96"> {/* Increased height for better visibility of vertical bar chart labels */}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reviewerStats} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" name="수치" tick={{fontSize: 12}} />
                <YAxis dataKey="name" type="category" width={70} name="리뷰어" tick={{fontSize: 12}}/>
                <Tooltip />
                <Legend verticalAlign="bottom" layout="horizontal" wrapperStyle={{fontSize: '12px', paddingTop: '10px'}} formatter={legendFormatter} />
                <Bar dataKey="reviews" name="리뷰 수" fill="#3b82f6" />
                <Bar dataKey="comments" name="코멘트 수" fill="#22c55e" />
                <Bar dataKey="approvals" name="승인 수" fill="#eab308" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Language Trends Section */}
      <div className={`${styles.card} mb-6`}>
        <SectionHeader title="언어별 리뷰 추이" sectionKey="languageTrends" />
        {openSections.languageTrends && (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyLanguageTrend} margin={{ top: 5, right: 20, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" name="월" tick={{fontSize: 12}} />
                <YAxis name="리뷰 수" tick={{fontSize: 12}}/>
                <Tooltip />
                <Legend verticalAlign="bottom" layout="horizontal" wrapperStyle={{fontSize: '12px', paddingTop: '10px'}} formatter={legendFormatter} />
                {Object.entries(monthlyLanguageTrend[0] || {}) // Add null check for monthlyLanguageTrend[0]
                  .filter(([key]) => key !== 'month')
                  .map(([key, _], index) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={languageStats[index]?.color || '#000000'}
                      name={key}
                      dot={{r:3}}
                      activeDot={{r:5}}
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      
      {/* Daily Usage Chart Section */}
      <div className={`${styles.card} mb-6`}>
        <SectionHeader title="일일 사용 현황" sectionKey="dailyUsage" />
        {openSections.dailyUsage && (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyUsage} margin={{ top: 5, right: 20, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" name="날짜" tick={{fontSize: 12}} />
                <YAxis name="수치" tick={{fontSize: 12}}/>
                <Tooltip />
                <Legend verticalAlign="bottom" layout="horizontal" wrapperStyle={{fontSize: '12px', paddingTop: '10px'}} formatter={legendFormatter} />
                <Line type="monotone" dataKey="reviews" stroke="#3b82f6" name="리뷰 수" dot={{r:3}} activeDot={{r:5}}/>
                <Line type="monotone" dataKey="projects" stroke="#22c55e" name="프로젝트 수" dot={{r:3}} activeDot={{r:5}}/>
                <Line type="monotone" dataKey="comments" stroke="#8b5cf6" name="코멘트 수" dot={{r:3}} activeDot={{r:5}}/>
                <Line type="monotone" dataKey="approvals" stroke="#eab308" name="승인 수" dot={{r:3}} activeDot={{r:5}}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Project Status Distribution & Top Projects Section */}
      <div className={`${styles.card} mb-6`}>
        <SectionHeader title="프로젝트 상태 및 상위 프로젝트" sectionKey="projectStatusAndTopProjects" />
        {openSections.projectStatusAndTopProjects && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`${styles.card} bg-white dark:bg-gray-800 shadow-sm pt-4`}>
              <h3 className="text-md font-semibold mb-2 text-center text-gray-700 dark:text-gray-300">프로젝트 상태 분포</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectStatsWithTotal}
                      cx="50%"
                      cy="45%" // Adjusted for legend
                      labelLine={false}
                      label={renderCustomizedLabel}
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                    >
                      {projectStatsWithTotal.map((entry, index) => (
                        <Cell key={`cell-proj-stat-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={pieTooltipFormatter} />
                    <Legend verticalAlign="bottom" layout="horizontal" align="center" iconSize={10} wrapperStyle={{fontSize: '10px', marginTop: '10px', lineHeight: '1.2em'}} formatter={legendFormatter}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={`${styles.card} bg-white dark:bg-gray-800 shadow-sm pt-4`}>
              <h3 className="text-md font-semibold mb-2 text-center text-gray-700 dark:text-gray-300">상위 프로젝트 (리뷰 수)</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProjects} margin={{ top: 5, right: 5, left: 5, bottom: 55 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-35} textAnchor="end" interval={0} tick={{fontSize: 11}} name="프로젝트" />
                    <YAxis name="리뷰 수" tick={{fontSize: 12}}/>
                    <Tooltip formatter={(value: number) => [value, "리뷰 수"]} />
                    <Legend verticalAlign="bottom" layout="horizontal" wrapperStyle={{fontSize: '12px', paddingTop: '40px'}} formatter={legendFormatter} />
                    <Bar dataKey="reviews" fill="#3b82f6" name="리뷰 수" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Monthly Trend Section */}
      <div className={`${styles.card} mb-6`}>
        <SectionHeader title="월간 추이 (리뷰 및 사용자)" sectionKey="monthlyTrend" />
        {openSections.monthlyTrend && (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend} margin={{ top: 5, right: 20, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" name="월" tick={{fontSize: 12}}/>
                <YAxis yAxisId="left" name="리뷰 수" tick={{fontSize: 12}}/>
                <YAxis yAxisId="right" orientation="right" name="사용자 수" tick={{fontSize: 12}}/>
                <Tooltip />
                <Legend verticalAlign="bottom" layout="horizontal" wrapperStyle={{fontSize: '12px', paddingTop: '10px'}} formatter={legendFormatter} />
                <Line yAxisId="left" type="monotone" dataKey="reviews" stroke="#3b82f6" name="리뷰 수" dot={{r:3}} activeDot={{r:5}}/>
                <Line yAxisId="right" type="monotone" dataKey="users" stroke="#8b5cf6" name="사용자 수" dot={{r:3}} activeDot={{r:5}}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </PageLayout>
  );
}