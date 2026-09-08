export type Locale = 'en' | 'ar';

export interface Translation {
  // Navigation
  home: string;
  tasks: string;
  rewards: string;
  family: string;
  settings: string;
  achievements: string;
  profile: string;
  myTasks: string;

  // Auth
  welcome: string;
  tagline: string;
  signIn: string;
  signUp: string;
  signOut: string;
  email: string;
  password: string;
  fullName: string;
  continue: string;
  demo: string;
  alreadyHaveAccount: string;
  dontHaveAccount: string;
  authError: string;
  safePrivate: string;

  // Parent Home
  goodMorning: string;
  goodAfternoon: string;
  goodEvening: string;
  familyOverview: string;
  children: string;
  tasksDone: string;
  pendingApprovals: string;
  pointsEarned: string;
  todaysActivity: string;
  viewAll: string;
  yourChildren: string;
  seeFamily: string;
  review: string;
  greatMomentum: string;
  thisWeek: string;
  familyProgress: string;
  heresWhatsHappening: string;

  // Parent Tasks
  manage: string;
  keepFamilyMoving: string;
  all: string;
  assigned: string;
  needsReview: string;
  approved: string;
  rejected: string;
  addTask: string;
  addReward: string;
  addChild: string;
  allCaught: string;
  approve: string;
  reject: string;
  approveTask: string;
  rejectTask: string;
  approveReward: string;
  rejectReward: string;
  waitingApproval: string;
  completed: string;
  inProgress: string;
  expired: string;

  // Parent Rewards
  celebrateProgress: string;
  makeHabitsSpecial: string;
  rewardStore: string;
  activeRewards: string;
  littleMoments: string;
  editReward: string;

  // Family View
  yourFamily: string;
  everyoneGrows: string;
  level: string;
  progressThisWeek: string;
  wonderfulProgress: string;
  keepCelebrating: string;
  recentTasks: string;
  balance: string;
  points: string;
  money: string;
  streak: string;
  screenTime: string;
  editChild: string;
  removeChild: string;
  confirmRemoveChild: string;

  // Child Home
  hi: string;
  readyForGreatDay: string;
  todaysTasks: string;
  seeAll: string;
  keepGoing: string;
  everyStepMatters: string;
  toLevel: string;
  topLevel: string;

  // Child Tasks
  keepItUp: string;
  doingGreat: string;
  toDo: string;
  done: string;
  waiting: string;
  tapToComplete: string;

  // Child Rewards
  dreamBig: string;
  pointsToSpend: string;
  redeem: string;
  notEnoughPoints: string;
  redeemConfirmation: string;

  // Achievements
  celebrateWins: string;
  unlockedBadges: string;
  youreAStar: string;
  keepTakingSteps: string;
  unlocked: string;
  locked: string;
  firstTask: string;
  tenTasks: string;
  sevenDayStreak: string;
  homeworkHero: string;
  readingStar: string;
  helpfulMember: string;

  // Profile
  chooseProfile: string;
  familySafeSpace: string;
  profileOnlyVisible: string;

  // Settings
  makeItYours: string;
  simpleControls: string;
  parentAccount: string;
  familySettings: string;
  rewardTypes: string;
  pointsMoneyScreenTime: string;
  notifications: string;
  taskCompletionsAndRequests: string;
  pinSecurity: string;
  protectParentControls: string;
  language: string;
  appearance: string;
  darkMode: string;
  lightMode: string;
  dataPrivacy: string;
  yourDataStaysPrivate: string;
  familyInsights: string;
  seeProgressOverTime: string;

  // Modals
  taskName: string;
  assignTo: string;
  category: string;
  rewardPoints: string;
  chooseIcon: string;
  save: string;
  cancel: string;
  rewardName: string;
  description: string;
  costInPoints: string;
  childNickname: string;
  chooseAvatar: string;
  addChildBtn: string;
  taskDescription: string;
  frequency: string;
  daily: string;
  weekly: string;
  oneTime: string;
  dueDate: string;
  difficulty: string;
  easy: string;
  medium: string;
  hard: string;
  rewardType: string;
  rewardAmount: string;

  // History
  history: string;
  transactionHistory: string;
  noHistory: string;
  pointsSpent: string;
  moneyEarned: string;
  moneySpent: string;

  // Notifications
  newNotification: string;
  noNotifications: string;
  markAllRead: string;

