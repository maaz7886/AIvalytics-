// components/ReportGenerator.jsx
'use client';

export default function ReportGenerator({ onGenerate, isGenerating, isDisabled }) {
  return (
    <button
      onClick={onGenerate}
      disabled={isDisabled || isGenerating}
      className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
        isDisabled 
          ? 'bg-gray-300 cursor-not-allowed' 
          : isGenerating 
            ? 'bg-blue-400 cursor-wait' 
            : 'bg-blue-600 hover:bg-blue-700'
      }`}
    >
      {isGenerating ? 'Generating Report...' : 'Generate PDF Report'}
    </button>
  );
}