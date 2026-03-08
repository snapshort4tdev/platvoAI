export type Language = "en" | "ar";

export interface Translations {
  sidebar: {
    home: string;
    aiChat: string;
    gallery: string;
    billing: string;
    settings: string;
  };
  settings: {
    settings: string;
    appearance: string;
    theme: string;
    language: string;
    chooseTheme: string;
    chooseLanguage: string;
    light: string;
    dark: string;
    system: string;
    english: string;
    arabic: string;
  };
  header: {
    newChat: string;
    chatHistory: string;
  };
  chat: {
    placeholder: string;
    webSearch: string;
    createNote: string;
    generateImage: string;
    askSearchCreate: string;
  };
    home: {
      howCanIHelp: string;
      helloThere: string;
    };
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    close: string;
    logOut: string;
    download: string;
  };
  billing: {
    usage: string;
    credits: string;
    images: string;
    remaining: string;
    used: string;
    monthlyLimit: string;
    remainingPercentage: string;
    nextRenewal: string;
    daysUntilReset: string;
    noActiveSubscription: string;
    subscriptionStatus: string;
    cancelSubscription: string;
    reactivateSubscription: string;
    manageSubscription: string;
    currentPlan: string;
    upgrade: string;
    plan: string;
    status: string;
    nextBillingDate: string;
    subscriptionWillCancel: string;
    syncSubscription: string;
    syncSubscriptionDescription: string;
    allPlans: string;
    highlights: string;
    planHighlights: string;
    popular: string;
    current: string;
    perMonthBilled: string;
    unlimitedGenerations: string;
    generationsLeft: string;
    switchPlan: string;
    manage: string;
    failedToLoad: string;
    redirectingToCheckout: string;
    failedToCreateCheckout: string;
    subscriptionSynced: string;
    failedToSyncSubscription: string;
    allInOnePlan: string;
    failedToFetchStatus: string;
    planFeatures: {
      credits30: string;
      images10: string;
      credits1500: string;
      images100: string;
      unlimitedNotes: string;
      advancedSearch: string;
      fullAccess: string;
      latestModelVersions: string;
      latestModels: string;
      premiumModels: string;
      prioritySupport: string;
      basicSupport: string;
      coreFeatures: string;
      communityAccess: string;
    };
    faq: {
      title: string;
      whatAreCredits: string;
      creditsAnswer: string;
      doImagesConsumeCredits: string;
      imagesAnswer: string;
      howDoHDImagesWork: string;
      hdImagesAnswer: string;
      whatHappensIfRunOutOfCredits: string;
      runOutOfCreditsAnswer: string;
      whatHappensIfRunOutOfImages: string;
      runOutOfImagesAnswer: string;
      doUnusedRollOver: string;
      rollOverAnswer: string;
      canIShareAccount: string;
      shareAccountAnswer: string;
      isThereUsageLimit: string;
      usageLimitAnswer: string;
      howDoesBillingWork: string;
      billingAnswer: string;
    };
  };
  messages: {
    pleaseTypeMessage: string;
    chatIdNotFound: string;
    waitForResponse: string;
    generationStopped: string;
  };
    notes: {
      notes: string;
      noNotes: string;
      createNote: string;
      searchNote: string;
    };
    chats: {
      noChats: string;
    };
    gallery: {
      title: string;
      subtitle: string;
      noImages: string;
      emptyState: string;
      emptyStateDescription: string;
    };
    tools: {
      preparingRequest: string;
      creatingNote: string;
      searchingWeb: string;
      extractingContent: string;
      generatingImage: string;
      working: string;
      webSearchResults: string;
      extractedContent: string;
      imageGenerated: string;
      prompt: string;
      done: string;
      errorOccurred: string;
      unknown: string;
    };
    landing: {
      pricing: string;
      features: string;
      signIn: string;
      tryForFree: string;
      newBadge: string;
      heroTitle1: string;
      heroTitle2: string;
      heroDescription: string;
      getStartedForFree: string;
      learnMore: string;
      problemTitle: string;
      problemDescription: string;
      problem1: string;
      problem2: string;
      problem3: string;
      problem4: string;
      problem5: string;
      problem6: string;
      problem7: string;
      problem8: string;
      problem9: string;
      betterWay: string;
      modelsTitle: string;
      modelsDescription: string;
      pricingOld: string;
      pricingNew: string;
      savePercent: string;
      getStartedNow: string;
    };
}

