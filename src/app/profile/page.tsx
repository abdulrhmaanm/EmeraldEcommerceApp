'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, User, Lock, Phone, Mail, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { UpdateUserProfile, UpdateUserPassword } from '@/app/apis/profileApi';
import Link from 'next/link';

const profileFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be valid'),
});
type ProfileFormPayload = z.infer<typeof profileFormSchema>;

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(6, 'Current password is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    rePassword: z.string().min(6, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords don't match",
    path: ['rePassword'],
  });
type PasswordFormPayload = z.infer<typeof passwordFormSchema>;

function InputWithIcon({
  icon: Icon, ...props
}: { icon: React.ElementType } & React.ComponentProps<typeof Input>) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <Input {...props} className={`pl-10 h-12 rounded-xl border-gray-200 bg-gray-50/50 focus:border-emerald-500 focus:ring-emerald-500 ${props.className ?? ''}`} />
    </div>
  );
}

export default function ProfilePage() {
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const profileForm = useForm<ProfileFormPayload>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { name: '', email: '', phone: '' },
  });

  const passwordForm = useForm<PasswordFormPayload>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: { currentPassword: '', password: '', rePassword: '' },
  });

  async function onSubmitProfile(values: ProfileFormPayload) {
    setLoadingProfile(true);
    const res = await UpdateUserProfile(values);
    if (res.success) { toast.success(res.message); } else { toast.error(res.message); }
    setLoadingProfile(false);
  }

  async function onSubmitPassword(values: PasswordFormPayload) {
    setLoadingPassword(true);
    const res = await UpdateUserPassword(values);
    if (res.success) {
      toast.success(res.message);
      passwordForm.reset();
    } else {
      toast.error(res.message);
    }
    setLoadingPassword(false);
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-gray-100 shadow-sm p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <User className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Signed in</p>
            <p className="font-bold text-gray-900 text-sm">My Account</p>
          </div>
        </div>
        <nav className="space-y-1">
          {[
            { href: '/profile', label: 'Profile Settings', icon: User },
            { href: '/allorders', label: 'My Orders', icon: ShieldCheck },
            { href: '/whishlist', label: 'Wishlist', icon: Mail },
            { href: '/cart', label: 'Cart', icon: Lock },
          ].map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 lg:p-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Profile Info */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
              <User className="w-6 h-6 text-emerald-600" /> Edit Profile
            </h2>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-5">
                <FormField control={profileForm.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">Full Name</FormLabel>
                    <FormControl>
                      <InputWithIcon icon={User} placeholder="Your Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={profileForm.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">Email</FormLabel>
                    <FormControl>
                      <InputWithIcon icon={Mail} type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={profileForm.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">Phone</FormLabel>
                    <FormControl>
                      <InputWithIcon icon={Phone} placeholder="01XXXXXXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={loadingProfile}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white h-12 px-8 rounded-xl font-bold flex items-center gap-2 transition shadow-lg shadow-emerald-600/20 disabled:opacity-70"
                  >
                    {loadingProfile ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                    {loadingProfile ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </Form>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
              <Lock className="w-6 h-6 text-emerald-600" /> Change Password
            </h2>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-5">
                {(['currentPassword', 'password', 'rePassword'] as const).map((field) => (
                  <FormField key={field} control={passwordForm.control} name={field} render={({ field: f }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        {field === 'currentPassword' ? 'Current Password' : field === 'password' ? 'New Password' : 'Confirm New Password'}
                      </FormLabel>
                      <FormControl>
                        <InputWithIcon icon={Lock} type="password" placeholder="••••••••" {...f} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                ))}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={loadingPassword}
                    className="bg-gray-900 hover:bg-black text-white h-12 px-8 rounded-xl font-bold flex items-center gap-2 transition disabled:opacity-70"
                  >
                    {loadingPassword ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                    {loadingPassword ? 'Updating…' : 'Update Password'}
                  </button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
}