  // Misc
  loading: string;
  errorLoading: string;
  retry: string;
  allChildren: string;
  parent: string;
  child: string;
  parentView: string;
  switchToChild: string;
  switchToParent: string;
  noRewards: string;
  noTasks: string;
  taskCreated: string;
  rewardCreated: string;
  childAdded: string;
  taskCompleted: string;
  taskApproved: string;
  taskRejected: string;
  rewardRedeemed: string;
  rewardApproved: string;
  rewardRejected: string;
  childRemoved: string;
  childUpdated: string;
  settingsSaved: string;
  offlineMessage: string;
  backOnline: string;
}

const en: Translation = {
  home: 'Home', tasks: 'Tasks', rewards: 'Rewards', family: 'Family', settings: 'Settings',
  achievements: 'Achievements', profile: 'Profile', myTasks: 'My Tasks',
  welcome: 'Welcome to BrightSteps', tagline: 'Small steps. Big celebrations.',
  signIn: 'Sign in', signUp: 'Create account', signOut: 'Sign out',
  email: 'Email address', password: 'Password', fullName: 'Your name',
  continue: 'Continue', demo: 'Try demo family',
  alreadyHaveAccount: 'Already have an account?', dontHaveAccount: "Don't have an account?",
  authError: 'Please check your details and try again.', safePrivate: 'Safe, private, and made for families',
  goodMorning: 'Good morning', goodAfternoon: 'Good afternoon', goodEvening: 'Good evening',
  familyOverview: 'Family overview', children: 'Children', tasksDone: 'Tasks done',
  pendingApprovals: 'Pending approvals', pointsEarned: 'Points earned',
  todaysActivity: "Today's activity", viewAll: 'View all', yourChildren: 'Your children',
  seeFamily: 'See family', review: 'Review', greatMomentum: 'Great momentum',
  thisWeek: 'This week', familyProgress: 'Family progress', heresWhatsHappening: "Here's what's happening with your family today.",
  manage: 'MANAGE', keepFamilyMoving: 'Keep the family moving forward.',
  all: 'All', assigned: 'Assigned', needsReview: 'Needs review', approved: 'Approved', rejected: 'Rejected',
  addTask: 'Add task', addReward: 'Add reward', addChild: 'Add child',
  allCaught: "You're all caught up!", approve: 'Approve', reject: 'Reject',
  approveTask: 'Approve task', rejectTask: 'Reject task', approveReward: 'Approve reward', rejectReward: 'Reject reward',
  waitingApproval: 'Waiting for approval', completed: 'Completed', inProgress: 'In progress', expired: 'Expired',
  celebrateProgress: 'CELEBRATE PROGRESS', makeHabitsSpecial: 'Make good habits feel special.',
  rewardStore: 'Reward store', activeRewards: 'active rewards', littleMoments: 'Little moments become big memories.',
  editReward: 'Edit reward',
  yourFamily: 'YOUR FAMILY', everyoneGrows: 'Everyone grows at their own pace.',
  level: 'Level', progressThisWeek: 'Progress this week', wonderfulProgress: 'Wonderful progress',
  keepCelebrating: 'Keep celebrating the small wins.', recentTasks: 'Recent tasks',
  balance: 'Reward balance', points: 'Points', money: 'Reward balance', streak: 'day streak', screenTime: 'Screen time',
  editChild: 'Edit child', removeChild: 'Remove child', confirmRemoveChild: 'Are you sure you want to remove this child? All their data will be lost.',
  hi: 'Hi', readyForGreatDay: 'Ready for a great day?',
  todaysTasks: "Today's Tasks", seeAll: 'See all', keepGoing: 'Keep going!',
  everyStepMatters: 'Every small step makes a difference.', toLevel: 'XP to', topLevel: 'Top level!',
  keepItUp: 'KEEP IT UP', doingGreat: "You're doing great", toDo: 'to do', done: 'done', waiting: 'waiting',
  tapToComplete: 'Tap to complete',
  dreamBig: 'DREAM BIG', pointsToSpend: 'points to spend', redeem: 'Redeem reward',
  notEnoughPoints: 'Not enough points', redeemConfirmation: 'is waiting for approval!',
  celebrateWins: 'CELEBRATE YOUR WINS', unlockedBadges: 'badges so far!', youreAStar: "You're a star",
  keepTakingSteps: 'Keep taking small steps to unlock more.', unlocked: 'Unlocked', locked: 'Locked',
  firstTask: 'First Task', tenTasks: '10 Tasks Completed', sevenDayStreak: '7-Day Consistency',
  homeworkHero: 'Homework Hero', readingStar: 'Reading Star', helpfulMember: 'Helpful Family Member',
  chooseProfile: 'Choose your profile', familySafeSpace: 'Family-safe space',
  profileOnlyVisible: 'Your profile is only visible to your family.',
  makeItYours: 'MAKE IT YOURS', simpleControls: 'Simple controls for your family.',
  parentAccount: 'Parent account', familySettings: 'Family settings',
  rewardTypes: 'Reward types', pointsMoneyScreenTime: 'Points, money, screen time',
  notifications: 'Notifications', taskCompletionsAndRequests: 'Task completions and requests',
  pinSecurity: 'PIN & security', protectParentControls: 'Protect parent controls',
  language: 'Language', appearance: 'Appearance', darkMode: 'Dark mode', lightMode: 'Light mode',
  dataPrivacy: 'Data & privacy', yourDataStaysPrivate: 'Your family data stays private',
  familyInsights: 'Family insights', seeProgressOverTime: 'See progress over time',
  taskName: 'Task name', assignTo: 'Assign to', category: 'Category', rewardPoints: 'Reward points',
  chooseIcon: 'Choose an icon', save: 'Save', cancel: 'Cancel',
  rewardName: 'Reward name', description: 'Description', costInPoints: 'Cost in points',
  childNickname: "Child's nickname", chooseAvatar: 'Choose an avatar', addChildBtn: 'Add child',
  taskDescription: 'A new family task', frequency: 'Frequency',
  daily: 'Daily', weekly: 'Weekly', oneTime: 'One time',
  dueDate: 'Due date', difficulty: 'Difficulty', easy: 'Easy', medium: 'Medium', hard: 'Hard',
  rewardType: 'Reward type', rewardAmount: 'Reward amount',
  history: 'History', transactionHistory: 'Transaction history', noHistory: 'No transactions yet',
  pointsSpent: 'Points spent', moneyEarned: 'Money earned', moneySpent: 'Money spent',
  newNotification: 'new', noNotifications: 'No notifications', markAllRead: 'Mark all read',
  loading: 'Loading...', errorLoading: 'Something went wrong', retry: 'Try again',
  allChildren: 'All children', parent: 'Parent', child: 'Child',
  parentView: 'Parent view', switchToChild: 'Switch to child view', switchToParent: 'Switch to parent view',
  noRewards: "Your parent hasn't added any rewards yet.", noTasks: 'No tasks yet',
  taskCreated: 'Task created.', rewardCreated: 'Reward created.', childAdded: 'Child added.',
  taskCompleted: 'Great job! Sent to your parent for approval.', taskApproved: 'Approved and reward granted!',
  taskRejected: 'Task sent back for revision.', rewardRedeemed: 'Reward requested! Waiting for approval.',
  rewardApproved: 'Reward approved!', rewardRejected: 'Reward not approved this time.',
  childRemoved: 'Child removed.', childUpdated: 'Child updated.', settingsSaved: 'Settings saved.',
  offlineMessage: "You're offline. Showing cached data.", backOnline: "Back online!",
};

