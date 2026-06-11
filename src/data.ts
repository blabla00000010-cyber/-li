import { Listing, Review } from './types';

export const INITIAL_LISTINGS: Listing[] = [
  {
    id: 'listing-1',
    name: 'شركة ريادة الأعمال للتقنية الرقمية',
    category: 'companies',
    description: 'شركة رائدة في تقديم الحلول البرمجية، وتطوير الأنظمة والتطبيقات السحابية للشركات الصغيرة والمتوسطة بدعم وخبرات محلية وعالمية.',
    lat: 24.7554,
    lng: 46.6348,
    address: 'برج تمكين، طريق الملك فهد، حي الياسمين، الرياض 13322',
    phone: '0114058822',
    email: 'info@reyadah.co',
    website: 'https://reyadah.co',
    rating: 4.8,
    reviewsCount: 12,
    workingHours: 'من الأحد إلى الخميس، من 9:00 صباحاً حتى 5:00 مساءً',
    logoUrl: '🏢',
    featured: true
  },
  {
    id: 'listing-2',
    name: 'مدارس المنار الأهلية النموذجية',
    category: 'schools',
    description: 'صرح تعليمي عريق يسعى لبناء جيل مبدع ومثقف من خلال بيئة تعليمية متكاملة وأحدث المناهج التعليمية المعتمدة والأنشطة اللامنهجية المتميزة لمراحل الروضة، الابتدائي والمتوسط.',
    lat: 24.8115,
    lng: 46.6575,
    address: 'حي نرجس، طريق أنس بن مالك، الرياض 13324',
    phone: '0112009011',
    email: 'admissions@almanar.edu.sa',
    website: 'https://almanar.edu.sa',
    rating: 4.5,
    reviewsCount: 8,
    workingHours: 'من الأحد إلى الخميس، من 7:00 صباحاً حتى 2:00 مساءً',
    logoUrl: '🏫',
    featured: true
  },
  {
    id: 'listing-3',
    name: 'مكتبة ومحمصة الرائد الفاخرة',
    category: 'stores',
    description: 'مساحة ثقافية رائعة تجمع بين متعة القراءة والمذاق الأنيق. نوفر تشكيلة مميزة من الكتب العربية والعالمية مع قهوة مختصة فريدة محمصة محلياً بيئتنا هادئة ومثالية للدراسة والعمل.',
    lat: 24.7298,
    lng: 46.671,
    address: 'حي العليا، طريق الملك عبدالله، الرياض 12271',
    phone: '0118881234',
    email: 'hello@alraedco.space',
    website: 'https://alraedco.space',
    rating: 4.9,
    reviewsCount: 24,
    workingHours: 'يومياً، من 7:00 صباحاً حتى 12:00 منتصف الليل',
    logoUrl: '☕',
    featured: true
  },
  {
    id: 'listing-4',
    name: 'أكاديمية المستقبل لتدريب السباحة والغوص',
    category: 'schools',
    description: 'أكاديمية رياضية متكاملة تقدم دورات سباحة احترافية للأطفال والكبار بمدربين معتمدين دولياً، وبأعلى معايير السلامة والنظافة.',
    lat: 24.7942,
    lng: 46.6908,
    address: 'حي الملقا، طريق سلمان بن عبدالعزيز، الرياض 13521',
    phone: '0115004400',
    email: 'swim@futureacad.sa',
    rating: 4.2,
    reviewsCount: 6,
    workingHours: 'يومياً إلا الجمعة، من 3:00 مساءً حتى 10:00 مساءً',
    logoUrl: '🏊‍♂️'
  },
  {
    id: 'listing-5',
    name: 'هايبر ماركت التوفير العائلي',
    category: 'stores',
    description: 'وجهتك المثالية للتسوق العائلي بأقل الأسعار وأجود المنتجات. نوفر الأغذية الطازجة والمستلزمات المنزلية واللحوم والخضار على مدار الساعة.',
    lat: 24.6855,
    lng: 46.6622,
    address: 'طريق التخصصي، حي المعذر، الرياض 12361',
    phone: '0113334455',
    email: 'support@tawfeer.com.sa',
    rating: 4.0,
    reviewsCount: 15,
    workingHours: 'مفتوح على مدار 24 ساعة طوال أيام الأسبوع',
    logoUrl: '🛒'
  },
  {
    id: 'listing-6',
    name: 'مستودع ركائز لتصميم وإنتاج الأثاث الراقي',
    category: 'companies',
    description: 'تصميم وتنفيذ غرف النوم، غرف المعيشة، والمطابخ بأخشاب مستوردة عالية الجودة وبأيدي فنانين ماهرين. نقدم خدمات تخصيص كاملة للمنازل والفلل والمشاريع التجارية.',
    lat: 24.7001,
    lng: 46.6922,
    address: 'حي السليمانية، طريق مكة المكرمة، الرياض 12234',
    phone: '0501112233',
    email: 'info@rakaiz.sa',
    website: 'https://rakaiz.sa',
    rating: 4.7,
    reviewsCount: 19,
    workingHours: 'السبت إلى الخميس، من 10:00 صباحاً حتى 9:00 مساءً',
    logoUrl: '🛋️'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    listingId: 'listing-1',
    senderName: 'محمد العتيبي',
    rating: 5,
    comment: 'عمل رائع وخدمة عملاء فائقة السرعة. طوروا لنا نظام المخازن والمستودعات بدقة وإتقان. ننصح بالتعامل معهم بشدة.',
    createdAt: '2026-05-10T12:00:00Z'
  },
  {
    id: 'rev-2',
    listingId: 'listing-1',
    senderName: 'سارة الدوسري',
    rating: 4,
    comment: 'حلول ذكية وجلسات عمل مثمرة. العيب الوحيد كان تقديم الطلب الأخير تأخر يومين، لكن الجودة عوضت ذلك.',
    createdAt: '2026-05-28T09:30:00Z'
  },
  {
    id: 'rev-3',
    listingId: 'listing-2',
    senderName: 'خالد عبد الله',
    rating: 5,
    comment: 'مدرسة رائعة بكل المقاييس! الطاقم التعليمي يهتم بكل تفاصيل تطور الطلاب المعرفي والأخلاقي. أبنائي متفوقون بفضل مجهوداتهم.',
    createdAt: '2026-04-15T10:00:00Z'
  },
  {
    id: 'rev-4',
    listingId: 'listing-3',
    senderName: 'أريج القحطاني',
    rating: 5,
    comment: 'مكان لا يُملّ! تشكيلة متميزة جداً من الكتب، وتوريد دائم للروايات الجديدة. البقلاوة والقهوة السريلانكية لديهم تفوز بالصدارة.',
    createdAt: '2026-06-01T15:45:00Z'
  }
];
