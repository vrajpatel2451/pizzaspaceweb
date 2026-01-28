"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Calendar,
  LogOut,
  ShoppingBag,
  MapPin,
  ChevronRight,
  Edit3,
  Crown,
  Loader2,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUser, useAuthStore } from "@/store";
import { clearAuthCookie } from "@/lib/actions/auth";
import { updateUser } from "@/lib/api";

interface QuickAction {
  label: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const quickActions: QuickAction[] = [
  {
    label: "My Orders",
    description: "View your order history",
    href: "/order",
    icon: ShoppingBag,
  },
  {
    label: "Saved Addresses",
    description: "Manage delivery addresses",
    href: "/addresses",
    icon: MapPin,
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const user = useUser();
  const { logout, setUser } = useAuthStore();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLogout = async () => {
    try {
      // Clear server-side cookie
      await clearAuthCookie();
      // Clear client-side store
      logout();
      // Navigate to home
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleEditOpen = () => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
      });
      setFormErrors({ name: "", email: "", phone: "" });
    }
    setIsEditOpen(true);
  };

  const validateForm = () => {
    const errors = { name: "", email: "", phone: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await updateUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });

      if (response.statusCode === 200 && response.data) {
        setUser(response.data);
        setIsEditOpen(false);
      } else {
        setFormErrors((prev) => ({
          ...prev,
          email: response.errorMessage || "Failed to update profile",
        }));
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      setFormErrors((prev) => ({
        ...prev,
        email: "An unexpected error occurred",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-white dark:bg-slate-950 pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20 min-h-screen overflow-hidden"
      aria-labelledby="profile-heading"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-orange-100 dark:bg-orange-500/5 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-orange-100 dark:bg-orange-500/5 rounded-full blur-3xl opacity-60" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-50 dark:bg-orange-500/3 rounded-full blur-3xl opacity-40" />
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
        <div>
          {/* Premium Header Section */}
          <div
            className={`text-center mb-10 transition-all duration-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            } motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0`}
          >
            {/* Badge */}
            <div
              className={`mb-5 transition-all duration-500 delay-100 ${
                isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-3"
              } motion-reduce:transition-none`}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
                <User className="w-3.5 h-3.5" />
                My Account
              </span>
            </div>

            {/* Headline */}
            <h1
              id="profile-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Your{" "}
              <span className="text-orange-500 relative">
                Profile
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-orange-300 dark:text-orange-500/50"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 8 Q 25 0, 50 8 T 100 8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
              Manage your account details, view orders, and customize your Pizza
              Space experience.
            </p>

            {/* Decorative divider */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <span className="w-12 h-0.5 bg-gradient-to-r from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
              <span className="w-2 h-2 bg-orange-400 dark:bg-orange-500 rounded-full" />
              <span className="w-12 h-0.5 bg-gradient-to-l from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
            </div>
          </div>

          {/* Profile Card */}
          <div
            className={`transition-all duration-500 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            } motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0`}
          >
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 rounded-2xl overflow-hidden mb-6">
              {/* Profile Header with Avatar */}
              <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 px-6 py-8 sm:px-8 sm:py-10">
                {/* Decorative pattern */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                />

                <div className="relative flex flex-col sm:flex-row items-center gap-5">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-3xl sm:text-4xl font-bold border-4 border-white/30 shadow-xl">
                      {getInitials(user.name)}
                    </div>
                    {/* Member badge */}
                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-1.5 shadow-lg">
                      <Crown className="w-5 h-5 text-orange-500" />
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="text-center sm:text-left text-white">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-1">
                      {user.name}
                    </h2>
                    <p className="text-white/80 flex items-center justify-center sm:justify-start gap-2">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </p>
                  </div>

                  {/* Edit Profile Button */}
                  <div className="sm:ml-auto">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
                      onClick={handleEditOpen}
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-orange-500" />
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Full Name
                    </p>
                    <p className="text-slate-900 dark:text-white font-medium">
                      {user.name}
                    </p>
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Email Address
                    </p>
                    <p className="text-slate-900 dark:text-white font-medium">
                      {user.email}
                    </p>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Phone Number
                    </p>
                    <p className="text-slate-900 dark:text-white font-medium flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      {user.phone || "Not provided"}
                    </p>
                  </div>

                  {/* Member Since */}
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Member Since
                    </p>
                    <p className="text-slate-900 dark:text-white font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <time dateTime={user.createdAt}>
                        {formatDate(user.createdAt)}
                      </time>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div
            className={`transition-all duration-500 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            } motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0`}
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-500" />
              Quick Actions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {quickActions.map((action) => (
                <Link key={action.href} href={action.href}>
                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-orange-200 dark:hover:border-orange-500/30 rounded-xl group cursor-pointer h-full">
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform duration-300">
                        <action.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">
                          {action.label}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {action.description}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Sign Out Section */}
          <div
            className={`transition-all duration-500 delay-400 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            } motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0`}
          >
            <Separator className="my-6" />

            <Card className="bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-500/20 rounded-xl">
              <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h4 className="font-semibold text-slate-900 dark:text-white">
                    Sign Out
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    End your current session securely
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="w-full sm:w-auto"
                  aria-label="Sign out of your account"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your personal information below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              error={formErrors.name}
              leftIcon={<User className="w-4 h-4" />}
              placeholder="Enter your full name"
            />
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              error={formErrors.email}
              leftIcon={<Mail className="w-4 h-4" />}
              placeholder="Enter your email"
            />
            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              error={formErrors.phone}
              leftIcon={<Phone className="w-4 h-4" />}
              placeholder="Enter your phone number"
            />
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
