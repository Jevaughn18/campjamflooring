import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Star, Trash2, Lock, Mail, KeyRound, AlertTriangle, UserPlus, Users, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface AdminUser {
  id: number;
  email: string;
  is_active: boolean;
  created_at: string;
}

interface DeleteConfirmation {
  isOpen: boolean;
  reviewId: number | null;
  reviewText: string;
}

const Admin = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmation>({
    isOpen: false,
    reviewId: null,
    reviewText: ""
  });
  const [showAdminManagement, setShowAdminManagement] = useState(false);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        checkIfAdmin(session.user.email!).then(isAdmin => {
          if (isAdmin) {
            setUser(session.user);
          } else {
            toast({
              title: "Access Denied",
              description: "You are not authorized to access this panel.",
              variant: "destructive",
            });
            supabase.auth.signOut();
          }
        });
      }
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        checkIfAdmin(session.user.email!).then(isAdmin => {
          if (isAdmin) {
            setUser(session.user);
          }
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchReviews();
      if (showAdminManagement) {
        fetchAdminUsers();
      }
    }
  }, [user, showAdminManagement]);

  const checkIfAdmin = async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('email, is_active')
        .eq('email', email.toLowerCase())
        .eq('is_active', true)
        .single();

      return !error && data !== null;
    } catch {
      return false;
    }
  };

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error",
        description: "Failed to load reviews.",
        variant: "destructive",
      });
    }
  };

  const fetchAdminUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdminUsers(data || []);
    } catch (error) {
      console.error('Error fetching admin users:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if email is in admin_users table
      const isAdmin = await checkIfAdmin(email);
      if (!isAdmin) {
        toast({
          title: "Access Denied",
          description: "This email is not authorized to access the admin panel.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      toast({
        title: "Welcome Back!",
        description: "You've successfully logged in.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Login failed. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    const DEFAULT_PASSWORD = "CampJam2025!";

    try {
      // Add to whitelist
      const { data: insertData, error: dbError } = await supabase
        .from('admin_users')
        .insert([
          {
            email: newAdminEmail.toLowerCase(),
            created_by: user.email,
          }
        ])
        .select();

      if (dbError) {
        throw dbError;
      }

      toast({
        title: "Admin Added Successfully!",
        description: `${newAdminEmail} can now log in with password: ${DEFAULT_PASSWORD}`,
        duration: 10000,
      });

      setNewAdminEmail("");
      fetchAdminUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add admin.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveAdmin = async (adminEmail: string) => {
    if (adminEmail === user.email) {
      toast({
        title: "Error",
        description: "You cannot remove yourself.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('email', adminEmail);

      if (error) throw error;

      toast({
        title: "Admin Removed",
        description: `${adminEmail} no longer has admin access.`,
      });

      fetchAdminUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove admin.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You've been successfully logged out.",
    });
  };

  const openDeleteConfirm = (id: number, comment: string) => {
    setDeleteConfirm({
      isOpen: true,
      reviewId: id,
      reviewText: comment
    });
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirm({
      isOpen: false,
      reviewId: null,
      reviewText: ""
    });
  };

  const handleDelete = async () => {
    if (!deleteConfirm.reviewId) return;

    setDeletingId(deleteConfirm.reviewId);
    closeDeleteConfirm();

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', deleteConfirm.reviewId);

      if (error) throw error;

      setReviews(reviews.filter(review => review.id !== deleteConfirm.reviewId));
      toast({
        title: "Review Deleted",
        description: "The review has been permanently deleted.",
      });
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: "Error",
        description: "Failed to delete review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? "fill-primary text-primary" : "text-muted-foreground"}
      />
    ));
  };

  // Login Screen
  if (!user) {
    return (
      <div className="min-h-screen bg-secondary/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-md soft-shadow">
          <CardContent className="p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-primary" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-center mb-2">Admin Login</h1>
            <p className="text-muted-foreground text-center mb-6">
              Sign in to manage customer reviews
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isLoading ? "Please wait..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Delete Confirmation Dialog
  const DeleteConfirmDialog = () => {
    if (!deleteConfirm.isOpen) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
        onClick={closeDeleteConfirm}
      >
        <Card
          className="w-full max-w-md mx-4 soft-shadow"
          onClick={(e) => e.stopPropagation()}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Delete Review?</h3>
                <p className="text-sm text-muted-foreground">This action cannot be undone</p>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg mb-6">
              <p className="text-sm text-foreground italic">
                "{deleteConfirm.reviewText.substring(0, 150)}{deleteConfirm.reviewText.length > 150 ? '...' : ''}"
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={closeDeleteConfirm}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="flex-1"
              >
                Delete Review
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Admin Dashboard
  return (
    <>
      <DeleteConfirmDialog />

      <div className="min-h-screen bg-secondary/30 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-muted-foreground">Logged in as: {user.email}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAdminManagement(!showAdminManagement)}
                >
                  <Users size={18} className="mr-2" />
                  Manage Admins
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </div>

            {showAdminManagement && (
              <Card className="mb-8 soft-shadow">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Manage Admin Users</h2>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-900">
                      <strong>How to add a new admin:</strong><br />
                      1. Enter their email below and click "Add Admin"<br />
                      2. Give them the default password shown in the success message<br />
                      3. They can log in with their email and the default password<br />
                      <br />
                      <strong>Default Password:</strong> CampJam2025!
                    </p>
                  </div>

                  <form onSubmit={handleAddAdmin} className="mb-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">New Admin Email</label>
                      <div className="flex gap-2">
                        <Input
                          type="email"
                          value={newAdminEmail}
                          onChange={(e) => setNewAdminEmail(e.target.value)}
                          placeholder="new@email.com"
                          required
                          className="flex-1"
                        />
                        <Button type="submit">
                          <UserPlus size={18} className="mr-2" />
                          Add Admin
                        </Button>
                      </div>
                    </div>
                  </form>

                  <div className="space-y-2">
                    <h3 className="font-medium mb-3">Admin Emails</h3>
                    {adminUsers.map((admin) => (
                      <div
                        key={admin.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <span className="text-sm">{admin.email}</span>
                        {admin.email !== user.email && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveAdmin(admin.email)}
                            title="Remove admin"
                          >
                            <X size={18} />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id} className="soft-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex gap-1">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(review.created_at)}
                            </span>
                          </div>

                          <p className="text-foreground mb-3 italic">"{review.comment}"</p>

                          <p className="font-semibold text-foreground">— {review.name}</p>
                        </div>

                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => openDeleteConfirm(review.id, review.comment)}
                          disabled={deletingId === review.id}
                          className="flex-shrink-0"
                        >
                          {deletingId === review.id ? (
                            <span className="animate-spin">⏳</span>
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">No reviews yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
