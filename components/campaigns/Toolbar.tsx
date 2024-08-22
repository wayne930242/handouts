import { Button } from "../ui/button";
export default function Toolbar() {
  return (
    <div className="flex justify-between items-center w-full">
      <div className="grow-1">
        <Button variant="outline">Join Campaign</Button>
      </div>
      <div>
        <Button>New Campaign</Button>
      </div>
    </div>
  );
}
