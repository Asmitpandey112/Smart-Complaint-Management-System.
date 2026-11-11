import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const TooltipContext = createContext({
  showTooltip: () => {},
  hideTooltip: () => {},
});

export function TooltipProvider({ children }) {
  const [tooltipState, setTooltipState] = useState({
    visible: false,
    content: null,
    badge: null,
    x: 0,
    y: 0,
  });

  const showTooltip = useCallback((content, badge = null) => {
    setTooltipState(prev => ({
      ...prev,
      visible: true,
      content,
      badge,
    }));
  }, []);

  const hideTooltip = useCallback(() => {
    setTooltipState(prev => ({
      ...prev,
      visible: false,
    }));
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setTooltipState(prev => {
        if (!prev.visible) return prev;
        return {
          ...prev,
          x: e.clientX,
          y: e.clientY,
        };
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <TooltipContext.Provider value={{ showTooltip, hideTooltip }}>
      {children}
      {tooltipState.visible && (
        <div
          className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-full mb-3 px-3 py-1.5 rounded-lg shadow-xl backdrop-blur-md bg-gray-900/90 text-white border border-gray-700/60 transition-all duration-75 text-xs flex items-center space-x-2"
          style={{
            left: `${tooltipState.x}px`,
            top: `${tooltipState.y - 12}px`,
          }}
        >
          {tooltipState.badge && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500 text-white">
              {tooltipState.badge}
            </span>
          )}
          <span className="font-medium text-gray-100">{tooltipState.content}</span>
        </div>
      )}
    </TooltipContext.Provider>
  );
}

export const useTooltip = () => useContext(TooltipContext);
