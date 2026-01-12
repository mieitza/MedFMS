'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/lib/stores/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Truck, Shield, Fuel, Wrench, User } from 'lucide-react';

const PIN_LENGTH = 4;

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading, checkAuth } = useAuthStore();

  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const usernameRef = useRef<HTMLInputElement>(null);
  const pinInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Check if already authenticated
  useEffect(() => {
    const check = async () => {
      const isValid = await checkAuth();
      if (isValid) {
        router.push('/');
      }
      setIsCheckingAuth(false);
    };
    check();
  }, [checkAuth, router]);

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated && !isCheckingAuth) {
      router.push('/');
    }
  }, [isAuthenticated, isCheckingAuth, router]);

  // Auto-focus username input
  useEffect(() => {
    if (!isCheckingAuth && usernameRef.current) {
      usernameRef.current.focus();
    }
  }, [isCheckingAuth]);

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newPin = pin.split('');
    newPin[index] = value.slice(-1); // Take only last character
    const updatedPin = newPin.join('').slice(0, PIN_LENGTH);
    setPin(updatedPin);
    setError('');

    // Move to next input
    if (value && index < PIN_LENGTH - 1) {
      pinInputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when complete
    if (updatedPin.length === PIN_LENGTH && username) {
      handleSubmit(username, updatedPin);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      pinInputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      pinInputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < PIN_LENGTH - 1) {
      pinInputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, PIN_LENGTH);
    setPin(pastedData);
    if (pastedData.length === PIN_LENGTH && username) {
      handleSubmit(username, pastedData);
    } else if (pastedData.length > 0) {
      pinInputRefs.current[Math.min(pastedData.length, PIN_LENGTH - 1)]?.focus();
    }
  };

  const handleUsernameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && username) {
      e.preventDefault();
      pinInputRefs.current[0]?.focus();
    }
  };

  const handleSubmit = async (user: string = username, pinCode: string = pin) => {
    if (!user) {
      setError('Introduceți numele de utilizator');
      usernameRef.current?.focus();
      return;
    }

    if (pinCode.length !== PIN_LENGTH) {
      setError('Introduceți codul PIN complet');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await login(user, pinCode);
      // Use window.location to ensure full page reload and proper state hydration
      window.location.href = '/';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Credențiale invalide');
      setPin('');
      pinInputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-slate-400">Se verifică sesiunea...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo and title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 mb-4">
            <Truck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">MedFMS</h1>
          <p className="text-slate-400">Fleet Management System</p>
        </motion.div>

        {/* Login card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-xl shadow-2xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl text-white">Autentificare</CardTitle>
              <CardDescription className="text-slate-400">
                Introduceți credențialele pentru a continua
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                className="space-y-6"
              >
                {/* Username Input */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="space-y-2"
                >
                  <Label htmlFor="username" className="text-slate-300">
                    Utilizator
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      ref={usernameRef}
                      id="username"
                      type="text"
                      placeholder="Nume utilizator"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setError('');
                      }}
                      onKeyDown={handleUsernameKeyDown}
                      disabled={isLoading}
                      className="pl-10 h-12 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
                    />
                  </div>
                </motion.div>

                {/* PIN Input */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="space-y-2"
                >
                  <Label className="text-slate-300">Cod PIN</Label>
                  <div className="flex justify-center gap-3" onPaste={handlePaste}>
                    {Array.from({ length: PIN_LENGTH }).map((_, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: 0.35 + index * 0.05 }}
                      >
                        <input
                          ref={(el) => { pinInputRefs.current[index] = el; }}
                          type="password"
                          inputMode="numeric"
                          maxLength={1}
                          value={pin[index] || ''}
                          onChange={(e) => handlePinChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          disabled={isLoading}
                          className={`
                            w-14 h-14 text-center text-2xl font-semibold rounded-xl
                            border-2 transition-all duration-200
                            bg-slate-900/50 text-white
                            focus:outline-none focus:ring-2 focus:ring-blue-500/50
                            disabled:opacity-50 disabled:cursor-not-allowed
                            ${pin[index] ? 'border-blue-500' : 'border-slate-600'}
                            ${error ? 'border-red-500 animate-shake' : ''}
                          `}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Error message */}
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit button */}
                <Button
                  type="submit"
                  disabled={isLoading || !username || pin.length !== PIN_LENGTH}
                  className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Se autentifică...
                    </>
                  ) : (
                    'Autentificare'
                  )}
                </Button>

                {/* Keyboard hint */}
                <p className="text-center text-xs text-slate-500">
                  Introduceți utilizatorul și codul PIN pentru a vă autentifica
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 flex justify-center gap-6"
        >
          {[
            { icon: Truck, label: 'Vehicule' },
            { icon: Fuel, label: 'Combustibil' },
            { icon: Wrench, label: 'Mentenanță' },
            { icon: Shield, label: 'Securitate' },
          ].map((feature) => (
            <div
              key={feature.label}
              className="flex flex-col items-center gap-1 text-slate-500"
            >
              <feature.icon className="h-5 w-5" />
              <span className="text-xs">{feature.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 text-center text-xs text-slate-600"
        >
          © 2024 MedFMS. Toate drepturile rezervate.
        </motion.p>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
