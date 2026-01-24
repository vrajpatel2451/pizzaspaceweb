'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TextArea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createContactQuery } from '@/lib/api/contact-queries';
import type { ContactSubject } from '@/types';

// Form validation schema
const contactFormSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  phone: z
    .string()
    .regex(/^[\d\s()+-]+$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  subject: z
    .string()
    .min(1, 'Please select a subject'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(500, 'Message must be less than 500 characters'),
  acceptPrivacy: z
    .boolean()
    .refine((val) => val === true, {
      message: 'You must accept the privacy policy',
    }),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm() {
  const [formStatus, setFormStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      acceptPrivacy: false,
    },
  });

  const acceptPrivacy = watch('acceptPrivacy');
  const subject = watch('subject');

  const onSubmit = async (data: ContactFormData) => {
    setFormStatus('submitting');
    setErrorMessage('');

    try {
      // Call the actual contact query API
      const response = await createContactQuery({
        name: data.fullName,
        email: data.email,
        phone: data.phone || undefined,
        subject: data.subject as ContactSubject,
        message: data.message,
      });

      if (response.statusCode === 200 || response.statusCode === 201) {
        // Success
        setFormStatus('success');
        reset();

        // Reset success message after 5 seconds
        setTimeout(() => {
          setFormStatus('idle');
        }, 5000);
      } else if (response.statusCode === 429) {
        setFormStatus('error');
        setErrorMessage('Too many requests. Please wait before trying again.');
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      setFormStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');

      // Reset error after 5 seconds
      setTimeout(() => {
        setFormStatus('idle');
        setErrorMessage('');
      }, 5000);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Send Us a Message
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          We&apos;d love to hear from you. Fill out the form below and we&apos;ll get back to you soon.
        </p>
      </div>

      {/* Success/Error Messages */}
      {formStatus === 'success' && (
        <div
          className={cn(
            "mb-6 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg flex items-start gap-3",
            "animate-in fade-in-0 slide-in-from-top-2 duration-300"
          )}
        >
          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-green-800 dark:text-green-400">
              Message sent successfully!
            </p>
            <p className="text-sm text-green-600 dark:text-green-500 mt-1">
              We&apos;ll get back to you within 24 hours.
            </p>
          </div>
        </div>
      )}

      {formStatus === 'error' && (
        <div
          className={cn(
            "mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg flex items-start gap-3",
            "animate-in fade-in-0 slide-in-from-top-2 duration-300"
          )}
        >
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800 dark:text-red-400">
              Error sending message
            </p>
            <p className="text-sm text-red-600 dark:text-red-500 mt-1">
              {errorMessage}
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Full Name */}
        <div>
          <Input
            id="fullName"
            label="Full Name"
            placeholder="John Doe"
            autoComplete="name"
            error={errors.fullName?.message}
            {...register('fullName')}
          />
        </div>

        {/* Email & Phone Row */}
        <div className="grid sm:grid-cols-2 gap-5">
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="john@example.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            id="phone"
            label="Phone (Optional)"
            type="tel"
            placeholder="+44 20 1234 5678"
            autoComplete="tel"
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>

        {/* Subject Dropdown */}
        <div className="space-y-1.5">
          <label
            htmlFor="subject"
            className="text-sm font-medium text-slate-900 dark:text-white"
          >
            Subject
          </label>
          <Select
            value={subject}
            onValueChange={(value) => setValue('subject', value, { shouldValidate: true })}
          >
            <SelectTrigger
              id="subject"
              className="w-full h-10 bg-white dark:bg-slate-900"
              aria-invalid={!!errors.subject}
            >
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general inquiry">General Inquiry</SelectItem>
              <SelectItem value="order issue">Order Issue</SelectItem>
              <SelectItem value="feedback">Feedback</SelectItem>
              <SelectItem value="reservation">Reservation</SelectItem>
              <SelectItem value="general complaint">General Complaint</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.subject && (
            <p className="text-xs text-red-500">{errors.subject.message}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <TextArea
            id="message"
            label="Message"
            placeholder="Tell us more about your inquiry..."
            rows={5}
            maxLength={500}
            showCharCount
            error={errors.message?.message}
            {...register('message')}
          />
        </div>

        {/* Privacy Policy Checkbox */}
        <div className="flex items-start gap-3">
          <Checkbox
            id="acceptPrivacy"
            checked={acceptPrivacy}
            onCheckedChange={(checked) =>
              setValue('acceptPrivacy', checked as boolean, { shouldValidate: true })
            }
            aria-invalid={!!errors.acceptPrivacy}
          />
          <div className="flex-1">
            <label
              htmlFor="acceptPrivacy"
              className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              I agree to the{' '}
              <a
                href="/privacy"
                className="text-orange-500 hover:text-orange-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>{' '}
              and{' '}
              <a
                href="/terms"
                className="text-orange-500 hover:text-orange-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service
              </a>
            </label>
            {errors.acceptPrivacy && (
              <p className="text-xs text-red-500 mt-1">
                {errors.acceptPrivacy.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={formStatus === 'submitting'}
        >
          {formStatus === 'submitting' ? (
            'Sending...'
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send Message
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
