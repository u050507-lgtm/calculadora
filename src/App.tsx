import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { Delete, Divide, Minus, Plus, X, Equal, Sparkles } from 'lucide-react';

type Operation = '+' | '-' | '*' | '/' | null;

export default function App() {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operation>(null);
  const [isNewInput, setIsNewInput] = useState(true);
  const [history, setHistory] = useState<string>('');

  // Mouse follow effect for that premium "glow"
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const handleNumber = (num: string) => {
    if (isNewInput) {
      setDisplay(num);
      setIsNewInput(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleDecimal = () => {
    if (isNewInput) {
      setDisplay('0.');
      setIsNewInput(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const calculate = () => {
    if (prevValue === null || operator === null) return;
    
    const current = parseFloat(display);
    let result = 0;
    
    switch (operator) {
      case '+': result = prevValue + current; break;
      case '-': result = prevValue - current; break;
      case '*': result = prevValue * current; break;
      case '/': result = prevValue / current; break;
    }
    
    const formattedResult = Number(result.toFixed(8)).toString();
    setDisplay(formattedResult);
    setPrevValue(null);
    setOperator(null);
    setIsNewInput(true);
    setHistory('');
  };

  const handleOperator = (op: Operation) => {
    const current = parseFloat(display);
    
    if (operator && !isNewInput) {
      calculate();
    } else {
      setPrevValue(current);
      setOperator(op);
      setHistory(`${current} ${op}`);
      setIsNewInput(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setIsNewInput(true);
    setHistory('');
  };

  const backspace = () => {
    if (isNewInput) return;
    if (display.length === 1) {
      setDisplay('0');
      setIsNewInput(true);
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const toggleSign = () => {
    setDisplay((parseFloat(display) * -1).toString());
  };

  const handlePercentage = () => {
    setDisplay((parseFloat(display) / 100).toString());
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/[0-9]/.test(e.key)) handleNumber(e.key);
      if (e.key === '.') handleDecimal();
      if (e.key === '+') handleOperator('+');
      if (e.key === '-') handleOperator('-');
      if (e.key === '*') handleOperator('*');
      if (e.key === '/') handleOperator('/');
      if (e.key === 'Enter' || e.key === '=') calculate();
      if (e.key === 'Escape' || e.key.toLowerCase() === 'c') clear();
      if (e.key === 'Backspace') backspace();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, prevValue, operator, isNewInput]);

  return (
    <div className="min-h-screen bg-[#fdfaf5] text-slate-800 flex flex-col items-center justify-center font-sans p-4 relative overflow-hidden">
      {/* Interactive Background with soft pastels */}
      <motion.div 
        style={{ x: springX, y: springY, transform: 'translate(-50%, -50%)' }}
        className="absolute w-[600px] h-[600px] bg-rose-200/40 rounded-full blur-[100px] pointer-events-none opacity-60"
      />
      <div className="absolute top-[15%] right-[10%] w-[450px] h-[450px] bg-purple-100/60 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[5%] left-[5%] w-[350px] h-[350px] bg-teal-50/80 rounded-full blur-[80px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="relative w-full max-w-[380px] bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[52px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-9 overflow-hidden group"
        id="calculator-main"
      >
        {/* Soft gloss effect */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
        
        {/* Display Area */}
        <div className="mb-10 pt-4 px-2 relative">
          <div className="absolute -top-4 left-0 right-0 flex justify-between items-center px-1">
            <div className="flex gap-2 opacity-30">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-300" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
            </div>
            <Sparkles size={16} className="text-rose-400 opacity-40 animate-pulse" />
          </div>

          <div className="h-8 text-right flex items-end justify-end overflow-hidden mb-2">
            <AnimatePresence mode="wait">
              <motion.span 
                key={history}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-slate-400/80 text-lg font-medium tracking-wider"
              >
                {history}
              </motion.span>
            </AnimatePresence>
          </div>
          
          <div className="relative">
            <motion.div 
              id="display"
              className="text-right text-7xl font-semibold tracking-tighter truncate leading-tight bg-gradient-to-b from-slate-800 to-slate-600 bg-clip-text text-transparent"
            >
              {display}
            </motion.div>
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-4" id="buttons-grid">
          {/* Row 1 */}
          <CalcButton label="AC" onClick={clear} type="utility" id="btn-ac" />
          <CalcButton label="±" onClick={toggleSign} type="utility" id="btn-sign" />
          <CalcButton label="%" onClick={handlePercentage} type="utility" id="btn-percent" />
          <CalcButton icon={<Divide size={24} strokeWidth={2.5} />} onClick={() => handleOperator('/')} type="operator" active={operator === '/'} id="btn-divide" />

          {/* Row 2 */}
          <CalcButton label="7" onClick={() => handleNumber('7')} id="btn-7" />
          <CalcButton label="8" onClick={() => handleNumber('8')} id="btn-8" />
          <CalcButton label="9" onClick={() => handleNumber('9')} id="btn-9" />
          <CalcButton icon={<X size={24} strokeWidth={2.5} />} onClick={() => handleOperator('*')} type="operator" active={operator === '*'} id="btn-multiply" />

          {/* Row 3 */}
          <CalcButton label="4" onClick={() => handleNumber('4')} id="btn-4" />
          <CalcButton label="5" onClick={() => handleNumber('5')} id="btn-5" />
          <CalcButton label="6" onClick={() => handleNumber('6')} id="btn-6" />
          <CalcButton icon={<Minus size={24} strokeWidth={2.5} />} onClick={() => handleOperator('-')} type="operator" active={operator === '-'} id="btn-minus" />

          {/* Row 4 */}
          <CalcButton label="1" onClick={() => handleNumber('1')} id="btn-1" />
          <CalcButton label="2" onClick={() => handleNumber('2')} id="btn-2" />
          <CalcButton label="3" onClick={() => handleNumber('3')} id="btn-3" />
          <CalcButton icon={<Plus size={24} strokeWidth={2.5} />} onClick={() => handleOperator('+')} type="operator" active={operator === '+'} id="btn-plus" />

          {/* Row 5 */}
          <CalcButton label="0" onClick={() => handleNumber('0')} id="btn-0" />
          <CalcButton label="." onClick={handleDecimal} id="btn-decimal" />
          <CalcButton icon={<Delete size={24} />} onClick={backspace} id="btn-backspace" />
          <CalcButton icon={<Equal size={32} strokeWidth={2.5} />} onClick={calculate} type="equals" id="btn-equals" />
        </div>
      </motion.div>

      {/* Footer Branding */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.4 }}
        className="mt-12 flex flex-col items-center gap-3"
      >
        <span className="text-[11px] uppercase tracking-[0.5em] font-bold text-slate-400">
          Pastel Bliss
        </span>
        <div className="h-[2px] w-8 bg-gradient-to-r from-transparent via-rose-200 to-transparent" />
        <span className="text-[9px] text-slate-300 uppercase tracking-[0.1em] font-medium">
          Soft & Precise
        </span>
      </motion.div>
    </div>
  );
}

interface CalcButtonProps {
  label?: string;
  icon?: ReactNode;
  onClick: () => void;
  type?: 'number' | 'operator' | 'utility' | 'equals';
  className?: string;
  active?: boolean;
  id: string;
}

function CalcButton({ label, icon, onClick, type = 'number', className = '', active = false, id }: CalcButtonProps) {
  const getStyles = () => {
    switch (type) {
      case 'operator':
        return active 
          ? 'bg-purple-300 text-white shadow-[0_8px_20px_rgba(216,180,254,0.4)] ring-2 ring-purple-200' 
          : 'bg-purple-50 text-purple-400 hover:bg-purple-100 ring-1 ring-purple-100 shadow-sm';
      case 'utility':
        return 'bg-rose-50 text-rose-400 hover:bg-rose-100 ring-1 ring-rose-100 shadow-sm';
      case 'equals':
        return 'bg-gradient-to-br from-rose-200 via-purple-200 to-indigo-200 text-white shadow-xl shadow-purple-200/50 hover:shadow-purple-300/60 ring-2 ring-white/50';
      default:
        return 'bg-white text-slate-600 hover:bg-slate-50 ring-1 ring-slate-100 shadow-sm';
    }
  };

  return (
    <motion.button
      id={id}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.94, y: 0 }}
      onClick={onClick}
      className={`
        relative h-[72px] rounded-[32px] flex items-center justify-center 
        text-2xl font-medium transition-all duration-300
        ${getStyles()}
        ${className}
      `}
    >
      {/* Gloss overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent opacity-0 hover:opacity-100 rounded-[32px] transition-opacity duration-500 pointer-events-none" />
      <span className="relative z-10">{label || icon}</span>
    </motion.button>
  );
}
