import Link from "next/link";
import { Button } from "../ui/button";
export default function Toolbar() {
  return (
    <div className="flex justify-between items-center w-full px-2">
      <div className="grow-1">
        <Button variant="outline">Join Campaign</Button>
      </div>
      <div>
        <Link href="/campaigns/new">
          <Button>New</Button>
        </Link>
      </div>
    </div>
  );
}
