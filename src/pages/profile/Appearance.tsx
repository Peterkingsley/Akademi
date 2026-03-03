import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Sun, Moon, Monitor, Type } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Appearance() {
  const [theme, setTheme] = useState('light');
  const [systemDefault, setSystemDefault] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [textSize, setTextSize] = useState(50);

  return (
    <Layout title="Appearance" showBack>
      <div className="p-4 space-y-8">
        
        {/* Theme Selection */}
        <div>
          <h3 className="font-bold text-[#0A1128] mb-4">Choose Theme</h3>
          <div className="grid grid-cols-2 gap-4">
            <ThemeCard 
              label="Light Mode" 
              active={theme === 'light'} 
              onClick={() => setTheme('light')}
              preview={
                <div className="w-full h-full bg-gray-50 rounded-lg p-3 flex flex-col gap-2">
                  <div className="w-1/2 h-2 bg-gray-200 rounded-full"></div>
                  <div className="w-full h-20 bg-white rounded-lg border border-gray-100 flex items-center justify-center">
                    <Sun className="w-8 h-8 text-orange-400" />
                  </div>
                  <div className="w-1/3 h-2 bg-gray-200 rounded-full"></div>
                </div>
              }
            />
            <ThemeCard 
              label="Dark Mode" 
              active={theme === 'dark'} 
              onClick={() => setTheme('dark')}
              preview={
                <div className="w-full h-full bg-[#1A1A1A] rounded-lg p-3 flex flex-col gap-2">
                  <div className="w-1/2 h-2 bg-gray-700 rounded-full"></div>
                  <div className="w-full h-20 bg-black rounded-lg border border-gray-800 flex items-center justify-center">
                    <Moon className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="w-1/3 h-2 bg-gray-700 rounded-full"></div>
                </div>
              }
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-[#0A1128] text-sm">System Default</div>
                <div className="text-xs text-gray-500">Match your phone's settings</div>
              </div>
            </div>
            <Switch checked={systemDefault} onChange={() => setSystemDefault(!systemDefault)} />
          </div>
          
          <div className="h-px bg-gray-50 mx-4"></div>
          
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                <div className="w-5 h-5 rounded-full border-2 border-current flex overflow-hidden">
                  <div className="w-1/2 bg-current h-full"></div>
                </div>
              </div>
              <div>
                <div className="font-bold text-[#0A1128] text-sm">High Contrast</div>
                <div className="text-xs text-gray-500">Improve text readability</div>
              </div>
            </div>
            <Switch checked={highContrast} onChange={() => setHighContrast(!highContrast)} />
          </div>
        </div>

        {/* Text Size */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-[#0A1128] mb-6">Text Size</h3>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-gray-400">A</span>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={textSize} 
              onChange={(e) => setTextSize(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00D632]"
            />
            <span className="text-xl font-bold text-[#0A1128]">A</span>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 italic px-8">
          Designed for JAMB, WAEC, and University Post-UTME prep efficiency.
        </p>

      </div>
    </Layout>
  );
}

function ThemeCard({ label, active, onClick, preview }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "p-3 rounded-2xl border-2 transition-all text-left",
        active ? "border-[#00D632] bg-green-50/30" : "border-gray-100 bg-white"
      )}
    >
      <div className="aspect-square rounded-xl overflow-hidden mb-3 border border-gray-100 shadow-sm">
        {preview}
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-[#0A1128]">{label}</span>
        <div className={cn(
          "w-5 h-5 rounded-full border-2 flex items-center justify-center",
          active ? "border-[#00D632]" : "border-gray-300"
        )}>
          {active && <div className="w-2.5 h-2.5 rounded-full bg-[#00D632]"></div>}
        </div>
      </div>
    </button>
  );
}

function Switch({ checked, onChange }: any) {
  return (
    <button 
      onClick={onChange}
      className={cn(
        "w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out",
        checked ? "bg-[#00D632]" : "bg-gray-200"
      )}
    >
      <div className={cn(
        "w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out",
        checked ? "translate-x-5" : "translate-x-0"
      )} />
    </button>
  );
}
