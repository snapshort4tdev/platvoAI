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
        shareAccountAnswer: "NoÔÇöthis plan is for a single user. Sharing/reselling may lead to suspension.",
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
      newBadge: "­ƒÆ½ New ÔÇö AI-Powered Intelligence Hub",
      heroTitle1: "All the World's AI Models.",
      heroTitle2: "One Subscription.",
      heroDescription: "Use GPT, Claude, Gemini, and more ÔÇö from one powerful workspace. Switch models instantly for chat and image generation without juggling multiple subscriptions.",
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
      home: "Ïº┘äÏ▒Ïª┘èÏ│┘èÏ®",
      aiChat: "┘àÏ¡ÏºÏ»Ï½Ï® Ï¼Ï»┘èÏ»Ï®",
      gallery: "Ïº┘ä┘àÏ╣Ï▒ÏÂ",
      billing: "Ïº┘äÏÑÏ┤Ï¬Ï▒Ïº┘â",
      settings: "Ïº┘äÏÑÏ╣Ï»ÏºÏ»ÏºÏ¬",
    },
    settings: {
      settings: "Ïº┘äÏÑÏ╣Ï»ÏºÏ»ÏºÏ¬",
      appearance: "Ïº┘ä┘àÏ©┘çÏ▒",
      theme: "Ïº┘äÏ│┘àÏ®",
      language: "Ïº┘ä┘äÏ║Ï®",
      chooseTheme: "ÏºÏ«Ï¬Ï▒ Ïº┘ä┘àÏ©┘çÏ▒ Ïº┘ä┘à┘üÏÂ┘ä ┘äÏ»┘è┘â",
      chooseLanguage: "ÏºÏ«Ï¬Ï▒ Ïº┘ä┘äÏ║Ï® Ïº┘ä┘à┘üÏÂ┘äÏ® ┘äÏ»┘è┘â",
      light: "┘üÏºÏ¬Ï¡",
      dark: "Ï»Ïº┘â┘å",
      system: "Ïº┘ä┘åÏ©Ïº┘à",
      english: "Ïº┘äÏÑ┘åÏ¼┘ä┘èÏ▓┘èÏ®",
      arabic: "Ïº┘äÏ╣Ï▒Ï¿┘èÏ®",
    },
    header: {
      newChat: "┘àÏ¡ÏºÏ»Ï½Ï® Ï¼Ï»┘èÏ»Ï®",
      chatHistory: "Ï│Ï¼┘ä Ïº┘ä┘àÏ¡ÏºÏ»Ï½ÏºÏ¬",
    },
    chat: {
      placeholder: "ÏºÏ│Ïú┘äÏî ÏºÏ¿Ï¡Ï½ Ïú┘ê Ïú┘åÏ┤Ïª ┘à┘äÏºÏ¡Ï©Ï®...",
      webSearch: "Ï¿Ï¡Ï½ Ï╣┘ä┘ë Ïº┘ä┘ê┘èÏ¿",
      createNote: "ÏÑ┘åÏ┤ÏºÏí ┘à┘äÏºÏ¡Ï©Ï®",
      generateImage: "ÏÑ┘åÏ┤ÏºÏí ÏÁ┘êÏ▒Ï®",
      askSearchCreate: "ÏºÏ│Ïú┘äÏî ÏºÏ¿Ï¡Ï½ Ïú┘ê Ïú┘åÏ┤Ïª ┘à┘äÏºÏ¡Ï©Ï®...",
    },
    home: {
      howCanIHelp: "┘â┘è┘ü ┘è┘à┘â┘å┘å┘è ┘àÏ│ÏºÏ╣Ï»Ï¬┘â Ïº┘ä┘è┘ê┘àÏƒ",
      helloThere: "┘àÏ▒Ï¡Ï¿Ïº┘ï!",
    },
    common: {
      loading: "Ï¼ÏºÏ▒┘è Ïº┘äÏ¬Ï¡┘à┘è┘ä...",
      error: "Ï«ÏÀÏú",
      success: "┘åÏ¼Ï¡",
      cancel: "ÏÑ┘äÏ║ÏºÏí",
      save: "Ï¡┘üÏ©",
      delete: "Ï¡Ï░┘ü",
      edit: "Ï¬Ï╣Ï»┘è┘ä",
      close: "ÏÑÏ║┘äÏº┘é",
      logOut: "Ï¬Ï│Ï¼┘è┘ä Ïº┘äÏ«Ï▒┘êÏ¼",
      download: "Ï¬Ï¡┘à┘è┘ä",
    },
    billing: {
      usage: "Ïº┘äÏºÏ│Ï¬Ï«Ï»Ïº┘à",
      credits: "Ïº┘ä┘àÏ¡ÏºÏ»Ï½ÏºÏ¬",
      images: "Ïº┘äÏÁ┘êÏ▒",
      remaining: "Ïº┘ä┘àÏ¬Ï¿┘é┘è",
      used: "Ïº┘ä┘àÏ│Ï¬Ï«Ï»┘à",
      monthlyLimit: "Ïº┘äÏ¡Ï» Ïº┘äÏ┤┘çÏ▒┘è",
      remainingPercentage: "Ïº┘ä┘åÏ│Ï¿Ï® Ïº┘ä┘àÏ¬Ï¿┘é┘èÏ®",
      nextRenewal: "Ïº┘äÏ¬Ï¼Ï»┘èÏ» Ïº┘äÏ¬Ïº┘ä┘è",
      daysUntilReset: "Ïú┘èÏº┘à Ï¡Ï¬┘ë ÏÑÏ╣ÏºÏ»Ï® Ïº┘äÏ¬Ï╣┘è┘è┘å",
      noActiveSubscription: "┘äÏº ┘è┘êÏ¼Ï» ÏºÏ┤Ï¬Ï▒Ïº┘â ┘åÏ┤ÏÀ",
      subscriptionStatus: "Ï¡Ïº┘äÏ® Ïº┘äÏºÏ┤Ï¬Ï▒Ïº┘â",
      cancelSubscription: "ÏÑ┘äÏ║ÏºÏí Ïº┘äÏºÏ┤Ï¬Ï▒Ïº┘â",
      reactivateSubscription: "ÏÑÏ╣ÏºÏ»Ï® Ï¬┘üÏ╣┘è┘ä Ïº┘äÏºÏ┤Ï¬Ï▒Ïº┘â",
      manageSubscription: "ÏÑÏ»ÏºÏ▒Ï® Ïº┘äÏºÏ┤Ï¬Ï▒Ïº┘â",
      currentPlan: "Ïº┘äÏ«ÏÀÏ® Ïº┘äÏ¡Ïº┘ä┘èÏ®",
      upgrade: "Ï¬Ï▒┘é┘èÏ®",
      plan: "Ïº┘äÏ«ÏÀÏ®",
      status: "Ïº┘äÏ¡Ïº┘äÏ®",
      nextBillingDate: "Ï¬ÏºÏ▒┘èÏ« Ïº┘ä┘ü┘êÏ¬Ï▒Ï® Ïº┘ä┘éÏºÏ»┘à",
      subscriptionWillCancel: "Ï│┘èÏ¬┘à ÏÑ┘äÏ║ÏºÏí ÏºÏ┤Ï¬Ï▒Ïº┘â┘â ┘ü┘è ┘å┘çÏº┘èÏ® ┘üÏ¬Ï▒Ï® Ïº┘ä┘ü┘êÏ¬Ï▒Ï®.",
      syncSubscription: "┘àÏ▓Ïº┘à┘åÏ® Ïº┘äÏºÏ┤Ï¬Ï▒Ïº┘â",
      syncSubscriptionDescription: "ÏÑÏ░Ïº ┘ä┘à ┘èÏ¬┘à Ï¬Ï¡Ï»┘èÏ½ ÏºÏ╣Ï¬┘àÏºÏ»ÏºÏ¬┘â Ï¿Ï╣Ï» Ïº┘äÏ»┘üÏ╣Ïî Ïº┘å┘éÏ▒ ┘ç┘åÏº ┘ä┘àÏ▓Ïº┘à┘åÏ® ┘èÏ»┘ê┘èÏ® ┘à┘å Stripe.",
      allPlans: "Platvo - Ï«ÏÀÏ® ┘êÏºÏ¡Ï»Ï® Ï¿Ï│┘èÏÀÏ®",
      highlights: "Ïº┘ä┘à┘à┘èÏ▓ÏºÏ¬",
      planHighlights: "Ïº┘ä┘à┘à┘èÏ▓ÏºÏ¬",
      popular: "Ï┤ÏºÏªÏ╣",
      current: "Ïº┘äÏ¡Ïº┘ä┘è",
      perMonthBilled: "Ï┤┘çÏ▒┘èÏº┘ï",
      unlimitedGenerations: "Ï╣┘à┘ä┘èÏºÏ¬ Ï║┘èÏ▒ ┘àÏ¡Ï»┘êÏ»Ï®",
      generationsLeft: "Ï╣┘à┘ä┘èÏºÏ¬ ┘àÏ¬Ï¿┘é┘èÏ®",
      switchPlan: "Ï¬Ï║┘è┘èÏ▒ Ïº┘äÏ«ÏÀÏ®",
      manage: "ÏÑÏ»ÏºÏ▒Ï®",
      failedToLoad: "┘üÏ┤┘ä Ïº┘äÏ¬Ï¡┘à┘è┘ä",
      redirectingToCheckout: "ÏÑÏ╣ÏºÏ»Ï® Ïº┘äÏ¬┘êÏ¼┘è┘ç ÏÑ┘ä┘ë ÏÁ┘üÏ¡Ï® Ïº┘äÏ»┘üÏ╣...",
      failedToCreateCheckout: "┘üÏ┤┘ä ÏÑ┘åÏ┤ÏºÏí Ï¼┘äÏ│Ï® Ïº┘äÏ»┘üÏ╣",
      subscriptionSynced: "Ï¬┘àÏ¬ ┘àÏ▓Ïº┘à┘åÏ® Ïº┘äÏºÏ┤Ï¬Ï▒Ïº┘â Ï¿┘åÏ¼ÏºÏ¡",
      failedToSyncSubscription: "┘üÏ┤┘ä ┘àÏ▓Ïº┘à┘åÏ® Ïº┘äÏºÏ┤Ï¬Ï▒Ïº┘â",
      allInOnePlan: "Ï«ÏÀÏ® PRO",
      failedToFetchStatus: "┘üÏ┤┘ä Ï¼┘äÏ¿ Ï¡Ïº┘äÏ® Ïº┘äÏºÏ┤Ï¬Ï▒Ïº┘â",
      planFeatures: {
        credits30: "30 ÏºÏ╣Ï¬┘àÏºÏ» Ï░┘âÏºÏí ÏºÏÁÏÀ┘åÏºÏ╣┘è / Ï┤┘çÏ▒",
        images10: "10 ÏÁ┘êÏ▒ Ï░┘âÏºÏí ÏºÏÁÏÀ┘åÏºÏ╣┘è / Ï┤┘çÏ▒",
        credits1500: "3,500 ÏºÏ╣Ï¬┘àÏºÏ» Ï░┘âÏºÏí ÏºÏÁÏÀ┘åÏºÏ╣┘è / Ï┤┘çÏ▒",
        images100: "120 ÏÁ┘êÏ▒Ï® Ï░┘âÏºÏí ÏºÏÁÏÀ┘åÏºÏ╣┘è / Ï┤┘çÏ▒ (┘é┘èÏºÏ│┘è)",
        unlimitedNotes: "┘à┘äÏºÏ¡Ï©ÏºÏ¬ Ï║┘èÏ▒ ┘àÏ¡Ï»┘êÏ»Ï®",
        advancedSearch: "Ï¿Ï¡Ï½ Ï░┘âÏºÏí ÏºÏÁÏÀ┘åÏºÏ╣┘è ┘àÏ¬┘éÏ»┘à",
        fullAccess: "┘êÏÁ┘ê┘ä ┘âÏº┘à┘ä ┘äÏ¼┘à┘èÏ╣ ÏúÏ»┘êÏºÏ¬ Platvo",
        latestModelVersions: "Ïº┘ä┘êÏÁ┘ê┘ä ÏÑ┘ä┘ë ÏúÏ¡Ï»Ï½ ÏÑÏÁÏ»ÏºÏ▒ÏºÏ¬ ┘å┘àÏºÏ░Ï¼ Ïº┘äÏ░┘âÏºÏí Ïº┘äÏºÏÁÏÀ┘åÏºÏ╣┘è",
        latestModels: "Ïº┘ä┘êÏÁ┘ê┘ä ÏÑ┘ä┘ë ÏúÏ¡Ï»Ï½ Ïº┘ä┘å┘àÏºÏ░Ï¼ ┘àÏ½┘ä Claude ┘ê GPT ┘êÏº┘ä┘àÏ▓┘èÏ»",
        premiumModels: "Ïº┘ä┘å┘àÏºÏ░Ï¼ Ïº┘ä┘à┘à┘èÏ▓Ï® ┘êÏº┘ä┘àÏ¬┘éÏ»┘àÏ® ┘àÏ┤┘à┘ê┘äÏ®",
        prioritySupport: "Ï»Ï╣┘à Ï░┘ê Ïú┘ê┘ä┘ê┘èÏ®",
        basicSupport: "Ï»Ï╣┘à ÏúÏ│ÏºÏ│┘è",
        coreFeatures: "Ïº┘ä┘êÏÁ┘ê┘ä ÏÑ┘ä┘ë Ïº┘ä┘à┘èÏ▓ÏºÏ¬ Ïº┘äÏúÏ│ÏºÏ│┘èÏ®",
        communityAccess: "Ïº┘ä┘êÏÁ┘ê┘ä ÏÑ┘ä┘ë Ïº┘ä┘àÏ¼Ï¬┘àÏ╣",
      },
      faq: {
        title: "Ïº┘äÏúÏ│Ïª┘äÏ® Ïº┘äÏ┤ÏºÏªÏ╣Ï®",
        whatAreCredits: "┘àÏº ┘ç┘è ÏºÏ╣Ï¬┘àÏºÏ»ÏºÏ¬ Ïº┘äÏ░┘âÏºÏí Ïº┘äÏºÏÁÏÀ┘åÏºÏ╣┘èÏƒ",
        creditsAnswer: "Ïº┘ä┘àÏ¡ÏºÏ»Ï½ÏºÏ¬ ┘ç┘è ┘êÏ¡Ï»ÏºÏ¬ ÏºÏ│Ï¬Ï«Ï»Ïº┘à ┘ä┘ä┘åÏÁ┘êÏÁ ┘êÏúÏ»┘êÏºÏ¬ Ïº┘äÏ░┘âÏºÏí Ïº┘äÏºÏÁÏÀ┘åÏºÏ╣┘è. ┘àÏ╣Ï©┘à ÏÀ┘äÏ¿ÏºÏ¬ Ïº┘ä┘åÏÁ┘êÏÁ Ï¬Ï¡Ï¬Ï│Ï¿ ┘âÏºÏ╣Ï¬┘àÏºÏ» ┘êÏºÏ¡Ï».",
        doImagesConsumeCredits: "┘ç┘ä Ï¬Ï│Ï¬┘ç┘ä┘â Ïº┘äÏÁ┘êÏ▒ Ïº┘ä┘àÏ¡ÏºÏ»Ï½ÏºÏ¬Ïƒ",
        imagesAnswer: "┘äÏº. Ïº┘äÏÁ┘êÏ▒ Ï¬Ï│Ï¬Ï«Ï»┘à Ï¿Ï»┘ä ÏÁ┘êÏ▒ Ï┤┘çÏ▒┘è ┘à┘å┘üÏÁ┘ä (120 ÏÁ┘êÏ▒Ï® ┘é┘èÏºÏ│┘èÏ®).",
        howDoHDImagesWork: "┘â┘è┘ü Ï¬Ï╣┘à┘ä ÏÁ┘êÏ▒ HDÏƒ",
        hdImagesAnswer: "ÏÑÏ░Ïº ┘âÏº┘åÏ¬ ÏÁ┘êÏ▒ HD ┘àÏ¬ÏºÏ¡Ï®Ïî ┘üÏÑ┘å ÏÁ┘êÏ▒Ï® HD ┘êÏºÏ¡Ï»Ï® Ï¬Ï¡Ï¬Ï│Ï¿ ┘âÏÁ┘êÏ▒Ï® ┘é┘èÏºÏ│┘èÏ¬┘è┘å ┘à┘å Ï¿Ï»┘ä Ïº┘äÏÁ┘êÏ▒ Ïº┘äÏ┤┘çÏ▒┘è.",
        whatHappensIfRunOutOfCredits: "┘àÏºÏ░Ïº ┘èÏ¡Ï»Ï½ ÏÑÏ░Ïº ┘å┘üÏ»Ï¬ Ïº┘ä┘àÏ¡ÏºÏ»Ï½ÏºÏ¬Ïƒ",
        runOutOfCreditsAnswer: "┘ä┘å Ï¬Ï¬┘à┘â┘å ┘à┘å Ï¬Ï┤Ï║┘è┘ä Ïº┘äÏÀ┘äÏ¿ÏºÏ¬ Ïº┘ä┘éÏºÏª┘àÏ® Ï╣┘ä┘ë Ïº┘ä┘àÏ¡ÏºÏ»Ï½ÏºÏ¬ Ï¡Ï¬┘ë ÏÑÏ╣ÏºÏ»Ï® Ïº┘äÏ¬Ï╣┘è┘è┘å Ïº┘äÏ┤┘çÏ▒┘èÏ® (ÏºÏ«Ï¬┘èÏºÏ▒┘è: ┘è┘à┘â┘å┘â Ï¬┘éÏ»┘è┘à Ï¡Ï▓┘à ÏÑÏÂÏº┘ü┘èÏ®).",
        whatHappensIfRunOutOfImages: "┘àÏºÏ░Ïº ┘èÏ¡Ï»Ï½ ÏÑÏ░Ïº ┘å┘üÏ»Ï¬ Ïº┘äÏÁ┘êÏ▒Ïƒ",
        runOutOfImagesAnswer: "┘ä┘å Ï¬Ï¬┘à┘â┘å ┘à┘å ÏÑ┘åÏ┤ÏºÏí Ïº┘ä┘àÏ▓┘èÏ» ┘à┘å Ïº┘äÏÁ┘êÏ▒ Ï¡Ï¬┘ë ÏÑÏ╣ÏºÏ»Ï® Ïº┘äÏ¬Ï╣┘è┘è┘å Ïº┘äÏ┤┘çÏ▒┘èÏ® (ÏºÏ«Ï¬┘èÏºÏ▒┘è: ┘è┘à┘â┘å┘â Ï¬┘éÏ»┘è┘à Ï¡Ï▓┘à ÏÑÏÂÏº┘ü┘èÏ®).",
        doUnusedRollOver: "┘ç┘ä Ï¬┘åÏ¬┘é┘ä Ïº┘ä┘àÏ¡ÏºÏ»Ï½ÏºÏ¬ Ïú┘ê Ïº┘äÏÁ┘êÏ▒ Ï║┘èÏ▒ Ïº┘ä┘àÏ│Ï¬Ï«Ï»┘àÏ®Ïƒ",
        rollOverAnswer: "┘äÏºÏî ┘èÏ¬┘à ÏÑÏ╣ÏºÏ»Ï® Ï¬Ï╣┘è┘è┘å┘çÏº Ï┤┘çÏ▒┘èÏº┘ï.",
        canIShareAccount: "┘ç┘ä ┘è┘à┘â┘å┘å┘è ┘àÏ┤ÏºÏ▒┘âÏ® Ï¡Ï│ÏºÏ¿┘èÏƒ",
        shareAccountAnswer: "┘äÏºÔÇö┘çÏ░┘ç Ïº┘äÏ«ÏÀÏ® ┘ä┘àÏ│Ï¬Ï«Ï»┘à ┘êÏºÏ¡Ï». ┘éÏ» Ï¬ÏñÏ»┘è ┘àÏ┤ÏºÏ▒┘âÏ®/ÏÑÏ╣ÏºÏ»Ï® Ï¿┘èÏ╣ Ïº┘äÏ¡Ï│ÏºÏ¿ ÏÑ┘ä┘ë Ïº┘äÏÑ┘è┘éÏº┘ü.",
        isThereUsageLimit: "┘ç┘ä ┘ç┘åÏº┘â Ï¡Ï» ÏºÏ│Ï¬Ï«Ï»Ïº┘à ┘ü┘è Ïº┘äÏ│ÏºÏ╣Ï®/Ïº┘ä┘è┘ê┘àÏƒ",
        usageLimitAnswer: "┘éÏ» ┘èÏ¬┘à Ï¬ÏÀÏ¿┘è┘é Ï¡Ï» Ï│ÏºÏ╣┘è Ï╣ÏºÏ»┘ä ┘ä┘à┘åÏ╣ ÏÑÏ│ÏºÏíÏ® Ïº┘äÏºÏ│Ï¬Ï«Ï»Ïº┘à ┘êÏº┘äÏ¡┘üÏºÏ© Ï╣┘ä┘ë Ï│Ï▒Ï╣Ï® Ïº┘äÏ«Ï»┘àÏ® ┘ä┘äÏ¼┘à┘èÏ╣.",
        howDoesBillingWork: "┘â┘è┘ü ┘èÏ╣┘à┘ä Ïº┘ä┘ü┘êÏ¬Ï▒Ï®Ïƒ ┘ç┘ä ┘è┘à┘â┘å┘å┘è Ïº┘äÏÑ┘äÏ║ÏºÏí ┘ü┘è Ïú┘è ┘ê┘éÏ¬Ïƒ",
        billingAnswer: "Ïº┘ä┘ü┘êÏ¬Ï▒Ï® Ï┤┘çÏ▒┘èÏ® ┘àÏ╣ Ïº┘äÏ¬Ï¼Ï»┘èÏ» Ïº┘äÏ¬┘ä┘éÏºÏª┘è. ┘è┘à┘â┘å┘â Ïº┘äÏÑ┘äÏ║ÏºÏí ┘ü┘è Ïú┘è ┘ê┘éÏ¬ ┘êÏº┘äÏºÏ¡Ï¬┘üÏºÏ© Ï¿Ïº┘ä┘êÏÁ┘ê┘ä Ï¡Ï¬┘ë ┘å┘çÏº┘èÏ® ┘üÏ¬Ï▒Ï® Ïº┘ä┘ü┘êÏ¬Ï▒Ï® Ïº┘äÏ«ÏºÏÁÏ® Ï¿┘â.",
      },
    },
    messages: {
      pleaseTypeMessage: "┘èÏ▒Ï¼┘ë ┘âÏ¬ÏºÏ¿Ï® Ï▒Ï│Ïº┘äÏ®",
      chatIdNotFound: "┘èÏ▒Ï¼┘ë ÏÑÏ╣ÏºÏ»Ï® Ï¬Ï¡┘à┘è┘ä Ïº┘äÏÁ┘üÏ¡Ï®Ïî ┘àÏ╣Ï▒┘ü Ïº┘ä┘àÏ¡ÏºÏ»Ï½Ï® Ï║┘èÏ▒ ┘à┘êÏ¼┘êÏ»",
      waitForResponse: "┘èÏ▒Ï¼┘ë Ïº┘äÏº┘åÏ¬Ï©ÏºÏ▒ Ï¡Ï¬┘ë ┘è┘åÏ¬┘ç┘è Ïº┘äÏ▒Ï» Ïº┘äÏ¡Ïº┘ä┘è Ïú┘ê ÏÑ┘è┘éÏº┘ü┘ç Ïú┘ê┘äÏº┘ï!",
      generationStopped: "Ï¬┘à ÏÑ┘è┘éÏº┘ü Ïº┘äÏ¬┘ê┘ä┘èÏ»!!",
    },
    notes: {
      notes: "Ïº┘ä┘à┘äÏºÏ¡Ï©ÏºÏ¬",
      noNotes: "┘äÏº Ï¬┘êÏ¼Ï» ┘à┘äÏºÏ¡Ï©ÏºÏ¬",
      createNote: "ÏÑ┘åÏ┤ÏºÏí ┘à┘äÏºÏ¡Ï©Ï®",
      searchNote: "Ï¿Ï¡Ï½ ┘ü┘è Ïº┘ä┘à┘äÏºÏ¡Ï©ÏºÏ¬",
    },
    chats: {
      noChats: "┘äÏº Ï¬┘êÏ¼Ï» ┘àÏ¡ÏºÏ»Ï½ÏºÏ¬",
    },
    gallery: {
      title: "Ïº┘ä┘àÏ╣Ï▒ÏÂ",
      subtitle: "┘äÏ»┘è┘â {count} ÏÁ┘êÏ▒Ï® ┘à┘åÏ┤ÏúÏ®",
      noImages: "┘ä┘à Ï¬┘é┘à Ï¿ÏÑ┘åÏ┤ÏºÏí Ïú┘è ÏÁ┘êÏ▒ Ï¿Ï╣Ï»",
      emptyState: "┘äÏº Ï¬┘êÏ¼Ï» ÏÁ┘êÏ▒ Ï¿Ï╣Ï»",
      emptyStateDescription: "┘é┘à Ï¿ÏÑ┘åÏ┤ÏºÏí Ïº┘äÏÁ┘êÏ▒ Ï¿ÏºÏ│Ï¬Ï«Ï»Ïº┘à ┘àÏ¡ÏºÏ»Ï½Ï® Ïº┘äÏ░┘âÏºÏí Ïº┘äÏºÏÁÏÀ┘åÏºÏ╣┘è ┘äÏ▒Ïñ┘èÏ¬┘çÏº ┘ç┘åÏº",
    },
    tools: {
      preparingRequest: "Ï¼ÏºÏ▒┘è ÏÑÏ╣Ï»ÏºÏ» Ïº┘äÏÀ┘äÏ¿...",
      creatingNote: "Ï¼ÏºÏ▒┘è ÏÑ┘åÏ┤ÏºÏí Ïº┘ä┘à┘äÏºÏ¡Ï©Ï®..",
      searchingWeb: "Ï¼ÏºÏ▒┘è Ïº┘äÏ¿Ï¡Ï½ Ï╣┘ä┘ë Ïº┘ä┘ê┘èÏ¿..",
      extractingContent: "Ï¼ÏºÏ▒┘è ÏºÏ│Ï¬Ï«Ï▒ÏºÏ¼ Ïº┘ä┘àÏ¡Ï¬┘ê┘ë..",
      generatingImage: "Ï¼ÏºÏ▒┘è ÏÑ┘åÏ┤ÏºÏí Ïº┘äÏÁ┘êÏ▒Ï®..",
      working: "Ï¼ÏºÏ▒┘è Ïº┘äÏ╣┘à┘ä...",
      webSearchResults: "┘åÏ¬ÏºÏªÏ¼ Ïº┘äÏ¿Ï¡Ï½ Ï╣┘ä┘ë Ïº┘ä┘ê┘èÏ¿",
      extractedContent: "Ïº┘ä┘àÏ¡Ï¬┘ê┘ë Ïº┘ä┘àÏ│Ï¬Ï«Ï▒Ï¼",
      imageGenerated: "Ï¬┘à ÏÑ┘åÏ┤ÏºÏí Ïº┘äÏÁ┘êÏ▒Ï®",
      prompt: "Ïº┘ä┘àÏÀÏº┘äÏ¿Ï®",
      done: "Ï¬┘à",
      errorOccurred: "Ï¡Ï»Ï½ Ï«ÏÀÏú",
      unknown: "Ï║┘èÏ▒ ┘àÏ╣Ï▒┘ê┘ü",
    },
    landing: {
      pricing: "Ïº┘äÏúÏ│Ï╣ÏºÏ▒",
      features: "Ïº┘ä┘à┘à┘èÏ▓ÏºÏ¬",
      signIn: "Ï¬Ï│Ï¼┘è┘ä Ïº┘äÏ»Ï«┘ê┘ä",
      tryForFree: "Ï¼Ï▒Ï¿ PlatvoAI ┘àÏ¼Ïº┘åÏº┘ï",
      newBadge: "­ƒÆ½ Ï¼Ï»┘èÏ» ÔÇö ┘à┘åÏÁÏ® Ï¬┘ê┘üÏ▒ ┘ä┘â ┘â┘ä ┘å┘àÏºÏ░Ï¼ Ï¿Ïº┘äÏ░┘âÏºÏí Ïº┘äÏºÏÁÏÀ┘åÏºÏ╣┘è",
      heroTitle1: "Ï¼┘à┘èÏ╣ ┘å┘àÏºÏ░Ï¼ Ïº┘äÏ░┘âÏºÏí Ïº┘äÏºÏÁÏÀ┘åÏºÏ╣┘è ┘ü┘è Ïº┘äÏ╣Ïº┘ä┘à",
      heroTitle2: "ÏºÏ┤Ï¬Ï▒Ïº┘â ┘êÏºÏ¡Ï»",
      heroDescription: "ÏºÏ│Ï¬Ï«Ï»┘à GPT ┘ê Claude ┘ê Gemini ┘êÏº┘ä┘àÏ▓┘èÏ» ÔÇö ┘à┘å ┘àÏ│ÏºÏ¡Ï® Ï╣┘à┘ä ┘é┘ê┘èÏ® ┘êÏºÏ¡Ï»Ï®. ┘é┘à Ï¿Ïº┘äÏ¬Ï¿Ï»┘è┘ä Ï¿┘è┘å Ïº┘ä┘å┘àÏºÏ░Ï¼ ┘ü┘êÏ▒Ïº┘ï ┘ä┘ä┘àÏ¡ÏºÏ»Ï½Ï® ┘êÏÑ┘åÏ┤ÏºÏí Ïº┘äÏÁ┘êÏ▒ Ï»┘ê┘å Ïº┘äÏ¡ÏºÏ¼Ï® ┘ä┘äÏ¬Ï╣Ïº┘à┘ä ┘àÏ╣ ÏºÏ┤Ï¬Ï▒Ïº┘âÏºÏ¬ ┘àÏ¬Ï╣Ï»Ï»Ï®.",
      getStartedForFree: "ÏºÏ¿Ï»Ïú ┘àÏ¼Ïº┘åÏº┘ï",
      learnMore: "ÏºÏ╣Ï▒┘ü Ïº┘ä┘àÏ▓┘èÏ»",
      problemTitle: "┘àÏ┤┘â┘äÏ® ÏºÏ│Ï¬Ï«Ï»Ïº┘à Ï╣Ï»Ï® ┘à┘åÏÁÏºÏ¬",
      problemDescription: "ÏÑÏ░Ïº ┘â┘åÏ¬ Ï¼ÏºÏ»Ïº┘ï ┘ü┘è ÏºÏ│Ï¬Ï«Ï»Ïº┘à Ïº┘äÏ░┘âÏºÏí Ïº┘äÏºÏÁÏÀ┘åÏºÏ╣┘èÏî ┘üÏ▒Ï¿┘àÏº Ï¬Ï╣┘ä┘à Ï¿Ïº┘ä┘üÏ╣┘ä Ïú┘å┘â Ï¬Ï¡Ï¬ÏºÏ¼ Ïú┘âÏ½Ï▒ ┘à┘å ┘êÏºÏ¡Ï». ┘ä┘â┘å ┘çÏ░Ïº ┘èÏ╣┘å┘è Ïº┘äÏ»┘üÏ╣ ┘ä┘â┘ä Ï┤┘èÏí Ï¿Ï┤┘â┘ä ┘à┘å┘üÏÁ┘ä ┘êÏº┘äÏ¬Ï¿Ï»┘è┘ä Ïº┘ä┘àÏ│Ï¬┘àÏ▒ Ï¿┘è┘å Ï╣┘äÏº┘àÏºÏ¬ Ïº┘äÏ¬Ï¿┘ê┘èÏ¿.",
      problem1: "20 Ï»┘ê┘äÏºÏ▒/Ï┤┘çÏ▒ ┘ä┘Ç ChatGPT Plus",
      problem2: "20 Ï»┘ê┘äÏºÏ▒/Ï┤┘çÏ▒ ┘ä┘Ç Claude Pro",
      problem3: "20 Ï»┘ê┘äÏºÏ▒/Ï┤┘çÏ▒ ┘ä┘Ç Gemini Advanced",
      problem4: "20 Ï»┘ê┘äÏºÏ▒/Ï┤┘çÏ▒ ┘ä┘Ç Perplexity Pro",
      problem5: "Ïº┘äÏ¬Ï¿Ï»┘è┘ä Ï¿┘è┘å 4 Ï╣┘äÏº┘àÏºÏ¬ Ï¬Ï¿┘ê┘èÏ¿ ┘àÏ«Ï¬┘ä┘üÏ®",
      problem6: "┘åÏ│Ï« ┘ê┘äÏÁ┘é ┘å┘üÏ│ Ïº┘ä┘àÏÀÏº┘äÏ¿Ï® ┘ü┘è ┘â┘ä ┘à┘âÏº┘å",
      problem7: "Ïº┘ä┘êÏÁ┘ê┘ä ÏÑ┘ä┘ë Ï¡Ï»┘êÏ» Ï▒Ï│ÏºÏª┘ä Claude",
      problem8: "Ï│ÏºÏ╣ÏºÏ¬ ┘ü┘è ÏºÏ¬Ï«ÏºÏ░ ┘éÏ▒ÏºÏ▒ Ïú┘è ┘êÏºÏ¡Ï» Ï¬Ï│Ï¬Ï«Ï»┘à",
      problem9: "100 Ï»┘ê┘äÏºÏ▒/Ï┤┘çÏ▒ ┘êÏÑÏ¡Ï¿ÏºÏÀ ┘àÏ│Ï¬┘àÏ▒",
      betterWay: "┘ç┘åÏº┘â ÏÀÏ▒┘è┘éÏ® Ïú┘üÏÂ┘ä",
      modelsTitle: "Ï«ÏÀÏ® PRO",
      modelsDescription: "Platvo - Ï«ÏÀÏ® ┘êÏºÏ¡Ï»Ï® Ï¿Ï│┘èÏÀÏ®. ┘â┘ä ┘àÏº Ï¬Ï¡Ï¬ÏºÏ¼┘ç ┘ü┘è ÏºÏ┤Ï¬Ï▒Ïº┘â ┘êÏºÏ¡Ï».",
      pricingOld: "Ï¿Ï»┘ê┘å Ï¡Ï»┘êÏ». Ï¿Ï»┘ê┘å Ï¿Ïº┘éÏºÏ¬ ┘àÏ╣┘éÏ»Ï®.",
      pricingNew: "14.99 Ï»┘ê┘äÏºÏ▒ / Ï┤┘çÏ▒",
      savePercent: "Ï«ÏÀÏ® ┘êÏºÏ¡Ï»Ï® Ï¿Ï│┘èÏÀÏ®",
      getStartedNow: "ÏºÏ¿Ï»Ïú Ïº┘äÏó┘å",
    },
  },
};
