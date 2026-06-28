"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "../../src/components/ProtectedRoute";
import { PageWrapper } from "../../src/components/layout/page-wrapper";
import { Card, CardContent, CardHeader } from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { EmptyState } from "../../src/components/ui/empty-state";
import { Modal } from "../../src/components/ui/modal";
import { Input } from "../../src/components/ui/input";
import { useAuth } from "../../src/context/auth-context";
import { authService, type AuthResponse } from "../../src/services/auth.service";

interface Address {
  id: string;
  type: string;
  label: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [profileUser, setProfileUser] = React.useState<AuthResponse["user"] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [showEditProfile, setShowEditProfile] = React.useState(false);
  const [showChangePassword, setShowChangePassword] = React.useState(false);
  const [formLoading, setFormLoading] = React.useState(false);

  const [editName, setEditName] = React.useState("");
  const [editEmail, setEditEmail] = React.useState("");
  const [editPhone, setEditPhone] = React.useState("");
  const [editErrors, setEditErrors] = React.useState<{ name?: string; email?: string; phone?: string }>({});

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [passwordErrors, setPasswordErrors] = React.useState<{ currentPassword?: string; newPassword?: string; confirmPassword?: string }>({});

  const [addresses, setAddresses] = React.useState<Address[]>([]);
  const [showAddressModal, setShowAddressModal] = React.useState(false);
  const [editingAddress, setEditingAddress] = React.useState<Address | null>(null);
  const [addressForm, setAddressForm] = React.useState({ label: "", line1: "", line2: "", city: "", state: "", pincode: "" });
  const [addressErrors, setAddressErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.getMe();
      setProfileUser(response.data);
      setEditName(response.data.name);
      setEditEmail(response.data.email);
      setEditPhone(response.data.phone || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof editErrors = {};
    if (!editName.trim()) newErrors.name = "Full name is required";
    if (!editEmail.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editEmail)) newErrors.email = "Invalid email address";
    if (!editPhone.trim()) newErrors.phone = "Phone is required";
    else if (!/^[0-9]{10}$/.test(editPhone.replace(/\D/g, ""))) newErrors.phone = "Phone must be 10 digits";
    setEditErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setFormLoading(true);
    try {
      setProfileUser((prev) => prev ? { ...prev, name: editName, email: editEmail, phone: editPhone } : null);
      setShowEditProfile(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setFormLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof passwordErrors = {};
    if (!currentPassword) newErrors.currentPassword = "Current password is required";
    if (!newPassword) newErrors.newPassword = "New password is required";
    else if (newPassword.length < 8) newErrors.newPassword = "Password must be at least 8 characters";
    if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (newPassword !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setPasswordErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setFormLoading(true);
    try {
      setShowChangePassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setFormLoading(false);
    }
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setAddressForm({ label: "", line1: "", line2: "", city: "", state: "", pincode: "" });
    setAddressErrors({});
    setShowAddressModal(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressForm({ label: address.label, line1: address.line1, line2: address.line2, city: address.city, state: address.state, pincode: address.pincode });
    setAddressErrors({});
    setShowAddressModal(true);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!addressForm.label.trim()) newErrors.label = "Label is required";
    if (!addressForm.line1.trim()) newErrors.line1 = "Address line is required";
    if (!addressForm.city.trim()) newErrors.city = "City is required";
    if (!addressForm.state.trim()) newErrors.state = "State is required";
    if (!addressForm.pincode.trim()) newErrors.pincode = "Pincode is required";
    else if (!/^[0-9]{6}$/.test(addressForm.pincode)) newErrors.pincode = "Pincode must be 6 digits";
    setAddressErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    if (editingAddress) {
      setAddresses((prev) => prev.map((a) => (a.id === editingAddress.id ? { ...a, ...addressForm } : a)));
    } else {
      setAddresses((prev) => [...prev, { ...addressForm, id: crypto.randomUUID(), type: "shipping", isDefault: prev.length === 0 }]);
    }
    setShowAddressModal(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Logout failed");
    }
  };

  const displayUser = profileUser || user;

  if (loading) {
    return (
      <ProtectedRoute>
        <PageWrapper title="Profile" description="Manage your personal information">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              <p className="mt-4 text-gray-600">Loading profile...</p>
            </div>
          </div>
        </PageWrapper>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <PageWrapper
        title="Profile"
        description="Manage your personal information and preferences"
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setShowChangePassword(true)}>
              Change Password
            </Button>
            <Button variant="primary" size="sm" onClick={() => setShowEditProfile(true)}>
              Edit Profile
            </Button>
          </div>
        }
      >
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-600">{error}</p>
              <Button variant="ghost" size="sm" className="mt-2" onClick={fetchProfile}>
                Try Again
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                </CardHeader>
                <CardContent>
                  {displayUser ? (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="mt-1 font-medium text-gray-900">{displayUser.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="mt-1 font-medium text-gray-900">{displayUser.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="mt-1 font-medium text-gray-900">{displayUser.phone || "Not provided"}</p>
                      </div>
                    </div>
                  ) : (
                    <EmptyState title="No profile data" description="Profile information could not be loaded." />
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Saved Addresses</h2>
                      <p className="mt-1 text-sm text-gray-600">Manage your shipping and billing addresses</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleAddAddress}>
                      Add Address
                    </Button>
                  </div>

                  <div className="mt-6">
                    {addresses.length === 0 ? (
                      <EmptyState
                        title="No saved addresses"
                        description="You haven't added any addresses yet."
                        actionLabel="Add Address"
                        onAction={handleAddAddress}
                      />
                    ) : (
                      <div className="space-y-4">
                        {addresses.map((address) => (
                          <div key={address.id} className="rounded-lg border border-gray-200 p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-900">{address.label}</span>
                                  {address.isDefault && (
                                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">Default</span>
                                  )}
                                </div>
                                <p className="mt-1 text-sm text-gray-600">
                                  {address.line1}, {address.line2 && `${address.line2}, `}
                                  {address.city}, {address.state} - {address.pincode}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleEditAddress(address)}>
                                  Edit
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteAddress(address.id)}>
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900">Account Security</h2>
                  <div className="mt-4 flex items-center justify-between rounded-lg border border-gray-200 p-4">
                    <div>
                      <p className="font-medium text-gray-900">Password</p>
                      <p className="mt-1 text-sm text-gray-600">Change your account password</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setShowChangePassword(true)}>
                      Change Password
                    </Button>
                  </div>
                  <div className="mt-4 flex items-center justify-between rounded-lg border border-gray-200 p-4">
                    <div>
                      <p className="font-medium text-gray-900">Logout</p>
                      <p className="mt-1 text-sm text-gray-600">Sign out of your account</p>
                    </div>
                    <Button variant="destructive" size="sm" onClick={handleLogout}>
                      Logout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Modal isOpen={showEditProfile} onClose={() => setShowEditProfile(false)} title="Edit Profile" description="Update your personal information">
          <form onSubmit={handleEditProfile} className="space-y-4">
            <Input label="Full Name" value={editName} onChange={(e) => setEditName(e.target.value)} error={editErrors.name} required />
            <Input label="Email" type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} error={editErrors.email} required />
            <Input label="Phone" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} error={editErrors.phone} required />
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowEditProfile(false)} disabled={formLoading}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={formLoading}>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>

        <Modal isOpen={showChangePassword} onClose={() => setShowChangePassword(false)} title="Change Password" description="Update your account password">
          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input label="Current Password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} error={passwordErrors.currentPassword} required />
            <Input label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} error={passwordErrors.newPassword} required />
            <Input label="Confirm New Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={passwordErrors.confirmPassword} required />
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowChangePassword(false)} disabled={formLoading}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={formLoading}>
                Update Password
              </Button>
            </div>
          </form>
        </Modal>

        <Modal isOpen={showAddressModal} onClose={() => setShowAddressModal(false)} title={editingAddress ? "Edit Address" : "Add Address"} size="md">
          <form onSubmit={handleSaveAddress} className="space-y-4">
            <Input label="Label (e.g. Home, Office)" value={addressForm.label} onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })} error={addressErrors.label} required />
            <Input label="Address Line 1" value={addressForm.line1} onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })} error={addressErrors.line1} required />
            <Input label="Address Line 2" value={addressForm.line2} onChange={(e) => setAddressForm({ ...addressForm, line2: e.target.value })} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="City" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} error={addressErrors.city} required />
              <Input label="State" value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} error={addressErrors.state} required />
            </div>
            <Input label="Pincode" value={addressForm.pincode} onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })} error={addressErrors.pincode} required />
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowAddressModal(false)} disabled={formLoading}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={formLoading}>
                {editingAddress ? "Update Address" : "Add Address"}
              </Button>
            </div>
          </form>
        </Modal>
      </PageWrapper>
    </ProtectedRoute>
  );
}
