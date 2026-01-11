
import React, { useState, useEffect } from 'react';
import { UserRole, FormData } from '../types.ts';
import { submitToGoogleSheets } from '../services/googleSheetsService.ts';

interface Props {
  onSuccess: (code: string, name: string) => void;
}

export const RegistrationForm: React.FC<Props> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nameArabic: '',
    nameEnglish: '',
    phonePrimary: '',
    phoneSecondary: '',
    role: UserRole.FREELANCER,
    email: '',
    trainingType: '',
    companyName: '',
    companyField: ''
  });

  const isStudent = formData.role === UserRole.STUDENT;
  const isTrainer = formData.role === UserRole.TRAINER;
  const isCompany = formData.role === UserRole.COMPANY;

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      email: isStudent ? '' : prev.email,
      trainingType: isTrainer ? prev.trainingType : '',
      companyName: isCompany ? prev.companyName : '',
      companyField: isCompany ? prev.companyField : '',
    }));
  }, [formData.role]);

  const generateCustomerCode = (nameEng: string, phone: string): string => {
    const names = nameEng.trim().split(/\s+/);
    const firstChar = names[0]?.charAt(0).toUpperCase() || 'X';
    const secondChar = names.length > 1 
      ? names[1].charAt(0).toUpperCase() 
      : (names[0]?.charAt(1)?.toUpperCase() || 'Y');
    const lastFour = phone.trim().slice(-4);
    return `${firstChar}${secondChar} - ${lastFour}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const code = generateCustomerCode(formData.nameEnglish, formData.phonePrimary);
      const timestamp = new Date().toLocaleString('ar-EG');
      const submissionData = { ...formData, customerCode: code, timestamp };
      
      const result = await submitToGoogleSheets(submissionData);
      
      if (result.success) {
        onSuccess(code, formData.nameArabic);
      } else {
        throw new Error(result.message || 'فشل في الاتصال');
      }
    } catch (err: any) {
      setError('حدث خطأ. تأكد من إعداد رابط Google Script بشكل صحيح.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#7b3291] outline-none transition-all text-right";
  const labelClass = "text-sm font-bold text-gray-600 block mb-1 text-right";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>الاسم بالكامل (بالعربي) <span className="text-red-500">*</span></label>
          <input required type="text" name="nameArabic" value={formData.nameArabic} onChange={handleChange} className={inputClass} placeholder="يوسف غريب" />
        </div>
        <div>
          <label className={labelClass}>Full Name (English) <span className="text-red-500">*</span></label>
          <input required type="text" name="nameEnglish" value={formData.nameEnglish} onChange={handleChange} dir="ltr" className={`${inputClass} text-left`} placeholder="Yousef Ghaleb" />
        </div>
        <div>
          <label className={labelClass}>رقم الهاتف الأساسي <span className="text-red-500">*</span></label>
          <input required type="tel" name="phonePrimary" value={formData.phonePrimary} onChange={handleChange} className={inputClass} placeholder="010XXXXXXXX" />
        </div>
        <div>
          <label className={labelClass}>رقم الهاتف الاحتياطي</label>
          <input type="tel" name="phoneSecondary" value={formData.phoneSecondary} onChange={handleChange} className={inputClass} placeholder="011XXXXXXXX" />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>نوع العضوية</label>
          <select name="role" value={formData.role} onChange={handleChange} className={`${inputClass} bg-white font-bold`}>
            {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
          </select>
        </div>

        {!isStudent && (
          <div className="md:col-span-2 text-right">
            <label className={labelClass}>البريد الإلكتروني <span className="text-red-500">*</span></label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange} dir="ltr" className={`${inputClass} text-left`} placeholder="name@email.com" />
          </div>
        )}

        {isCompany && (
          <>
            <div>
              <label className={labelClass}>اسم الشركة <span className="text-red-500">*</span></label>
              <input required type="text" name="companyName" value={formData.companyName} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>مجال الشركة <span className="text-red-500">*</span></label>
              <input required type="text" name="companyField" value={formData.companyField} onChange={handleChange} className={inputClass} />
            </div>
          </>
        )}

        {isTrainer && (
          <div className="md:col-span-2">
            <label className={labelClass}>ما هو تخصصك التدريبي؟ <span className="text-red-500">*</span></label>
            <input required type="text" name="trainingType" value={formData.trainingType} onChange={handleChange} className={inputClass} />
          </div>
        )}
      </div>

      {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 font-bold">⚠️ {error}</div>}

      <button type="submit" disabled={loading} className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all ${loading ? 'bg-gray-400' : 'bg-[#7b3291] hover:bg-[#652976]'}`}>
        {loading ? 'جاري الحفظ...' : 'تأكيد تسجيل البيانات'}
      </button>
    </form>
  );
};
