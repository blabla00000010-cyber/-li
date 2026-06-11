import React, { useState } from 'react';
import { Listing, Message } from '../types';
import { X, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

interface ContactListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing | null;
  onSendMessage: (message: Omit<Message, 'id' | 'createdAt' | 'readByListing' | 'replies'>) => void;
}

export default function ContactListingModal({
  isOpen,
  onClose,
  listing,
  onSendMessage,
}: ContactListingModalProps) {
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [messageText, setMessageText] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !listing) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !senderEmail || !senderPhone || !subject || !messageText) {
      alert('الرجاء تعبئة جميع الحقول لإرسال الرسالة.');
      return;
    }

    onSendMessage({
      listingId: listing.id,
      listingName: listing.name,
      senderName,
      senderEmail,
      senderPhone,
      subject,
      messageText,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      // Reset forms
      setSenderName('');
      setSenderEmail('');
      setSenderPhone('');
      setSubject('');
      setMessageText('');
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 text-right">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 flex flex-col relative">
        
        {/* Success Splash Screen overlay */}
        {isSuccess && (
          <div className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 border border-emerald-150">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 animate-bounce" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">تم إرسال رسالتك بنجاح!</h3>
            <p className="text-slate-505 text-sm max-w-xs leading-relaxed">
              لقد تم تسليم رسالتك بنجاح إلى <strong>{listing.name}</strong>. يمكنك تصفح الردود في مركز الرسائل الفوري.
            </p>
          </div>
        )}

        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 p-2 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <span className="text-blue-600 bg-blue-50 p-1.5 rounded-lg">
              <MessageSquare className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-800">تواصل مباشر مع المنشأة</h2>
              <p className="text-xs text-slate-500">{listing.name}</p>
            </div>
          </div>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-100/50 text-xs text-blue-950 leading-relaxed mb-1">
            ⚠️ <strong>ملاحظة هامة:</strong> سيتم حفظ هذه المراسلة في خادم المحاكاة المحلي. يمكنك أنت وصاحب المنشأة الرد وقراءة الرسائل فوراً من خلال تبويب <strong>"صندوق الرسائل"</strong> في لوحة التجربة!
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الاسم الكامل *</label>
              <input
                type="text"
                required
                placeholder="أحمد الهلالي"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">رقم الجوال *</label>
              <input
                type="tel"
                required
                placeholder="05xxxxxxx"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm ltr text-right"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني للتواصل *</label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm ltr text-right"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">عنوان الرسالة / موضوع الاستفسار *</label>
            <input
              type="text"
              required
              placeholder="مثال: استفسار عن مقاعد الروضة الشاغرة"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">نص الاستفسار ومحتوى الرسالة *</label>
            <textarea
              required
              rows={4}
              placeholder="اكتب هنا كافة تفاصيل استفسارك وسيقوم فريق العمل بالرد عليك في أقرب وقت..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
            />
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-2 flex gap-2">
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-150 text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>إرسال الاستفسار الآن</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all duration-150 text-sm cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
