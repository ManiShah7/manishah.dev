"use client";

import { useEffect } from "react";

export default function PrismLoader() {
  useEffect(() => {
    // Check if Prism is already loaded
    if (typeof window !== "undefined" && window.Prism) {
      window.Prism.highlightAll();
      return;
    }

    // Load Prism CSS
    if (!document.querySelector('link[href*="prism-tomorrow"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href =
        "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css";
      document.head.appendChild(link);
    }

    // Load Prism JS
    const loadPrismScripts = () => {
      // Load core Prism
      const coreScript = document.createElement("script");
      coreScript.src =
        "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js";
      coreScript.onload = () => {
        // Load autoloader after core is loaded
        const autoloaderScript = document.createElement("script");
        autoloaderScript.src =
          "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js";
        autoloaderScript.onload = () => {
          // Highlight all code blocks after everything is loaded
          if (window.Prism) {
            window.Prism.highlightAll();
          }
        };
        document.head.appendChild(autoloaderScript);
      };
      document.head.appendChild(coreScript);
    };

    // Only load if not already present
    if (!document.querySelector('script[src*="prism-core"]')) {
      loadPrismScripts();
    }
  }, []);

  return null;
}

// Extend Window type for TypeScript
declare global {
  interface Window {
    Prism: {
      highlightAll: () => void;
      highlightElement: (element: Element) => void;
      manual: boolean;
    };
  }
}
