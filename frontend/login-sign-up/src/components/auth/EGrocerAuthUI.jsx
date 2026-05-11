import React, { useState } from "react";
import {
  ShoppingCart,
  Store,
  ShieldCheck,
  User,
  Mail,
  Lock,
  Phone,
  Building2,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";

import logo from "../../logo.png";

export default function EGrocerAuthUI() {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("customer");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    storeName: "",
    storeDescription: "",
    businessLicenseNumber: "",
    department: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const roleCards = [
    {
      id: "customer",
      title: "Customer",
      icon: <ShoppingCart className="w-6 h-6" />,
      desc: "Shop fresh groceries and manage your orders.",
    },
    {
      id: "seller",
      title: "Seller Partner",
      icon: <Store className="w-6 h-6" />,
      desc: "Sell products and manage your grocery store.",
    },
  ];

  const [passwordStrength, setPasswordStrength] = useState(0);

  const getPasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length >= 8) score++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score++;
    if (/\d/.test(pass)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score++;
    return score;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      setPasswordStrength(getPasswordStrength(value));
    }
  };

  const validateForm = () => {
    if (mode === "signup") {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        return "Please enter a valid email address.";
      }

      // Phone validation (+92XXXXXXXXXX)
      const phoneRegex = /^\+92\d{10}$/;
      if (formData.phone && !phoneRegex.test(formData.phone)) {
        return "Phone number must be in format +923004249190 (Total 13 characters).";
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
    const payload = mode === "login"
      ? { email: formData.email, password: formData.password }
      : { ...formData, userType: role };

    try {
      const hostname = window.location.hostname;
      const response = await fetch(`http://${hostname}:5001${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Something went wrong");
      }

      // Clear any old session data from other sellers
      localStorage.clear();

      // Save token and user info
      localStorage.setItem("token", result.data.token);
      localStorage.setItem("user", JSON.stringify(result.data.user));

      alert(mode === "login" ? "Login successful!" : "Signup successful!");

      // Redirect based on role
      const userType = result.data.user.user_type || role;

      if (userType === "admin") {
        localStorage.clear();
        throw new Error("admin cant access from here");
      }

      if (userType === "customer") {
        window.location.href = `http://${hostname}:3000?userId=${result.data.user.user_id}&token=${result.data.token}`;
      } else if (userType === "seller") {
        window.location.href = `http://${hostname}:3001?sellerId=${result.data.user.user_id}&token=${result.data.token}`;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f8f5] flex">
      {/* LEFT SIDE */}
      <div
        className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2070&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative group">
              {/* Subtle Glow Effect */}
              <div className="absolute -inset-1 bg-[#2ECC71] rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>

              <img
                src={logo}
                alt="eGrocer Logo"
                className="relative w-16 h-16 object-contain rounded-2xl shadow-xl"
              />
            </div>
            <div>
              <h1 className="text-5xl font-extrabold tracking-tight">eGrocer</h1>
              <p className="text-white/70 text-lg">Fresh groceries delivered fast</p>
            </div>
          </div>

          <h2 className="text-6xl font-black leading-tight mb-6">
            Fresh Groceries <br />
            <span className="text-[#2ECC71]">Delivered To Your Doorstep</span>
          </h2>

          <p className="text-lg text-white/80 max-w-xl leading-relaxed">
            Join Pakistan's growing grocery marketplace. Customers shop smarter,
            sellers grow faster, and admins manage everything in one platform.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8">
          {/* TOP BAR */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-gray-500 mt-1">
                {mode === "login"
                  ? "Login to continue"
                  : "Choose your account type"}
              </p>
            </div>

            <button
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setError("");
              }}
              className="text-[#27AE60] font-semibold hover:text-[#1E8449]"
            >
              {mode === "login" ? "Sign Up" : "Login"}
            </button>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl">
              {error}
            </div>
          )}

          {/* ROLE SELECTOR */}
          {mode === "signup" && (
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {roleCards.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setRole(item.id)}
                  className={`border-2 rounded-2xl p-4 text-left transition-all ${role === item.id
                    ? "border-[#27AE60] bg-[#27AE60]/5"
                    : "border-gray-200 hover:border-[#27AE60]/30"
                    }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-[#27AE60]/10 text-[#27AE60] flex items-center justify-center mb-3">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                </button>
              ))}
            </div>
          )}

          {/* FORM */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* NAME ROW */}
            {mode === "signup" && (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    First Name
                  </label>
                  <div className="mt-2 relative">
                    <User className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Fahad"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#27AE60]"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Last Name
                  </label>
                  <div className="mt-2 relative">
                    <User className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Ahmad"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* EMAIL */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <div className="mt-2 relative">
                <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            {/* PHONE */}
            {mode === "signup" && (
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Phone Number
                </label>
                <div className="mt-2 relative">
                  <Phone className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+92 300 4249190"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            )}

            {/* SELLER FIELDS */}
            {mode === "signup" && role === "seller" && (
              <>
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Store Name
                  </label>
                  <div className="mt-2 relative">
                    <Building2 className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="storeName"
                      value={formData.storeName}
                      onChange={handleChange}
                      placeholder="Fresh Mart"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Store Description
                  </label>
                  <textarea
                    rows={4}
                    name="storeDescription"
                    value={formData.storeDescription}
                    onChange={handleChange}
                    placeholder="Tell customers about your store..."
                    className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Business License Number
                  </label>
                  <div className="mt-2 relative">
                    <BadgeCheck className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="businessLicenseNumber"
                      value={formData.businessLicenseNumber}
                      onChange={handleChange}
                      placeholder="BLN-009223"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </>
            )}

            {/* ADMIN EXTRA fields removed as Admin role is no longer selectable in signup */}

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="mt-2 relative">
                <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              {/* STRENGTH BAR */}
              {mode === "signup" && formData.password && (
                <div className="mt-3">
                  <div className="flex gap-1 h-1.5">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`flex-1 rounded-full transition-all duration-500 ${passwordStrength >= level
                          ? passwordStrength <= 1
                            ? "bg-red-500"
                            : passwordStrength <= 2
                              ? "bg-yellow-500"
                              : passwordStrength <= 3
                                ? "bg-blue-500"
                                : "bg-[#27AE60]"
                          : "bg-gray-100"
                          }`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-1.5">
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${passwordStrength <= 1 ? "text-red-500" :
                      passwordStrength <= 2 ? "text-yellow-600" :
                        passwordStrength <= 3 ? "text-blue-600" : "text-[#27AE60]"
                      }`}>
                      {passwordStrength === 0 && "Enter Password"}
                      {passwordStrength === 1 && "Very Weak"}
                      {passwordStrength === 2 && "Fair"}
                      {passwordStrength === 3 && "Strong"}
                      {passwordStrength === 4 && "Excellent"}
                    </p>
                    <p className="text-[10px] text-gray-400 italic">
                      Use Uppercase, Digits & Special Chars
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* LOGIN OPTIONS */}
            {mode === "login" && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600">
                  <input type="checkbox" />
                  Remember me
                </label>
                <button type="button" className="text-[#27AE60] font-semibold">
                  Forgot Password?
                </button>
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#27AE60] hover:bg-[#1E8449] disabled:bg-gray-400 transition-all text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2"
            >
              {isLoading ? "Processing..." : (mode === "login" ? "Login to eGrocer" : "Create Account")}
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-8 text-center text-gray-500 text-sm">
            By continuing you agree to our Terms &amp; Privacy Policy.
          </div>
        </div>
      </div>
    </div>
  );
}
