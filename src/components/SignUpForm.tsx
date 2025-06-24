
'use client';

import { useState } from 'react';
import { signUpUser } from '@/lib/auth';

type UserRole = 'admin' | 'developer' | 'manager' | 'sales_rep';

export default function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('sales_rep'); // default role
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await signUpUser({
        email,
        password,
        full_name: fullName,
        role,
      });
      setMessage(`✅ Signed up successfully as ${user.user.email}`);
    } catch (err: any) {
      console.error('Signup error:', err);
      setMessage(`❌ Signup failed: ${err.message}`);
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value as UserRole);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={e => setFullName(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
      <select
        value={role}
        onChange={handleRoleChange}
        className="w-full p-2 border rounded"
      >
        <option value="sales_rep">Sales Rep</option>
        <option value="manager">Manager</option>
        <option value="developer">Developer</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        Sign Up
      </button>
      {message && <p className="text-sm mt-2">{message}</p>}
    </form>
  );
}
