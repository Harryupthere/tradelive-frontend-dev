
export const API_ENDPOINTS = {
  login:'/auth/login',
  signup:'/auth/register',
  resetPassword:'/auth/reset-password',
  forgetPassword:'/auth/forgot-password',

  getNews:'/news',
  news_detail:'/news',

  //courses
  courses:'/products',
  courseOverview:'/products',
  courseOverviewFeedback:'/product-feedback',

  courseDetails:'/courses',


  enrollment:'/enrollments',

  usersProfile:'/users/profile',
  updateProfile:'/users/profile',
  updatePassword:'/users/password',
  uploadRequest:'/upload/request',

  paymentgateways:'/payment-gateways',
  stripeCreateSession:'/billing/stripe-session',
  checkPaymentStatus:'/billing/status',
  transactions:'/billing',
  getActivationCoupons:'/coupons',
  friendActivationCoupon:'/coupons/redeem-for',
  selfActivationCoupon:'/coupons/redeem',

  currencyLatest:'currency-convertor/latest?base=',
  currencyPairs:'currency-convertor/pairs?',//?base=EUR&target=USD
  currencySupportedCodes:'currency-convertor/supported-codes',
  currencyTables:'currency-convertor/tables',//?base=EUR&target=USD

  positionList:'position-size/list',
  positionSizeCalculator:'position-size/calculate',

  pipcalculator:"pip-calculator/calculate",

  marginCalculator:"margin-calculator",

  fibonacciCalculator:"fibonacci-calculator",

  pivotCalculato:'pivot-point-calculator',
  riskCalculator:'risk-of-ruin-calculator',

  compondCalculator:'compounding-calculator',

  drawdownCalculator:'drawdown-calculator',

  instructor:'instructors',
  instructors:'/instructor-scheduler',


  updateLectureProgress:'enrollments/progress'
};




