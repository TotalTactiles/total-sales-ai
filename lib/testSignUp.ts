import 'dotenv/config';
import { signUpUser } from './auth';

(async () => {
  try {
    const newUser = await signUpUser({
      email: 'peonmyboot@gmail.com',
      password: 'SecurePass123!',
      full_name: 'Debug Test',
      role: 'manager',
    });

    console.log('✅ User created:', newUser);
  } catch (err) {
    console.error('❌ Signup failed:', err);
  }
})();
