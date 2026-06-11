import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Listing, 
  ListingCategory, 
  Message, 
  Review, 
  Reply 
} from './types';
import { INITIAL_LISTINGS, INITIAL_REVIEWS } from './data';
import MapContainer from './components/MapContainer';
import AddListingModal from './components/AddListingModal';
import ContactListingModal from './components/ContactListingModal';
import MessageCenter from './components/MessageCenter';
import { 
  Search, 
  Plus, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Star, 
  MessageSquare, 
  Building2, 
  GraduationCap, 
  Store, 
  Compass, 
  SlidersHorizontal,
  ChevronLeft,
  ThumbsUp,
  Inbox
} from 'lucide-react';

export default function App() {
  // ----------------------------------------------------
  // Local States with LocalStorage Syncing
  // ----------------------------------------------------
  const [listings, setListings] = useState<Listing[]>(() => {
    const saved = localStorage.getItem('directory_listings');
    return saved ? JSON.parse(saved) : INITIAL_LISTINGS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('directory_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('directory_messages');
    if (saved) return JSON.parse(saved);

    // Initial interactive seed messages for spectacular first-load experience
    const seedMsgs: Message[] = [
      {
        id: 'msg-seed-1',
        listingId: 'listing-1',
        listingName: 'شركة ريادة الأعمال للتقنية الرقمية',
        senderName: 'عبدالعزيز الرويس',
        senderEmail: 'a.ruwais@gmail.com',
        senderPhone: '0544123456',
        subject: 'استفسار حول طلب تطوير تطبيق سحابي تجاري',
        messageText: 'السلام عليكم ورحمة الله وبركاته، نحن شركة البيوت الغذائية، نود معرفة التكلفة التقريبية والزمنية لبناء نظام سحابي لإدارة مبيعات وعقود سلاسل مطاعمنا. شكراً لكم.',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
        readByListing: false,
        replies: []
      },
      {
        id: 'msg-seed-2',
        listingId: 'listing-2',
        listingName: 'مدارس المنار الأهلية النموذجية',
        senderName: 'جواهر الفهد',
        senderEmail: 'jawaher@outlook.com',
        senderPhone: '0566332211',
        subject: 'التسجيل لمرحلة التمهيدي والصف الأول الشواغر والأسعار',
        messageText: 'مرحباً بكم، هل تتوفر مقاعد شاغرة لمرحلة تمهيدي بنين وبنات لهذا العام؟ وكم تبلغ الرسوم الدراسية الإجمالية شاملة الحافلة؟ ولكم جزيل التقدير.',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
        readByListing: true,
        replies: [
          {
            id: 'rep-seed-1',
            senderType: 'listing',
            senderName: 'إدارة القبول والتسجيل المنار',
            messageText: 'أهلاً بك جواهر الفهد، نسعد باهتمامك بمدارسنا. تتوفر لدينا مقاعد شاغرة محدودة. تبلغ الرسوم 18,500 ريال سنوياً غير شاملة المواصلات. ندعوك لزيارة المدرسة لإجراء اختبار القبول والتعريف.',
            createdAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
          }
        ]
      }
    ];
    return seedMsgs;
  });

  // UI Interactive State Managers
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | ListingCategory>('all');
  const [selectedListingId, setSelectedListingId] = useState<string | null>('listing-1');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isMessageCenterOpen, setIsMessageCenterOpen] = useState(false);
  const [isSelectingCoords, setIsSelectingCoords] = useState(false);
  const [addingCoords, setAddingCoords] = useState<{ lat: number; lng: number } | null>(null);

  // New Review form inputs state
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSubmitMessage, setReviewSubmitMessage] = useState('');

  // ----------------------------------------------------
  // Sync Data to LocalStorage on updates
  // ----------------------------------------------------
  useEffect(() => {
    localStorage.setItem('directory_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('directory_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('directory_messages', JSON.stringify(messages));
  }, [messages]);

  // Handle addition of a new Listing
  const handleAddListing = (newListingData: Omit<Listing, 'id' | 'rating' | 'reviewsCount' | 'createdAt'>) => {
    const newListingObj: Listing = {
      ...newListingData,
      id: `listing-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 0,
      createdAt: new Date().toISOString(),
    };
    setListings((prev) => [newListingObj, ...prev]);
    setSelectedListingId(newListingObj.id);
    setIsAddModalOpen(false);
    setIsSelectingCoords(false);
    setAddingCoords(null);
  };

  // Handle map click callbacks for picking coords
  const handleMapClickForCoords = (coords: { lat: number; lng: number }) => {
    if (isSelectingCoords) {
      setAddingCoords(coords);
    }
  };

  // Handle message sending to a Listing
  const handleSendMessage = (msgData: Omit<Message, 'id' | 'createdAt' | 'readByListing' | 'replies'>) => {
    const newMsg: Message = {
      ...msgData,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      readByListing: false,
      replies: [],
    };
    setMessages((prev) => [newMsg, ...prev]);
  };

  // Handle posting a reply in message center thread
  const handleReplyToMessage = (messageId: string, replyText: string, senderType: 'user' | 'listing') => {
    setMessages((prev) => 
      prev.map((msg) => {
        if (msg.id === messageId) {
          const activeListing = listings.find((l) => l.id === msg.listingId);
          const replySenderName = senderType === 'listing' 
            ? (activeListing?.name || msg.listingName)
            : msg.senderName;

          const newReply: Reply = {
            id: `reply-${Date.now()}`,
            senderType,
            senderName: replySenderName,
            messageText: replyText,
            createdAt: new Date().toISOString(),
          };

          return {
            ...msg,
            readByListing: senderType === 'user' ? false : msg.readByListing,
            replies: [...msg.replies, newReply],
          };
        }
        return msg;
      })
    );
  };

  // Handle adding a review on active list detail view
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListingId || !newReviewName || !newReviewComment) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      listingId: selectedListingId,
      senderName: newReviewName,
      rating: newReviewRating,
      comment: newReviewComment,
      createdAt: new Date().toISOString(),
    };

    const updatedReviews = [newRev, ...reviews];
    setReviews(updatedReviews);

    // Re-calculate rating average and reviews count for listing
    setListings((prev) => 
      prev.map((item) => {
        if (item.id === selectedListingId) {
          const itemReviews = updatedReviews.filter((r) => r.listingId === selectedListingId);
          const totalRating = itemReviews.reduce((sum, r) => sum + r.rating, 0);
          const avgRating = parseFloat((totalRating / itemReviews.length).toFixed(1));

          return {
            ...item,
            rating: avgRating,
            reviewsCount: itemReviews.length,
          };
        }
        return item;
      })
    );

    // Success response & Reset fields
    setNewReviewName('');
    setNewReviewComment('');
    setNewReviewRating(5);
    setReviewSubmitMessage('شكراً لك! تم إضافة مراجعتك وتقييمك للمنشأة في سجلاتنا بنجاح.');
    setTimeout(() => {
      setReviewSubmitMessage('');
    }, 4500);
  };

  // Filter listings based on Search bar & Category buttons
  const filteredListings = listings.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const activeListing = listings.find((item) => item.id === selectedListingId) || null;
  const activeListingReviews = reviews.filter((r) => r.listingId === selectedListingId);

  // Total unread messages count helper
  const unreadCount = messages.filter((m) => !m.readByListing).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans relative pb-8 selection:bg-blue-100 selection:text-blue-900">
      
      {/* ----------------------------------------------------
          NAVBAR HEADER
          ---------------------------------------------------- */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm px-4 md:px-8 py-4 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo Brand Title */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm text-xl font-bold font-mono">
              📍
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-blue-900 uppercase">نَجْم السَّهْل الجُغْرافي</h1>
              <p className="text-[10px] md:text-xs text-blue-650 font-semibold mt-0.5">الدليل التفاعلي لتحديد مواقع ومراسلة المنشآت والمدارس</p>
            </div>
          </div>

          {/* Quick Stats / Header Actions */}
          <div className="flex items-center gap-3">
            
            {/* Floating Inbox Button with real dynamic unread count badger */}
            <button
              onClick={() => setIsMessageCenterOpen(!isMessageCenterOpen)}
              className="relative p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all duration-200 text-slate-700 flex items-center gap-2 cursor-pointer font-semibold text-xs"
              title="صندوق رسائل المنشآت والمراسلات التفاعلية"
            >
              <Inbox className="w-5 h-5 text-blue-600" />
              <span className="hidden sm:inline text-slate-650">صندوق المراسلات</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Register Listing Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="py-2.5 px-4 md:px-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs md:text-sm flex items-center gap-2 cursor-pointer shadow-sm hover:shadow-md transition-all duration-150"
            >
              <Plus className="w-4.5 h-4.5" />
              <span>أضف منشأة جديدة</span>
            </button>
          </div>

        </div>
      </header>

      {/* ----------------------------------------------------
          MAIN APP GRID LAYOUT & TABS
          ---------------------------------------------------- */}
      <main className="max-w-7xl mx-auto w-full px-4 md:px-8 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Toggle Message Center overlay instead of grid if open! */}
        {isMessageCenterOpen ? (
          <div className="lg:col-span-12">
            <div className="mb-4">
              <button
                onClick={() => setIsMessageCenterOpen(false)}
                className="px-4 py-2 bg-blue-50 hover:bg-blue-105 text-blue-800 text-xs font-semibold rounded-lg transition duration-150 cursor-pointer flex items-center gap-1.5 justify-start"
              >
                <ChevronLeft className="w-4.5 h-4.5" />
                <span>العودة لتصفح الدليل والخريطة</span>
              </button>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.3 }}
            >
              <MessageCenter
                messages={messages}
                onReplyToMessage={handleReplyToMessage}
                listings={listings}
                onClose={() => setIsMessageCenterOpen(false)}
              />
            </motion.div>
          </div>
        ) : (
          <>
            {/* LEFT AREA: DIRECTORY EXPANDABLE LISTINGS AND DETAILS (Col: 5) & Interactive filter */}
            <section className="lg:col-span-5 flex flex-col gap-5">
              
              {/* Directory Filter Panel */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
                
                {/* Search Text Bar */}
                <div className="relative">
                  <span className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="text"
                    placeholder="ابحث بالاسم، الوصف، أو الحي هنا..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-10 pl-3 py-2 bg-slate-100 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm placeholder:text-slate-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 left-3 flex items-center text-xs text-blue-600 font-semibold hover:text-blue-850"
                    >
                      مسح
                    </button>
                  )}
                </div>

                {/* Categories filter tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
                  {[
                    { key: 'all', label: 'الكل', icon: <Compass className="w-3.5 h-3.5" /> },
                    { key: 'companies', label: 'شركات', icon: <Building2 className="w-3.5 h-3.5" /> },
                    { key: 'schools', label: 'مدارس وجامعات', icon: <GraduationCap className="w-3.5 h-3.5" /> },
                    { key: 'stores', label: 'محلات ومتاجر', icon: <Store className="w-3.5 h-3.5" /> },
                    { key: 'others', label: 'أخرى', icon: <MapPin className="w-3.5 h-3.5" /> },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveCategory(tab.key as any)}
                      className={`py-2 px-3.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all duration-200 whitespace-nowrap cursor-pointer ${
                        activeCategory === tab.key
                          ? 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm'
                          : 'bg-white text-slate-600 hover:bg-slate-50 rounded-lg'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

              </div>

              {/* Listings Scrollbox list */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col max-h-[580px] overflow-hidden">
                <div className="p-4 border-b border-slate-150 bg-slate-50/50 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-505">المنشآت المتاحة ({filteredListings.length})</span>
                  <span className="text-[10px] text-slate-400 font-medium">الرياض، المملكة العربية السعودية</span>
                </div>

                <div className="overflow-y-auto divide-y divide-slate-100 flex-1">
                  {filteredListings.length === 0 ? (
                    <div className="p-12 text-center text-slate-450 flex flex-col items-center justify-center gap-2">
                      <span className="text-3xl">🔍</span>
                      <p className="font-bold text-slate-700 text-sm">عذراً، لم نجد أي نتائج متطابقة</p>
                      <p className="text-xs text-slate-400">جرب تغيير مصطلحات البحث أو الفئات المبرزة.</p>
                    </div>
                  ) : (
                    filteredListings.map((facility) => {
                      const isSelected = facility.id === selectedListingId;

                      return (
                        <div
                          key={facility.id}
                          onClick={() => setSelectedListingId(facility.id)}
                          className={`p-4 text-right transition-all duration-150 flex gap-3.5 hover:bg-slate-50 cursor-pointer ${
                            isSelected ? 'bg-blue-50/50 border-r-4 border-blue-600' : 'bg-white'
                          }`}
                        >
                          {/* Circle Avatar Frame */}
                          <div className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-lg shadow-sm border border-slate-150/55 ${
                            facility.category === 'companies' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                            facility.category === 'schools' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            facility.category === 'stores' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                            'bg-purple-50 text-purple-750 border-purple-100'
                          }`}>
                            {facility.logoUrl || '🏢'}
                          </div>

                          {/* Meta Information details */}
                          <div className="flex-grow space-y-1 overflow-hidden">
                            <div className="flex items-center justify-between w-full">
                              <h3 className="font-bold text-slate-900 text-sm truncate max-w-[210px]">{facility.name}</h3>
                              
                              {/* Rating badge */}
                              <div className="flex items-center gap-0.5 shrink-0 bg-amber-50 border border-amber-150 px-1.5 py-0.5 rounded-md">
                                <span className="text-[10px] text-amber-800 font-extrabold">{facility.rating}</span>
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              </div>
                            </div>

                            <p className="text-xs text-slate-500 line-clamp-1 leading-relaxed">
                              {facility.description}
                            </p>

                            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-450 font-medium">
                              <span className="flex items-center gap-1 overflow-hidden truncate max-w-[200px]">
                                <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
                                <span className="truncate">{facility.address}</span>
                              </span>
                              
                              <span className="shrink-0 text-blue-600 bg-blue-50/50 px-2 py-0.5 rounded-full font-semibold">
                                {facility.category === 'companies' ? 'مؤسسة' :
                                 facility.category === 'schools' ? 'تعليمي' :
                                 facility.category === 'stores' ? 'تجاري' : 'خدمات'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </section>

            {/* RIGHT AREA: DETAILED LISTING CARD & MAP COMPONENT (Col: 7) */}
            <section className="lg:col-span-7 flex flex-col gap-5">
              
              {/* Map Panel Container */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5 h-[340px]">
                <MapContainer
                  listings={filteredListings}
                  selectedListingId={selectedListingId}
                  onSelectListing={(listing) => setSelectedListingId(listing.id)}
                  isAddingMode={isSelectingCoords}
                  addingCoords={addingCoords}
                  onMapClickForCoords={handleMapClickForCoords}
                />
              </div>

              {/* Complete Active Listing Details Module */}
              <AnimatePresence mode="wait">
                {activeListing ? (
                  <motion.div
                    key={activeListing.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
                  >
                    
                    {/* Facility Banner Frame */}
                    <div className="p-6 bg-slate-50 border-b border-slate-150 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white shadow-md rounded-2xl flex items-center justify-center text-3xl border border-slate-100">
                          {activeListing.logoUrl || '🏢'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px] font-bold">
                              {activeListing.category === 'companies' ? 'شركة / مؤسسة' :
                               activeListing.category === 'schools' ? 'منشأة تعليمية' :
                               activeListing.category === 'stores' ? 'محل تجاري / مطعم' : 'خدمات عامة'}
                            </span>
                            {activeListing.featured && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-extrabold flex items-center gap-0.5">
                                ⭐ مميز
                              </span>
                            )}
                          </div>
                          
                          <h2 className="text-lg font-extrabold text-slate-900 mt-1.5">{activeListing.name}</h2>
                          
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 justify-start">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{activeListing.address}</span>
                          </p>
                        </div>
                      </div>

                      {/* Contact Buttons action call */}
                      <button
                        onClick={() => setIsContactModalOpen(true)}
                        className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-2 transition duration-150 cursor-pointer self-start md:self-auto shrink-0 shadow-sm"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>مراسلة المنشأة واستفسار</span>
                      </button>
                    </div>

                    {/* About Content */}
                    <div className="p-6 space-y-6">
                      
                      {/* Description Text */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-550 border-b border-slate-100 pb-1 uppercase tracking-wider">نبذة عن المنشأة والخدمات المشهورة</h4>
                        <p className="text-xs text-slate-650 leading-relaxed">{activeListing.description}</p>
                      </div>

                      {/* Metadata Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-150 text-xs">
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                            <div>
                              <span className="block text-[10px] text-slate-400 font-bold">رقم الهاتف</span>
                              <span className="text-slate-800 font-semibold font-mono ltr">{activeListing.phone}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                            <div>
                              <span className="block text-[10px] text-slate-400 font-bold">البريد الإلكتروني</span>
                              <span className="text-slate-800 font-medium font-mono select-all text-xs">{activeListing.email}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                            <div>
                              <span className="block text-[10px] text-slate-400 font-bold">ساعات العمل الرسمية</span>
                              <span className="text-slate-800 font-medium">{activeListing.workingHours || 'غير متوفر بالدليل'}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                            <div>
                              <span className="block text-[10px] text-slate-400 font-bold">الموقع الإلكتروني</span>
                              {activeListing.website ? (
                                <a 
                                  href={activeListing.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-blue-600 font-bold hover:underline font-mono text-xs truncate max-w-[200px]"
                                >
                                  {activeListing.website}
                                </a>
                              ) : (
                                <span className="text-slate-400">غير متوفر</span>
                              )}
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Ratings and reviews section */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <h4 className="text-xs font-bold text-slate-700 tracking-wider">سجل التقييمات ومراجعات العملاء ({activeListingReviews.length})</h4>
                          
                          <div className="flex items-center gap-1 text-xs">
                            <span className="font-extrabold text-slate-800">{activeListing.rating}</span>
                            <div className="flex text-amber-400 text-[10px]">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-3.5 h-3.5 ${Math.round(activeListing.rating) > i ? 'fill-amber-400 text-amber-400' : 'text-slate-330'}`} 
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Leave a review box Form */}
                        <form onSubmit={handleAddReview} className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-3">
                          <h5 className="text-xs font-bold text-slate-800">اترك مراجعة وتقييماً للمنشأة:</h5>
                          
                          {reviewSubmitMessage && (
                            <div className="p-2.5 bg-emerald-50 border border-emerald-150 rounded-lg text-xs text-emerald-800 leading-relaxed font-semibold">
                              {reviewSubmitMessage}
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <input
                                type="text"
                                required
                                placeholder="اسمك الكريم"
                                value={newReviewName}
                                onChange={(e) => setNewReviewName(e.target.value)}
                                className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-slate-500">تقييمك بالنجوم:</span>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((starVal) => (
                                  <button
                                    key={starVal}
                                    type="button"
                                    onClick={() => setNewReviewRating(starVal)}
                                    className="p-1 cursor-pointer transition transform hover:scale-125 focus:outline-none"
                                  >
                                    <Star 
                                      className={`w-4 h-4 ${
                                        newReviewRating >= starVal 
                                          ? 'fill-amber-400 text-amber-400' 
                                          : 'text-slate-300'
                                      }`} 
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <input
                              type="text"
                              required
                              placeholder="ملاحظتك ومراجعة تجربتك معهم..."
                              value={newReviewComment}
                              onChange={(e) => setNewReviewComment(e.target.value)}
                              className="flex-1 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <button
                              type="submit"
                              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition duration-150 shrink-0 cursor-pointer"
                            >
                              إضافة تقييم
                            </button>
                          </div>
                        </form>

                        {/* Recent Reviews list box */}
                        <div className="space-y-3 max-h-[220px] overflow-y-auto">
                          {activeListingReviews.length === 0 ? (
                            <p className="text-center text-slate-400 py-6 text-xs italic">لا توجد مراجعات حتى الآن. كن أول من يكتب تجربته!</p>
                          ) : (
                            activeListingReviews.map((rev) => (
                              <div key={rev.id} className="p-3 border-r-2 border-slate-200 bg-slate-50/40 rounded-l-lg text-xs space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-slate-800">{rev.senderName}</span>
                                  <div className="flex text-amber-400 gap-0.5">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <Star key={i} className={`w-3 h-3 ${rev.rating > i ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-slate-600 leading-relaxed font-normal">{rev.comment}</p>
                                <span className="block text-[9px] text-slate-400 mt-1" style={{ direction: 'ltr' }}>
                                  {new Date(rev.createdAt).toLocaleDateString('ar-SA')}
                                </span>
                              </div>
                            ))
                          )}
                        </div>

                      </div>

                    </div>
                  </motion.div>
                ) : (
                  <div className="bg-slate-100/50 rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2 h-44">
                    <span className="text-3xl">🏢</span>
                    <p className="font-bold text-slate-650 text-sm">لم يتم تحديد منشأة لاستعراض تفاصيلها</p>
                    <p className="text-xs text-slate-400 mt-1">اضغط على أي منشأة من القائمة الجانبية أو أي رمز بالخريطة لعرض تفاصيلها بالكامل هنا.</p>
                  </div>
                )}
              </AnimatePresence>

            </section>
          </>
        )}

      </main>

      {/* ----------------------------------------------------
          MODALS & FLOATING OVERLAYS WINDOWS
          ---------------------------------------------------- */}
      
      {/* 1. Register listing modal */}
      <AddListingModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsSelectingCoords(false);
        }}
        onAddListing={handleAddListing}
        addingCoords={addingCoords}
        setIsSelectingCoords={setIsSelectingCoords}
        isSelectingCoords={isSelectingCoords}
      />

      {/* 2. Direct message modal */}
      <ContactListingModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        listing={activeListing}
        onSendMessage={handleSendMessage}
      />

      {/* FOOTER */}
      <footer className="mt-12 text-center text-xs text-slate-400 border-t border-slate-200 pt-6">
        <p>© 2026 دليل نَجْم السَّهْل الجغرافي الموحّد للمنشآت والمدارس. كافة الحقوق محفوظة.</p>
        <p className="mt-1">نظام خرائط ذكي مدمج بتقنيات الويب السهلة للتواصل الفوري السريع.</p>
      </footer>
    </div>
  );
}
