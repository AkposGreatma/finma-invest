import React, { useEffect, useState } from "react";

function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === "accepted") {
      setShowInstall(false);
    }

    setDeferredPrompt(null);
  };

  if (!showInstall) return null;

  return (
    <button style={styles.installButton} onClick={handleInstallClick}>
      Install FINMA
    </button>
  );
}

const styles = {
  installButton: {
    position: "fixed",
    right: "24px",
    bottom: "24px",
    zIndex: 2000,
    padding: "12px 18px",
    borderRadius: "999px",
    border: "none",
    background: "#10B981",
    color: "#FFFFFF",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 12px 28px rgba(16, 185, 129, 0.25)",
  },
};

export default InstallPrompt;