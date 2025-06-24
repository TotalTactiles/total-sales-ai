'use client';

import { useState } from 'react';
import { signUpUser } from '@/lib/auth';

export default function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('manager');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await signUpUser({ email, password, full_name: fullName, role });
      setMessage(`✅ Signed up successfully as ${user.user.email}`);
    } catch (err: any) {
      setMessage(`❌ Signup failed: ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <input type="text" placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} required />
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="manager">Manager</option>
        <option value="developer">Developer</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">Sign Up</button>
      {message && <p>{message}</p>}
    </form>
  );
}
