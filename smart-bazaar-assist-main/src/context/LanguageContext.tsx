import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'kn' | 'hi';

interface Translations {
  // Navbar
  home: string;
  products: string;
  admin: string;
  smartBazaar: string;
  
  // Home Page
  theFutureOfGroceryShopping: string;
  welcomeTo: string;
  assistant: string;
  heroSubheadline: string;
  startShopping: string;
  voiceSearch: string;
  imageSearch: string;
  whyChooseSmartBazaar: string;
  revolutionizingExperience: string;
  noQueues: string;
  noQueuesDesc: string;
  fasterCheckout: string;
  fasterCheckoutDesc: string;
  smartCart: string;
  smartCartDesc: string;
  productsCount: string;
  avgCheckout: string;
  satisfaction: string;
  support: string;
  copyright: string;
  
  // Products Page
  browseProducts: string;
  productsAvailable: string;
  searchForProducts: string;
  noProductsFound: string;
  tryAdjusting: string;
  all: string;
  bakery: string;
  dairy: string;
  fruits: string;
  vegetables: string;
  spreads: string;
  beverages: string;
  grains: string;
  snacks: string;
  cooking: string;
  
  // Product Card
  addToCart: string;
  onlyLeft: string;
  expiresIn: string;
  days: string;
  aisle: string;
  
  // Checkout Page
  yourCart: string;
  continueShopping: string;
  cartIsEmpty: string;
  startAddingItems: string;
  browseProductsBtn: string;
  frequentlyBoughtTogether: string;
  orderSummary: string;
  verified: string;
  subtotal: string;
  items: string;
  gst: string;
  total: string;
  payNow: string;
  scanningItems: string;
  paymentSuccessful: string;
  thankYouShopping: string;
  billSentTo: string;
  downloadBill: string;
  shareViaWhatsApp: string;
  
  // Admin Page
  adminLogin: string;
  email: string;
  password: string;
  signIn: string;
  invalidCredentials: string;
  adminDashboard: string;
  manageInventory: string;
  addProduct: string;
  totalProducts: string;
  lowStock: string;
  nearExpiry: string;
  customersToday: string;
  lowStockAlert: string;
  allProductsWellStocked: string;
  left: string;
  nearExpiryItems: string;
  noProductsNearExpiry: string;
  expires: string;
  customerInsights: string;
  today: string;
  phoneNumber: string;
  time: string;
  totalSpend: string;
  productManagement: string;
  inStock: string;
  signOut: string;
  
  // Product Form Modal
  editProduct: string;
  addNewProduct: string;
  productName: string;
  brand: string;
  price: string;
  originalPrice: string;
  stockQuantity: string;
  offerTag: string;
  category: string;
  expiryDate: string;
  productImage: string;
  imageUrl: string;
  updateProduct: string;
  
  // Aisle Map
  storeMap: string;
  finding: string;
  entrance: string;
  checkout: string;
  yourItem: string;
  otherAisles: string;
  
  // OTP Modal
  verifyToContinue: string;
  enterEmailToReceiveOTP: string;
  emailAddress: string;
  enterYourEmail: string;
  sendOTP: string;
  enterOTPSentTo: string;
  enterOTP: string;
  enterSixDigitOTP: string;
  checkEmailForOTP: string;
  verifyAndContinue: string;
  changeEmail: string;
  verifying: string;
  sendingOTP: string;
  termsOfService: string;
  otpSentToEmail: string;
  otpExpired: string;
  invalidOTP: string;
  resendOTP: string;
  resendIn: string;
  seconds: string;
  maxResendAttempts: string;
  
  // Delete Dialog
  deleteProduct: string;
  deleteConfirmation: string;
  cancel: string;
  delete: string;
  
  // Advanced Features
  counterAvailable: string;
  minWait: string;
  counterOffline: string;
  countersAvailable: string;
  fastest: string;
  billingCounterStatus: string;
  inQueue: string;
  liveUpdates: string;
  enterYourName: string;
  errorCreatingSession: string;
  sessionCreated: string;
  enterNameAndCode: string;
  invalidSessionCode: string;
  joinedSession: string;
  leftSession: string;
  members: string;
  familySync: string;
  familySyncMode: string;
  yourName: string;
  createNewSession: string;
  or: string;
  enterSessionCode: string;
  joinExistingSession: string;
  sessionCode: string;
  sharedCart: string;
  addedBy: string;
  noItemsYet: string;
  leaveSession: string;
  errorSendingRequest: string;
  helpRequestSent: string;
  findHelp: string;
  silentAssistance: string;
  helpOnTheWay: string;
  staffWillAssist: string;
  requestHelpSilently: string;
  helpInAisle: string;
  helpFindingProduct: string;
  generalAssistance: string;
  whichAisle: string;
  whatProduct: string;
  enterProductName: string;
  additionalMessage: string;
  describeNeed: string;
  sending: string;
  requestHelp: string;
  pricePerUnit: string;
  showOnMap: string;
  frequentlyAsked: string;
  counterUpdated: string;
  counterManagement: string;
  available: string;
  busy: string;
  offline: string;
  waitTime: string;
  min: string;
  newHelpRequest: string;
  requestResolved: string;
  requestAssigned: string;
  helpRequests: string;
  pending: string;
  noHelpRequests: string;
  aisleHelp: string;
  findProduct: string;
  generalHelp: string;
  assign: string;
  
  // Magic Link Auth & Customer Dashboard
  error: string;
  pleaseEnterEmail: string;
  magicLinkSent: string;
  checkYourEmail: string;
  failedToSendLink: string;
  checkYourInbox: string;
  magicLinkSentTo: string;
  clickLinkToLogin: string;
  tryDifferentEmail: string;
  signInToCheckout: string;
  enterEmailForMagicLink: string;
  sendMagicLink: string;
  pleaseEnterName: string;
  profileCompleted: string;
  welcomeToSmartBazaar: string;
  failedToUpdateProfile: string;
  completeYourProfile: string;
  almostThere: string;
  loggedInAs: string;
  fullName: string;
  enterFullName: string;
  optional: string;
  saving: string;
  completeProfile: string;
  customerDashboard: string;
  searchCustomers: string;
  totalCustomers: string;
  goldMembers: string;
  totalRevenue: string;
  avgLTV: string;
  noCustomersYet: string;
  customer: string;
  status: string;
  tier: string;
  ltv: string;
  lastVisit: string;
  profileInfo: string;
  purchaseInsights: string;
  totalOrders: string;
  avgOrderValue: string;
  lifetimeValue: string;
  frequentItems: string;
  behavioralInsights: string;
  visitFrequency: string;
  paymentMethod: string;
  adminNotes: string;
  edit: string;
  recentOrders: string;
  editAdminNotes: string;
  addNotesForCustomer: string;
  enterNotes: string;
  notesSaved: string;
  adminNotesUpdated: string;
  save: string;
  loginSuccessful: string;
  completePaymentMessage: string;
  loggedOutSuccessfully: string;
  
  // Find Help additional
  pleaseSelectLocation: string;
  yourCurrentLocation: string;
  selectLocation: string;
  typeYourLocation: string;
  
  // Weight-based products
  enterWeight: string;
  perKg: string;
}

