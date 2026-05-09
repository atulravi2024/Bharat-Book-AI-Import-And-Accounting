import React, { useState, useEffect } from 'react';
import { X, Delete, Square, Minus, Minimize2 } from 'lucide-react';

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalculatorModal: React.FC<CalculatorModalProps> = ({ isOpen, onClose }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      const key = e.key;
      if (key >= '0' && key <= '9') {
        inputDigit(key);
      } else if (key === '.') {
        inputDot();
      } else if (key === 'Backspace') {
        backspace();
      } else if (key === 'Escape') {
        onClose();
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculateEquals();
      } else if (key === '+') {
        performOperation('+');
      } else if (key === '-') {
        performOperation('-');
      } else if (key === '*') {
        performOperation('×');
      } else if (key === '/') {
        e.preventDefault();
        performOperation('÷');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, display, waitingForNewValue, operator, previousValue]);

  const inputDigit = (digit: string) => {
    if (waitingForNewValue) {
      setDisplay(digit);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDot = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clearEntry = () => {
    setDisplay('0');
  };

  const clearAll = () => {
    setDisplay('0');
    setEquation('');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForNewValue(false);
  };

  const backspace = () => {
    if (waitingForNewValue) return;
    setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (previousValue == null) {
      setPreviousValue(inputValue);
      setEquation(`${inputValue} ${nextOperator}`);
    } else if (operator) {
      if (waitingForNewValue) {
        setOperator(nextOperator);
        setEquation(`${previousValue} ${nextOperator}`);
        return;
      }
      
      const currentValue = previousValue || 0;
      let newValue = 0;

      switch (operator) {
        case '+': newValue = currentValue + inputValue; break;
        case '-': newValue = currentValue - inputValue; break;
        case '×': newValue = currentValue * inputValue; break;
        case '÷': newValue = currentValue / inputValue; break;
      }

      setPreviousValue(newValue);
      setDisplay(formatNumber(newValue));
      setEquation(`${formatNumber(newValue)} ${nextOperator}`);
    }

    setWaitingForNewValue(true);
    setOperator(nextOperator);
  };

  const calculateEquals = () => {
    if (!operator || previousValue == null) return;
    
    const inputValue = parseFloat(display);
    let newValue = 0;

    switch (operator) {
      case '+': newValue = previousValue + inputValue; break;
      case '-': newValue = previousValue - inputValue; break;
      case '×': newValue = previousValue * inputValue; break;
      case '÷': newValue = previousValue / inputValue; break;
    }

    setDisplay(formatNumber(newValue));
    if (waitingForNewValue) {
        setEquation(`${previousValue} ${operator} ${inputValue} =`);
    } else {
        setEquation(`${previousValue} ${operator} ${inputValue} =`);
    }
    setPreviousValue(null);
    setOperator(null);
    setWaitingForNewValue(true);
  };

  const formatNumber = (num: number) => {
    const str = String(num);
    if (str.length > 12) {
      return num.toPrecision(12).replace(/\.?0+$/, '');
    }
    return str;
  };

  const calculatePercentage = () => {
    const currentValue = parseFloat(display);
    if (previousValue !== null && operator) {
      let result = 0;
      if (operator === '+' || operator === '-') {
        result = previousValue * (currentValue / 100);
      } else {
        result = currentValue / 100;
      }
      setDisplay(formatNumber(result));
    } else {
      setDisplay(formatNumber(currentValue / 100));
    }
  };

  const invertSign = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const squareRoot = () => {
    setDisplay(formatNumber(Math.sqrt(parseFloat(display))));
  };

  const square = () => {
    setDisplay(formatNumber(Math.pow(parseFloat(display), 2)));
  };

  const reciprocal = () => {
    setDisplay(formatNumber(1 / parseFloat(display)));
  };

  if (!isOpen) return null;

  const btnClass = "border-none outline-none flex items-center justify-center text-lg md:text-xl rounded shadow-sm transition-colors";
  const numClass = `${btnClass} font-semibold bg-white hover:bg-gray-100 text-gray-900`;
  const opClass = `${btnClass} bg-[#f9f9f9] hover:bg-gray-200 text-gray-800 font-medium text-sm md:text-base`;
  const memClass = "flex-1 hover:bg-gray-200 font-medium text-xs text-gray-700 rounded p-1 transition-colors";

  return (
    <div className={`fixed z-[200] flex items-center justify-center p-0 md:p-4 ${isMaximized ? 'inset-0' : 'inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2'}`}>
      <div className={`fixed inset-0 bg-black/20 ${!isMaximized && 'md:hidden'}`} onClick={onClose}></div>
      
      <div className={`bg-[#f3f3f3] flex flex-col shadow-2xl relative transition-all duration-200 border border-gray-300 md:rounded-lg
          ${isMaximized ? 'w-full h-full md:rounded-none' : 'w-full h-full md:w-[320px] md:h-[520px]'}`}>
        
        {/* Title bar */}
        <div className="flex justify-between items-center px-2 py-2 bg-white/50 backdrop-blur-sm">
           <div className="text-xs font-semibold select-none ml-2 text-gray-700">Calculator</div>
           <div className="flex">
              <button className="p-2 hover:bg-gray-200 rounded text-gray-600 hidden md:block">
                <Minus size={14} />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded text-gray-600 hidden md:block" onClick={() => setIsMaximized(!isMaximized)}>
                {isMaximized ? <Minimize2 size={14} /> : <Square size={14} />}
              </button>
              <button className="p-2 hover:bg-red-500 hover:text-white rounded text-gray-600 transition-colors" onClick={onClose}>
                <X size={14} />
              </button>
           </div>
        </div>

        {/* Display */}
        <div className="flex-none px-4 pt-4 pb-2 flex flex-col justify-end text-right">
          <div className="min-h-[24px] text-gray-500 text-sm font-medium tracking-wider select-text overflow-hidden text-ellipsis whitespace-nowrap">
            {equation}
          </div>
          <div className="text-5xl font-semibold text-gray-900 tracking-tight leading-none mt-2 select-text overflow-hidden text-ellipsis whitespace-nowrap">
            {display}
          </div>
        </div>

        {/* Memory buttons */}
        <div className="flex px-2 pb-2 gap-1 px-3">
          <button className={memClass}>MC</button>
          <button className={memClass}>MR</button>
          <button className={memClass + " font-bold"}>M+</button>
          <button className={memClass + " font-bold"}>M-</button>
          <button className={memClass}>MS</button>
          <button className={memClass}>M▾</button>
        </div>

        {/* Keypad */}
        <div className="flex-1 grid grid-cols-4 gap-1 p-1 bg-[#f3f3f3] mx-1 mb-1 pb-2">
          {/* Row 1 */}
          <button className={opClass} onClick={calculatePercentage}>%</button>
          <button className={opClass} onClick={clearEntry}>CE</button>
          <button className={opClass} onClick={clearAll}>C</button>
          <button className={opClass} onClick={backspace}>
             <Delete size={20} strokeWidth={1.5} />
          </button>

          {/* Row 2 */}
          <button className={opClass} onClick={reciprocal}>1/<span className="font-serif italic">x</span></button>
          <button className={opClass} onClick={square}><span className="font-serif italic">x</span>²</button>
          <button className={opClass} onClick={squareRoot}>√<span className="font-serif italic">x</span></button>
          <button className={opClass} onClick={() => performOperation('÷')}>÷</button>

          {/* Row 3 */}
          <button className={numClass} onClick={() => inputDigit('7')}>7</button>
          <button className={numClass} onClick={() => inputDigit('8')}>8</button>
          <button className={numClass} onClick={() => inputDigit('9')}>9</button>
          <button className={opClass} onClick={() => performOperation('×')}>×</button>

          {/* Row 4 */}
          <button className={numClass} onClick={() => inputDigit('4')}>4</button>
          <button className={numClass} onClick={() => inputDigit('5')}>5</button>
          <button className={numClass} onClick={() => inputDigit('6')}>6</button>
          <button className={opClass} onClick={() => performOperation('-')}>-</button>

          {/* Row 5 */}
          <button className={numClass} onClick={() => inputDigit('1')}>1</button>
          <button className={numClass} onClick={() => inputDigit('2')}>2</button>
          <button className={numClass} onClick={() => inputDigit('3')}>3</button>
          <button className={opClass} onClick={() => performOperation('+')}>+</button>

          {/* Row 6 */}
          <button className={numClass} onClick={invertSign}>+/-</button>
          <button className={numClass} onClick={() => inputDigit('0')}>0</button>
          <button className={numClass} onClick={inputDot}>.</button>
          <button className={`${btnClass} bg-blue-600 hover:bg-blue-700 text-white font-medium`} onClick={calculateEquals}>=</button>
        </div>
      </div>
    </div>
  );
};
