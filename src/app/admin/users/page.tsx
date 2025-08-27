'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import AdminNavbar from '@/components/AdminNavbar';
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  Phone,
  Calendar,
  ShoppingBag,
  Trash2
} from 'lucide-react';
import { Spinner } from '@/components';

interface User {
  id: string;
  phoneNumber: string;
  name?: string;
  email?: string;
  status: 'active' | 'inactive' | 'banned';
  joinedDate: string;
  lastLogin: string;
  totalOrders: number;
  totalSpent: number;
  orderCount: number;
  isVerified: boolean;
  addressCount?: number;
  lastOrderDate?: string;
  orderStatistics?: {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    firstOrderDate: string;
    lastOrderDate: string;
  };
  recentOrders?: Array<{
    orderId: string;
    totalPrice: number;
    status: string;
    createdAt: string;
    items: any[];
  }>;
  address?: Array<{
    receiverName: string;
    city: string;
    pinCode: string;
    fullAddress: string;
    phoneNumber: string;
    addressType: string;
  }>;
}

const UserCard = ({ user, onEdit, onBan, onActivate, onViewDetails, onDelete }: {
  user: User;
  onEdit: (user: User) => void;
  onBan: (userId: string) => void;
  onActivate: (userId: string) => void;
  onViewDetails: (user: User) => void;
  onDelete: (userId: string) => void;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'banned': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {user.name || 'User'}
            </h3>
            <div className="flex items-center gap-1 text-gray-600">
              <Phone className="w-4 h-4" />
              <span className="text-sm">{user.phoneNumber}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
          </span>
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px]">
                <button
                  onClick={() => {
                    onViewDetails(user);
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                <button
                  onClick={() => {
                    onEdit(user);
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit User
                </button>
                {user.status === 'active' ? (
                  <button
                    onClick={() => {
                      onBan(user.id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                  >
                    <Ban className="w-4 h-4" />
                    Deactivate User
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onActivate(user.id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-green-600"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Activate User
                  </button>
                )}
                <button
                  onClick={() => {
                    onDelete(user.id);
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete User
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Joined</p>
          <p className="font-medium flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(user.joinedDate).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Last Login</p>
          <p className="font-medium">{new Date(user.lastLogin).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-gray-500">Total Orders</p>
          <p className="font-medium flex items-center gap-1">
            <ShoppingBag className="w-4 h-4" />
            {user.totalOrders}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Total Spent</p>
          <p className="font-medium text-green-600">₹{typeof user.totalSpent === 'number' ? user.totalSpent.toLocaleString() : '0'}</p>
        </div>
      </div>
    </div>
  );
};

const UserDetailsModal = ({ user, isOpen, onClose }: {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">User Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{user.name || 'User'}</h3>
              <p className="text-gray-600">{user.phoneNumber}</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                user.status === 'active' ? 'bg-green-100 text-green-800' :
                user.status === 'banned' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Account Information</h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">Phone:</span> {user.phoneNumber}</p>
                <p><span className="text-gray-500">Email:</span> {user.email || 'Not provided'}</p>
                <p><span className="text-gray-500">Verified:</span> {user.isVerified ? 'Yes' : 'No'}</p>
                <p><span className="text-gray-500">Joined:</span> {new Date(user.joinedDate).toLocaleDateString()}</p>
                <p><span className="text-gray-500">Last Login:</span> {new Date(user.lastLogin).toLocaleDateString()}</p>
                <p><span className="text-gray-500">Addresses:</span> {user.addressCount || 0}</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Order Statistics</h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">Total Orders:</span> {user.orderStatistics?.totalOrders || user.totalOrders}</p>
                <p><span className="text-gray-500">Total Spent:</span> ₹{
                  typeof (user.orderStatistics?.totalSpent ?? user.totalSpent) === 'number'
                    ? (user.orderStatistics?.totalSpent ?? user.totalSpent).toLocaleString()
                    : '0'
                }</p>
                <p><span className="text-gray-500">Average Order:</span> ₹{
                  typeof (user.orderStatistics?.averageOrderValue ?? (user.totalOrders > 0 ? user.totalSpent / user.totalOrders : 0)) === 'number'
                    ? Math.round(user.orderStatistics?.averageOrderValue ?? (user.totalOrders > 0 ? user.totalSpent / user.totalOrders : 0)).toLocaleString()
                    : '0'
                }</p>
                {user.orderStatistics?.firstOrderDate && (
                  <p><span className="text-gray-500">First Order:</span> {new Date(user.orderStatistics.firstOrderDate).toLocaleDateString()}</p>
                )}
                {user.orderStatistics?.lastOrderDate && (
                  <p><span className="text-gray-500">Last Order:</span> {new Date(user.orderStatistics.lastOrderDate).toLocaleDateString()}</p>
                )}
                <p><span className="text-gray-500">Status:</span> {
                  (user.orderStatistics?.totalSpent || user.totalSpent) > 50000 ? 'VIP Customer' :
                  (user.orderStatistics?.totalSpent || user.totalSpent) > 20000 ? 'Premium Customer' :
                  (user.orderStatistics?.totalSpent || user.totalSpent) > 5000 ? 'Regular Customer' :
                  'New Customer'
                }</p>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          {user.recentOrders && user.recentOrders.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Recent Orders</h4>
              <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                <div className="space-y-2">
                  {user.recentOrders.map((order, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <div>
                        <span className="font-medium">{order.orderId}</span>
                        <span className="ml-2 text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">₹{typeof order.totalPrice === 'number' ? order.totalPrice.toLocaleString() : '0'}</div>
                        <div className={`text-xs ${
                          order.status === 'delivered' ? 'text-green-600' :
                          order.status === 'cancelled' ? 'text-red-600' :
                          'text-orange-600'
                        }`}>
                          {order.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Addresses */}
          {user.address && user.address.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Saved Addresses</h4>
              <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                <div className="space-y-3">
                  {user.address.map((addr, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium">{addr.receiverName} ({addr.addressType})</div>
                      <div className="text-gray-600">{addr.fullAddress}</div>
                      <div className="text-gray-500">{addr.city} - {addr.pinCode}</div>
                      <div className="text-gray-500">📞 {addr.phoneNumber}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function AdminUsersPage() {
  const { showSuccess, showError } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNextPage: false,
    hasPrevPage: false
  });


  // Only run fetchUsers when user is ready and not loading, and when search/filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers(1);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter]);
  
  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50',
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter })
      });

      const response = await fetch(`/api/users?${params}`);
      const data = await response.json();


      if (data.success) {
        setUsers(data.users);
        setPagination(data.pagination);
      } else {
        showError('Failed to fetch users', data.error);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showError('Failed to fetch users', 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (user: User) => {
    // For now, just show success message - implement edit modal later
    showSuccess(`Edit functionality for ${user.name || 'User'} will be implemented`, 'Coming soon');
  };

  const handleBanUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'deactivate' })
      });

      const data = await response.json();

      if (data.success) {
        setUsers(users.map(user =>
          user.id === userId ? { ...user, status: 'inactive' as const } : user
        ));
        showSuccess('User has been deactivated', 'User status updated successfully');
      } else {
        showError('Failed to deactivate user', data.error);
      }
    } catch (error) {
      console.error('Error deactivating user:', error);
      showError('Failed to deactivate user', 'Please try again');
    }
  };

  const handleActivateUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'activate' })
      });

      const data = await response.json();

      if (data.success) {
        setUsers(users.map(user =>
          user.id === userId ? { ...user, status: 'active' as const } : user
        ));
        showSuccess('User has been activated', 'User status updated successfully');
      } else {
        showError('Failed to activate user', data.error);
      }
    } catch (error) {
      console.error('Error activating user:', error);
      showError('Failed to activate user', 'Please try again');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setUsers(users.filter(user => user.id !== userId));
        showSuccess('User deleted successfully', 'User has been removed from the system');
      } else {
        showError('Failed to delete user', data.error);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      showError('Failed to delete user', 'Please try again');
    }
  };

  const handleViewDetails = async (user: User) => {
    try {
      // Fetch detailed user information
      const response = await fetch(`/api/users/${user.id}`);
      const data = await response.json();

      if (data.success) {
        setSelectedUser(data.user);
        setIsDetailsModalOpen(true);
      } else {
        showError('Failed to fetch user details', data.error);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      showError('Failed to fetch user details', 'Please try again');
    }
  };


  if(!users) {
    return (
      <Spinner/>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Notice */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-green-900 mb-1">User Management System Active</h3>
              <p className="text-sm text-green-700">
                Real user data is now being loaded from the database. You can view, activate/deactivate, and delete users.
                User statistics are calculated from their actual order history.
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={handleEditUser}
              onBan={handleBanUser}
              onActivate={handleActivateUser}
              onViewDetails={handleViewDetails}
              onDelete={handleDeleteUser}
            />
          ))}
        </div>

        {users.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Pagination */}
        {/* Show pagination if 50 users are fetched (page is full) or more than 1 page */}
        {(users.length === 50 || pagination.totalPages > 1) && (
          <div className="flex flex-col items-center gap-2 mt-8">
            <div className="flex justify-center items-center gap-2 flex-wrap">
              <button
                onClick={() => fetchUsers(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              {/* Page numbers */}
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => fetchUsers(pageNum)}
                  className={`px-3 py-2 rounded-lg border mx-0.5 ${pagination.currentPage === pageNum ? 'bg-orange-500 text-white border-orange-500 font-semibold' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                  disabled={pagination.currentPage === pageNum}
                >
                  {pageNum}
                </button>
              ))}
              <button
                onClick={() => fetchUsers(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
              <span className="text-sm text-gray-600 ml-2">
                Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalUsers} total users)
              </span>
            </div>
          </div>
        )}
      </main>

      {/* User Details Modal */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </div>
  );
}
