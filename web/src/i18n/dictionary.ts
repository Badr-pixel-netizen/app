/**
 * Bilingual Translation Dictionary (src/i18n/dictionary.ts)
 * Strongly-typed Arabic (ar - RTL) and English (en - LTR) dictionary
 * covering all static UI strings for Salamiyah Cinema (سينما سلمية) & B4F Board (Workspaces/Projects/Issues).
 * Dynamic database payloads (titles, names, descriptions) remain untouched.
 */

export type Language = 'ar' | 'en';

export const translations = {
  ar: {
    // Brand & Header
    'brand.name': 'سينما سلمية',
    'brand.subtitle': 'SALAMIYAH CINEMA',
    'brand.hall': 'القاعة الرئيسية (375 مقعداً)',
    'brand.footerNote':
      'القاعة الرئيسية (375 مقعداً) · جميع المواعيد معروضة بتوقيت دمشق (Asia/Damascus) · الدفع نقداً في شباك التذاكر.',

    // Navbar & Navigation
    'nav.home': 'الرئيسية',
    'nav.movies': 'الأفلام',
    'nav.events': 'الفعاليات',
    'nav.myBookings': 'حجوزاتي',
    'nav.admin': 'لوحة الإدارة',
    'nav.login': 'تسجيل الدخول',
    'nav.register': 'إنشاء حساب',
    'nav.logout': 'خروج',
    'nav.logoutFull': 'تسجيل الخروج',
    'nav.mainMenu': 'القائمة الرئيسية',
    'nav.roleSwitcher': 'تبديل الصلاحية للاختبار',
    'nav.role.guest': 'وضع التصفح: زائر',
    'nav.role.customer': 'وضع التصفح: عميل (سارة)',
    'nav.role.admin': 'وضع التصفح: مدير (بدر)',
    'nav.role.staff': 'وضع التصفح: موظف (رامي)',
    'nav.theme.toLight': 'التبديل إلى وضع الملصق النهاري',
    'nav.theme.toDark': 'التبديل إلى وضع قاعة العرض الليلي',
    'nav.lang.switch': 'تغيير اللغة (العربية / الإنجليزية)',

    // Home & Catalog
    'home.heroBadge': 'العرض الافتتاحي · سينما سلمية',
    'home.heroHall': 'SALAMIYAH MAIN HALL',
    'home.bookNow': 'احجز تذكرتك الآن',
    'home.nextSession': 'العرض القادم:',
    'home.nextDate': 'الموعد القادم:',
    'home.soon': 'قريباً',
    'home.detailsAndBook': 'التفاصيل والحجز',
    'home.bookEventNow': 'احجز الآن',
    'home.ratingLabel': 'التصنيف:',
    'home.searchPlaceholder':
      'ابحث عن اسم الفيلم، الفعالية، أو التصنيف الفني في سينما سلمية...',
    'home.clearSearch': 'مسح البحث',
    'home.filterEvents': 'تصفية الفعاليات:',
    'home.filter.all': 'جميع الفعاليات',
    'home.filter.comedy': 'كوميديا وستاند أب',
    'home.filter.cultural': 'أمسية ثقافية',
    'home.filter.festival': 'مهرجان سينمائي',
    'home.filter.lecture': 'ندوة ومحاضرة',
    'home. filterReset': 'إعادة ضبط الفلاتر',
    'home.moviesOverline': 'NOW SHOWING',
    'home.moviesHeading': 'يعرض الآن في سينما سلمية — الأفلام',
    'home.moviesSubheading':
      'مرتبة حسب أقرب موعد عرض قادم في القاعة الرئيسية (بتوقيت دمشق)',
    'home.moviesCountSuffix': 'أفلام',
    'home.noMoviesTitle': 'لا توجد أفلام مطابقة للبحث',
    'home.noMoviesDesc':
      'لم نتمكن من العثور على أفلام منشورة تطابق عبارة البحث الحالية.',
    'home.showAllMovies': 'عرض جميع الأفلام',
    'home.eventsOverline': 'CULTURAL & LIVE EVENTS',
    'home.eventsHeading': 'الفعاليات والعروض الحية',
    'home.eventsSubheading':
      'أمسيات موسيقية، عروض ستاند أب كوميدي، ومهرجانات ثقافية على مسرح سينما سلمية',
    'home.eventsCountSuffix': 'فعاليات',
    'home.noEventsTitle': 'لا توجد فعاليات مطابقة',
    'home.noEventsDesc': 'جرب تغيير فلتر نوع الفعالية أو مسح كلمة البحث.',

    // Content Details & Sessions
    'details.backToCatalog': 'العودة إلى قائمة العروض في سينما سلمية',
    'details.kindMovie': 'فيلم سينمائي',
    'details.kindEvent': 'فعالية حية',
    'details.ageRating': 'التصنيف العمري:',
    'details.duration': 'المدة:',
    'details.language': 'اللغة:',
    'details.noDescription': 'لا يوجد وصف تفصيلي متاح لهذا العرض حالياً.',
    'details.watchTrailer': 'مشاهدة الإعلان الترويجي',
    'details.watchTrailerExt': 'مشاهدة الإعلان الترويجي (رابط خارجي)',
    'details.viewSessions': 'استعراض المواعيد المتاحة',
    'details.sessionsHeading': 'العروض والمواعيد المتاحة',
    'details.sessionsSubheading':
      'جميع المواعيد معروضة بتوقيت دمشق المحلي (Asia/Damascus) · السعر محدد لكل جلسة عرض.',
    'details.noSessionsTitle': 'لا توجد عروض مجدولة حالياً',
    'details.noSessionsDesc':
      'لم يتم طرح مواعيد جديدة لهذا العرض بعد. يرجى التحقق لاحقاً.',
    'details.ticketPrice': 'سعر التذكرة:',
    'details.mainHall': 'القاعة الرئيسية',
    'details.bookSeats': 'احجز مقاعدك',
    'details.trailerModalTitle': 'الإعلان الترويجي',

    // Auth Pages
    'auth.loginTitle': 'تسجيل الدخول إلى سينما سلمية',
    'auth.registerTitle': 'إنشاء حساب عميل جديد',
    'auth.loginRedirectHint':
      'يرجى تسجيل الدخول أولاً للمتابعة إلى الصفحة المطلوبة.',
    'auth.defaultHint':
      'احجز مقاعدك في سينما سلمية واستلم تذاكر QR فورية.',
    'auth.fullName': 'الاسم الكامل *',
    'auth.fullNamePlaceholder': 'مثال: سارة الحموي',
    'auth.email': 'البريد الإلكتروني *',
    'auth.password': 'كلمة المرور *',
    'auth.passwordHint': '8 أحرف على الأقل (حرف + رقم)',
    'auth.phone': 'رقم الهاتف (اختياري)',
    'auth.submitLogin': 'دخول إلى سينما سلمية',
    'auth.submitRegister': 'تسجيل الحساب',
    'auth.demoAccounts': 'تعبئة سريعة لحسابات التجربة:',
    'auth.demoCustomer': 'حساب عميل (سارة)',
    'auth.demoAdmin': 'حساب مدير (بدر)',
    'auth.noAccount': 'ليس لديك حساب بعد؟',
    'auth.createNewAccount': 'إنشاء حساب جديد',
    'auth.haveAccount': 'لديك حساب بالفعل؟',

    // Admin Sidebar & Shell
    'admin.brandTitle': 'إدارة سينما سلمية',
    'admin.brandSub': 'ADMINISTRATION',
    'admin.mobileHeader': 'لوحة تحكم إدارة سينما سلمية',
    'admin.openMenu': 'أقسام الإدارة',
    'admin.nav.dashboard': 'لوحة الإحصائيات',
    'admin.nav.movies': 'إدارة الأفلام',
    'admin.nav.events': 'إدارة الفعاليات',
    'admin.nav.settings': 'إعدادات الحجز',

    // Admin Dashboard
    'admin.statsOverline': 'EXECUTIVE OVERVIEW',
    'admin.statsHeading': 'لوحة الإحصائيات العامة — سينما سلمية (آخر 30 يوماً)',
    'admin.statsSubheading':
      'ملخص الحجوزات، الإيرادات المتوقعة، ونسب إشغال العروض القادمة في القاعة الرئيسية.',
    'admin.kpi.totalReservations': 'إجمالي الحجوزات',
    'admin.kpi.last30Days': 'خلال آخر 30 يوماً',
    'admin.kpi.confirmed': 'الحجوزات المؤكدة',
    'admin.kpi.activeQr': 'تذاكر QR فعالة',
    'admin.kpi.cancelledExpired': 'الملغاة / المنتهية',
    'admin.kpi.expectedRevenue': 'الإيرادات المتوقعة',
    'admin.kpi.confirmedOnly': 'للحجوزات المؤكدة فقط',
    'admin.upcomingHeading': 'العروض القادمة ونسبة الإشغال (7 أيام القادمة)',
    'admin.latestReservationsHeading': 'أحدث الحجوزات المسجلة',
    'admin.col.show': 'العرض / الفعالية',
    'admin.col.damascusTime': 'الموعد (توقيت دمشق)',
    'admin.col.seatsBookedTotal': 'المقاعد المحجوزة / الإجمالي',
    'admin.col.occupancy': 'نسبة الإشغال (Occupancy)',
    'admin.col.resCode': 'رقم الحجز',
    'admin.col.customer': 'العميل',
    'admin.col.status': 'الحالة',
    'admin.col.amount': 'المبلغ',
    'admin.col.actions': 'الإجراءات',

    // Admin Movies & Events CRUD
    'admin.moviesHeading': 'إدارة الأفلام السينمائية',
    'admin.eventsHeading': 'إدارة الفعاليات والعروض الحية',
    'admin.contentSubheading':
      'إضافة وتعديل المحتوى، التحكم الفوري بالنشر، أو الأرشفة الآمنة دون حذف السجلات التاريخية.',
    'admin.addMovie': 'إضافة فيلم جديد',
    'admin.addEvent': 'إضافة فعالية جديدة',
    'admin.searchMoviePlaceholder': 'ابحث بعنوان الفيلم...',
    'admin.searchEventPlaceholder': 'ابحث بعنوان الفعالية...',
    'admin.status.all': 'الكل',
    'admin.status.published': 'منشور',
    'admin.status.draft': 'مسودة',
    'admin.status.archived': 'مؤرشف',
    'admin.badge.published': 'منشور (Published)',
    'admin.badge.draft': 'مسودة (Draft)',
    'admin.badge.archived': 'مؤرشف (Archived)',
    'admin.action.publish': 'نشر',
    'admin.action.unpublish': 'إلغاء النشر',
    'admin.action.edit': 'تعديل',
    'admin.action.archive': 'أرشفة',
    'admin.archiveConfirmTitle': 'تأكيد أرشفة المحتوى',
    'admin.archiveConfirmBtn': 'نعم، أرشفة',

    // Admin Settings
    'admin.settingsHeading': 'إعدادات الحجز والقاعة — سينما سلمية',
    'admin.settingsSubheading':
      'تتحكم هذه القيم بمهلة الحجز المؤقت للمقاعد والحد الأقصى المسموح لكل عميل ونافذة الإلغاء.',
    'admin.settings.holdDuration':
      'مدة الحجز المؤقت للمقاعد (بالدقائق 1 - 60) *',
    'admin.settings.holdDurationHint':
      'المهلة التي يحتفظ فيها النظام بالمقعد في حالة HELD قبل انتهاء الصلاحية.',
    'admin.settings.maxSeats':
      'الحد الأقصى للمقاعد في الحجز الواحد (1 - 20) *',
    'admin.settings.maxSeatsHint':
      'يُستخدم في خريطة المقاعد لمنع تجاوز الحد المسموح للعميل.',
    'admin.settings.cancelWindow':
      'نافذة السماح بإلغاء الحجز قبل العرض (بالدقائق 0 - 1440) *',
    'admin.settings.cancelWindowHint':
      'المدة الأدنى قبل بدء العرض التي يُسمح فيها للعميل بإلغاء حجزه المؤكد.',
    'admin.settings.currencyNote': 'العملة المعتمدة للنظام:',
    'admin.settings.saveBtn': 'حفظ الإعدادات',

    // Shared UI Kit & Statuses
    'ui.cancel': 'إلغاء',
    'ui.confirm': 'تأكيد',
    'ui.saveChanges': 'حفظ التعديلات',
    'ui.addAndSave': 'إضافة وحفظ',
    'ui.retry': 'إعادة المحاولة',
    'ui.prevPage': 'السابق',
    'ui.nextPage': 'التالي',
    'ui.page': 'صفحة',
    'ui.of': 'من',
    'ui.total': 'الإجمالي:',
    'ui.emptyTitle': 'لا توجد سجلات مطابقة',
    'ui.emptyDesc': 'جرب تعديل كلمات البحث أو الفلاتر لعرض النتائج.',
    'ui.errorTitle': 'حدث خطأ أثناء تحميل البيانات',
    'ui.backHome': 'العودة إلى الصفحة الرئيسية',
    'status.confirmed': 'مؤكد',
    'status.pending': 'قيد الانتظار',
    'status.cancelled': 'ملغى',
    'status.expired': 'منتهي الصلاحية',

    // B4F Board (Workspace / Project / Issue Labels for Shared Cohort Components)
    'board.workspaces': 'مساحات العمل',
    'board.projects': 'المشاريع',
    'board.issues': 'المهام والتذاكر',
    'board.newIssue': 'مهمة جديدة',
    'board.newProject': 'مشروع جديد',
    'board.filterPlaceholder': 'تصفية المهام حسب العنوان أو الوسم...',
    'board.sortBy': 'ترتيب حسب',
    'board.status.todo': 'قيد الانتظار',
    'board.status.inProgress': 'قيد التنفيذ',
    'board.status.done': 'مكتمل',
    'board.priority.high': 'أولوية عالية',
    'board.priority.medium': 'أولوية متوسطة',
    'board.priority.low': 'أولوية منخفضة',
  },

  en: {
    // Brand & Header
    'brand.name': 'Salamiyah Cinema',
    'brand.subtitle': 'سينما سلمية',
    'brand.hall': 'Main Hall (375 Seats)',
    'brand.footerNote':
      'Main Hall (375 Seats) · All showtimes displayed in Damascus Time (Asia/Damascus) · Cash payment at the box office.',

    // Navbar & Navigation
    'nav.home': 'Home',
    'nav.movies': 'Movies',
    'nav.events': 'Events',
    'nav.myBookings': 'My Bookings',
    'nav.admin': 'Admin Panel',
    'nav.login': 'Sign In',
    'nav.register': 'Register',
    'nav.logout': 'Logout',
    'nav.logoutFull': 'Sign Out',
    'nav.mainMenu': 'Main Menu',
    'nav.roleSwitcher': 'Switch test role',
    'nav.role.guest': 'Role: Guest',
    'nav.role.customer': 'Role: Customer (Sara)',
    'nav.role.admin': 'Role: Admin (Badr)',
    'nav.role.staff': 'Role: Staff (Rami)',
    'nav.theme.toLight': 'Switch to Cinema Daylight Mode',
    'nav.theme.toDark': 'Switch to Cinema Theatre Dark Mode',
    'nav.lang.switch': 'Switch language (Arabic / English)',

    // Home & Catalog
    'home.heroBadge': 'FEATURED PREMIERE · SALAMIYAH CINEMA',
    'home.heroHall': 'SALAMIYAH MAIN HALL',
    'home.bookNow': 'Book Tickets Now',
    'home.nextSession': 'Next Showtime:',
    'home.nextDate': 'Next Session:',
    'home.soon': 'Coming Soon',
    'home.detailsAndBook': 'Details & Booking',
    'home.bookEventNow': 'Book Now',
    'home.ratingLabel': 'Rated:',
    'home.searchPlaceholder':
      'Search movies, live events, or genres at Salamiyah Cinema...',
    'home.clearSearch': 'Clear Search',
    'home.filterEvents': 'Filter Events:',
    'home.filter.all': 'All Events',
    'home.filter.comedy': 'Comedy & Stand-up',
    'home.filter.cultural': 'Cultural Night',
    'home.filter.festival': 'Film Festival',
    'home.filter.lecture': 'Talk & Lecture',
    'home. filterReset': 'Reset Filters',
    'home.moviesOverline': 'NOW SHOWING',
    'home.moviesHeading': 'Now Showing — Feature Films',
    'home.moviesSubheading':
      'Ordered by nearest upcoming scheduled session in the Main Hall (Damascus Time)',
    'home.moviesCountSuffix': 'Movies',
    'home.noMoviesTitle': 'No matching movies found',
    'home.noMoviesDesc':
      'We could not find any published movies matching your search query.',
    'home.showAllMovies': 'Show All Movies',
    'home.eventsOverline': 'CULTURAL & LIVE EVENTS',
    'home.eventsHeading': 'Live Events & Stage Performances',
    'home.eventsSubheading':
      'Musical evenings, stand-up comedy shows, and independent film festivals on stage',
    'home.eventsCountSuffix': 'Events',
    'home.noEventsTitle': 'No matching events found',
    'home.noEventsDesc':
      'Try selecting a different event category or clearing your search.',

    // Content Details & Sessions
    'details.backToCatalog': 'Back to Salamiyah Cinema Catalog',
    'details.kindMovie': 'FEATURE FILM',
    'details.kindEvent': 'LIVE EVENT',
    'details.ageRating': 'Age Rating:',
    'details.duration': 'Duration:',
    'details.language': 'Language:',
    'details.noDescription': 'No detailed synopsis available for this show yet.',
    'details.watchTrailer': 'Watch Official Trailer',
    'details.watchTrailerExt': 'Watch Trailer (External Link)',
    'details.viewSessions': 'Available Showtimes',
    'details.sessionsHeading': 'Available Sessions & Showtimes',
    'details.sessionsSubheading':
      'All times shown in Damascus local time (Asia/Damascus) · Ticket price set per session.',
    'details.noSessionsTitle': 'No scheduled sessions available',
    'details.noSessionsDesc':
      'New showtimes have not been scheduled yet. Please check back soon.',
    'details.ticketPrice': 'Ticket Price:',
    'details.mainHall': 'Main Hall',
    'details.bookSeats': 'Select Seats',
    'details.trailerModalTitle': 'Official Trailer',

    // Auth Pages
    'auth.loginTitle': 'Sign In to Salamiyah Cinema',
    'auth.registerTitle': 'Create Customer Account',
    'auth.loginRedirectHint':
      'Please sign in first to continue to the requested page.',
    'auth.defaultHint':
      'Reserve your seats at Salamiyah Cinema and get instant QR tickets.',
    'auth.fullName': 'Full Name *',
    'auth.fullNamePlaceholder': 'e.g. Sara Al-Hamwi',
    'auth.email': 'Email Address *',
    'auth.password': 'Password *',
    'auth.passwordHint': 'At least 8 characters (letter + number)',
    'auth.phone': 'Phone Number (Optional)',
    'auth.submitLogin': 'Sign In',
    'auth.submitRegister': 'Create Account',
    'auth.demoAccounts': 'Quick Fill Demo Accounts:',
    'auth.demoCustomer': 'Customer (Sara)',
    'auth.demoAdmin': 'Admin (Badr)',
    'auth.noAccount': "Don't have an account yet?",
    'auth.createNewAccount': 'Create a new account',
    'auth.haveAccount': 'Already have an account?',

    // Admin Sidebar & Shell
    'admin.brandTitle': 'Salamiyah Cinema Admin',
    'admin.brandSub': 'ADMINISTRATION',
    'admin.mobileHeader': 'Salamiyah Cinema Admin Control',
    'admin.openMenu': 'Admin Menu',
    'admin.nav.dashboard': 'Overview & Analytics',
    'admin.nav.movies': 'Manage Movies',
    'admin.nav.events': 'Manage Events',
    'admin.nav.settings': 'Booking Settings',

    // Admin Dashboard
    'admin.statsOverline': 'EXECUTIVE OVERVIEW',
    'admin.statsHeading': 'Analytics Overview — Salamiyah Cinema (Last 30 Days)',
    'admin.statsSubheading':
      'Summary of reservations, expected box-office revenue, and Main Hall session occupancy.',
    'admin.kpi.totalReservations': 'Total Reservations',
    'admin.kpi.last30Days': 'Over the last 30 days',
    'admin.kpi.confirmed': 'Confirmed Bookings',
    'admin.kpi.activeQr': 'Active QR tickets',
    'admin.kpi.cancelledExpired': 'Cancelled / Expired',
    'admin.kpi.expectedRevenue': 'Expected Revenue',
    'admin.kpi.confirmedOnly': 'Confirmed bookings only',
    'admin.upcomingHeading': 'Upcoming Sessions & Occupancy (Next 7 Days)',
    'admin.latestReservationsHeading': 'Latest Recorded Reservations',
    'admin.col.show': 'Movie / Event',
    'admin.col.damascusTime': 'Showtime (Damascus Time)',
    'admin.col.seatsBookedTotal': 'Booked / Total Seats',
    'admin.col.occupancy': 'Hall Occupancy',
    'admin.col.resCode': 'Booking Code',
    'admin.col.customer': 'Customer',
    'admin.col.status': 'Status',
    'admin.col.amount': 'Total Amount',
    'admin.col.actions': 'Actions',

    // Admin Movies & Events CRUD
    'admin.moviesHeading': 'Manage Feature Films',
    'admin.eventsHeading': 'Manage Live Events',
    'admin.contentSubheading':
      'Create and edit catalog items, toggle live publication, or safely archive records.',
    'admin.addMovie': 'Add New Movie',
    'admin.addEvent': 'Add New Event',
    'admin.searchMoviePlaceholder': 'Search by movie title...',
    'admin.searchEventPlaceholder': 'Search by event title...',
    'admin.status.all': 'All',
    'admin.status.published': 'Published',
    'admin.status.draft': 'Draft',
    'admin.status.archived': 'Archived',
    'admin.badge.published': 'Published',
    'admin.badge.draft': 'Draft',
    'admin.badge.archived': 'Archived',
    'admin.action.publish': 'Publish',
    'admin.action.unpublish': 'Unpublish',
    'admin.action.edit': 'Edit',
    'admin.action.archive': 'Archive',
    'admin.archiveConfirmTitle': 'Confirm Content Archiving',
    'admin.archiveConfirmBtn': 'Yes, Archive',

    // Admin Settings
    'admin.settingsHeading': 'Booking & Hall Settings — Salamiyah Cinema',
    'admin.settingsSubheading':
      'Configure seat hold duration, maximum seats per reservation, and cancellation window.',
    'admin.settings.holdDuration': 'Temporary Seat Hold Duration (1 - 60 min) *',
    'admin.settings.holdDurationHint':
      'Duration a seat remains in HELD status before expiring automatically.',
    'admin.settings.maxSeats': 'Max Seats Per Reservation (1 - 20) *',
    'admin.settings.maxSeatsHint':
      'Enforced on the interactive seat map per customer booking.',
    'admin.settings.cancelWindow':
      'Cancellation Window Before Showtime (0 - 1440 min) *',
    'admin.settings.cancelWindowHint':
      'Minimum minutes before session start required for customer cancellation.',
    'admin.settings.currencyNote': 'System Currency:',
    'admin.settings.saveBtn': 'Save Settings',

    // Shared UI Kit & Statuses
    'ui.cancel': 'Cancel',
    'ui.confirm': 'Confirm',
    'ui.saveChanges': 'Save Changes',
    'ui.addAndSave': 'Create & Save',
    'ui.retry': 'Try Again',
    'ui.prevPage': 'Previous',
    'ui.nextPage': 'Next',
    'ui.page': 'Page',
    'ui.of': 'of',
    'ui.total': 'Total:',
    'ui.emptyTitle': 'No matching records found',
    'ui.emptyDesc': 'Try adjusting your search query or active filters.',
    'ui.errorTitle': 'Failed to load data',
    'ui.backHome': 'Back to Home Page',
    'status.confirmed': 'Confirmed',
    'status.pending': 'Pending',
    'status.cancelled': 'Cancelled',
    'status.expired': 'Expired',

    // B4F Board (Workspace / Project / Issue Labels for Shared Cohort Components)
    'board.workspaces': 'Workspaces',
    'board.projects': 'Projects',
    'board.issues': 'Issues & Tasks',
    'board.newIssue': 'New Issue',
    'board.newProject': 'New Project',
    'board.filterPlaceholder': 'Filter issues by title or tag...',
    'board.sortBy': 'Sort By',
    'board.status.todo': 'To Do',
    'board.status.inProgress': 'In Progress',
    'board.status.done': 'Done',
    'board.priority.high': 'High Priority',
    'board.priority.medium': 'Medium Priority',
    'board.priority.low': 'Low Priority',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function translate(lang: Language, key: TranslationKey): string {
  return translations[lang][key] ?? translations.ar[key] ?? key;
}

