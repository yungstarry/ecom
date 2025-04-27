import { supabase } from './supabase';
import { User } from '../types';

// Password validation
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const validatePassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return {
      valid: false,
      message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`,
    };
  }

  if (!PASSWORD_REGEX.test(password)) {
    return {
      valid: false,
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    };
  }

  return { valid: true, message: '' };
};

// Sign up
export const signUp = async (
  email: string,
  password: string,
  fullName: string
): Promise<{ user: User | null; error: string | null }> => {
  try {
    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return { user: null, error: passwordValidation.message };
    }

    // Sign up user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (signUpError) throw signUpError;

    if (authData.user) {
      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          full_name: fullName,
          email_verified: false,
        });

      if (profileError) throw profileError;

      return { user: authData.user as User, error: null };
    }

    return { user: null, error: 'Failed to create user' };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

// Sign in
export const signIn = async (
  email: string,
  password: string,
  remember: boolean = false
): Promise<{ user: User | null; error: string | null }> => {
  try {
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (user) {
      // Update last login
      await supabase
        .from('user_profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id);

      return { user: user as User, error: null };
    }

    return { user: null, error: 'Invalid credentials' };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

// Sign out
export const signOut = async (): Promise<{ error: string | null }> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Request password reset
export const requestPasswordReset = async (email: string): Promise<{ error: string | null }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Reset password
export const resetPassword = async (
  newPassword: string
): Promise<{ error: string | null }> => {
  try {
    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return { error: passwordValidation.message };
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Change password (for authenticated users)
export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<{ error: string | null }> => {
  try {
    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return { error: passwordValidation.message };
    }

    // Verify current password by attempting to sign in
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      return { error: 'User not found' };
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInError) {
      return { error: 'Current password is incorrect' };
    }

    // Update password
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Update user profile
export const updateProfile = async (
  userId: string,
  data: { fullName?: string; phone?: string }
): Promise<{ error: string | null }> => {
  try {
    const updates: any = {};
    if (data.fullName) updates.full_name = data.fullName;
    if (data.phone) updates.phone = data.phone;

    const { error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId);

    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};