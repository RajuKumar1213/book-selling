"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

import {
  User,
  Phone,
  Calendar,
  LogOut,
  Package,
  Clock,
  Eye,
  Truck,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ChefHat,
  CreditCard,
  Banknote,
  Edit3,
  Shield,
  Bell,
  Gift,
  Star,
  X,
  Save,
} from "lucide-react";
import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import ReviewModal from "@/components/ReviewModal";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  discountedPrice?: number;
  quantity: number;
  selectedWeight?: string;
  imageUrl: string;
}

interface CustomerInfo {
  fullName: string;
  mobileNumber: string;
  deliveryDate: string;
  timeSlot: string;
  area: string;
  pinCode: string;
  fullAddress: string;
}

interface Order {
  _id: string;
  orderId: string;
  items: OrderItem[];
  customerInfo: CustomerInfo;
  totalAmount: number;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "out_for_delivery"
    | "delivered"
    | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  paymentMethod: "razorpay" | "cod";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  paymentCompletedAt?: string;
  createdAt: string;
  notes?: string;
}

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");

  // Review modal state
  const [reviewModal, setReviewModal] = useState({
    isOpen: false,
    productId: "",
    productName: "",
    productImage: "",
    orderId: "",
  });

  // Check if user already reviewed a product
  const [reviewedProducts, setReviewedProducts] = useState<Set<string>>(
    new Set()
  );

  // Edit profile modal state
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchOrders();
      checkReviewedProducts();
      // Initialize profile data
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [user]);

  const checkReviewedProducts = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/reviews/check?userId=${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReviewedProducts(new Set(data.reviewedProductIds || []));
      }
    } catch (error) {
      console.error("Error checking reviewed products:", error);
    }
  };

  const openEditProfile = () => {
    setShowEditProfile(true);
  };

  const closeEditProfile = () => {
    setShowEditProfile(false);
    // Reset to original values
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  };

  const handleProfileInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveProfileChanges = async () => {
    if (!user) return;

    setEditingProfile(true);
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phoneNumber, // Map phoneNumber to phone for API
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update user context if available
        // For now, we'll just close the modal
        setShowEditProfile(false);
        // You might want to refresh the page or update the user context here
        alert('Profile updated successfully!');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setEditingProfile(false);
    }
  };

  const openReviewModal = (
    productId: string,
    productName: string,
    productImage: string,
    orderId: string
  ) => {
    setReviewModal({
      isOpen: true,
      productId,
      productName,
      productImage,
      orderId,
    });
  };

  const closeReviewModal = () => {
    setReviewModal({
      isOpen: false,
      productId: "",
      productName: "",
      productImage: "",
      orderId: "",
    });
  };

  const handleReviewSubmitted = () => {
    // Refresh reviewed products and orders
    checkReviewedProducts();
    fetchOrders();
    closeReviewModal();
  };

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);

      // Only fetch orders for the current user by mobile number
      if (!user?.phoneNumber) {
        console.error("User phone number not available");
        return;
      }

      const response = await fetch(
        `/api/orders?mobile=${encodeURIComponent(user.phoneNumber)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "preparing":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "out_for_delivery":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "preparing":
        return <ChefHat className="w-4 h-4" />;
      case "out_for_delivery":
        return <Truck className="w-4 h-4" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getPaymentIcon = (method: string) => {
    return method === "cod" ? (
      <Banknote className="w-4 h-4" />
    ) : (
      <CreditCard className="w-4 h-4" />
    );
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50  ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="animate-pulse space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-16 bg-gray-200 rounded-xl"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50 ">
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 rounded-2xl p-8 text-white mb-8 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
                    <User className="w-10 h-10 md:w-12 md:h-12 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">
                      My Profile
                    </h1>
                    <p className="text-pink-100 text-sm md:text-base mb-2">
                      Welcome back to Cakes Wow!
                    </p>
                    <div className="flex items-center gap-2 text-pink-100">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm md:text-base">
                        {user.phoneNumber}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={openEditProfile}
                    className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all flex items-center gap-2 text-sm">
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                  <button
                    onClick={logout}
                    className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all flex items-center gap-2 text-sm">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex-1 px-4 md:px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === "orders"
                    ? "bg-pink-50 text-pink-600 border-b-2 border-pink-500"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}>
                <Package className="w-5 h-5 inline-block mr-2" />
                <span className="hidden sm:inline">My Orders</span>
                <span className="sm:hidden">Orders</span>
                <span className="ml-1">({orders.length})</span>
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex-1 px-4 md:px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === "settings"
                    ? "bg-pink-50 text-pink-600 border-b-2 border-pink-500"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}>
                <Shield className="w-5 h-5 inline-block mr-2" />
                Settings
              </button>
            </div>
          </div>

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              {loadingOrders ? (
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 text-center">
                  <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading your orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-12 text-center">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No orders yet
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Start browsing our delicious cakes and place your first
                    order!
                  </p>
                  <button
                    onClick={() => router.push("/")}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-medium rounded-lg hover:from-pink-600 hover:to-orange-600 transition-all transform hover:scale-105">
                    Browse Cakes
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Order Header */}
                        <div className="flex items-start gap-4">
                          {order.items?.[0]?.imageUrl && (
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              <Image
                                src={order.items[0].imageUrl}
                                alt={order.items[0].name}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 truncate">
                                Order #{order.orderId}
                              </h3>
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                                  order.status
                                )}`}>
                                {getStatusIcon(order.status)}
                                {order.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {order.items?.length} item
                              {order.items?.length !== 1 ? "s" : ""} • ₹
                              {order.totalAmount}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-2">
                              <Calendar className="w-3 h-3" />
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Order Actions */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            {getPaymentIcon(order.paymentMethod)}
                            <span>{order.paymentMethod.toUpperCase()}</span>
                          </div>
                          <Link href={`/order-confirmation/${order.orderId}`}>
                            <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-pink-600 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors">
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                          </Link>
                        </div>
                      </div>

                      {/* Order Items Preview */}
                      {order.items && order.items.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="space-y-3">
                            {order.items.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <ChefHat className="w-4 h-4" />
                                  <span>{item.name}</span>
                                  {item.selectedWeight && (
                                    <span className="text-xs text-gray-500">
                                      ({item.selectedWeight})
                                    </span>
                                  )}
                                </div>

                                {/* Write Review Button for Delivered Products */}
                                {order.status?.toLowerCase() === "delivered" && (
                                  <div className="flex items-center gap-2">
                                    {reviewedProducts.has(item.productId) ? (
                                      <span onClick={() =>
                                          openReviewModal(
                                            item.productId,
                                            item.name,
                                            item.imageUrl,
                                            order._id
                                          )
                                        } className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                                        <Star className="w-3 h-3 fill-current" />
                                        Reviewed
                                      </span>
                                    ) : (
                                      <button
                                        onClick={() =>
                                          openReviewModal(
                                            item.productId,
                                            item.name,
                                            item.imageUrl,
                                            order._id
                                          )
                                        }
                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-pink-500 to-orange-500 rounded-full hover:from-pink-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-sm">
                                        <Star className="w-3 h-3" />
                                        Write Review
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              {/* Account Information */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Account Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">Phone Number</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {user?.phoneNumber}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">Member Since</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-gray-700">Account Status</span>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Preferences
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-gray-700 block">
                          Order Notifications
                        </span>
                        <span className="text-sm text-gray-500">
                          Get updates about your orders
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Gift className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-gray-700 block">
                          Promotional Offers
                        </span>
                        <span className="text-sm text-gray-500">
                          Receive special deals and discounts
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-red-100">
                <h3 className="text-lg font-semibold text-red-600 mb-4">
                  Danger Zone
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <span className="text-gray-700 block font-medium">
                        Delete Account
                      </span>
                      <span className="text-sm text-gray-500">
                        Permanently delete your account and all data
                      </span>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Review Modal */}
        <ReviewModal
          isOpen={reviewModal.isOpen}
          onClose={closeReviewModal}
          productId={reviewModal.productId}
          productName={reviewModal.productName}
          productImage={reviewModal.productImage}
          userId={user?.id}
          userName={user?.name}
          userEmail={user?.email}
          orderId={reviewModal.orderId}
          onReviewSubmitted={handleReviewSubmitted}
        />

        {/* Edit Profile Modal */}
        {showEditProfile && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-pink-500" />
                  Edit Profile
                </h2>
                <button
                  onClick={closeEditProfile}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-4">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={profileData.name}
                    onChange={(e) => handleProfileInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={profileData.email}
                    onChange={(e) => handleProfileInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="Enter your email address"
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={profileData.phoneNumber}
                    onChange={(e) => handleProfileInputChange('phoneNumber', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                <button
                  onClick={closeEditProfile}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveProfileChanges}
                  disabled={editingProfile}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg hover:from-pink-600 hover:to-orange-600 transition-all disabled:opacity-50"
                >
                  {editingProfile ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {editingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
