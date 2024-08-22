import AuthButton from "./AuthButton";

export default function NavBar({
  isSupabaseConnected,
}: {
  isSupabaseConnected: boolean;
}) {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
        <div className="text-2xl font-bold">ShareHandouts</div>
        {isSupabaseConnected && <AuthButton />}
      </div>
    </nav>
  );
}
