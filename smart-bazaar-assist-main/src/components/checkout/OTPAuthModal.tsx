import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Shield, ArrowRight, Loader2, Timer, RefreshCw } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';

interface OTPAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface OTPData {
  otp: string;
  expiryTime: number;
  isUsed: boolean;
}

const OTP_EXPIRY_SECONDS = 120; // 2 minutes
const MAX_RESEND_ATTEMPTS = 3;

const OTPAuthModal = ({ isOpen, onClose, onSuccess }: OTPAuthModalProps) => {
  const { setAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpData, setOtpData] = useState<OTPData | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [resendAttempts, setResendAttempts] = useState(0);

  // Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOTPEmail = useCallback(async (userEmail: string, generatedOTP: string) => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      throw new Error('EmailJS configuration is missing');
    }

    await emailjs.send(
      serviceId,
      templateId,
      {
        to_email: userEmail,
        otp: generatedOTP,
        message: `Your OTP is ${generatedOTP}. It is valid for 2 minutes. Do not share it with anyone.`,
      },
      publicKey
    );
  }, []);

  const handleSendOtp = async (isResend = false) => {
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (isResend && resendAttempts >= MAX_RESEND_ATTEMPTS) {
      setError(t.maxResendAttempts);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const generatedOTP = generateOTP();
      const expiryTime = Date.now() + (OTP_EXPIRY_SECONDS * 1000);

      await sendOTPEmail(email.trim(), generatedOTP);

      // Store OTP in state
      setOtpData({
        otp: generatedOTP,
        expiryTime,
        isUsed: false,
      });

      // Start countdown
      setCountdown(OTP_EXPIRY_SECONDS);

      if (isResend) {
        setResendAttempts((prev) => prev + 1);
      }

      toast.success(t.otpSentToEmail);
      setIsLoading(false);
      setStep('otp');
    } catch (err) {
      console.error('Error sending OTP:', err);
      setError('Failed to send OTP. Please try again.');
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    if (!otpData) {
      setError('No OTP data found. Please request a new OTP.');
      return;
    }

    setIsLoading(true);
    setError('');

    // Check if OTP is expired
    if (Date.now() > otpData.expiryTime) {
      setError(t.otpExpired);
      setIsLoading(false);
      return;
    }

    // Check if OTP is already used
    if (otpData.isUsed) {
      setError(t.invalidOTP);
      setIsLoading(false);
      return;
    }

    // Verify OTP
    if (otp === otpData.otp) {
      // Mark OTP as used (one-time use)
      setOtpData({ ...otpData, isUsed: true });

      // Authenticate user
      setAuthenticated(email.trim());
      toast.success('Verified successfully!');
      setIsLoading(false);
      onSuccess();
      onClose();
    } else {
      setError(t.invalidOTP);
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep('email');
    setEmail('');
    setOtp('');
    setError('');
    setOtpData(null);
    setCountdown(0);
    setResendAttempts(0);
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const canResend = countdown === 0 && resendAttempts < MAX_RESEND_ATTEMPTS;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-foreground/60 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            <Card variant="elevated">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  {t.verifyToContinue}
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={handleClose}>
                  <X className="w-5 h-5" />
                </Button>
              </CardHeader>
              <CardContent>
                {step === 'email' ? (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-primary" />
                      </div>
                      <p className="text-muted-foreground">
                        {t.enterEmailToReceiveOTP}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        {t.emailAddress}
                      </label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError('');
                        }}
                        placeholder={t.enterYourEmail}
                        className="h-12"
                      />
                    </div>

                    {error && (
                      <p className="text-sm text-destructive">{error}</p>
                    )}

                    <Button
                      variant="hero"
                      size="lg"
                      className="w-full"
                      onClick={() => handleSendOtp(false)}
                      disabled={isLoading || !validateEmail(email)}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          {t.sendingOTP}
                        </>
                      ) : (
                        <>
                          {t.sendOTP}
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      {t.termsOfService}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-8 h-8 text-primary" />
                      </div>
                      <p className="text-muted-foreground">
                        {t.enterOTPSentTo}
                      </p>
                      <p className="font-semibold text-foreground">{email}</p>
                    </div>

                    {/* Countdown Timer */}
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <Timer className="w-4 h-4 text-primary" />
                      <span className={`font-mono ${countdown <= 30 ? 'text-destructive' : 'text-foreground'}`}>
                        {formatTime(countdown)}
                      </span>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        {t.enterOTP}
                      </label>
                      <Input
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          setOtp(value);
                          setError('');
                        }}
                        placeholder={t.enterSixDigitOTP}
                        className="h-12 text-center text-2xl tracking-widest"
                      />
                    </div>

                    {error && (
                      <p className="text-sm text-destructive">{error}</p>
                    )}

                    <p className="text-sm text-muted-foreground text-center">
                      {t.checkEmailForOTP}
                    </p>

                    <Button
                      variant="hero"
                      size="lg"
                      className="w-full"
                      onClick={handleVerifyOtp}
                      disabled={isLoading || otp.length !== 6}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          {t.verifying}
                        </>
                      ) : (
                        t.verifyAndContinue
                      )}
                    </Button>

                    {/* Resend OTP */}
                    <div className="flex items-center justify-center">
                      {canResend ? (
                        <Button
                          variant="ghost"
                          className="text-primary"
                          onClick={() => handleSendOtp(true)}
                          disabled={isLoading}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          {t.resendOTP} ({MAX_RESEND_ATTEMPTS - resendAttempts} {t.left || 'left'})
                        </Button>
                      ) : countdown > 0 ? (
                        <p className="text-sm text-muted-foreground">
                          {t.resendIn} {formatTime(countdown)}
                        </p>
                      ) : (
                        <p className="text-sm text-destructive">
                          {t.maxResendAttempts}
                        </p>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={() => {
                        setStep('email');
                        setOtp('');
                        setError('');
                        setOtpData(null);
                        setCountdown(0);
                      }}
                    >
                      {t.changeEmail}
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OTPAuthModal;