export const translations: Record<Language, Translations> = {
  en: {
    sidebar: {
      home: "Home",
      aiChat: "AI Chat",
      gallery: "Gallery",
      billing: "Billing",
      settings: "Settings",
    },
    settings: {
      settings: "Settings",
      appearance: "Appearance",
      theme: "Theme",
      language: "Language",
      chooseTheme: "Choose your preferred theme",
      chooseLanguage: "Choose your preferred language",
      light: "Light",
      dark: "Dark",
      system: "System",
      english: "English",
      arabic: "Arabic",
    },
    header: {
      newChat: "New Chat",
      chatHistory: "Chat history",
    },
    chat: {
      placeholder: "Ask, search or create note...",
      webSearch: "Web Search",
      createNote: "Create Note",
      generateImage: "Generate Image",
      askSearchCreate: "Ask, search or create note...",
    },
    home: {
      howCanIHelp: "How can I help you today?",
      helloThere: "Hello there!",
    },
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      close: "Close",
      logOut: "Log Out",
      download: "Download",
    },
    billing: {
      usage: "Usage",
      credits: "Credits",
      images: "Images",
      remaining: "Remaining",
      used: "Used",
      monthlyLimit: "Monthly Limit",
      remainingPercentage: "Remaining Percentage",
      nextRenewal: "Next Renewal",
      daysUntilReset: "Days until reset",
      noActiveSubscription: "No active subscription",
      subscriptionStatus: "Subscription Status",
      cancelSubscription: "Cancel Subscription",
      reactivateSubscription: "Reactivate Subscription",
      manageSubscription: "Manage Subscription",
      currentPlan: "Current Plan",
      upgrade: "Upgrade",
      plan: "Plan",
      status: "Status",
      nextBillingDate: "Next billing date",
      subscriptionWillCancel: "Your subscription will cancel at the end of the billing period.",
      syncSubscription: "Sync Subscription",
      syncSubscriptionDescription: "If your credits didn't update after payment, click this to manually sync from Stripe.",
      allPlans: "Platvo - One Simple Plan",
      highlights: "Highlights",
      planHighlights: "Highlights",
      popular: "Popular",
      current: "Current",
      perMonthBilled: "per month billed",
      unlimitedGenerations: "Unlimited generations",
      generationsLeft: "generations left",
      switchPlan: "Switch plan",
      manage: "Manage",
      failedToLoad: "Failed to load",
      redirectingToCheckout: "Redirecting to checkout...",
      failedToCreateCheckout: "Failed to create checkout session",
      subscriptionSynced: "Subscription synced successfully",
      failedToSyncSubscription: "Failed to sync subscription",
      allInOnePlan: "PRO Plan",
      failedToFetchStatus: "Failed to fetch subscription status",
      planFeatures: {
        credits30: "30 AI Credits / month",
        images10: "10 AI Images / month",
        credits1500: "3,500 AI Credits / month",
        images100: "120 AI Images / month (Standard)",
        unlimitedNotes: "Unlimited Notes",
        advancedSearch: "AI Advanced Search",
        fullAccess: "Full access to all Platvo tools",
        latestModelVersions: "Access to the latest AI model versions",
        latestModels: "Access to latest AI models like Claude, GPT, and more",
        premiumModels: "Premium & advanced AI models included",
        prioritySupport: "Priority Support",
        basicSupport: "Basic Support",
        coreFeatures: "Access to core features",
        communityAccess: "Community access",
      },
      faq: {
        title: "FAQ",
        whatAreCredits: "What are AI Credits?",
        creditsAnswer: "Credits are usage units for text and AI tools. Most text requests count as 1 Credit.",
        doImagesConsumeCredits: "Do images consume Credits?",
        imagesAnswer: "No. Images use a separate monthly image allowance (120 Standard images).",
        howDoHDImagesWork: "How do HD images work?",
        hdImagesAnswer: "If HD is available, 1 HD image counts as 2 Standard images from your monthly image allowance.",
        whatHappensIfRunOutOfCredits: "What happens if I run out of Credits?",
        runOutOfCreditsAnswer: "You'll be unable to run credit-based requests until your monthly reset (optional: you can offer add-on packs).",
        whatHappensIfRunOutOfImages: "What happens if I run out of images?",
        runOutOfImagesAnswer: "You won't be able to generate more images until the monthly reset (optional: you can offer add-on packs).",
        doUnusedRollOver: "Do unused Credits or images roll over?",
        rollOverAnswer: "No, they reset monthly.",
        canIShareAccount: "Can I share my account?",
        shareAccountAnswer: "No—this plan is for a single user. Sharing/reselling may lead to suspension.",
        isThereUsageLimit: "Is there a usage limit per hour/day?",
        usageLimitAnswer: "A fair hourly limit may apply to prevent abuse and keep the service fast for everyone.",
        howDoesBillingWork: "How does billing work? Can I cancel anytime?",
        billingAnswer: "Billed monthly with auto-renewal. You can cancel anytime and keep access until the end of your billing period.",
      },
    },
    messages: {
      pleaseTypeMessage: "Please type in a message",
      chatIdNotFound: "Please reload chatId not found",
      waitForResponse: "Please wait for the current response to finish or stop it first!",
      generationStopped: "Generation stopped!!",
    },
    notes: {
      notes: "Notes",
      noNotes: "No Notes",
      createNote: "Create Note",
      searchNote: "Search Note",
    },
    chats: {
      noChats: "No Chats",
    },
    gallery: {
      title: "Gallery",
      subtitle: "You have {count} generated image{plural}",
      noImages: "You haven't generated any images yet",
      emptyState: "No images yet",
      emptyStateDescription: "Generate images using the AI chat to see them here",
    },
    tools: {
      preparingRequest: "Preparing request...",
      creatingNote: "Creating note..",
      searchingWeb: "Searching web..",
      extractingContent: "Extracting content..",
      generatingImage: "Generating image..",
      working: "Working...",
      webSearchResults: "Web search results",
      extractedContent: "Extracted content",
      imageGenerated: "Image generated",
      prompt: "Prompt",
      done: "Done",
      errorOccurred: "Error occurred",
      unknown: "Unknown",
    },
    landing: {
      pricing: "Pricing",
      features: "Features",
      signIn: "Sign In",
      tryForFree: "Try PlatvoAI for Free",
      newBadge: "💫 New — AI-Powered Intelligence Hub",
      heroTitle1: "All the World's AI Models.",
      heroTitle2: "One Subscription.",
      heroDescription: "Use GPT, Claude, Gemini, and more — from one powerful workspace. Switch models instantly for chat and image generation without juggling multiple subscriptions.",
      getStartedForFree: "Get Started For Free",
      learnMore: "Learn More",
      problemTitle: "The problem with using multiple AIs",
      problemDescription: "If you're serious about using AI, you probably already know you need more than one. But that means paying for everything separately and constantly switching between tabs.",
      problem1: "$20/month for ChatGPT Plus",
      problem2: "$20/month for Claude Pro",
      problem3: "$20/month for Gemini Advanced",
      problem4: "$20/month for Perplexity Pro",
      problem5: "Switching between 4 different tabs",
      problem6: "Copy-pasting the same prompt everywhere",
      problem7: "Hitting Claude's message limits",
      problem8: "Hours deciding which one to use",
      problem9: "$100/month and constant frustration",
      betterWay: "There's a better way",
      modelsTitle: "PRO Plan",
      modelsDescription: "Platvo - One Simple Plan. Everything you need in one subscription.",
      pricingOld: "No limits. No confusing tiers.",
      pricingNew: "$14.99 / month",
      savePercent: "One Simple Plan",
      getStartedNow: "Get Started Now",
    },
  },
  ar: {
    sidebar: {
      home: "الرئيسية",
      aiChat: "محادثة جديدة",
      gallery: "المعرض",
      billing: "الإشتراك",
      settings: "الإعدادات",
    },
    settings: {
      settings: "الإعدادات",
      appearance: "المظهر",
      theme: "السمة",
      language: "اللغة",
      chooseTheme: "اختر المظهر المفضل لديك",
      chooseLanguage: "اختر اللغة المفضلة لديك",
      light: "فاتح",
      dark: "داكن",
      system: "النظام",
      english: "الإنجليزية",
      arabic: "العربية",
    },
    header: {
      newChat: "محادثة جديدة",
      chatHistory: "سجل المحادثات",
    },
    chat: {
      placeholder: "اسأل، ابحث أو أنشئ ملاحظة...",
      webSearch: "بحث على الويب",
      createNote: "إنشاء ملاحظة",
      generateImage: "إنشاء صورة",
      askSearchCreate: "اسأل، ابحث أو أنشئ ملاحظة...",
    },
    home: {
      howCanIHelp: "كيف يمكنني مساعدتك اليوم؟",
      helloThere: "مرحباً!",
    },
    common: {
      loading: "جاري التحميل...",
      error: "خطأ",
      success: "نجح",
      cancel: "إلغاء",
      save: "حفظ",
      delete: "حذف",
      edit: "تعديل",
      close: "إغلاق",
      logOut: "تسجيل الخروج",
      download: "تحميل",
    },
    billing: {
      usage: "الاستخدام",
      credits: "المحادثات",
      images: "الصور",
      remaining: "المتبقي",
      used: "المستخدم",
      monthlyLimit: "الحد الشهري",
      remainingPercentage: "النسبة المتبقية",
      nextRenewal: "التجديد التالي",
      daysUntilReset: "أيام حتى إعادة التعيين",
      noActiveSubscription: "لا يوجد اشتراك نشط",
      subscriptionStatus: "حالة الاشتراك",
      cancelSubscription: "إلغاء الاشتراك",
      reactivateSubscription: "إعادة تفعيل الاشتراك",
      manageSubscription: "إدارة الاشتراك",
      currentPlan: "الخطة الحالية",
      upgrade: "ترقية",
      plan: "الخطة",
      status: "الحالة",
      nextBillingDate: "تاريخ الفوترة القادم",
      subscriptionWillCancel: "سيتم إلغاء اشتراكك في نهاية فترة الفوترة.",
      syncSubscription: "مزامنة الاشتراك",
      syncSubscriptionDescription: "إذا لم يتم تحديث اعتماداتك بعد الدفع، انقر هنا لمزامنة يدوية من Stripe.",
      allPlans: "Platvo - خطة واحدة بسيطة",
      highlights: "المميزات",
      planHighlights: "المميزات",
      popular: "شائع",
      current: "الحالي",
      perMonthBilled: "شهرياً",
      unlimitedGenerations: "عمليات غير محدودة",
      generationsLeft: "عمليات متبقية",
      switchPlan: "تغيير الخطة",
      manage: "إدارة",
      failedToLoad: "فشل التحميل",
      redirectingToCheckout: "إعادة التوجيه إلى صفحة الدفع...",
      failedToCreateCheckout: "فشل إنشاء جلسة الدفع",
      subscriptionSynced: "تمت مزامنة الاشتراك بنجاح",
      failedToSyncSubscription: "فشل مزامنة الاشتراك",
      allInOnePlan: "خطة PRO",
      failedToFetchStatus: "فشل جلب حالة الاشتراك",
      planFeatures: {
        credits30: "30 اعتماد ذكاء اصطناعي / شهر",
        images10: "10 صور ذكاء اصطناعي / شهر",
        credits1500: "3,500 اعتماد ذكاء اصطناعي / شهر",
        images100: "120 صورة ذكاء اصطناعي / شهر (قياسي)",
        unlimitedNotes: "ملاحظات غير محدودة",
        advancedSearch: "بحث ذكاء اصطناعي متقدم",
        fullAccess: "وصول كامل لجميع أدوات Platvo",
        latestModelVersions: "الوصول إلى أحدث إصدارات نماذج الذكاء الاصطناعي",
        latestModels: "الوصول إلى أحدث النماذج مثل Claude و GPT والمزيد",
        premiumModels: "النماذج المميزة والمتقدمة مشمولة",
        prioritySupport: "دعم ذو أولوية",
        basicSupport: "دعم أساسي",
        coreFeatures: "الوصول إلى الميزات الأساسية",
        communityAccess: "الوصول إلى المجتمع",
      },
      faq: {
        title: "الأسئلة الشائعة",
        whatAreCredits: "ما هي اعتمادات الذكاء الاصطناعي؟",
        creditsAnswer: "المحادثات هي وحدات استخدام للنصوص وأدوات الذكاء الاصطناعي. معظم طلبات النصوص تحتسب كاعتماد واحد.",
        doImagesConsumeCredits: "هل تستهلك الصور المحادثات؟",
        imagesAnswer: "لا. الصور تستخدم بدل صور شهري منفصل (120 صورة قياسية).",
        howDoHDImagesWork: "كيف تعمل صور HD؟",
        hdImagesAnswer: "إذا كانت صور HD متاحة، فإن صورة HD واحدة تحتسب كصورة قياسيتين من بدل الصور الشهري.",
        whatHappensIfRunOutOfCredits: "ماذا يحدث إذا نفدت المحادثات؟",
        runOutOfCreditsAnswer: "لن تتمكن من تشغيل الطلبات القائمة على المحادثات حتى إعادة التعيين الشهرية (اختياري: يمكنك تقديم حزم إضافية).",
        whatHappensIfRunOutOfImages: "ماذا يحدث إذا نفدت الصور؟",
        runOutOfImagesAnswer: "لن تتمكن من إنشاء المزيد من الصور حتى إعادة التعيين الشهرية (اختياري: يمكنك تقديم حزم إضافية).",
        doUnusedRollOver: "هل تنتقل المحادثات أو الصور غير المستخدمة؟",
        rollOverAnswer: "لا، يتم إعادة تعيينها شهرياً.",
        canIShareAccount: "هل يمكنني مشاركة حسابي؟",
        shareAccountAnswer: "لا—هذه الخطة لمستخدم واحد. قد تؤدي مشاركة/إعادة بيع الحساب إلى الإيقاف.",
        isThereUsageLimit: "هل هناك حد استخدام في الساعة/اليوم؟",
        usageLimitAnswer: "قد يتم تطبيق حد ساعي عادل لمنع إساءة الاستخدام والحفاظ على سرعة الخدمة للجميع.",
        howDoesBillingWork: "كيف يعمل الفوترة؟ هل يمكنني الإلغاء في أي وقت؟",
        billingAnswer: "الفوترة شهرية مع التجديد التلقائي. يمكنك الإلغاء في أي وقت والاحتفاظ بالوصول حتى نهاية فترة الفوترة الخاصة بك.",
      },
    },
    messages: {
      pleaseTypeMessage: "يرجى كتابة رسالة",
      chatIdNotFound: "يرجى إعادة تحميل الصفحة، معرف المحادثة غير موجود",
      waitForResponse: "يرجى الانتظار حتى ينتهي الرد الحالي أو إيقافه أولاً!",
      generationStopped: "تم إيقاف التوليد!!",
    },
    notes: {
      notes: "الملاحظات",
      noNotes: "لا توجد ملاحظات",
      createNote: "إنشاء ملاحظة",
      searchNote: "بحث في الملاحظات",
    },
    chats: {
      noChats: "لا توجد محادثات",
    },
    gallery: {
      title: "المعرض",
      subtitle: "لديك {count} صورة منشأة",
      noImages: "لم تقم بإنشاء أي صور بعد",
      emptyState: "لا توجد صور بعد",
      emptyStateDescription: "قم بإنشاء الصور باستخدام محادثة الذكاء الاصطناعي لرؤيتها هنا",
    },
    tools: {
      preparingRequest: "جاري إعداد الطلب...",
      creatingNote: "جاري إنشاء الملاحظة..",
      searchingWeb: "جاري البحث على الويب..",
      extractingContent: "جاري استخراج المحتوى..",
      generatingImage: "جاري إنشاء الصورة..",
      working: "جاري العمل...",
      webSearchResults: "نتائج البحث على الويب",
      extractedContent: "المحتوى المستخرج",
      imageGenerated: "تم إنشاء الصورة",
      prompt: "المطالبة",
      done: "تم",
      errorOccurred: "حدث خطأ",
      unknown: "غير معروف",
    },
    landing: {
      pricing: "الأسعار",
      features: "المميزات",
      signIn: "تسجيل الدخول",
      tryForFree: "جرب PlatvoAI مجاناً",
      newBadge: "💫 جديد — منصة توفر لك كل نماذج بالذكاء الاصطناعي",
      heroTitle1: "جميع نماذج الذكاء الاصطناعي في العالم",
      heroTitle2: "اشتراك واحد",
      heroDescription: "استخدم GPT و Claude و Gemini والمزيد — من مساحة عمل قوية واحدة. قم بالتبديل بين النماذج فوراً للمحادثة وإنشاء الصور دون الحاجة للتعامل مع اشتراكات متعددة.",
      getStartedForFree: "ابدأ مجاناً",
      learnMore: "اعرف المزيد",
      problemTitle: "مشكلة استخدام عدة منصات",
      problemDescription: "إذا كنت جاداً في استخدام الذكاء الاصطناعي، فربما تعلم بالفعل أنك تحتاج أكثر من واحد. لكن هذا يعني الدفع لكل شيء بشكل منفصل والتبديل المستمر بين علامات التبويب.",
      problem1: "20 دولار/شهر لـ ChatGPT Plus",
      problem2: "20 دولار/شهر لـ Claude Pro",
      problem3: "20 دولار/شهر لـ Gemini Advanced",
      problem4: "20 دولار/شهر لـ Perplexity Pro",
      problem5: "التبديل بين 4 علامات تبويب مختلفة",
      problem6: "نسخ ولصق نفس المطالبة في كل مكان",
      problem7: "الوصول إلى حدود رسائل Claude",
      problem8: "ساعات في اتخاذ قرار أي واحد تستخدم",
      problem9: "100 دولار/شهر وإحباط مستمر",
      betterWay: "هناك طريقة أفضل",
      modelsTitle: "خطة PRO",
      modelsDescription: "Platvo - خطة واحدة بسيطة. كل ما تحتاجه في اشتراك واحد.",
      pricingOld: "بدون حدود. بدون باقات معقدة.",
      pricingNew: "14.99 دولار / شهر",
      savePercent: "خطة واحدة بسيطة",
      getStartedNow: "ابدأ الآن",
    },
  },
};
