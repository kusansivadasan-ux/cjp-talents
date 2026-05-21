'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SkillsInput } from '@/components/SkillsInput'
import { ThankYou } from '@/components/sections/ThankYou'

// ─── Options ───────────────────────────────────────────────────────────────

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
]

const EDUCATION_OPTIONS = [
  '10th / SSLC', '12th / HSC', 'Diploma', "Bachelor's Degree",
  "Master's Degree", 'MBA', 'PhD', 'Other',
]

const DOMAIN_OPTIONS = [
  'Technology & Engineering', 'Product & Design', 'Marketing & Growth',
  'Sales & Business Development', 'Operations & Supply Chain',
  'Finance & Accounting', 'Human Resources', 'Legal & Compliance',
  'Content & Media', 'Research & Analytics', 'Healthcare',
  'Education & Edtech', 'Agriculture & Agritech', 'Manufacturing',
  'Social Impact & NGO', 'Other',
]

// ─── Schema ─────────────────────────────────────────────────────────────────

const schema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  city: z.string().min(2, 'Enter your city'),
  state: z.string().min(1, 'Select your state'),
  education: z.string().optional(),
  college: z.string().optional(),
  domain: z.string().optional(),
  skills: z.array(z.string()).default([]),
  purpose: z.enum(['job', 'cofounder', 'both'], { error: 'Select your purpose' }),
  aspiration: z.string().max(120, 'Max 120 characters').optional(),
})

type FormValues = z.infer<typeof schema>

// ─── Shared styled select ────────────────────────────────────────────────────

function NativeSelect({
  value,
  onChange,
  placeholder,
  options,
  error,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  options: string[]
  error?: string
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={[
        'h-9 w-full rounded-lg border px-2.5 py-1 text-sm outline-none transition-colors',
        'bg-[#1A1A1A] text-[#F5F5F5]',
        error ? 'border-red-500' : 'border-white/10',
        'focus:border-[#E8540A] focus:ring-2 focus:ring-[#E8540A]/20',
        !value ? 'text-white/30' : '',
      ].join(' ')}
    >
      <option value="" disabled hidden>{placeholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt} className="bg-[#1A1A1A] text-[#F5F5F5]">
          {opt}
        </option>
      ))}
    </select>
  )
}

// ─── Error message ───────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-red-400 text-xs mt-1">{message}</p>
}

// ─── Component ───────────────────────────────────────────────────────────────

