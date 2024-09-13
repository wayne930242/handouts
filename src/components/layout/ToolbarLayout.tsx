export default function ToolbarLayout({ leftSec: left, children }: Props) {
  return (
    <div className="flex justify-between items-center w-full">
      <div className="grow-1 flex gap-2 items-center pl-2">{left}</div>
      <div className="flex gap-2 items-center">{children}</div>
    </div>
  );
}

interface Props {
  leftSec?: React.ReactNode;
  children?: React.ReactNode;
}
