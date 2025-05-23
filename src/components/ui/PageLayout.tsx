import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PageLayoutProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  icon: Icon,
  title,
  description,
  children
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="mb-8 sm:mb-12 text-center">
        <div className="inline-flex items-center justify-center p-2 sm:p-3 mb-4 sm:mb-6 rounded-2xl bg-blue-50/50 ring-1 ring-blue-100">
          <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">{title}</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
};