export function SignupForm() {
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref') ?? undefined
  const isInvite = searchParams.get('inv') === '1'

  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{ displayNumber: number; referralCode: string } | null>(null)

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      skills: [],
    },
  })

  const purposeValue = watch('purpose')
  const aspirationValue = watch('aspiration') ?? ''

  async function onSubmit(data: FormValues) {
    setServerError(null)
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          referred_by: ref,
          is_priority_review: isInvite,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        setServerError(json.error ?? 'Something went wrong. Please try again.')
        return
      }
      setSuccess({ displayNumber: json.display_number, referralCode: json.referral_code })
    } catch {
      setServerError('Network error. Please check your connection and try again.')
    }
  }

  if (success) {
    return <ThankYou displayNumber={success.displayNumber} referralCode={success.referralCode} />
  }

  return (
    <section id="signup" className="py-20 px-4 bg-[#0D0D0D]">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          {isInvite && (
            <div className="inline-flex items-center gap-2 mb-4 bg-[#E8540A]/10 border border-[#E8540A]/30 rounded-full px-4 py-1.5">
              <span className="w-2 h-2 rounded-full bg-[#E8540A] animate-pulse" />
              <span className="text-[#E8540A] text-sm font-medium">Priority Review — You were invited</span>
            </div>
          )}
          <h2 className="text-3xl font-black text-[#F5E8D5] mb-2">Join the Movement</h2>
          <p className="text-[#F5E8D5]/50 text-sm">
            Apply for early access to CJP Talents — India&apos;s exclusive talent &amp; co-founder platform.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name */}
          <div>
            <Label htmlFor="full_name" className="text-[#F5E8D5]/70 mb-1.5">
              Full Name <span className="text-[#E8540A]">*</span>
            </Label>
            <Input
              id="full_name"
              {...register('full_name')}
              placeholder="Ravi Kumar"
              className="bg-[#1A1A1A] border-white/10 text-[#F5F5F5] placeholder:text-white/30 focus-visible:border-[#E8540A] focus-visible:ring-[#E8540A]/20"
            />
            <FieldError message={errors.full_name?.message} />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-[#F5E8D5]/70 mb-1.5">
              Email Address <span className="text-[#E8540A]">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="ravi@example.com"
              className="bg-[#1A1A1A] border-white/10 text-[#F5F5F5] placeholder:text-white/30 focus-visible:border-[#E8540A] focus-visible:ring-[#E8540A]/20"
            />
            <FieldError message={errors.email?.message} />
          </div>

          {/* Mobile */}
          <div>
            <Label htmlFor="mobile" className="text-[#F5E8D5]/70 mb-1.5">
              Mobile Number <span className="text-[#E8540A]">*</span>
            </Label>
            <div className="flex gap-2">
              <span className="inline-flex items-center px-3 rounded-lg border border-white/10 bg-[#1A1A1A] text-[#F5F5F5]/50 text-sm select-none">
                +91
              </span>
              <Input
                id="mobile"
                type="tel"
                maxLength={10}
                {...register('mobile')}
                placeholder="9876543210"
                className="bg-[#1A1A1A] border-white/10 text-[#F5F5F5] placeholder:text-white/30 focus-visible:border-[#E8540A] focus-visible:ring-[#E8540A]/20 flex-1"
              />
            </div>
            <FieldError message={errors.mobile?.message} />
          </div>

          {/* City + State */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="city" className="text-[#F5E8D5]/70 mb-1.5">
                City <span className="text-[#E8540A]">*</span>
              </Label>
              <Input
                id="city"
                {...register('city')}
                placeholder="Mumbai"
                className="bg-[#1A1A1A] border-white/10 text-[#F5F5F5] placeholder:text-white/30 focus-visible:border-[#E8540A] focus-visible:ring-[#E8540A]/20"
              />
              <FieldError message={errors.city?.message} />
            </div>
            <div>
              <Label className="text-[#F5E8D5]/70 mb-1.5">
                State <span className="text-[#E8540A]">*</span>
              </Label>
              <Controller
                name="state"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <NativeSelect
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select state"
                    options={INDIAN_STATES}
                    error={errors.state?.message}
                  />
                )}
              />
              <FieldError message={errors.state?.message} />
            </div>
          </div>

          {/* Education */}
          <div>
            <Label className="text-[#F5E8D5]/70 mb-1.5">Education</Label>
            <Controller
              name="education"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <NativeSelect
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  placeholder="Select your highest qualification"
                  options={EDUCATION_OPTIONS}
                />
              )}
            />
          </div>

          {/* College */}
          <div>
            <Label htmlFor="college" className="text-[#F5E8D5]/70 mb-1.5">College / University</Label>
            <Input
              id="college"
              {...register('college')}
              placeholder="IIT Delhi, Anna University, etc."
              className="bg-[#1A1A1A] border-white/10 text-[#F5F5F5] placeholder:text-white/30 focus-visible:border-[#E8540A] focus-visible:ring-[#E8540A]/20"
            />
          </div>

          {/* Domain */}
          <div>
            <Label className="text-[#F5E8D5]/70 mb-1.5">Domain / Industry</Label>
            <Controller
              name="domain"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <NativeSelect
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  placeholder="Select your domain"
                  options={DOMAIN_OPTIONS}
                />
              )}
            />
          </div>

          {/* Skills */}
          <div>
            <Label className="text-[#F5E8D5]/70 mb-1.5">Skills</Label>
            <Controller
              name="skills"
              control={control}
              render={({ field }) => (
                <SkillsInput value={field.value} onChange={field.onChange} />
              )}
            />
          </div>

          {/* Purpose */}
          <div>
            <Label className="text-[#F5E8D5]/70 mb-2">
              What are you looking for? <span className="text-[#E8540A]">*</span>
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {(['job', 'cofounder', 'both'] as const).map((opt) => {
                const labels: Record<string, string> = {
                  job: 'Find a Job',
                  cofounder: 'Find Co-founder',
                  both: 'Both',
                }
                const isActive = purposeValue === opt
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setValue('purpose', opt, { shouldValidate: true })}
                    className={[
                      'rounded-lg border py-2.5 text-sm font-medium transition-all',
                      isActive
                        ? 'border-[#E8540A] bg-[#E8540A]/10 text-[#E8540A]'
                        : 'border-white/10 bg-[#1A1A1A] text-[#F5F5F5]/60 hover:border-white/20 hover:text-[#F5F5F5]',
                    ].join(' ')}
                  >
                    {labels[opt]}
                  </button>
                )
              })}
            </div>
            <FieldError message={errors.purpose?.message} />
          </div>

          {/* Aspiration */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label htmlFor="aspiration" className="text-[#F5E8D5]/70">
                What&apos;s your big aspiration?
              </Label>
              <span className="text-[#F5F5F5]/30 text-xs">{aspirationValue.length}/120</span>
            </div>
            <Textarea
              id="aspiration"
              {...register('aspiration')}
              placeholder="Build India's top B2B SaaS company, land a product role at a unicorn…"
              maxLength={120}
              className="bg-[#1A1A1A] border-white/10 text-[#F5F5F5] placeholder:text-white/30 focus-visible:border-[#E8540A] focus-visible:ring-[#E8540A]/20 resize-none"
            />
            <FieldError message={errors.aspiration?.message} />
          </div>

          {/* Server error */}
          {serverError && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400 text-sm">
              {serverError}
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-[#E8540A] hover:bg-[#E8540A]/90 text-white font-bold text-base disabled:opacity-60"
          >
            {isSubmitting ? 'Submitting…' : 'Apply for Early Access →'}
          </Button>

          <p className="text-center text-[#F5F5F5]/25 text-xs">
            By applying you agree to our terms. No spam — ever.
          </p>
        </form>
      </div>
    </section>
  )
}
