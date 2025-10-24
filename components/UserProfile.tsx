import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Settings, Mail, Calendar, Building, Briefcase } from 'lucide-react';
import { supabase, UserProfile as UserProfileType } from '../lib/supabase';

interface UserProfileProps {
  user: any;
  onSignOut: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onSignOut }) => {
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    company: '',
    role: '',
  });

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || '',
          company: data.company || '',
          role: data.role || '',
        });
      } else {
        // Create profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: user.id,
            full_name: user.user_metadata?.full_name || '',
          })
          .select()
          .single();

        if (createError) throw createError;
        setProfile(newProfile);
        setFormData({
          full_name: newProfile.full_name || '',
          company: newProfile.company || '',
          role: newProfile.role || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(formData)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onSignOut();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <User className="text-cyan-400" size={20} />
          Profile
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 text-slate-400 hover:text-cyan-400 transition-colors rounded-lg hover:bg-slate-700/50"
            title="Edit Profile"
          >
            <Settings size={16} />
          </button>
          <button
            onClick={handleSignOut}
            className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-slate-700/50"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Email */}
        <div className="flex items-center gap-3">
          <Mail className="text-slate-400" size={18} />
          <div>
            <p className="text-sm text-slate-400">Email</p>
            <p className="text-white">{user.email}</p>
          </div>
        </div>

        {/* Member Since */}
        <div className="flex items-center gap-3">
          <Calendar className="text-slate-400" size={18} />
          <div>
            <p className="text-sm text-slate-400">Member Since</p>
            <p className="text-white">
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Profile Fields */}
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Company
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                placeholder="Enter your company"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Role
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                placeholder="Enter your role"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-slate-700/50 text-slate-300 font-medium rounded-lg hover:bg-slate-600/50 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {profile?.full_name && (
              <div className="flex items-center gap-3">
                <User className="text-slate-400" size={18} />
                <div>
                  <p className="text-sm text-slate-400">Full Name</p>
                  <p className="text-white">{profile.full_name}</p>
                </div>
              </div>
            )}
            {profile?.company && (
              <div className="flex items-center gap-3">
                <Building className="text-slate-400" size={18} />
                <div>
                  <p className="text-sm text-slate-400">Company</p>
                  <p className="text-white">{profile.company}</p>
                </div>
              </div>
            )}
            {profile?.role && (
              <div className="flex items-center gap-3">
                <Briefcase className="text-slate-400" size={18} />
                <div>
                  <p className="text-sm text-slate-400">Role</p>
                  <p className="text-white">{profile.role}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default UserProfile;
