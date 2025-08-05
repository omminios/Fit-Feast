import React from 'react';

interface MacroData {
  protein: number;
  carbs: number;
  fats: number;
}

interface MacroDoughnutChartProps {
  data: MacroData;
  size?: number;
  showLegend?: boolean;
  className?: string;
  centerText?: string;
}

const MacroDoughnutChart: React.FC<MacroDoughnutChartProps> = ({ 
  data, 
  size = 120, 
  showLegend = true,
  className = "",
  centerText
}) => {
  const { protein, carbs, fats } = data;
  const total = protein + carbs + fats;
  
  if (total === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
        <div className="text-gray-400 text-sm">No macros</div>
      </div>
    );
  }

  // Calculate percentages
  const proteinPercent = (protein / total) * 100;
  const carbsPercent = (carbs / total) * 100;
  const fatsPercent = (fats / total) * 100;

  // Doughnut chart parameters
  const radius = size / 2 - 10;
  const innerRadius = radius * 0.6; // 60% of outer radius for hollow center
  const centerX = size / 2;
  const centerY = size / 2;

  const createDoughnutSlice = (startAngle: number, endAngle: number) => {
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);
    
    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);
    
    const innerX1 = centerX + innerRadius * Math.cos(startRad);
    const innerY1 = centerY + innerRadius * Math.sin(startRad);
    const innerX2 = centerX + innerRadius * Math.cos(endRad);
    const innerY2 = centerY + innerRadius * Math.sin(endRad);
    
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${innerX2} ${innerY2} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerX1} ${innerY1} Z`;
  };

  // Calculate angles for each slice
  const proteinAngle = (proteinPercent / 100) * 360;
  const carbsAngle = (carbsPercent / 100) * 360;
  const fatsAngle = (fatsPercent / 100) * 360;

  const proteinPath = createDoughnutSlice(0, proteinAngle);
  const carbsPath = createDoughnutSlice(proteinAngle, proteinAngle + carbsAngle);
  const fatsPath = createDoughnutSlice(proteinAngle + carbsAngle, 360);

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Doughnut Chart */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Protein slice */}
          <path
            d={proteinPath}
            fill="#3B82F6"
            stroke="#1E40AF"
            strokeWidth="1"
          />
          
          {/* Carbs slice */}
          <path
            d={carbsPath}
            fill="#F59E0B"
            stroke="#D97706"
            strokeWidth="1"
          />
          
          {/* Fats slice */}
          <path
            d={fatsPath}
            fill="#EF4444"
            stroke="#DC2626"
            strokeWidth="1"
          />
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-700">
              {centerText || `${total.toFixed(0)}g`}
            </div>
            <div className="text-xs text-gray-500">
              {centerText ? 'total' : 'per 100g'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      {showLegend && (
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="text-blue-600 font-medium">Protein</span>
            <span className="text-gray-600">({protein.toFixed(1)}g)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
            <span className="text-orange-600 font-medium">Carbs</span>
            <span className="text-gray-600">({carbs.toFixed(1)}g)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-red-600 font-medium">Fats</span>
            <span className="text-gray-600">({fats.toFixed(1)}g)</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MacroDoughnutChart; 