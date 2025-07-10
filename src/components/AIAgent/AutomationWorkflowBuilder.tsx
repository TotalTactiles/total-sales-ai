
import React from 'react';
import NativeWorkflowBuilder from '@/components/Automation/NativeWorkflowBuilder';

const AutomationWorkflowBuilder = () => {
  const [showBuilder, setShowBuilder] = React.useState(false);
  
  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Workflow Builder</h2>
        <p className="text-gray-600 mb-6">Create custom automation workflows with drag-and-drop simplicity</p>
        <button
          onClick={() => setShowBuilder(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
        >
          Open Workflow Builder
        </button>
      </div>
      
      {showBuilder && (
        <NativeWorkflowBuilder
          onClose={() => setShowBuilder(false)}
          onSave={(workflow) => {
            console.log('Workflow saved:', workflow);
            setShowBuilder(false);
          }}
        />
      )}
    </div>
  );
};

export default AutomationWorkflowBuilder;
