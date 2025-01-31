import React from 'react';
import { 
  BookOpen, 
  FileText, 
  Code, 
  CheckCircle, 
  AlertCircle,
  GitPullRequest,
  Users,
  Clock,
  Bot,
  GitBranch,
  MessageSquare,
  BarChart,
  HelpCircle,
  Mail
} from 'lucide-react';
import { PageLayout } from './ui/PageLayout';
import { styles } from '../styles/commonStyles';

const Guide: React.FC = () => {
  const guideSteps = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: '1. 요청서 작성',
      description: '프로젝트에 대한 기본 정보와 함께 코드 리뷰 시스템 사용 요청서를 작성합니다.',
      details: [
        {
          icon: <GitBranch className="w-4 h-4" />,
          text: '프로젝트 이름과 Repository URL을 입력합니다.'
        },
        {
          icon: <MessageSquare className="w-4 h-4" />,
          text: '프로젝트 설명과 사용 목적을 상세히 작성합니다.'
        },
        {
          icon: <Users className="w-4 h-4" />,
          text: '예상 사용 기간과 팀 규모를 지정합니다.'
        },
      ]
    },
    {
      icon: <AlertCircle className="w-6 h-6" />,
      title: '2. 승인 대기',
      description: '관리자 검토 후 승인이 이루어집니다.',
      details: [
        {
          icon: <Clock className="w-4 h-4" />,
          text: '요청서는 관리자 검토 단계를 거칩니다.'
        },
        {
          icon: <CheckCircle className="w-4 h-4" />,
          text: '승인 또는 거절 결과는 내 프로젝트 탭에서 확인할 수 있습니다.'
        },
        {
          icon: <HelpCircle className="w-4 h-4" />,
          text: '거절된 경우, 거절 사유를 확인하고 수정하여 다시 제출할 수 있습니다.'
        },
      ]
    },
    {
      icon: <Bot className="w-6 h-6" />,
      title: '3. 시스템 사용',
      description: '승인 후 코드 리뷰 시스템을 사용할 수 있습니다.',
      details: [
        {
          icon: <Code className="w-4 h-4" />,
          text: 'Prompt 테스트 탭에서 AI 코드 리뷰를 테스트해볼 수 있습니다.'
        },
        {
          icon: <GitPullRequest className="w-4 h-4" />,
          text: 'Pull Request URL을 입력하여 실제 코드 리뷰를 요청할 수 있습니다.'
        },
        {
          icon: <MessageSquare className="w-4 h-4" />,
          text: '리뷰 결과는 해당 Pull Request에 자동으로 코멘트됩니다.'
        },
      ]
    },
    {
      icon: <BarChart className="w-6 h-6" />,
      title: '4. 프로젝트 관리',
      description: '내 프로젝트 탭에서 프로젝트 현황을 관리합니다.',
      details: [
        {
          icon: <CheckCircle className="w-4 h-4" />,
          text: '프로젝트의 현재 상태를 확인할 수 있습니다.'
        },
        {
          icon: <AlertCircle className="w-4 h-4" />,
          text: '필요한 경우 프로젝트 취소를 요청할 수 있습니다.'
        },
        {
          icon: <BarChart className="w-4 h-4" />,
          text: '프로젝트별 사용 통계를 확인할 수 있습니다.'
        },
      ]
    }
  ];

  return (
    <PageLayout
      icon={BookOpen}
      title="사용 가이드"
      description="AI 코드 리뷰 시스템의 사용 방법을 안내합니다. 각 단계별 가이드를 참고하여 시스템을 효율적으로 활용하세요."
    >
      <div className="space-y-6">
        {guideSteps.map((step, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.cardHoverLine} />
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-xl bg-blue-50/50 ring-1 ring-blue-100
                              group-hover:bg-blue-100/50 transition-colors duration-300">
                  {React.cloneElement(step.icon, {
                    className: "w-6 h-6 text-blue-600"
                  })}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors duration-300">
                  {step.description}
                </p>
                <ul className="space-y-3">
                  {step.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-gray-600 group-hover:text-gray-700">
                      <div className="text-blue-600/75 group-hover:text-blue-700 transition-colors duration-300">
                        {detail.icon}
                      </div>
                      <span>{detail.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl bg-blue-50/50 p-8 ring-1 ring-blue-100">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-white shadow-sm">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">
              도움이 필요하신가요?
            </h3>
            <p className="text-gray-600">
              추가 문의사항이 있으시다면 관리자에게 문의해 주세요.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Guide; 