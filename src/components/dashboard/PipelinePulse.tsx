import React from 'react';
import { PipelineLead } from '../../types/dashboard';

interface PipelinePulseProps {
  leads: PipelineLead[];
}

export const PipelinePulse: React.FC<PipelinePulseProps> = ({ leads }) => {
  const getStatusClasses = (status: string) => {
    const statusMap = {
      qualified: 'bg-green-100 text-green-700',
      proposal: 'bg-blue-100 text-blue-700',
      negotiation: 'bg-yellow-100 text-yellow-700',
      closing: 'bg-purple-100 text-purple-700'
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.qualified;
  };

  const getPriorityColor = (priority: string) => {
    const priorityMap = {
      high: 'bg-red-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500'
    };
    return priorityMap[priority as keyof typeof priorityMap] || priorityMap.medium;
  };

  const getAvatarColor = (avatar: string) => {
    const colors = ['bg-blue-100 text-blue-600', 'bg-purple-100 text-purple-600', 'bg-green-100 text-green-600'];
    return colors[avatar.charCodeAt(0) % colors.length];
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <span className="mr-2">🔄</span>Pipeline Pulse
        </h3>
        <button className="flex items-center text-blue-600 hover:text-blue-700 text-sm">
          <span className="mr-1">🔍</span>Filter
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-sm text-gray-600">
              <th className="pb-3">Lead</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Priority</th>
              <th className="pb-3">Value</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody className="space-y-2">
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b last:border-b-0">
                <td className="py-3">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 ${getAvatarColor(lead.avatar)} rounded-full flex items-center justify-center mr-3`}>
                      <span className="font-medium text-sm">{lead.avatar}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{lead.company}</p>
                      <p className="text-sm text-gray-500">{lead.contact}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3">
                  <span className={`px-2 py-1 ${getStatusClasses(lead.status)} rounded-full text-xs`}>
                    {lead.status}
                  </span>
                </td>
                <td className="py-3">
                  <span className={`w-3 h-3 ${getPriorityColor(lead.priority)} rounded-full inline-block`}></span>
                </td>
                <td className="py-3">
                  <span className="font-semibold text-gray-900">{lead.value}</span>
                </td>
                <td className="py-3">
                  <div className="flex space-x-2">
                    <button className="p-1 hover:bg-gray-100 rounded">📞</button>
                    <button className="p-1 hover:bg-gray-100 rounded">📧</button>
                    <button className="p-1 hover:bg-gray-100 rounded">📅</button>
                    <button className="p-1 hover:bg-gray-100 rounded">📋</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
