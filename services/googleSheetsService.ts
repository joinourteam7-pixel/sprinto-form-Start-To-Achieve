
import { FormData, RegistrationResponse } from '../types.ts';

/**
 * يرجى وضع رابط الـ Web App الخاص بك هنا بعد عمل Deploy في Apps Script
 */
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz_XXXXXXXXXXXX_REPLACE_ME/exec';

export const submitToGoogleSheets = async (data: FormData): Promise<RegistrationResponse> => {
  try {
    // إذا لم يتم تغيير الرابط، نقوم بمحاكاة النجاح للتجربة
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('REPLACE_ME')) {
      await new Promise(r => setTimeout(r, 1000));
      return { success: true, customerCode: data.customerCode || '' };
    }

    // إرسال البيانات
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // لضمان عدم حدوث مشاكل CORS مع جوجل
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // في وضع no-cors لا يمكننا قراءة الاستجابة، لذا نفترض النجاح إذا لم يحدث خطأ
    return { success: true, customerCode: data.customerCode || '' };
  } catch (error) {
    console.error('Error submitting form:', error);
    return { 
      success: false, 
      customerCode: '', 
      message: 'تعذر الاتصال بقاعدة البيانات، يرجى المحاولة لاحقاً.' 
    };
  }
};
