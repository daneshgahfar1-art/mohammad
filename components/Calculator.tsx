import React, { useState, useEffect } from 'react';
import { CalculatorState, Operator } from '../types';
import CalculatorButton from './CalculatorButton';
import { getKhwarizmiWisdom } from '../services/geminiService';

// Helper to convert English digits to Persian
const toPersianDigits = (num: string | number): string => {
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num
    .toString()
    .replace(/\d/g, (x) => farsiDigits[parseInt(x)]);
};

const Calculator: React.FC = () => {
  const [state, setState] = useState<CalculatorState>({
    currentValue: '0',
    previousValue: null,
    operator: null,
    waitingForNewValue: false,
    history: [],
  });

  const [wisdom, setWisdom] = useState<string>('');
  const [loadingWisdom, setLoadingWisdom] = useState<boolean>(false);

  const handleNumber = (num: string) => {
    setState((prev) => {
      if (prev.waitingForNewValue) {
        return {
          ...prev,
          currentValue: num,
          waitingForNewValue: false,
        };
      }
      return {
        ...prev,
        currentValue: prev.currentValue === '0' ? num : prev.currentValue + num,
      };
    });
  };

  const handleOperator = (nextOperator: Operator) => {
    const { currentValue, previousValue, operator } = state;

    if (operator && !state.waitingForNewValue) {
      const result = calculate(parseFloat(previousValue || '0'), parseFloat(currentValue), operator);
      setState({
        currentValue: String(result),
        previousValue: String(result),
        operator: nextOperator,
        waitingForNewValue: true,
        history: [...state.history, `${toPersianDigits(previousValue || '0')} ${getOperatorSymbol(operator)} ${toPersianDigits(currentValue)} = ${toPersianDigits(result)}`],
      });
    } else {
      setState((prev) => ({
        ...prev,
        previousValue: prev.currentValue,
        operator: nextOperator,
        waitingForNewValue: true,
      }));
    }
  };

  const calculate = (a: number, b: number, op: Operator): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return a / b;
      default: return b;
    }
  };

  const handleEqual = async () => {
    const { currentValue, previousValue, operator } = state;
    if (!operator || !previousValue) return;

    const result = calculate(parseFloat(previousValue), parseFloat(currentValue), operator);
    const expression = `${previousValue} ${operator} ${currentValue}`;
    const resultStr = String(result);

    setState({
      currentValue: resultStr,
      previousValue: null,
      operator: null,
      waitingForNewValue: true,
      history: [ ...state.history.slice(-4), `${toPersianDigits(previousValue)} ${getOperatorSymbol(operator)} ${toPersianDigits(currentValue)} = ${toPersianDigits(resultStr)}` ],
    });

    // Fetch wisdom
    setLoadingWisdom(true);
    setWisdom('');
    const wiseWords = await getKhwarizmiWisdom(expression, resultStr);
    setWisdom(wiseWords);
    setLoadingWisdom(false);
  };

  const handleClear = () => {
    setState({
      currentValue: '0',
      previousValue: null,
      operator: null,
      waitingForNewValue: false,
      history: state.history,
    });
    setWisdom('');
  };

  const handlePercent = () => {
    const current = parseFloat(state.currentValue);
    setState((prev) => ({
      ...prev,
      currentValue: String(current / 100),
    }));
  };

  const getOperatorSymbol = (op: Operator) => {
    switch (op) {
      case '+': return '+';
      case '-': return '-';
      case '*': return '×';
      case '/': return '÷';
      default: return '';
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Frame */}
      <div className="bg-stone-200 p-2 rounded-3xl shadow-2xl border-4 border-stone-300">
        <div className="bg-stone-100 rounded-[1.2rem] p-6 border border-stone-300 shadow-inner relative overflow-hidden">
          
          {/* Header / Brand */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-display text-teal-800 tracking-wider">الخوارزمی</h1>
            <div className="h-0.5 w-16 bg-amber-500 mx-auto mt-1 rounded-full opacity-60"></div>
          </div>

          {/* Display */}
          <div className="bg-teal-900 rounded-2xl p-4 mb-6 shadow-inner border-b-4 border-teal-950 relative">
            <div className="absolute top-2 left-3 text-teal-400 text-xs font-mono opacity-60">
              {state.previousValue ? toPersianDigits(state.previousValue) : ''} {getOperatorSymbol(state.operator)}
            </div>
            <div className="text-right text-4xl md:text-5xl text-emerald-50 font-display tracking-widest truncate pt-4 pb-1">
              {toPersianDigits(state.currentValue)}
            </div>
          </div>

          {/* Wisdom / AI Panel */}
          <div className={`min-h-[4rem] mb-6 p-3 rounded-lg bg-amber-50 border border-amber-200 text-center transition-all duration-500 ${wisdom || loadingWisdom ? 'opacity-100' : 'opacity-0'}`}>
            {loadingWisdom ? (
              <div className="flex items-center justify-center gap-2 text-amber-700 text-sm animate-pulse">
                <span className="w-2 h-2 bg-amber-600 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-amber-600 rounded-full animate-bounce delay-75"></span>
                <span className="w-2 h-2 bg-amber-600 rounded-full animate-bounce delay-150"></span>
                <span>در حال تفکر...</span>
              </div>
            ) : (
              <p className="text-sm text-amber-900 font-serif leading-6 italic">
                "{wisdom}"
              </p>
            )}
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-4 gap-3">
            <CalculatorButton label="C" onClick={handleClear} variant="action" />
            <CalculatorButton label="+/-" onClick={() => handleNumber(String(parseFloat(state.currentValue) * -1))} variant="action" />
            <CalculatorButton label="٪" onClick={handlePercent} variant="action" />
            <CalculatorButton label="÷" onClick={() => handleOperator('/')} variant="operator" />

            <CalculatorButton label="۷" onClick={() => handleNumber('7')} />
            <CalculatorButton label="۸" onClick={() => handleNumber('8')} />
            <CalculatorButton label="۹" onClick={() => handleNumber('9')} />
            <CalculatorButton label="×" onClick={() => handleOperator('*')} variant="operator" />

            <CalculatorButton label="۴" onClick={() => handleNumber('4')} />
            <CalculatorButton label="۵" onClick={() => handleNumber('5')} />
            <CalculatorButton label="۶" onClick={() => handleNumber('6')} />
            <CalculatorButton label="-" onClick={() => handleOperator('-')} variant="operator" />

            <CalculatorButton label="۱" onClick={() => handleNumber('1')} />
            <CalculatorButton label="۲" onClick={() => handleNumber('2')} />
            <CalculatorButton label="۳" onClick={() => handleNumber('3')} />
            <CalculatorButton label="+" onClick={() => handleOperator('+')} variant="operator" />

            <CalculatorButton label="." onClick={() => handleNumber('.')} />
            <CalculatorButton label="۰" onClick={() => handleNumber('0')} />
            <CalculatorButton label="=" onClick={handleEqual} variant="equals" />
          </div>

        </div>
      </div>

      {/* History Ribbon (Decorative) */}
      <div className="hidden lg:block absolute top-0 -left-64 w-56 h-full p-4">
        <h3 className="text-stone-500 text-lg font-display mb-3 text-right border-b pb-2">تاریخچه</h3>
        <div className="flex flex-col gap-2 items-end opacity-70">
           {state.history.map((entry, idx) => (
             <div key={idx} className="text-stone-600 font-mono text-sm bg-white/50 px-2 py-1 rounded shadow-sm">{entry}</div>
           ))}
           {state.history.length === 0 && <span className="text-xs text-stone-400 italic">خالی</span>}
        </div>
      </div>
    </div>
  );
};

export default Calculator;