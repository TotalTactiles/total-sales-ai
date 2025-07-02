export default function AuthPageFallback() {
  return (
    <div>
      <h1>🔐 Login</h1>
      <button onClick={mockLogin}>Login (simulate)</button>
    </div>
  );
}

function mockLogin() {
  localStorage.setItem('demo-auth', 'true');
  window.location.href = '/sales-dashboard';
}
