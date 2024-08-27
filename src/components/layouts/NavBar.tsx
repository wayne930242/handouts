import AuthButton from "../AuthButton";
import { Link } from "@/navigation";
import { Badge } from "../ui/badge";
import LocaleSwitcher from "../LocaleSwitcher";

export default function NavBar({}) {

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-12">
      <div className="w-full max-w-4xl flex justify-between items-center py-2 px-3 text-sm">
        <Link href="/" className="flex items-center gap-1">
          <div className="text-2xl font-bold">Handouts</div>
          <Badge variant="destructive">BETA</Badge>
        </Link>
        <div className="flex gap-x-2.5 items-center">
          <LocaleSwitcher />
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
