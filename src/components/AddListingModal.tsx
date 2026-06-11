import React, { useState } from 'react';
import { ListingCategory, Listing } from '../types';
import { X, MapPin, CheckCircle, Info } from 'lucide-react';

interface AddListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddListing: (newListing: Omit<Listing, 'id' | 'rating' | 'reviewsCount' | 'createdAt'>) => void;
  addingCoords: { lat: number; lng: number } | null;
  setIsSelectingCoords: (active: boolean) => void;
  isSelectingCoords: boolean;
}

export default function AddListingModal({
  isOpen,
  onClose,
  onAddListing,
  addingCoords,
  setIsSelectingCoords,
  isSelectingCoords,
}: AddListingModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ListingCategory>('companies');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [workingHours, setWorkingHours] = useState('');
  const [logoEmoji, setLogoEmoji] = useState('🏢');
  const [showCoordsTip, setShowCoordsTip] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !address || !phone || !email) {
      alert('الرجاء تعبئة كافة الحقول الرئيسية المطلوبة.');
      return;
    }

    const latVal = addingCoords ? addingCoords.lat : 24.7136;
    const lngVal = addingCoords ? addingCoords.lng : 46.6753;

    onAddListing({
      name,
      category,
      description,
      address,
      phone,
      email,
      website: website || undefined,
      workingHours: workingHours || undefined,
      logoUrl: logoEmoji,
      lat: latVal,
      lng: lngVal,
    });

    // Reset fields
    setName('');
    setDescription('');
    setAddress('');
    setPhone('');
    setEmail('');
    setWebsite('');
    setWorkingHours('');
    setIsSelectingCoords(false);
    onClose();
  };

  const handleEmojiSelect = (categoryType: ListingCategory) => {
    setCategory(categoryType);
    if (categoryType === 'companies') setLogoEmoji('🏢');
    else if (categoryType === 'schools') setLogoEmoji('🏫');
    else if (categoryType === 'stores') setLogoEmoji('☕');
    else setLogoEmoji('📍');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 text-right">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <button
            onClick={() => {
              setIsSelectingCoords(false);
              onClose();
            }}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 p-2 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-slate-850 flex items-center gap-2">
            <span>✨ أضف منشأتك الجديدة مجاناً</span>
          </h2>
        </div>

        {/* Scrollable Container */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1">
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">اسم المنشأة *</label>
              <input
                type="text"
                required
                placeholder="مثال: مدرسة الإنجاز الأهلية"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">تصنيف المنشأة *</label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { key: 'companies', label: 'شركة', icon: '🏢' },
                  { key: 'schools', label: 'مدرسة', icon: '🏫' },
                  { key: 'stores', label: 'محل/مقهى', icon: '☕' },
                  { key: 'others', label: 'أخرى', icon: '📍' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleEmojiSelect(item.key as ListingCategory)}
                    className={`py-2 px-1 text-center rounded-lg border text-xs font-medium transition-all duration-200 flex flex-col items-center gap-1 ${
                      category === item.key
                        ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-500/10'
                        : 'border-slate-200 hover:border-slate-350 text-slate-700 bg-white'
                    }`}
                  >
                    <span className="text-sm">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">نبذة ووصف المنشأة *</label>
            <textarea
              required
              rows={3}
              placeholder="اكتب وصفاً معبراً عن الخدمات التي توفرها منشأتك لتسهيل العثور عليك..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
            />
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">الرقم الهاتفي للتواصل *</label>
              <input
                type="tel"
                required
                placeholder="مثال: 0112345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">البريد الإلكتروني الرسمي *</label>
              <input
                type="email"
                required
                placeholder="info@yourcompany.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm ltr"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">ساعات العمل (اختياري)</label>
              <input
                type="text"
                placeholder="مثال: من الأحد إلى الخميس 8ص-4م"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">الموقع الإلكتروني ورابط الويب (اختياري)</label>
              <input
                type="url"
                placeholder="https://yourcompany.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm ltr"
              />
            </div>
          </div>

          {/* Location & Coordinates Input */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-3">
            <div>
              <label className="block text-xs font-bold text-blue-900 mb-1">العنوان الجغرافي *</label>
              <input
                type="text"
                required
                placeholder="مثال: حي الملك فهد، طريق الملك عبدالعزيز، الرياض"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              />
            </div>

            {/* Interactive Coordinate Picker Panel */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">تحديد الإحداثيات على الخريطة:</span>
                {addingCoords ? (
                  <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>تم التحديد بنجاح!</span>
                  </span>
                ) : (
                  <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md font-medium">إحداثيات الرياض التلقائية</span>
                )}
              </div>

              {showCoordsTip && (
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs leading-relaxed text-blue-900 flex gap-2">
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p>
                    <strong>كيف تحدد موقعك؟</strong> انقر على زر "تحديد الموقع من الخريطة" أدناه، ثم انقر في أي مكان داخل الخريطة التفاعلية بالخلفية وسيتم جلب إحداثيات موقع منشأتك تلقائياً!
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsSelectingCoords(!isSelectingCoords)}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-xs flex items-center justify-center gap-2 border transition-all duration-200 ${
                    isSelectingCoords
                      ? 'bg-rose-500 border-rose-500 text-white shadow-md animate-pulse'
                      : 'bg-white border-slate-200 hover:border-blue-300 text-slate-800'
                  }`}
                >
                  <MapPin className={`w-4 h-4 ${isSelectingCoords ? 'animate-bounce' : 'text-slate-500'}`} />
                  <span>{isSelectingCoords ? 'جاري تحديد الموقع... انقر على الخريطة الآن' : 'تحديد الموقع من الخريطة تدوياً'}</span>
                </button>

                {addingCoords && (
                  <div className="bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg text-[11px] text-slate-600 select-all font-mono flex items-center justify-center">
                    {addingCoords.lat.toFixed(5)}, {addingCoords.lng.toFixed(5)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-150 text-sm shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>✅ نشر وتسجيل المنشأة</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSelectingCoords(false);
                onClose();
              }}
              className="px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all duration-150 text-sm cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
