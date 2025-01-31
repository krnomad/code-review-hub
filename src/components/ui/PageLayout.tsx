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
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-blue-50/50 ring-1 ring-blue-100">
          <Icon className="w-10 h-10 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-gray-900">{title}</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}; 