import { useEffect, useCallback } from "react";

type SaveCallback = () => void;

const useSaveShortcut = (saveCallback: SaveCallback) => {
  const isMac = useCallback(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const platform = window.navigator.platform.toLowerCase();
    const macosPlatforms = [
      "macintosh",
      "macintel",
      "macppc",
      "mac68k",
      "darwin",
    ];
    return (
      macosPlatforms.indexOf(platform) !== -1 || /mac|darwin/.test(userAgent)
    );
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const modifierKey = isMac() ? event.metaKey : event.ctrlKey;

      if (modifierKey && event.key === "s") {
        event.preventDefault();
        saveCallback();
      }
    },
    [isMac, saveCallback]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
};

export default useSaveShortcut;