const ar: Translation = {
  home: 'الرئيسية', tasks: 'المهام', rewards: 'المكافآت', family: 'العائلة', settings: 'الإعدادات',
  achievements: 'الإنجازات', profile: 'الملف الشخصي', myTasks: 'مهامي',
  welcome: 'مرحباً بك في خطوات مشرقة', tagline: 'خطوات صغيرة. احتفالات كبيرة.',
  signIn: 'تسجيل الدخول', signUp: 'إنشاء حساب', signOut: 'تسجيل الخروج',
  email: 'البريد الإلكتروني', password: 'كلمة المرور', fullName: 'اسمك',
  continue: 'متابعة', demo: 'تجربة العائلة التجريبية',
  alreadyHaveAccount: 'لديك حساب بالفعل؟', dontHaveAccount: 'ليس لديك حساب؟',
  authError: 'يرجى التحقق من بياناتك والمحاولة مرة أخرى.', safePrivate: 'آمن وخاص ومصمم للعائلات',
  goodMorning: 'صباح الخير', goodAfternoon: 'مساء الخير', goodEvening: 'مساء الخير',
  familyOverview: 'نظرة عامة على العائلة', children: 'الأطفال', tasksDone: 'المهام المكتملة',
  pendingApprovals: 'في انتظار الموافقة', pointsEarned: 'النقاط المكتسبة',
  todaysActivity: 'نشاط اليوم', viewAll: 'عرض الكل', yourChildren: 'أطفالك',
  seeFamily: 'عرض العائلة', review: 'مراجعة', greatMomentum: 'تقدم رائع',
  thisWeek: 'هذا الأسبوع', familyProgress: 'تقدم العائلة', heresWhatsHappening: 'إليك ما يحدث مع عائلتك اليوم.',
  manage: 'إدارة', keepFamilyMoving: 'حافظ على تقدم العائلة.',
  all: 'الكل', assigned: 'مُسندة', needsReview: 'تحتاج مراجعة', approved: 'تمت الموافقة', rejected: 'مرفوضة',
  addTask: 'إضافة مهمة', addReward: 'إضافة مكافأة', addChild: 'إضافة طفل',
  allCaught: 'لقد أنجزت كل شيء!', approve: 'موافقة', reject: 'رفض',
  approveTask: 'الموافقة على المهمة', rejectTask: 'رفض المهمة', approveReward: 'الموافقة على المكافأة', rejectReward: 'رفض المكافأة',
  waitingApproval: 'في انتظار الموافقة', completed: 'مكتملة', inProgress: 'قيد التنفيذ', expired: 'منتهية',
  celebrateProgress: 'احتفل بالتقدم', makeHabitsSpecial: 'اجعل العادات الجيدة ممتعة.',
  rewardStore: 'متجر المكافآت', activeRewards: 'مكافآت نشطة', littleMoments: 'اللحظات الصغيرة تصبح ذكريات كبيرة.',
  editReward: 'تعديل المكافأة',
  yourFamily: 'عائلتك', everyoneGrows: 'كل واحد يتقدم بخطواته الخاصة.',
  level: 'المستوى', progressThisWeek: 'التقدم هذا الأسبوع', wonderfulProgress: 'تقدم رائع',
  keepCelebrating: 'استمر في الاحتفال بالإنجازات الصغيرة.', recentTasks: 'المهام الأخيرة',
  balance: 'الرصيد', points: 'النقاط', money: 'الرصيد', streak: 'أيام متتالية', screenTime: 'وقت الشاشة',
  editChild: 'تعديل الطفل', removeChild: 'إزالة الطفل', confirmRemoveChild: 'هل أنت متأكد من إزالة هذا الطفل؟ سيتم فقد جميع بياناته.',
  hi: 'مرحباً', readyForGreatDay: 'مستعد ليوم رائع؟',
  todaysTasks: 'مهام اليوم', seeAll: 'عرض الكل', keepGoing: 'استمر!',
  everyStepMatters: 'كل خطوة صغيرة تصنع فرقاً.', toLevel: 'نقطة للوصول إلى', topLevel: 'أعلى مستوى!',
  keepItUp: 'واصل التقدم', doingGreat: 'أنت تبلي بلاءً حسناً', toDo: 'للقيام', done: 'تم', waiting: 'في الانتظار',
  tapToComplete: 'اضغط للإكمال',
  dreamBig: 'احلم كبيراً', pointsToSpend: 'نقطة للإنفاق', redeem: 'استبدال المكافأة',
  notEnoughPoints: 'نقاط غير كافية', redeemConfirmation: 'في انتظار الموافقة!',
  celebrateWins: 'احتفل بإنجازاتك', unlockedBadges: 'أوسمة حتى الآن!', youreAStar: 'أنت نجم',
  keepTakingSteps: 'استمر في اتخاذ خطوات صغيرة لفتح المزيد.', unlocked: 'مفتوح', locked: 'مغلق',
  firstTask: 'أول مهمة', tenTasks: '10 مهام مكتملة', sevenDayStreak: '7 أيام متتالية',
  homeworkHero: 'بطل الواجب', readingStar: 'نجم القراءة', helpfulMember: 'عضو عائلي مفيد',
  chooseProfile: 'اختر ملفك الشخصي', familySafeSpace: 'مساحة آمنة للعائلة',
  profileOnlyVisible: 'ملفك الشخصي مرئي فقط لعائلتك.',
  makeItYours: 'اجعله خاصاً بك', simpleControls: 'تحكمات بسيطة لعائلتك.',
  parentAccount: 'حساب ولي الأمر', familySettings: 'إعدادات العائلة',
  rewardTypes: 'أنواع المكافآت', pointsMoneyScreenTime: 'نقاط، مال، وقت شاشة',
  notifications: 'الإشعارات', taskCompletionsAndRequests: 'إكمال المهام والطلبات',
  pinSecurity: 'رمز PIN والأمان', protectParentControls: 'حماية تحكمات ولي الأمر',
  language: 'اللغة', appearance: 'المظهر', darkMode: 'الوضع الداكن', lightMode: 'الوضع الفاتح',
  dataPrivacy: 'البيانات والخصوصية', yourDataStaysPrivate: 'بيانات عائلتك تبقى خاصة',
  familyInsights: 'رؤى العائلة', seeProgressOverTime: 'شاهد التقدم بمرور الوقت',
  taskName: 'اسم المهمة', assignTo: 'إسناد إلى', category: 'الفئة', rewardPoints: 'نقاط المكافأة',
  chooseIcon: 'اختر أيقونة', save: 'حفظ', cancel: 'إلغاء',
  rewardName: 'اسم المكافأة', description: 'الوصف', costInPoints: 'التكلفة بالنقاط',
  childNickname: 'اسم الطفل', chooseAvatar: 'اختر صورة رمزية', addChildBtn: 'إضافة طفل',
  taskDescription: 'مهمة عائلية جديدة', frequency: 'التكرار',
  daily: 'يومي', weekly: 'أسبوعي', oneTime: 'مرة واحدة',
  dueDate: 'تاريخ الاستحقاق', difficulty: 'الصعوبة', easy: 'سهل', medium: 'متوسط', hard: 'صعب',
  rewardType: 'نوع المكافأة', rewardAmount: 'مقدار المكافأة',
  history: 'السجل', transactionHistory: 'سجل المعاملات', noHistory: 'لا توجد معاملات بعد',
  pointsSpent: 'النقاط المنفقة', moneyEarned: 'المال المكتسب', moneySpent: 'المال المنفق',
  newNotification: 'جديد', noNotifications: 'لا توجد إشعارات', markAllRead: 'تعليم الكل كمقروء',
  loading: 'جارٍ التحميل...', errorLoading: 'حدث خطأ ما', retry: 'حاول مرة أخرى',
  allChildren: 'كل الأطفال', parent: 'ولي الأمر', child: 'طفل',
  parentView: 'وضع ولي الأمر', switchToChild: 'التبديل إلى وضع الطفل', switchToParent: 'التبديل إلى وضع ولي الأمر',
  noRewards: 'لم يضف ولي أمرك مكافآت بعد.', noTasks: 'لا توجد مهام بعد',
  taskCreated: 'تم إنشاء المهمة.', rewardCreated: 'تم إنشاء المكافأة.', childAdded: 'تمت إضافة الطفل.',
  taskCompleted: 'رائع! أرسلناها لولي أمرك للموافقة.', taskApproved: 'تمت الموافقة ومنح المكافأة!',
  taskRejected: 'تم إرجاع المهمة للمراجعة.', rewardRedeemed: 'تم طلب المكافأة! في انتظار الموافقة.',
  rewardApproved: 'تمت الموافقة على المكافأة!', rewardRejected: 'لم تتم الموافقة على المكافأة هذه المرة.',
  childRemoved: 'تمت إزالة الطفل.', childUpdated: 'تم تحديث بيانات الطفل.', settingsSaved: 'تم حفظ الإعدادات.',
  offlineMessage: 'أنت غير متصل. يتم عرض البيانات المخزنة مؤقتاً.', backOnline: 'تم استعادة الاتصال!',
};

export const translations: Record<Locale, Translation> = { en, ar };

export function getTranslation(locale: Locale): Translation {
  return translations[locale];
}

export function getGreeting(locale: Locale): string {
  const hour = new Date().getHours();
  const t = translations[locale];
  if (hour < 12) return t.goodMorning;
  if (hour < 18) return t.goodAfternoon;
  return t.goodEvening;
}
