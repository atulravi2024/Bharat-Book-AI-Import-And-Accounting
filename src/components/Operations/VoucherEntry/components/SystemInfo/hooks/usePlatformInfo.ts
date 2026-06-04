import React from "react";

export function usePlatformInfo() {
  return React.useMemo(() => {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return {
        deviceOS: "Generic OS",
        browserDetail: "Web Browser",
        screenSize: "1920 x 1080 (DPR: 1.0)",
      };
    }

    const ua = navigator.userAgent;
    const platform = navigator.platform || "";

    // 1. Detect Operating System Brand & Version
    let osName = "Unknown OS";
    let osVersion = "";

    if (/Windows NT 10\.0/i.test(ua)) {
      osName = "Windows";
      osVersion = "10/11";
    } else if (/Windows NT 6\.3/i.test(ua)) {
      osName = "Windows";
      osVersion = "8.1";
    } else if (/Windows NT 6\.2/i.test(ua)) {
      osName = "Windows";
      osVersion = "8";
    } else if (/Windows NT 6\.1/i.test(ua)) {
      osName = "Windows";
      osVersion = "7";
    } else if (/Macintosh/i.test(ua)) {
      osName = "macOS";
      const macVersionMatch = ua.match(
        /Mac OS X (\d+[._]\d+[._]\d+|\d+[._]\d+)/,
      );
      if (macVersionMatch) {
        osVersion = macVersionMatch[1].replace(/_/g, ".");
      }
    } else if (/iPhone/i.test(ua)) {
      osName = "iOS (iPhone)";
      const iosVersionMatch = ua.match(
        /OS (\d+[._]\d+[._]\d+|\d+[._]\d+) like Mac/,
      );
      if (iosVersionMatch) {
        osVersion = iosVersionMatch[1].replace(/_/g, ".");
      }
    } else if (/iPad/i.test(ua)) {
      osName = "iPadOS";
      const iosVersionMatch = ua.match(
        /OS (\d+[._]\d+[._]\d+|\d+[._]\d+) like Mac/,
      );
      if (iosVersionMatch) {
        osVersion = iosVersionMatch[1].replace(/_/g, ".");
      }
    } else if (/Android/i.test(ua)) {
      osName = "Android";
      const androidVersionMatch = ua.match(/Android (\d+(\.\d+)?)/);
      if (androidVersionMatch) {
        osVersion = androidVersionMatch[1];
      }
    } else if (/Linux/i.test(ua)) {
      osName = "Linux";
    }

    // Modern CPU Architecture Guessing
    let arch = "";
    if (/x86_64|x64|wow64|amd64/i.test(ua) || /win64/i.test(platform)) {
      arch = "64-bit";
    } else if (/i686|i386|ia32|win32/i.test(ua) || /win32/i.test(platform)) {
      arch = "32-bit";
    } else if (/arm64|aarch64/i.test(ua)) {
      arch = "ARM64";
    } else if (
      /mac/i.test(platform.toLowerCase()) &&
      !/iphone|ipad/i.test(ua)
    ) {
      arch =
        navigator.maxTouchPoints > 0
          ? "ARM64 (Apple Touch Device)"
          : "64-bit (Intel/Apple)";
    }

    // 2. Detect Browser Name and Version
    let browserName = "Browser";
    let browserVersion = "";

    if (/OPR\/(\d+)/i.test(ua) || /Opera/i.test(ua)) {
      browserName = "Opera";
      const match = ua.match(/(?:OPR|Version)\/(\d+(\.\d+)?)/);
      if (match) browserVersion = match[1];
    } else if (/Edg\/(\d+)/i.test(ua)) {
      browserName = "Microsoft Edge";
      const match = ua.match(/Edg\/(\d+(\.\d+)?)/);
      if (match) browserVersion = match[1];
    } else if (/Chrome\/(\d+)/i.test(ua)) {
      browserName = "Google Chrome";
      const match = ua.match(/Chrome\/(\d+(\.\d+)?)/);
      if (match) browserVersion = match[1];
    } else if (/Safari\/(\d+)/i.test(ua) && !/Chrome/i.test(ua)) {
      browserName = "Apple Safari";
      const match = ua.match(/Version\/(\d+(\.\d+)?)/);
      if (match) browserVersion = match[1];
    } else if (/Firefox\/(\d+)/i.test(ua)) {
      browserName = "Mozilla Firefox";
      const match = ua.match(/Firefox\/(\d+(\.\d+)?)/);
      if (match) browserVersion = match[1];
    } else if (/MSIE (\d+)/i.test(ua) || /Trident.*rv:(\d+)/i.test(ua)) {
      browserName = "Internet Explorer";
      const match = ua.match(/(?:MSIE |rv:)(\d+(\.\d+)?)/);
      if (match) browserVersion = match[1];
    }

    const fullOsString = osVersion ? `${osName} v${osVersion}` : osName;
    const archString = arch ? ` (${arch})` : "";
    const browserString = browserVersion
      ? `${browserName} v${browserVersion}`
      : browserName;

    // Screen resolution & scale ratio details
    let screenDetails = "Unknown";
    if (typeof screen !== "undefined") {
      const dpr =
        typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
      screenDetails = `${screen.width} x ${screen.height} (DPR: ${dpr.toFixed(1)})`;
    }

    return {
      deviceOS: `${fullOsString}${archString}`,
      browserDetail: browserString,
      screenSize: screenDetails,
    };
  }, []);

}
