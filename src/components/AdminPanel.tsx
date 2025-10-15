import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAppStore } from '../store/appStore';

interface PendingUser {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  created_at: string;
}

const AdminPanel: React.FC = () => {
  const { currentUser } = useAppStore();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch pending users
  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching pending users:', error);
      } else {
        setPendingUsers(data || []);
      }
    } catch (err) {
      console.error('[AdminPanel] Exception:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'hq_admin') {
      fetchPendingUsers();
    }
  }, [currentUser]);

  const handleApprove = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          status: 'approved',
          approved_by: currentUser?.id,
          approved_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error approving user:', error);
        alert('Failed to approve user');
      } else {
        alert('User approved successfully!');
        fetchPendingUsers(); // Refresh the list
      }
    } catch (err) {
      console.error('Exception approving user:', err);
      alert('Failed to approve user');
    }
  };

  const handleReject = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error rejecting user:', error);
        alert('Failed to reject user');
      } else {
        alert('User rejected');
        fetchPendingUsers(); // Refresh the list
      }
    } catch (err) {
      console.error('Exception rejecting user:', err);
      alert('Failed to reject user');
    }
  };

  // Only show for admins
  if (currentUser?.role !== 'hq_admin') {
    return null;
  }

  return (
    <div className="bg-white dark:bg-black rounded-lg border border-green-300 dark:border-[#00ff41] p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-green-700 dark:text-[#00ff41] dark:font-mono flex items-center gap-2">
          <span className="text-lg">⏳</span>
          <span className="dark:hidden">Pending Approvals</span>
          <span className="hidden dark:inline">[PENDING_APPROVALS]</span>
        </h2>
        <button
          onClick={fetchPendingUsers}
          className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-[#00ff41] rounded-md hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors dark:font-mono text-xs"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 dark:border-[#00ff41] mx-auto mb-3"></div>
          <p className="text-green-700 dark:text-[#00ff41] dark:font-mono text-sm">Loading...</p>
        </div>
      ) : pendingUsers.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-green-600 dark:text-[#33ff66] dark:font-mono text-sm">
            <span className="dark:hidden">No pending approvals</span>
            <span className="hidden dark:inline">NO_PENDING_REQUESTS</span>
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingUsers.map((user) => (
            <div
              key={user.id}
              className="flex flex-col gap-3 p-3 bg-green-50 dark:bg-[#0a0e0a] rounded-lg border border-green-200 dark:border-[#00ff41]/30"
            >
              <div className="flex-1">
                <p className="font-semibold text-green-700 dark:text-[#00ff41] dark:font-mono text-sm">
                  {user.name}
                </p>
                <p className="text-xs text-green-600 dark:text-[#33ff66] dark:font-mono truncate">
                  {user.email}
                </p>
                <p className="text-xs text-green-500 dark:text-[#33ff66] dark:font-mono mt-1">
                  Role: <span className="uppercase">{user.role}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(user.id)}
                  className="flex-1 px-3 py-2 bg-green-600 dark:bg-[#00ff41] text-white dark:text-black rounded-md font-semibold hover:bg-green-700 dark:hover:bg-[#00dd37] transition-colors dark:font-mono text-xs"
                >
                  ✓ Approve
                </button>
                <button
                  onClick={() => handleReject(user.id)}
                  className="flex-1 px-3 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors dark:font-mono text-xs"
                >
                  ✗ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;