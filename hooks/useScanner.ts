"use client";
import { useState, useEffect, useRef, useCallback } from "react";

export type ScannerState = "idle" | "loading" | "scanning" | "error";

export function useScanner(onScan: (barcode: string) => void, enabled: boolean) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<unknown>(null);
  const [state, setState] = useState<ScannerState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const stop = useCallback(() => {
    if (readerRef.current) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (readerRef.current as any).reset();
      } catch (_) {}
      readerRef.current = null;
    }
    setState("idle");
  }, []);

  const start = useCallback(async () => {
    setState("loading");
    // Dynamic import to avoid SSR issues
    try {
      const ZXing = await import("@zxing/library");
      const hints = new Map();
      hints.set(ZXing.DecodeHintType.POSSIBLE_FORMATS, [
        ZXing.BarcodeFormat.CODE_128,
        ZXing.BarcodeFormat.CODE_39,
        ZXing.BarcodeFormat.EAN_13,
        ZXing.BarcodeFormat.EAN_8,
        ZXing.BarcodeFormat.QR_CODE,
        ZXing.BarcodeFormat.DATA_MATRIX,
      ]);

      const reader = new ZXing.BrowserMultiFormatReader(hints);
      readerRef.current = reader;

      const devices = await ZXing.BrowserCodeReader.listVideoInputDevices();
      // Prefer back camera on mobile
      const device =
        devices.find((d) =>
          d.label.toLowerCase().includes("back") ||
          d.label.toLowerCase().includes("rear") ||
          d.label.toLowerCase().includes("environment")
        ) ?? devices[devices.length - 1];

      await reader.decodeFromVideoDevice(
        device?.deviceId,
        videoRef.current!,
        (result, err) => {
          if (result) {
            onScan(result.getText());
          }
          if (err && !(err instanceof ZXing.NotFoundException)) {
            console.warn("Scanner decode error:", err);
          }
        }
      );
      setState("scanning");
    } catch (e) {
      console.error("Scanner init error:", e);
      setErrorMsg(
        e instanceof Error && e.message.includes("Permission")
          ? "Camera permission denied. Please allow camera access."
          : "Camera unavailable. Use manual input below."
      );
      setState("error");
    }
  }, [onScan]);

  useEffect(() => {
    if (enabled) {
      start();
    } else {
      stop();
    }
    return stop;
  }, [enabled, start, stop]);

  return { videoRef, state, errorMsg };
}
