import { Button } from '../ui/button';
import { Card } from '../ui/card';
import type { TemplateType } from './app';

interface ChooseTemplateScreenProps {
  selectedTemplate: TemplateType | null;
  onTemplateSelect: (template: TemplateType) => void;
  onBack: () => void;
  onNext: () => void;
}

const templates = [
  {
    id: 'single' as TemplateType,
    name: 'Single Photo',
    description: 'One large photo',
    preview: (
      <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
        <div className="w-20 h-20 bg-gray-400 rounded"></div>
      </div>
    )
  },
  {
    id: '2-strip' as TemplateType,
    name: '2-Photo Strip',
    description: 'Two photos vertically',
    preview: (
      <div className="w-full h-full bg-gray-200 rounded flex flex-col gap-2 p-2">
        <div className="flex-1 bg-gray-400 rounded"></div>
        <div className="flex-1 bg-gray-400 rounded"></div>
      </div>
    )
  },
  {
    id: '4-strip' as TemplateType,
    name: '4-Photo Strip',
    description: 'Four photos vertically',
    preview: (
      <div className="w-full h-full bg-gray-200 rounded flex flex-col gap-1 p-2">
        <div className="flex-1 bg-gray-400 rounded"></div>
        <div className="flex-1 bg-gray-400 rounded"></div>
        <div className="flex-1 bg-gray-400 rounded"></div>
        <div className="flex-1 bg-gray-400 rounded"></div>
      </div>
    )
  },
  {
    id: 'collage' as TemplateType,
    name: 'Collage',
    description: 'Four photos in grid',
    preview: (
      <div className="w-full h-full bg-gray-200 rounded grid grid-cols-2 gap-1 p-2">
        <div className="bg-gray-400 rounded"></div>
        <div className="bg-gray-400 rounded"></div>
        <div className="bg-gray-400 rounded"></div>
        <div className="bg-gray-400 rounded"></div>
      </div>
    )
  }
];

export function ChooseTemplateScreen({ 
  selectedTemplate, 
  onTemplateSelect, 
  onBack, 
  onNext 
}: ChooseTemplateScreenProps) {
  return (
    <div className="w-full h-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 px-8 py-6 border-b">
        <h1 className="text-4xl font-bold text-gray-800 text-center">
          Choose Your Template
        </h1>
        <p className="text-xl text-gray-600 text-center mt-2">
          Select the layout for your photo strip
        </p>
      </div>

      {/* Template Grid */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedTemplate === template.id
                  ? 'ring-4 ring-blue-500 shadow-lg transform scale-105'
                  : 'hover:shadow-md'
              }`}
              onClick={() => onTemplateSelect(template.id)}
            >
              <div className="aspect-[3/4] mb-4">
                {template.preview}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {template.name}
              </h3>
              <p className="text-sm text-gray-600">
                {template.description}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-shrink-0 flex justify-between items-center px-8 py-6 border-t bg-gray-50">
        <Button
          onClick={onBack}
          variant="outline"
          className="text-lg px-8 py-6 rounded-xl"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
          Back
        </Button>

        <Button
          onClick={onNext}
          disabled={!selectedTemplate}
          className="bg-green-500 hover:bg-green-600 text-lg px-8 py-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
          </svg>
        </Button>
      </div>
    </div>
  );
}