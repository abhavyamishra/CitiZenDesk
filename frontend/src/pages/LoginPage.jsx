import { LoginForm } from "@/components/login-form"; 

export default function LoginPage() {
  return (
    <div
      style={{
        background: 'hsl(214.3, 31.8%, 91.4%)',
        width: '100vw',
        height: '100vh',
      }}
    >
      <div className="shrink-div">
        <LoginForm />
      </div>
    </div>
  );
}
