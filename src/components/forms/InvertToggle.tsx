import React from 'react';
import { InvertOption } from '../../types';

interface InvertToggleProps {
  value: string;
  onChange: (value: InvertOption) => void;
}

const InvertToggle: React.FC<InvertToggleProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Esquema de colores:
      </label>
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={() => onChange('false')}
          className={`px-4 py-2 rounded border ${
            value === 'false' 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Negro sobre Blanco
        </button>
        <button
          type="button"
          onClick={() => onChange('true')}
          className={`px-4 py-2 rounded border ${
            value === 'true' 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Blanco sobre Negro
        </button>
      </div>
    </div>
  );
};

export default InvertToggle;