import React, { useState } from 'react';
import { Message, Listing } from '../types';
import { Inbox, User, Building, Send, ChevronLeft, RefreshCw, MessageCircle } from 'lucide-react';

interface MessageCenterProps {
  messages: Message[];
  onReplyToMessage: (messageId: string, replyText: string, senderType: 'user' | 'listing') => void;
  listings: Listing[];
  onClose: () => void;
}

export default function MessageCenter({
  messages,
  onReplyToMessage,
  listings,
  onClose,
}: MessageCenterProps) {
  // Simulated Persona: 'inquirer' (sending user) or 'owner' (facility manager/listing respondent)
  const [persona, setPersona] = useState<'inquirer' | 'owner'>('inquirer');
  
  // Selected listing for when persona is 'owner' (which business dashboard are they looking at?)
  const [selectedOwnerListingId, setSelectedOwnerListingId] = useState<string>(
    listings.length > 0 ? listings[0].id : ''
  );

  // Selected active message to view conversation details
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    messages.length > 0 ? messages[0].id : null
  );

  // Quick reply input string
  const [replyText, setReplyText] = useState('');

  // Filter messages based on Selected Persona and Specific Listing
  const filteredMessages = messages.filter((msg) => {
    if (persona === 'inquirer') {
      // In guest inquirer mode, we show all queries they sent
      return true;
    } else {
      // In Owner mode, only query topics targeting their business
      return msg.listingId === selectedOwnerListingId;
    }
  });

  // Active highlighted message object
  const activeMessage = messages.find((m) => m.id === selectedMessageId);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedMessageId || !activeMessage) return;

    // In 'owner' mode, senderType is 'listing' and named as the business name,
    // In 'inquirer' mode, senderType is 'user' and named as the person's name.
    const senderType = persona === 'owner' ? 'listing' : 'user';
    
    onReplyToMessage(selectedMessageId, replyText.trim(), senderType);
    setReplyText('');
  };

  const getRelativeDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('ar-SA', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-[580px] text-right">
      
      {/* Top Banner & Mode Toggle */}
      <div className="bg-slate-900 text-white p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800">
        <div>
          <h3 className="font-bold text-base flex items-center gap-1.5 justify-end md:justify-start">
            <Inbox className="w-5 h-5 text-blue-400" />
            <span>نظام المراسلات والتواصل الفوري (المحاكي المزدوج)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">تتيح لك هذه المنصة محاكاة إرسال واستقبال والرد على الرسائل كعضو مستفسر أو كصاحب عمل!</p>
        </div>

        {/* Persona Switch Slider Selector */}
        <div className="flex bg-slate-800 p-1 rounded-xl shrink-0 self-center md:self-auto">
          <button
            onClick={() => {
              setPersona('inquirer');
              setReplyText('');
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
              persona === 'inquirer'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>تصفح كـ مستعلم</span>
          </button>
          <button
            onClick={() => {
              setPersona('owner');
              setReplyText('');
              // Pick first listing to show if not set
              if (listings.length > 0 && !selectedOwnerListingId) {
                setSelectedOwnerListingId(listings[0].id);
              }
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
              persona === 'owner'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>لوحة تحكم المنشآت</span>
          </button>
        </div>
      </div>

      {/* Owner business dashboard switcher (only visible if manager mode active) */}
      {persona === 'owner' && (
        <div className="bg-slate-50 border-b border-slate-200 p-3 flex items-center justify-between gap-3 text-xs md:text-sm">
          <div className="flex items-center gap-1.5 text-slate-700">
            <Building className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-slate-800">اختر المنشأة لإدارتها والرد على عملائها:</span>
          </div>
          <select
            value={selectedOwnerListingId}
            onChange={(e) => {
              setSelectedOwnerListingId(e.target.value);
              setSelectedMessageId(null); // Reset active thread
            }}
            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            {listings.map((item) => (
              <option key={item.id} value={item.id}>
                {item.logoUrl} {item.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Main Container - Left list, Right active conversation chat */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* RIGHT SIDEBAR: List of Messages */}
        <div className="w-full md:w-5/12 border-l border-slate-150 flex flex-col h-full bg-slate-50/50">
          <div className="p-3 bg-white border-b border-slate-150 flex items-center justify-between text-xs font-bold text-slate-500">
            <span>الرسائل الواردة ({filteredMessages.length})</span>
            <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
              {persona === 'inquirer' ? 'استفسارات مرسلة' : 'صندوق البريد'}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center gap-2 h-full">
                <div className="text-3xl">📭</div>
                <p className="text-xs font-semibold text-slate-500">لا يوجد أي رسائل لمشاهدتها حالياً</p>
                <p className="text-[11px] text-slate-400 max-w-[200px] leading-relaxed">
                  {persona === 'inquirer' 
                    ? 'قم بإرسال استفسار لأي منشأة عبر النقر على زر "تواصل الآن" في صفحتها وسيظهر الاستفسار هنا!'
                    : 'لم تتلق هذه المنشأة أي استفسارات حتى الآن.'}
                </p>
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isActive = msg.id === selectedMessageId;
                const hasUnread = persona === 'owner' && !msg.readByListing;

                return (
                  <button
                    key={msg.id}
                    onClick={() => setSelectedMessageId(msg.id)}
                    className={`w-full p-4 text-right transition-all duration-150 flex flex-col gap-1 hover:bg-slate-100/70 border-r-4 ${
                      isActive 
                        ? 'bg-blue-50/50 border-blue-600' 
                        : hasUnread 
                          ? 'border-emerald-500 bg-emerald-50/10' 
                          : 'border-transparent bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full text-xs">
                      <span className="font-bold text-slate-800 truncate max-w-[130px]">
                        {persona === 'inquirer' ? `إلى: ${msg.listingName}` : `من: ${msg.senderName}`}
                      </span>
                      <span className="text-[10px] text-slate-400">{getRelativeDate(msg.createdAt)}</span>
                    </div>
                    
                    <h4 className="text-xs font-extrabold text-slate-900 mt-1 line-clamp-1">
                      {msg.subject}
                    </h4>
                    
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {msg.messageText}
                    </p>

                    <div className="flex items-center justify-between w-full mt-2 pt-1 border-t border-slate-100/50 text-[10px]">
                      <span className="text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        <span>{msg.replies.length} ردود</span>
                      </span>
                      
                      {hasUnread && (
                        <span className="bg-emerald-500 text-white font-bold text-[9px] px-1.5 py-0.5 rounded-full">رسالة جديدة</span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* LEFT COMPONENT: Chat Message Thread Viewer */}
        <div className="hidden md:flex flex-col flex-1 h-full bg-white relative">
          {activeMessage ? (
            <div className="flex flex-col h-full">
              
              {/* Active Conversation Metadata Title */}
              <div className="p-4 border-b border-slate-150 bg-slate-50 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">موضوع الاستفسار: {activeMessage.subject}</h4>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-semibold">
                      المنشأة: {activeMessage.listingName}
                    </span>
                    <span className="text-[11px]">ارسل في: {getRelativeDate(activeMessage.createdAt)}</span>
                  </div>
                </div>

                {/* Sender Details box */}
                <div className="text-xs text-slate-600 border-r border-slate-200 pr-3 hidden lg:block text-left">
                  <div className="font-bold text-slate-705">المرسل: {activeMessage.senderName}</div>
                  <div className="text-[10px] text-slate-400 font-mono select-all">+{activeMessage.senderPhone} | {activeMessage.senderEmail}</div>
                </div>
              </div>

              {/* Chat Reply Threads Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-100/30">
                
                {/* 1. The original message card */}
                <div className="flex flex-col items-start gap-1 max-w-[85%] self-start justify-start">
                  <span className="text-[10px] text-slate-500 px-1 font-semibold">{activeMessage.senderName} (صاحب الاستفسار)</span>
                  <div className="bg-slate-200 text-slate-800 p-3 rounded-2xl rounded-tr-none text-xs leading-relaxed shadow-sm">
                    {activeMessage.messageText}
                  </div>
                </div>

                {/* 2. All reply bubbles */}
                {activeMessage.replies.map((rep) => {
                  const isCurrentPersonaOwn = 
                    (persona === 'owner' && rep.senderType === 'listing') || 
                    (persona === 'inquirer' && rep.senderType === 'user');

                  return (
                    <div 
                      key={rep.id} 
                      className={`flex flex-col max-w-[85%] gap-0.5 ${
                        isCurrentPersonaOwn 
                          ? 'mr-auto items-end text-left' 
                          : 'ml-auto items-start text-right'
                      }`}
                    >
                      <span className="text-[9px] text-slate-400 px-1 font-bold">
                        {rep.senderName} ({rep.senderType === 'listing' ? 'رسمي' : 'مستفسر'})
                      </span>
                      
                      <div className={`p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                        rep.senderType === 'listing'
                          ? 'bg-emerald-600 text-white rounded-tl-none'
                          : 'bg-blue-600 text-white rounded-tr-none'
                      }`}>
                        {rep.messageText}
                      </div>
                      
                      <span className="text-[9px] text-slate-300" style={{ direction: 'ltr' }}>
                        {getRelativeDate(rep.createdAt)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input Compose Box */}
              <form onSubmit={handleSendReply} className="p-3 border-t border-slate-150 bg-slate-50 flex gap-2">
                <input
                  type="text"
                  required
                  placeholder={
                    persona === 'owner' 
                      ? `اكتب رداً رسمياً على ${activeMessage.senderName} باسم المنشأة...`
                      : `اكتب تعقيباً إضافياً للمنشأة...`
                  }
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 px-4 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                />
                
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 transition-all duration-150 cursor-pointer shadow-sm shrink-0 ${
                    persona === 'owner' 
                      ? 'bg-emerald-600 hover:bg-emerald-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>إرسال الرد</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 bg-slate-50/10">
              <span className="text-4xl mb-3">💬</span>
              <p className="font-bold text-slate-500 text-sm">لم يتم تحديد استفسار لمشاهدته</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">
                الرجاء تحديد موضوع أو رسالة من القائمة الجانبية اليمنى لبدء المحادثة الفورية وتجربة المحاكاة.
              </p>
            </div>
          )}
        </div>

        {/* MOBILE FALLBACK TIP (Single layout switcher for small screens) */}
        {!activeMessage && filteredMessages.length > 0 && (
          <div className="md:hidden flex-1 flex flex-col items-center justify-center p-4 text-center bg-white text-slate-450 text-xs">
            ⚠️ استخدم شاشة عرض أكبر أو حدد استفساراً من القائمة الجانبية لتصفح المحادثة بالكامل.
          </div>
        )}
      </div>
    </div>
  );
}
