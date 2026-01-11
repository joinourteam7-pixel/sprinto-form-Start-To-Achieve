
/**
 * كود جوجل أبس سكريبت - نسخة SprintO المضمونة
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheets()[0];
    
    // الأعمدة المحددة من قبلك في الصورة
    var headers = [
      "التاريخ والوقت", 
      "كود العميل", 
      "الاسم بالعربي", 
      "الاسم بالإنجليزي", 
      "رقم التليفون الأساسي", 
      "رقم التليفون الاحتياطي", 
      "نوع العضوية", 
      "البريد الإلكتروني", 
      "نوع التدريب / اسم الشركة", 
      "مجال الشركة"
    ];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#7b3291").setFontColor("white").setHorizontalAlignment("center");
    }

    // استقبال البيانات من e.parameter (الفورم المباشر)
    var p = e.parameter;
    
    // تحديد حقل "نوع التدريب / اسم الشركة" بناء على نوع العضوية
    var trainingOrCompany = "---";
    if (p.role === "مدرب") {
      trainingOrCompany = p.trainingType;
    } else if (p.role === "شركة") {
      trainingOrCompany = p.companyName;
    }

    var newRow = [
      p.timestamp,
      p.customerCode,
      p.nameArabic,
      p.nameEnglish,
      "'" + p.phonePrimary, // الـ ' لمنع جوجل من حذف الصفر في بداية الرقم
      p.phoneSecondary ? "'" + p.phoneSecondary : "---",
      p.role,
      p.email || "لا يوجد",
      trainingOrCompany,
      p.companyField || "---"
    ];

    sheet.appendRow(newRow);
    
    // تنسيق الصف الأخير
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, headers.length).setHorizontalAlignment("center");

    return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);

  } catch (error) {
    return ContentService.createTextOutput("Error: " + error.toString()).setMimeType(ContentService.MimeType.TEXT);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput("SprintO Active ✅");
}