const translations: Record<Language, Translations> = {
  en: {
    // Navbar
    home: 'Home',
    products: 'Products',
    admin: 'Admin',
    smartBazaar: 'Smart Bazaar',
    
    // Home Page
    theFutureOfGroceryShopping: 'The Future of Grocery Shopping',
    welcomeTo: 'Welcome to',
    assistant: 'Assistant',
    heroSubheadline: 'Experience seamless grocery shopping with AI-powered search, smart recommendations, and lightning-fast checkout.',
    startShopping: 'Start Shopping',
    voiceSearch: 'Voice Search',
    imageSearch: 'Image Search',
    whyChooseSmartBazaar: 'Why Choose Smart Bazaar?',
    revolutionizingExperience: 'Revolutionizing your grocery experience with cutting-edge technology',
    noQueues: 'No Queues',
    noQueuesDesc: 'Skip the long checkout lines with our smart self-checkout system.',
    fasterCheckout: 'Faster Checkout',
    fasterCheckoutDesc: 'Scan, pay, and go in under 60 seconds with mobile payments.',
    smartCart: 'Smart Cart',
    smartCartDesc: 'Real-time price tracking and smart recommendations as you shop.',
    productsCount: 'Products',
    avgCheckout: 'Avg Checkout',
    satisfaction: 'Satisfaction',
    support: 'Support',
    copyright: '© 2026 Smart Bazaar Assistant.',
    
    // Products Page
    browseProducts: 'Browse Products',
    productsAvailable: 'products available',
    searchForProducts: 'Search for products...',
    noProductsFound: 'No products found',
    tryAdjusting: 'Try adjusting your search or filter criteria',
    all: 'All',
    bakery: 'Bakery',
    dairy: 'Dairy',
    fruits: 'Fruits',
    vegetables: 'Vegetables',
    spreads: 'Spreads',
    beverages: 'Beverages',
    grains: 'Grains',
    snacks: 'Snacks',
    cooking: 'Cooking',
    
    // Product Card
    addToCart: 'Add to Cart',
    onlyLeft: 'Only',
    expiresIn: 'Expires in',
    days: 'days',
    aisle: 'Aisle',
    
    // Checkout Page
    yourCart: 'Your Cart',
    continueShopping: 'Continue Shopping',
    cartIsEmpty: 'Your cart is empty',
    startAddingItems: 'Start adding some delicious items!',
    browseProductsBtn: 'Browse Products',
    frequentlyBoughtTogether: 'Frequently Bought Together',
    orderSummary: 'Order Summary',
    verified: 'Verified',
    subtotal: 'Subtotal',
    items: 'items',
    gst: 'GST (5%)',
    total: 'Total',
    payNow: 'Pay Now',
    scanningItems: 'Scanning items...',
    paymentSuccessful: 'Payment Successful!',
    thankYouShopping: 'Thank you for shopping with Smart Bazaar',
    billSentTo: 'Bill sent to:',
    downloadBill: 'Download Bill (PDF)',
    shareViaWhatsApp: 'Share Bill via WhatsApp',
    
    // Admin Page
    adminLogin: 'Admin Login',
    email: 'Email',
    password: 'Password',
    signIn: 'Sign In',
    invalidCredentials: 'Invalid credentials. Please try again.',
    adminDashboard: 'Admin Dashboard',
    manageInventory: 'Manage your Smart Bazaar inventory and customers',
    addProduct: 'Add Product',
    totalProducts: 'Total Products',
    lowStock: 'Low Stock',
    nearExpiry: 'Near Expiry',
    customersToday: 'Customers Today',
    lowStockAlert: 'Low Stock Alert',
    allProductsWellStocked: 'All products are well stocked!',
    left: 'left',
    nearExpiryItems: 'Near Expiry Items',
    noProductsNearExpiry: 'No products near expiry!',
    expires: 'Expires:',
    customerInsights: 'Customer Insights',
    today: 'Today',
    phoneNumber: 'Phone Number',
    time: 'Time',
    totalSpend: 'Total Spend',
    productManagement: 'Product Management',
    inStock: 'in stock',
    signOut: 'Sign Out',
    
    // Product Form Modal
    editProduct: 'Edit Product',
    addNewProduct: 'Add New Product',
    productName: 'Product Name',
    brand: 'Brand',
    price: 'Price (Rs.)',
    originalPrice: 'Original Price',
    stockQuantity: 'Stock Quantity',
    offerTag: 'Offer Tag',
    category: 'Category',
    expiryDate: 'Expiry Date',
    productImage: 'Product Image',
    imageUrl: 'Image URL',
    updateProduct: 'Update Product',
    
    // Aisle Map
    storeMap: 'Store Map',
    finding: 'Finding:',
    entrance: 'Entrance',
    checkout: 'Checkout',
    yourItem: 'Your Item',
    otherAisles: 'Other Aisles',
    
    // OTP Modal
    verifyToContinue: 'Verify to Continue',
    enterEmailToReceiveOTP: 'Enter your email address to receive a one-time password',
    emailAddress: 'Email Address',
    enterYourEmail: 'Enter your email',
    sendOTP: 'Send OTP',
    enterOTPSentTo: 'Enter the 6-digit OTP sent to',
    enterOTP: 'Enter OTP',
    enterSixDigitOTP: 'Enter 6-digit OTP',
    checkEmailForOTP: 'Check your email inbox for the OTP code',
    verifyAndContinue: 'Verify & Continue',
    changeEmail: 'Change Email',
    verifying: 'Verifying...',
    sendingOTP: 'Sending OTP...',
    termsOfService: 'By continuing, you agree to our Terms of Service',
    otpSentToEmail: 'OTP sent to your email',
    otpExpired: 'OTP has expired. Please request a new one.',
    invalidOTP: 'Invalid OTP. Please try again.',
    resendOTP: 'Resend OTP',
    resendIn: 'Resend in',
    seconds: 'seconds',
    maxResendAttempts: 'Maximum resend attempts reached. Please try again later.',
    
    // Delete Dialog
    deleteProduct: 'Delete Product',
    deleteConfirmation: 'Are you sure you want to delete this product? This action cannot be undone.',
    cancel: 'Cancel',
    delete: 'Delete',
    counterAvailable: 'Empty',
    minWait: 'min wait',
    counterOffline: 'Offline',
    countersAvailable: 'counters available',
    fastest: 'Fastest',
    billingCounterStatus: 'Billing Counter Status',
    inQueue: 'in queue',
    liveUpdates: 'Live updates • Choose the fastest counter',
    enterYourName: 'Please enter your name',
    errorCreatingSession: 'Error creating session',
    sessionCreated: 'Session created! Share the code with family.',
    enterNameAndCode: 'Please enter your name and session code',
    invalidSessionCode: 'Invalid session code',
    joinedSession: 'Joined family session!',
    leftSession: 'Left family session',
    members: 'members',
    familySync: 'Family Sync',
    familySyncMode: 'Family Sync Mode',
    yourName: 'Your Name',
    createNewSession: 'Create New Session',
    or: 'or',
    enterSessionCode: 'Enter session code',
    joinExistingSession: 'Join Existing Session',
    sessionCode: 'Session Code',
    sharedCart: 'Shared Cart',
    addedBy: 'by',
    noItemsYet: 'No items yet. Add from product pages!',
    leaveSession: 'Leave Session',
    errorSendingRequest: 'Error sending request',
    helpRequestSent: 'Help request sent! Staff will assist you shortly.',
    findHelp: 'Find Help',
    silentAssistance: 'Silent Assistance',
    helpOnTheWay: 'Help is on the way!',
    staffWillAssist: 'A staff member will assist you shortly.',
    requestHelpSilently: 'Request help without talking. Staff will come to you.',
    helpInAisle: 'Help in an aisle',
    helpFindingProduct: 'Help finding a product',
    generalAssistance: 'General assistance',
    whichAisle: 'Which aisle are you in?',
    whatProduct: 'What product are you looking for?',
    enterProductName: 'Enter product name',
    additionalMessage: 'Additional message (optional)',
    describeNeed: 'Describe what you need help with...',
    sending: 'Sending...',
    requestHelp: 'Request Help',
    pricePerUnit: 'Price Per Unit',
    showOnMap: 'Show on Map',
    frequentlyAsked: 'Frequently Asked',
    counterUpdated: 'Counter updated',
    counterManagement: 'Counter Management',
    available: 'Available',
    busy: 'Busy',
    offline: 'Offline',
    waitTime: 'Wait Time',
    min: 'min',
    newHelpRequest: 'New help request received!',
    requestResolved: 'Request marked as resolved',
    requestAssigned: 'Request assigned',
    helpRequests: 'Help Requests',
    pending: 'pending',
    noHelpRequests: 'No help requests at the moment',
    aisleHelp: 'Aisle Help',
    findProduct: 'Find Product',
    generalHelp: 'General Help',
    assign: 'Assign',
    error: 'Error',
    pleaseEnterEmail: 'Please enter your email address',
    magicLinkSent: 'Magic Link Sent!',
    checkYourEmail: 'Check your email for the login link',
    failedToSendLink: 'Failed to send magic link',
    checkYourInbox: 'Check Your Inbox',
    magicLinkSentTo: "We've sent a magic link to",
    clickLinkToLogin: 'Click the link in the email to log in',
    tryDifferentEmail: 'Try a different email',
    signInToCheckout: 'Sign in to Checkout',
    enterEmailForMagicLink: 'Enter your email to receive a magic link',
    sendMagicLink: 'Send Magic Link',
    pleaseEnterName: 'Please enter your full name',
    profileCompleted: 'Profile Completed!',
    welcomeToSmartBazaar: 'Welcome to Smart Bazaar',
    failedToUpdateProfile: 'Failed to update profile',
    completeYourProfile: 'Complete Your Profile',
    almostThere: "You're almost there! Just a few more details.",
    loggedInAs: 'Logged in as',
    fullName: 'Full Name',
    enterFullName: 'Enter your full name',
    optional: 'Optional',
    saving: 'Saving...',
    completeProfile: 'Complete Profile',
    customerDashboard: 'Customer Dashboard',
    searchCustomers: 'Search customers...',
    totalCustomers: 'Total Customers',
    goldMembers: 'Gold Members',
    totalRevenue: 'Total Revenue',
    avgLTV: 'Avg LTV',
    noCustomersYet: 'No customers yet. Customers will appear here after their first purchase.',
    customer: 'Customer',
    status: 'Status',
    tier: 'Tier',
    ltv: 'LTV',
    lastVisit: 'Last Visit',
    profileInfo: 'Profile Info',
    purchaseInsights: 'Purchase Insights',
    totalOrders: 'Total Orders',
    avgOrderValue: 'Avg Order Value',
    lifetimeValue: 'Lifetime Value',
    frequentItems: 'Frequently Purchased',
    behavioralInsights: 'Behavioral Insights',
    visitFrequency: 'Visit Frequency',
    paymentMethod: 'Preferred Payment',
    adminNotes: 'Admin Notes',
    edit: 'Edit',
    recentOrders: 'Recent Orders',
    editAdminNotes: 'Edit Admin Notes',
    addNotesForCustomer: 'Add internal notes for',
    enterNotes: 'Enter notes...',
    notesSaved: 'Notes Saved',
    adminNotesUpdated: 'Admin notes have been updated',
    save: 'Save',
    loginSuccessful: 'Login successful',
    completePaymentMessage: 'You can complete the payment now.',
    loggedOutSuccessfully: 'Logged out successfully',
    
    // Find Help additional
    pleaseSelectLocation: 'Please select or enter your location',
    yourCurrentLocation: 'Your Current Location',
    selectLocation: 'Select your location',
    typeYourLocation: 'Type your location...',
    
    // Weight-based products
    enterWeight: 'Enter weight',
    perKg: 'per kg',
  },
  kn: {
    // Navbar
    home: 'ಮುಖಪುಟ',
    products: 'ಉತ್ಪನ್ನಗಳು',
    admin: 'ನಿರ್ವಾಹಕ',
    smartBazaar: 'ಸ್ಮಾರ್ಟ್ ಬಜಾರ್',
    
    // Home Page
    theFutureOfGroceryShopping: 'ದಿನಸಿ ಶಾಪಿಂಗ್‌ನ ಭವಿಷ್ಯ',
    welcomeTo: 'ಸುಸ್ವಾಗತ',
    assistant: 'ಸಹಾಯಕ',
    heroSubheadline: 'AI-ಆಧಾರಿತ ಹುಡುಕಾಟ, ಸ್ಮಾರ್ಟ್ ಶಿಫಾರಸುಗಳು ಮತ್ತು ತ್ವರಿತ ಚೆಕ್‌ಔಟ್‌ನೊಂದಿಗೆ ಸುಲಭ ದಿನಸಿ ಶಾಪಿಂಗ್ ಅನುಭವಿಸಿ.',
    startShopping: 'ಶಾಪಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ',
    voiceSearch: 'ಧ್ವನಿ ಹುಡುಕಾಟ',
    imageSearch: 'ಚಿತ್ರ ಹುಡುಕಾಟ',
    whyChooseSmartBazaar: 'ಸ್ಮಾರ್ಟ್ ಬಜಾರ್ ಏಕೆ ಆಯ್ಕೆ ಮಾಡಬೇಕು?',
    revolutionizingExperience: 'ಅತ್ಯಾಧುನಿಕ ತಂತ್ರಜ್ಞಾನದೊಂದಿಗೆ ನಿಮ್ಮ ದಿನಸಿ ಅನುಭವವನ್ನು ಕ್ರಾಂತಿಕಾರಿಗೊಳಿಸುತ್ತಿದೆ',
    noQueues: 'ಸರತಿ ಇಲ್ಲ',
    noQueuesDesc: 'ನಮ್ಮ ಸ್ಮಾರ್ಟ್ ಸ್ವಯಂ-ಚೆಕ್‌ಔಟ್ ಸಿಸ್ಟಮ್‌ನೊಂದಿಗೆ ಉದ್ದ ಸರತಿಗಳನ್ನು ಬಿಟ್ಟುಬಿಡಿ.',
    fasterCheckout: 'ವೇಗದ ಚೆಕ್‌ಔಟ್',
    fasterCheckoutDesc: 'ಮೊಬೈಲ್ ಪಾವತಿಗಳೊಂದಿಗೆ 60 ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಸ್ಕ್ಯಾನ್, ಪಾವತಿ ಮತ್ತು ಹೋಗಿ.',
    smartCart: 'ಸ್ಮಾರ್ಟ್ ಕಾರ್ಟ್',
    smartCartDesc: 'ನೀವು ಶಾಪಿಂಗ್ ಮಾಡುವಾಗ ನೈಜ-ಸಮಯದ ಬೆಲೆ ಟ್ರ್ಯಾಕಿಂಗ್ ಮತ್ತು ಸ್ಮಾರ್ಟ್ ಶಿಫಾರಸುಗಳು.',
    productsCount: 'ಉತ್ಪನ್ನಗಳು',
    avgCheckout: 'ಸರಾಸರಿ ಚೆಕ್‌ಔಟ್',
    satisfaction: 'ತೃಪ್ತಿ',
    support: 'ಬೆಂಬಲ',
    copyright: '© 2026 ಸ್ಮಾರ್ಟ್ ಬಜಾರ್ ಸಹಾಯಕ.',
    
    // Products Page
    browseProducts: 'ಉತ್ಪನ್ನಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ',
    productsAvailable: 'ಉತ್ಪನ್ನಗಳು ಲಭ್ಯವಿದೆ',
    searchForProducts: 'ಉತ್ಪನ್ನಗಳನ್ನು ಹುಡುಕಿ...',
    noProductsFound: 'ಯಾವುದೇ ಉತ್ಪನ್ನಗಳು ಸಿಗಲಿಲ್ಲ',
    tryAdjusting: 'ನಿಮ್ಮ ಹುಡುಕಾಟ ಅಥವಾ ಫಿಲ್ಟರ್ ಮಾನದಂಡವನ್ನು ಸರಿಹೊಂದಿಸಲು ಪ್ರಯತ್ನಿಸಿ',
    all: 'ಎಲ್ಲಾ',
    bakery: 'ಬೇಕರಿ',
    dairy: 'ಡೈರಿ',
    fruits: 'ಹಣ್ಣುಗಳು',
    vegetables: 'ತರಕಾರಿಗಳು',
    spreads: 'ಸ್ಪ್ರೆಡ್‌ಗಳು',
    beverages: 'ಪಾನೀಯಗಳು',
    grains: 'ಧಾನ್ಯಗಳು',
    snacks: 'ತಿಂಡಿಗಳು',
    cooking: 'ಅಡುಗೆ',
    
    // Product Card
    addToCart: 'ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ',
    onlyLeft: 'ಕೇವಲ',
    expiresIn: 'ಅವಧಿ ಮುಗಿಯುತ್ತದೆ',
    days: 'ದಿನಗಳು',
    aisle: 'ಸಾಲು',
    
    // Checkout Page
    yourCart: 'ನಿಮ್ಮ ಕಾರ್ಟ್',
    continueShopping: 'ಶಾಪಿಂಗ್ ಮುಂದುವರಿಸಿ',
    cartIsEmpty: 'ನಿಮ್ಮ ಕಾರ್ಟ್ ಖಾಲಿಯಾಗಿದೆ',
    startAddingItems: 'ರುಚಿಕರ ವಸ್ತುಗಳನ್ನು ಸೇರಿಸಲು ಪ್ರಾರಂಭಿಸಿ!',
    browseProductsBtn: 'ಉತ್ಪನ್ನಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ',
    frequentlyBoughtTogether: 'ಆಗಾಗ್ಗೆ ಒಟ್ಟಿಗೆ ಖರೀದಿಸಲಾಗುತ್ತದೆ',
    orderSummary: 'ಆರ್ಡರ್ ಸಾರಾಂಶ',
    verified: 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
    subtotal: 'ಉಪಮೊತ್ತ',
    items: 'ವಸ್ತುಗಳು',
    gst: 'ಜಿಎಸ್‌ಟಿ (5%)',
    total: 'ಒಟ್ಟು',
    payNow: 'ಈಗ ಪಾವತಿಸಿ',
    scanningItems: 'ವಸ್ತುಗಳನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಲಾಗುತ್ತಿದೆ...',
    paymentSuccessful: 'ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿದೆ!',
    thankYouShopping: 'ಸ್ಮಾರ್ಟ್ ಬಜಾರ್‌ನೊಂದಿಗೆ ಶಾಪಿಂಗ್ ಮಾಡಿದ್ದಕ್ಕೆ ಧನ್ಯವಾದಗಳು',
    billSentTo: 'ಬಿಲ್ ಕಳುಹಿಸಲಾಗಿದೆ:',
    downloadBill: 'ಬಿಲ್ ಡೌನ್‌ಲೋಡ್ (PDF)',
    shareViaWhatsApp: 'ವಾಟ್ಸ್‌ಆ್ಯಪ್ ಮೂಲಕ ಹಂಚಿಕೊಳ್ಳಿ',
    
    // Admin Page
    adminLogin: 'ನಿರ್ವಾಹಕ ಲಾಗಿನ್',
    email: 'ಇಮೇಲ್',
    password: 'ಪಾಸ್‌ವರ್ಡ್',
    signIn: 'ಸೈನ್ ಇನ್',
    invalidCredentials: 'ಅಮಾನ್ಯ ರುಜುವಾತುಗಳು. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    adminDashboard: 'ನಿರ್ವಾಹಕ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    manageInventory: 'ನಿಮ್ಮ ಸ್ಮಾರ್ಟ್ ಬಜಾರ್ ಸಂಗ್ರಹ ಮತ್ತು ಗ್ರಾಹಕರನ್ನು ನಿರ್ವಹಿಸಿ',
    addProduct: 'ಉತ್ಪನ್ನ ಸೇರಿಸಿ',
    totalProducts: 'ಒಟ್ಟು ಉತ್ಪನ್ನಗಳು',
    lowStock: 'ಕಡಿಮೆ ಸ್ಟಾಕ್',
    nearExpiry: 'ಅವಧಿ ಮುಗಿಯುತ್ತಿದೆ',
    customersToday: 'ಇಂದಿನ ಗ್ರಾಹಕರು',
    lowStockAlert: 'ಕಡಿಮೆ ಸ್ಟಾಕ್ ಎಚ್ಚರಿಕೆ',
    allProductsWellStocked: 'ಎಲ್ಲಾ ಉತ್ಪನ್ನಗಳು ಚೆನ್ನಾಗಿ ಸಂಗ್ರಹವಾಗಿವೆ!',
    left: 'ಉಳಿದಿದೆ',
    nearExpiryItems: 'ಅವಧಿ ಮುಗಿಯುತ್ತಿರುವ ವಸ್ತುಗಳು',
    noProductsNearExpiry: 'ಅವಧಿ ಮುಗಿಯುತ್ತಿರುವ ಉತ್ಪನ್ನಗಳಿಲ್ಲ!',
    expires: 'ಅವಧಿ:',
    customerInsights: 'ಗ್ರಾಹಕ ಒಳನೋಟಗಳು',
    today: 'ಇಂದು',
    phoneNumber: 'ಫೋನ್ ಸಂಖ್ಯೆ',
    time: 'ಸಮಯ',
    totalSpend: 'ಒಟ್ಟು ಖರ್ಚು',
    productManagement: 'ಉತ್ಪನ್ನ ನಿರ್ವಹಣೆ',
    inStock: 'ಸ್ಟಾಕ್‌ನಲ್ಲಿ',
    signOut: 'ಸೈನ್ ಔಟ್',
    
    // Product Form Modal
    editProduct: 'ಉತ್ಪನ್ನ ಸಂಪಾದಿಸಿ',
    addNewProduct: 'ಹೊಸ ಉತ್ಪನ್ನ ಸೇರಿಸಿ',
    productName: 'ಉತ್ಪನ್ನದ ಹೆಸರು',
    brand: 'ಬ್ರಾಂಡ್',
    price: 'ಬೆಲೆ (ರೂ.)',
    originalPrice: 'ಮೂಲ ಬೆಲೆ',
    stockQuantity: 'ಸ್ಟಾಕ್ ಪ್ರಮಾಣ',
    offerTag: 'ಆಫರ್ ಟ್ಯಾಗ್',
    category: 'ವರ್ಗ',
    expiryDate: 'ಅವಧಿ ಮುಗಿಯುವ ದಿನಾಂಕ',
    productImage: 'ಉತ್ಪನ್ನ ಚಿತ್ರ',
    imageUrl: 'ಚಿತ್ರ URL',
    updateProduct: 'ಉತ್ಪನ್ನ ನವೀಕರಿಸಿ',
    
    // Aisle Map
    storeMap: 'ಅಂಗಡಿ ನಕ್ಷೆ',
    finding: 'ಹುಡುಕುತ್ತಿದೆ:',
    entrance: 'ಪ್ರವೇಶ',
    checkout: 'ಚೆಕ್‌ಔಟ್',
    yourItem: 'ನಿಮ್ಮ ವಸ್ತು',
    otherAisles: 'ಇತರ ಸಾಲುಗಳು',
    
    // OTP Modal
    verifyToContinue: 'ಮುಂದುವರಿಸಲು ಪರಿಶೀಲಿಸಿ',
    enterEmailToReceiveOTP: 'ಒಂದು-ಬಾರಿ ಪಾಸ್‌ವರ್ಡ್ ಪಡೆಯಲು ನಿಮ್ಮ ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ',
    emailAddress: 'ಇಮೇಲ್ ವಿಳಾಸ',
    enterYourEmail: 'ನಿಮ್ಮ ಇಮೇಲ್ ನಮೂದಿಸಿ',
    sendOTP: 'OTP ಕಳುಹಿಸಿ',
    enterOTPSentTo: 'ಕಳುಹಿಸಲಾದ 6-ಅಂಕಿಯ OTP ನಮೂದಿಸಿ',
    enterOTP: 'OTP ನಮೂದಿಸಿ',
    enterSixDigitOTP: '6-ಅಂಕಿಯ OTP ನಮೂದಿಸಿ',
    checkEmailForOTP: 'OTP ಕೋಡ್‌ಗಾಗಿ ನಿಮ್ಮ ಇಮೇಲ್ ಇನ್‌ಬಾಕ್ಸ್ ಪರಿಶೀಲಿಸಿ',
    verifyAndContinue: 'ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಮುಂದುವರಿಸಿ',
    changeEmail: 'ಇಮೇಲ್ ಬದಲಾಯಿಸಿ',
    verifying: 'ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...',
    sendingOTP: 'OTP ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...',
    termsOfService: 'ಮುಂದುವರಿಸುವ ಮೂಲಕ, ನೀವು ನಮ್ಮ ಸೇವಾ ನಿಯಮಗಳನ್ನು ಒಪ್ಪುತ್ತೀರಿ',
    otpSentToEmail: 'ನಿಮ್ಮ ಇಮೇಲ್‌ಗೆ OTP ಕಳುಹಿಸಲಾಗಿದೆ',
    otpExpired: 'OTP ಅವಧಿ ಮುಗಿದಿದೆ. ದಯವಿಟ್ಟು ಹೊಸದನ್ನು ವಿನಂತಿಸಿ.',
    invalidOTP: 'ಅಮಾನ್ಯ OTP. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    resendOTP: 'OTP ಮರುಕಳುಹಿಸಿ',
    resendIn: 'ಮರುಕಳುಹಿಸಿ',
    seconds: 'ಸೆಕೆಂಡುಗಳು',
    maxResendAttempts: 'ಗರಿಷ್ಠ ಮರುಕಳುಹಿಸುವ ಪ್ರಯತ್ನಗಳು ತಲುಪಿವೆ. ದಯವಿಟ್ಟು ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    
    // Delete Dialog
    deleteProduct: 'ಉತ್ಪನ್ನ ಅಳಿಸಿ',
    deleteConfirmation: 'ಈ ಉತ್ಪನ್ನವನ್ನು ಅಳಿಸಲು ನೀವು ಖಚಿತವಾಗಿ ಬಯಸುವಿರಾ? ಈ ಕ್ರಿಯೆಯನ್ನು ರದ್ದುಗೊಳಿಸಲಾಗುವುದಿಲ್ಲ.',
    cancel: 'ರದ್ದುಮಾಡಿ',
    delete: 'ಅಳಿಸಿ',
    counterAvailable: 'ಖಾಲಿ',
    minWait: 'ನಿಮಿಷ ಕಾಯಿರಿ',
    counterOffline: 'ಆಫ್‌ಲೈನ್',
    countersAvailable: 'ಕೌಂಟರ್‌ಗಳು ಲಭ್ಯ',
    fastest: 'ವೇಗದ',
    billingCounterStatus: 'ಬಿಲ್ಲಿಂಗ್ ಕೌಂಟರ್ ಸ್ಥಿತಿ',
    inQueue: 'ಸರತಿಯಲ್ಲಿ',
    liveUpdates: 'ನೇರ ನವೀಕರಣಗಳು',
    enterYourName: 'ನಿಮ್ಮ ಹೆಸರು ನಮೂದಿಸಿ',
    errorCreatingSession: 'ಸೆಷನ್ ರಚಿಸುವಲ್ಲಿ ದೋಷ',
    sessionCreated: 'ಸೆಷನ್ ರಚಿಸಲಾಗಿದೆ!',
    enterNameAndCode: 'ಹೆಸರು ಮತ್ತು ಕೋಡ್ ನಮೂದಿಸಿ',
    invalidSessionCode: 'ಅಮಾನ್ಯ ಸೆಷನ್ ಕೋಡ್',
    joinedSession: 'ಕುಟುಂಬ ಸೆಷನ್‌ಗೆ ಸೇರಿದ್ದೀರಿ!',
    leftSession: 'ಸೆಷನ್ ಬಿಟ್ಟಿದ್ದೀರಿ',
    members: 'ಸದಸ್ಯರು',
    familySync: 'ಕುಟುಂಬ ಸಿಂಕ್',
    familySyncMode: 'ಕುಟುಂಬ ಸಿಂಕ್ ಮೋಡ್',
    yourName: 'ನಿಮ್ಮ ಹೆಸರು',
    createNewSession: 'ಹೊಸ ಸೆಷನ್ ರಚಿಸಿ',
    or: 'ಅಥವಾ',
    enterSessionCode: 'ಸೆಷನ್ ಕೋಡ್ ನಮೂದಿಸಿ',
    joinExistingSession: 'ಅಸ್ತಿತ್ವದಲ್ಲಿರುವ ಸೆಷನ್‌ಗೆ ಸೇರಿ',
    sessionCode: 'ಸೆಷನ್ ಕೋಡ್',
    sharedCart: 'ಹಂಚಿಕೆಯ ಕಾರ್ಟ್',
    addedBy: 'ಸೇರಿಸಿದವರು',
    noItemsYet: 'ಇನ್ನೂ ವಸ್ತುಗಳಿಲ್ಲ',
    leaveSession: 'ಸೆಷನ್ ಬಿಡಿ',
    errorSendingRequest: 'ವಿನಂತಿ ಕಳುಹಿಸುವಲ್ಲಿ ದೋಷ',
    helpRequestSent: 'ಸಹಾಯ ವಿನಂತಿ ಕಳುಹಿಸಲಾಗಿದೆ!',
    findHelp: 'ಸಹಾಯ ಹುಡುಕಿ',
    silentAssistance: 'ಮೌನ ಸಹಾಯ',
    helpOnTheWay: 'ಸಹಾಯ ಬರುತ್ತಿದೆ!',
    staffWillAssist: 'ಸಿಬ್ಬಂದಿ ಶೀಘ್ರದಲ್ಲೇ ಸಹಾಯ ಮಾಡುತ್ತಾರೆ',
    requestHelpSilently: 'ಮಾತನಾಡದೆ ಸಹಾಯ ಕೋರಿ',
    helpInAisle: 'ಸಾಲಿನಲ್ಲಿ ಸಹಾಯ',
    helpFindingProduct: 'ಉತ್ಪನ್ನ ಹುಡುಕಲು ಸಹಾಯ',
    generalAssistance: 'ಸಾಮಾನ್ಯ ಸಹಾಯ',
    whichAisle: 'ಯಾವ ಸಾಲಿನಲ್ಲಿದ್ದೀರಿ?',
    whatProduct: 'ಯಾವ ಉತ್ಪನ್ನ ಹುಡುಕುತ್ತಿದ್ದೀರಿ?',
    enterProductName: 'ಉತ್ಪನ್ನದ ಹೆಸರು ನಮೂದಿಸಿ',
    additionalMessage: 'ಹೆಚ್ಚುವರಿ ಸಂದೇಶ',
    describeNeed: 'ನಿಮಗೆ ಏನು ಬೇಕು ವಿವರಿಸಿ',
    sending: 'ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...',
    requestHelp: 'ಸಹಾಯ ಕೋರಿ',
    pricePerUnit: 'ಪ್ರತಿ ಯುನಿಟ್ ಬೆಲೆ',
    showOnMap: 'ನಕ್ಷೆಯಲ್ಲಿ ತೋರಿಸಿ',
    frequentlyAsked: 'ಪದೇ ಪದೇ ಕೇಳಲಾಗುತ್ತದೆ',
    counterUpdated: 'ಕೌಂಟರ್ ನವೀಕರಿಸಲಾಗಿದೆ',
    counterManagement: 'ಕೌಂಟರ್ ನಿರ್ವಹಣೆ',
    available: 'ಲಭ್ಯ',
    busy: 'ಬ್ಯುಸಿ',
    offline: 'ಆಫ್‌ಲೈನ್',
    waitTime: 'ಕಾಯುವ ಸಮಯ',
    min: 'ನಿಮಿಷ',
    newHelpRequest: 'ಹೊಸ ಸಹಾಯ ವಿನಂತಿ!',
    requestResolved: 'ವಿನಂತಿ ಪರಿಹರಿಸಲಾಗಿದೆ',
    requestAssigned: 'ವಿನಂತಿ ನಿಯೋಜಿಸಲಾಗಿದೆ',
    helpRequests: 'ಸಹಾಯ ವಿನಂತಿಗಳು',
    pending: 'ಬಾಕಿ',
    noHelpRequests: 'ಸಹಾಯ ವಿನಂತಿಗಳಿಲ್ಲ',
    aisleHelp: 'ಸಾಲು ಸಹಾಯ',
    findProduct: 'ಉತ್ಪನ್ನ ಹುಡುಕಿ',
    generalHelp: 'ಸಾಮಾನ್ಯ ಸಹಾಯ',
    assign: 'ನಿಯೋಜಿಸಿ',
    error: 'ದೋಷ',
    pleaseEnterEmail: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ',
    magicLinkSent: 'ಮ್ಯಾಜಿಕ್ ಲಿಂಕ್ ಕಳುಹಿಸಲಾಗಿದೆ!',
    checkYourEmail: 'ಲಾಗಿನ್ ಲಿಂಕ್‌ಗಾಗಿ ನಿಮ್ಮ ಇಮೇಲ್ ಪರಿಶೀಲಿಸಿ',
    failedToSendLink: 'ಮ್ಯಾಜಿಕ್ ಲಿಂಕ್ ಕಳುಹಿಸಲು ವಿಫಲವಾಗಿದೆ',
    checkYourInbox: 'ನಿಮ್ಮ ಇನ್‌ಬಾಕ್ಸ್ ಪರಿಶೀಲಿಸಿ',
    magicLinkSentTo: 'ನಾವು ಮ್ಯಾಜಿಕ್ ಲಿಂಕ್ ಕಳುಹಿಸಿದ್ದೇವೆ',
    clickLinkToLogin: 'ಲಾಗಿನ್ ಮಾಡಲು ಇಮೇಲ್‌ನಲ್ಲಿರುವ ಲಿಂಕ್ ಕ್ಲಿಕ್ ಮಾಡಿ',
    tryDifferentEmail: 'ಬೇರೆ ಇಮೇಲ್ ಪ್ರಯತ್ನಿಸಿ',
    signInToCheckout: 'ಚೆಕ್‌ಔಟ್‌ಗೆ ಸೈನ್ ಇನ್ ಮಾಡಿ',
    enterEmailForMagicLink: 'ಮ್ಯಾಜಿಕ್ ಲಿಂಕ್ ಪಡೆಯಲು ನಿಮ್ಮ ಇಮೇಲ್ ನಮೂದಿಸಿ',
    sendMagicLink: 'ಮ್ಯಾಜಿಕ್ ಲಿಂಕ್ ಕಳುಹಿಸಿ',
    pleaseEnterName: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ',
    profileCompleted: 'ಪ್ರೊಫೈಲ್ ಪೂರ್ಣಗೊಂಡಿದೆ!',
    welcomeToSmartBazaar: 'ಸ್ಮಾರ್ಟ್ ಬಜಾರ್‌ಗೆ ಸುಸ್ವಾಗತ',
    failedToUpdateProfile: 'ಪ್ರೊಫೈಲ್ ನವೀಕರಿಸಲು ವಿಫಲವಾಗಿದೆ',
    completeYourProfile: 'ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಪೂರ್ಣಗೊಳಿಸಿ',
    almostThere: 'ನೀವು ಬಹುತೇಕ ಅಲ್ಲಿದ್ದೀರಿ! ಇನ್ನೂ ಕೆಲವು ವಿವರಗಳು.',
    loggedInAs: 'ಲಾಗಿನ್ ಆಗಿದೆ',
    fullName: 'ಪೂರ್ಣ ಹೆಸರು',
    enterFullName: 'ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ',
    optional: 'ಐಚ್ಛಿಕ',
    saving: 'ಉಳಿಸಲಾಗುತ್ತಿದೆ...',
    completeProfile: 'ಪ್ರೊಫೈಲ್ ಪೂರ್ಣಗೊಳಿಸಿ',
    customerDashboard: 'ಗ್ರಾಹಕ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    searchCustomers: 'ಗ್ರಾಹಕರನ್ನು ಹುಡುಕಿ...',
    totalCustomers: 'ಒಟ್ಟು ಗ್ರಾಹಕರು',
    goldMembers: 'ಗೋಲ್ಡ್ ಸದಸ್ಯರು',
    totalRevenue: 'ಒಟ್ಟು ಆದಾಯ',
    avgLTV: 'ಸರಾಸರಿ LTV',
    noCustomersYet: 'ಇನ್ನೂ ಗ್ರಾಹಕರಿಲ್ಲ.',
    customer: 'ಗ್ರಾಹಕ',
    status: 'ಸ್ಥಿತಿ',
    tier: 'ಹಂತ',
    ltv: 'LTV',
    lastVisit: 'ಕೊನೆಯ ಭೇಟಿ',
    profileInfo: 'ಪ್ರೊಫೈಲ್ ಮಾಹಿತಿ',
    purchaseInsights: 'ಖರೀದಿ ಒಳನೋಟಗಳು',
    totalOrders: 'ಒಟ್ಟು ಆರ್ಡರ್‌ಗಳು',
    avgOrderValue: 'ಸರಾಸರಿ ಆರ್ಡರ್ ಮೌಲ್ಯ',
    lifetimeValue: 'ಜೀವಿತಾವಧಿ ಮೌಲ್ಯ',
    frequentItems: 'ಆಗಾಗ್ಗೆ ಖರೀದಿಸಿದ',
    behavioralInsights: 'ವರ್ತನೆಯ ಒಳನೋಟಗಳು',
    visitFrequency: 'ಭೇಟಿ ಆವರ್ತನ',
    paymentMethod: 'ಆದ್ಯತೆಯ ಪಾವತಿ',
    adminNotes: 'ನಿರ್ವಾಹಕ ಟಿಪ್ಪಣಿಗಳು',
    edit: 'ಸಂಪಾದಿಸಿ',
    recentOrders: 'ಇತ್ತೀಚಿನ ಆರ್ಡರ್‌ಗಳು',
    editAdminNotes: 'ನಿರ್ವಾಹಕ ಟಿಪ್ಪಣಿಗಳನ್ನು ಸಂಪಾದಿಸಿ',
    addNotesForCustomer: 'ಆಂತರಿಕ ಟಿಪ್ಪಣಿಗಳನ್ನು ಸೇರಿಸಿ',
    enterNotes: 'ಟಿಪ್ಪಣಿಗಳನ್ನು ನಮೂದಿಸಿ...',
    notesSaved: 'ಟಿಪ್ಪಣಿಗಳನ್ನು ಉಳಿಸಲಾಗಿದೆ',
    adminNotesUpdated: 'ನಿರ್ವಾಹಕ ಟಿಪ್ಪಣಿಗಳನ್ನು ನವೀಕರಿಸಲಾಗಿದೆ',
    save: 'ಉಳಿಸಿ',
    loginSuccessful: 'ಲಾಗಿನ್ ಯಶಸ್ವಿಯಾಗಿದೆ',
    completePaymentMessage: 'ನೀವು ಈಗ ಪಾವತಿಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಬಹುದು.',
    loggedOutSuccessfully: 'ಯಶಸ್ವಿಯಾಗಿ ಲಾಗ್ ಔಟ್ ಆಗಿದೆ',
    
    // Find Help additional
    pleaseSelectLocation: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ನಮೂದಿಸಿ',
    yourCurrentLocation: 'ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಸ್ಥಳ',
    selectLocation: 'ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    typeYourLocation: 'ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಟೈಪ್ ಮಾಡಿ...',
    
    // Weight-based products
    enterWeight: 'ತೂಕ ನಮೂದಿಸಿ',
    perKg: 'ಪ್ರತಿ ಕೆಜಿಗೆ',
  },
  hi: {
    // Navbar
    home: 'होम',
    products: 'उत्पाद',
    admin: 'एडमिन',
    smartBazaar: 'स्मार्ट बाज़ार',
    
    // Home Page
    theFutureOfGroceryShopping: 'किराने की खरीदारी का भविष्य',
    welcomeTo: 'स्वागत है',
    assistant: 'सहायक',
    heroSubheadline: 'AI-संचालित खोज, स्मार्ट अनुशंसाओं और तेज़ चेकआउट के साथ सहज किराने की खरीदारी का अनुभव करें।',
    startShopping: 'खरीदारी शुरू करें',
    voiceSearch: 'वॉइस सर्च',
    imageSearch: 'इमेज सर्च',
    whyChooseSmartBazaar: 'स्मार्ट बाज़ार क्यों चुनें?',
    revolutionizingExperience: 'अत्याधुनिक तकनीक के साथ आपके किराने के अनुभव में क्रांति ला रहे हैं',
    noQueues: 'कोई कतार नहीं',
    noQueuesDesc: 'हमारे स्मार्ट सेल्फ-चेकआउट सिस्टम के साथ लंबी कतारों को छोड़ें।',
    fasterCheckout: 'तेज़ चेकआउट',
    fasterCheckoutDesc: 'मोबाइल भुगतान के साथ 60 सेकंड में स्कैन, भुगतान और जाएं।',
    smartCart: 'स्मार्ट कार्ट',
    smartCartDesc: 'जब आप खरीदारी करते हैं तो रीयल-टाइम मूल्य ट्रैकिंग और स्मार्ट अनुशंसाएं।',
    productsCount: 'उत्पाद',
    avgCheckout: 'औसत चेकआउट',
    satisfaction: 'संतुष्टि',
    support: 'सहायता',
    copyright: '© 2026 स्मार्ट बाज़ार सहायक।',
    
    // Products Page
    browseProducts: 'उत्पाद ब्राउज़ करें',
    productsAvailable: 'उत्पाद उपलब्ध हैं',
    searchForProducts: 'उत्पाद खोजें...',
    noProductsFound: 'कोई उत्पाद नहीं मिला',
    tryAdjusting: 'अपनी खोज या फ़िल्टर मानदंड समायोजित करने का प्रयास करें',
    all: 'सभी',
    bakery: 'बेकरी',
    dairy: 'डेयरी',
    fruits: 'फल',
    vegetables: 'सब्जियां',
    spreads: 'स्प्रेड',
    beverages: 'पेय पदार्थ',
    grains: 'अनाज',
    snacks: 'स्नैक्स',
    cooking: 'खाना पकाना',
    
    // Product Card
    addToCart: 'कार्ट में डालें',
    onlyLeft: 'केवल',
    expiresIn: 'समाप्त होता है',
    days: 'दिनों में',
    aisle: 'गलियारा',
    
    // Checkout Page
    yourCart: 'आपका कार्ट',
    continueShopping: 'खरीदारी जारी रखें',
    cartIsEmpty: 'आपका कार्ट खाली है',
    startAddingItems: 'स्वादिष्ट आइटम जोड़ना शुरू करें!',
    browseProductsBtn: 'उत्पाद ब्राउज़ करें',
    frequentlyBoughtTogether: 'अक्सर एक साथ खरीदे गए',
    orderSummary: 'ऑर्डर सारांश',
    verified: 'सत्यापित',
    subtotal: 'उप-कुल',
    items: 'आइटम',
    gst: 'जीएसटी (5%)',
    total: 'कुल',
    payNow: 'अभी भुगतान करें',
    scanningItems: 'आइटम स्कैन हो रहे हैं...',
    paymentSuccessful: 'भुगतान सफल!',
    thankYouShopping: 'स्मार्ट बाज़ार के साथ खरीदारी करने के लिए धन्यवाद',
    billSentTo: 'बिल भेजा गया:',
    downloadBill: 'बिल डाउनलोड करें (PDF)',
    shareViaWhatsApp: 'व्हाट्सएप पर शेयर करें',
    
    // Admin Page
    adminLogin: 'एडमिन लॉगिन',
    email: 'ईमेल',
    password: 'पासवर्ड',
    signIn: 'साइन इन',
    invalidCredentials: 'अमान्य क्रेडेंशियल। कृपया पुनः प्रयास करें।',
    adminDashboard: 'एडमिन डैशबोर्ड',
    manageInventory: 'अपनी स्मार्ट बाज़ार इन्वेंटरी और ग्राहकों को प्रबंधित करें',
    addProduct: 'उत्पाद जोड़ें',
    totalProducts: 'कुल उत्पाद',
    lowStock: 'कम स्टॉक',
    nearExpiry: 'समाप्ति के निकट',
    customersToday: 'आज के ग्राहक',
    lowStockAlert: 'कम स्टॉक अलर्ट',
    allProductsWellStocked: 'सभी उत्पाद अच्छी तरह से स्टॉक में हैं!',
    left: 'बाकी',
    nearExpiryItems: 'समाप्ति के निकट आइटम',
    noProductsNearExpiry: 'समाप्ति के निकट कोई उत्पाद नहीं!',
    expires: 'समाप्ति:',
    customerInsights: 'ग्राहक इनसाइट्स',
    today: 'आज',
    phoneNumber: 'फोन नंबर',
    time: 'समय',
    totalSpend: 'कुल खर्च',
    productManagement: 'उत्पाद प्रबंधन',
    inStock: 'स्टॉक में',
    signOut: 'साइन आउट',
    
    // Product Form Modal
    editProduct: 'उत्पाद संपादित करें',
    addNewProduct: 'नया उत्पाद जोड़ें',
    productName: 'उत्पाद का नाम',
    brand: 'ब्रांड',
    price: 'कीमत (रु.)',
    originalPrice: 'मूल कीमत',
    stockQuantity: 'स्टॉक मात्रा',
    offerTag: 'ऑफर टैग',
    category: 'श्रेणी',
    expiryDate: 'समाप्ति तिथि',
    productImage: 'उत्पाद छवि',
    imageUrl: 'छवि URL',
    updateProduct: 'उत्पाद अपडेट करें',
    
    // Aisle Map
    storeMap: 'स्टोर मैप',
    finding: 'खोज रहे हैं:',
    entrance: 'प्रवेश',
    checkout: 'चेकआउट',
    yourItem: 'आपका आइटम',
    otherAisles: 'अन्य गलियारे',
    
    // OTP Modal
    verifyToContinue: 'जारी रखने के लिए सत्यापित करें',
    enterEmailToReceiveOTP: 'वन-टाइम पासवर्ड प्राप्त करने के लिए अपना ईमेल पता दर्ज करें',
    emailAddress: 'ईमेल पता',
    enterYourEmail: 'अपना ईमेल दर्ज करें',
    sendOTP: 'OTP भेजें',
    enterOTPSentTo: 'भेजे गए 6-अंकीय OTP दर्ज करें',
    enterOTP: 'OTP दर्ज करें',
    enterSixDigitOTP: '6-अंकीय OTP दर्ज करें',
    checkEmailForOTP: 'OTP कोड के लिए अपना ईमेल इनबॉक्स जांचें',
    verifyAndContinue: 'सत्यापित करें और जारी रखें',
    changeEmail: 'ईमेल बदलें',
    verifying: 'सत्यापित हो रहा है...',
    sendingOTP: 'OTP भेजा जा रहा है...',
    termsOfService: 'जारी रखकर, आप हमारी सेवा की शर्तों से सहमत होते हैं',
    otpSentToEmail: 'आपके ईमेल पर OTP भेजा गया',
    otpExpired: 'OTP समाप्त हो गया है। कृपया नया अनुरोध करें।',
    invalidOTP: 'अमान्य OTP। कृपया पुनः प्रयास करें।',
    resendOTP: 'OTP पुनः भेजें',
    resendIn: 'पुनः भेजें',
    seconds: 'सेकंड में',
    maxResendAttempts: 'अधिकतम पुनः भेजने के प्रयास समाप्त। कृपया बाद में पुनः प्रयास करें।',
    
    // Delete Dialog
    deleteProduct: 'उत्पाद हटाएं',
    deleteConfirmation: 'क्या आप वाकई इस उत्पाद को हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।',
    cancel: 'रद्द करें',
    delete: 'हटाएं',
    counterAvailable: 'खाली',
    minWait: 'मिनट प्रतीक्षा',
    counterOffline: 'ऑफलाइन',
    countersAvailable: 'काउंटर उपलब्ध',
    fastest: 'सबसे तेज',
    billingCounterStatus: 'बिलिंग काउंटर स्थिति',
    inQueue: 'कतार में',
    liveUpdates: 'लाइव अपडेट',
    enterYourName: 'अपना नाम दर्ज करें',
    errorCreatingSession: 'सत्र बनाने में त्रुटि',
    sessionCreated: 'सत्र बनाया गया!',
    enterNameAndCode: 'नाम और कोड दर्ज करें',
    invalidSessionCode: 'अमान्य सत्र कोड',
    joinedSession: 'परिवार सत्र में शामिल हुए!',
    leftSession: 'सत्र छोड़ दिया',
    members: 'सदस्य',
    familySync: 'परिवार सिंक',
    familySyncMode: 'परिवार सिंक मोड',
    yourName: 'आपका नाम',
    createNewSession: 'नया सत्र बनाएं',
    or: 'या',
    enterSessionCode: 'सत्र कोड दर्ज करें',
    joinExistingSession: 'मौजूदा सत्र में शामिल हों',
    sessionCode: 'सत्र कोड',
    sharedCart: 'साझा कार्ट',
    addedBy: 'द्वारा जोड़ा गया',
    noItemsYet: 'अभी तक कोई आइटम नहीं',
    leaveSession: 'सत्र छोड़ें',
    errorSendingRequest: 'अनुरोध भेजने में त्रुटि',
    helpRequestSent: 'सहायता अनुरोध भेजा गया!',
    findHelp: 'सहायता खोजें',
    silentAssistance: 'मौन सहायता',
    helpOnTheWay: 'सहायता आ रही है!',
    staffWillAssist: 'स्टाफ जल्द ही सहायता करेगा',
    requestHelpSilently: 'बिना बोले सहायता मांगें',
    helpInAisle: 'गलियारे में सहायता',
    helpFindingProduct: 'उत्पाद खोजने में सहायता',
    generalAssistance: 'सामान्य सहायता',
    whichAisle: 'आप किस गलियारे में हैं?',
    whatProduct: 'कौन सा उत्पाद खोज रहे हैं?',
    enterProductName: 'उत्पाद का नाम दर्ज करें',
    additionalMessage: 'अतिरिक्त संदेश',
    describeNeed: 'अपनी जरूरत बताएं',
    sending: 'भेजा जा रहा है...',
    requestHelp: 'सहायता मांगें',
    pricePerUnit: 'प्रति यूनिट मूल्य',
    showOnMap: 'नक्शे पर दिखाएं',
    frequentlyAsked: 'अक्सर पूछे जाने वाले',
    counterUpdated: 'काउंटर अपडेट किया गया',
    counterManagement: 'काउंटर प्रबंधन',
    available: 'उपलब्ध',
    busy: 'व्यस्त',
    offline: 'ऑफलाइन',
    waitTime: 'प्रतीक्षा समय',
    min: 'मिनट',
    newHelpRequest: 'नया सहायता अनुरोध!',
    requestResolved: 'अनुरोध हल किया गया',
    requestAssigned: 'अनुरोध सौंपा गया',
    helpRequests: 'सहायता अनुरोध',
    pending: 'लंबित',
    noHelpRequests: 'कोई सहायता अनुरोध नहीं',
    aisleHelp: 'गलियारा सहायता',
    findProduct: 'उत्पाद खोजें',
    generalHelp: 'सामान्य सहायता',
    assign: 'सौंपें',
    error: 'त्रुटि',
    pleaseEnterEmail: 'कृपया अपना ईमेल पता दर्ज करें',
    magicLinkSent: 'मैजिक लिंक भेजा गया!',
    checkYourEmail: 'लॉगिन लिंक के लिए अपना ईमेल जांचें',
    failedToSendLink: 'मैजिक लिंक भेजने में विफल',
    checkYourInbox: 'अपना इनबॉक्स जांचें',
    magicLinkSentTo: 'हमने मैजिक लिंक भेजा है',
    clickLinkToLogin: 'लॉगिन करने के लिए ईमेल में लिंक पर क्लिक करें',
    tryDifferentEmail: 'दूसरा ईमेल आज़माएं',
    signInToCheckout: 'चेकआउट के लिए साइन इन करें',
    enterEmailForMagicLink: 'मैजिक लिंक प्राप्त करने के लिए अपना ईमेल दर्ज करें',
    sendMagicLink: 'मैजिक लिंक भेजें',
    pleaseEnterName: 'कृपया अपना पूरा नाम दर्ज करें',
    profileCompleted: 'प्रोफ़ाइल पूर्ण!',
    welcomeToSmartBazaar: 'स्मार्ट बाज़ार में आपका स्वागत है',
    failedToUpdateProfile: 'प्रोफ़ाइल अपडेट करने में विफल',
    completeYourProfile: 'अपनी प्रोफ़ाइल पूर्ण करें',
    almostThere: 'आप लगभग वहाँ हैं! बस कुछ और विवरण।',
    loggedInAs: 'लॉगिन किया हुआ',
    fullName: 'पूरा नाम',
    enterFullName: 'अपना पूरा नाम दर्ज करें',
    optional: 'वैकल्पिक',
    saving: 'सहेजा जा रहा है...',
    completeProfile: 'प्रोफ़ाइल पूर्ण करें',
    customerDashboard: 'ग्राहक डैशबोर्ड',
    searchCustomers: 'ग्राहक खोजें...',
    totalCustomers: 'कुल ग्राहक',
    goldMembers: 'गोल्ड सदस्य',
    totalRevenue: 'कुल राजस्व',
    avgLTV: 'औसत LTV',
    noCustomersYet: 'अभी तक कोई ग्राहक नहीं।',
    customer: 'ग्राहक',
    status: 'स्थिति',
    tier: 'टियर',
    ltv: 'LTV',
    lastVisit: 'अंतिम विज़िट',
    profileInfo: 'प्रोफ़ाइल जानकारी',
    purchaseInsights: 'खरीद इनसाइट्स',
    totalOrders: 'कुल ऑर्डर',
    avgOrderValue: 'औसत ऑर्डर मूल्य',
    lifetimeValue: 'जीवनकाल मूल्य',
    frequentItems: 'अक्सर खरीदे गए',
    behavioralInsights: 'व्यवहार इनसाइट्स',
    visitFrequency: 'विज़िट आवृत्ति',
    paymentMethod: 'पसंदीदा भुगतान',
    adminNotes: 'एडमिन नोट्स',
    edit: 'संपादित करें',
    recentOrders: 'हाल के ऑर्डर',
    editAdminNotes: 'एडमिन नोट्स संपादित करें',
    addNotesForCustomer: 'आंतरिक नोट्स जोड़ें',
    enterNotes: 'नोट्स दर्ज करें...',
    notesSaved: 'नोट्स सहेजे गए',
    adminNotesUpdated: 'एडमिन नोट्स अपडेट किए गए',
    save: 'सहेजें',
    loginSuccessful: 'लॉगिन सफल',
    completePaymentMessage: 'अब आप भुगतान पूरा कर सकते हैं।',
    loggedOutSuccessfully: 'सफलतापूर्वक लॉग आउट हो गया',
    
    // Find Help additional
    pleaseSelectLocation: 'कृपया अपना स्थान चुनें या दर्ज करें',
    yourCurrentLocation: 'आपका वर्तमान स्थान',
    selectLocation: 'अपना स्थान चुनें',
    typeYourLocation: 'अपना स्थान टाइप करें...',
    
    // Weight-based products
    enterWeight: 'वज़न दर्ज करें',
    perKg: 'प्रति किलो',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('smartbazaar-language');
    return (stored as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('smartbazaar-language', lang);
  };

  useEffect(() => {
    const stored = localStorage.getItem('smartbazaar-language');
    if (stored && (stored === 'en' || stored === 'kn' || stored === 'hi')) {
      setLanguageState(stored);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const languageNames: Record<Language, string> = {
  en: 'English',
  kn: 'ಕನ್ನಡ',
  hi: 'हिंदी',
};
