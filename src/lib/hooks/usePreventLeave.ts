import { useState, useEffect, useCallback } from "react";

/**
 * Custom React hook to prevent the user from leaving the page accidentally.
 * It handles browser events like closing tab, refreshing, and navigating.
 *
 * @param initialEnabled - Initial state to enable or disable the prevent leave behavior
 * @param message - The message to display when the user tries to leave the page
 * @returns An object containing the current enable state and a function to update it
 */
const usePreventLeave = (
  initialEnabled: boolean = true,
  message: string = "您確定要離開嗎？您的未保存更改可能會丟失。"
) => {
  const [enabled, setEnabled] = useState(initialEnabled);

  useEffect(() => {
    setEnabled(initialEnabled);
  }, [initialEnabled]);

  const handleBeforeUnload = useCallback(
    (event: BeforeUnloadEvent) => {
      if (enabled) {
        event.preventDefault();
        event.returnValue = message;
        return message;
      }
    },
    [enabled, message]
  );

  useEffect(() => {
    if (enabled) {
      window.addEventListener("beforeunload", handleBeforeUnload);
      window.addEventListener('unload', handleBeforeUnload);
    } else {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener('unload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener('unload', handleBeforeUnload);
    };
  }, [enabled, handleBeforeUnload]);

  return { enabled, setEnabled };
};

export default usePreventLeave;
