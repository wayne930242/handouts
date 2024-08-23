import { PacmanLoader } from "react-spinners";
import { createPortal } from "react-dom";

export default function OverlayLoading() {
  return (
    <>
      {createPortal(
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <PacmanLoader color="#fff" loading={true} />
        </div>,
        document.body
      )}
    </>
  );
}
