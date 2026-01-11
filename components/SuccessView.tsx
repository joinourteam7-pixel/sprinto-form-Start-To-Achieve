
import React from 'react';

interface Props {
  customerCode: string;
  userName: string;
  onNewRegistration: () => void;
}

export const SuccessView: React.FC<Props> = ({ customerCode, userName, onNewRegistration }) => {
  return (
    <div className="text-center animate-in fade-in duration-700">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      
      <h2 className="text-3xl font-extrabold text-gray-800 mb-2">تم التسجيل بنجاح!</h2>
      <p className="text-gray-600 mb-8">أهلاً بك يا <span className="font-bold text-[#7b3291]">{userName}</span> في عائلة SprintO.</p>
      
      <div className="bg-[#fff9db] border-2 border-[#ffde00] rounded-3xl p-8 mb-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
          <svg className="w-24 h-24 text-black" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
          </svg>
        </div>
        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">كود العميل الخاص بك</p>
        <div className="text-4xl md:text-5xl font-black text-gray-900 font-mono tracking-tighter">
          {customerCode}
        </div>
        <p className="mt-4 text-xs text-gray-500 italic">برجاء الاحتفاظ بهذا الكود لاستخدامه عند الدخول للمكان</p>
      </div>

      <button
        onClick={onNewRegistration}
        className="text-[#7b3291] font-bold hover:underline transition-all"
      >
        تسجيل مستخدم جديد
      </button>
    </div>
  );
};
