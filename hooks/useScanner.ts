"use client";
import {useState, useEffect, useRef, useCallback} from "react";

export type ScannerState = "idle" | "loading" | "scanning" | "error";

export function useScanner(
  onScan: (barcode: string) => void,
  enabled: boolean,
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<any>(null);
  const [state, setState] = useState<ScannerState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const stop = useCallback(() => {
    if (readerRef.current) {
      try {
        readerRef.current.reset();
      } catch (_) {}
      readerRef.current = null;
    }
    setState("idle");
  }, []);

  const start = useCallback(async () => {
    setState("loading");
    try {
      const ZXing = await import("@zxing/library");

      // Setup the barcode formats you want to scan
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

      // ✅ List cameras using standard web API
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((d) => d.kind === "videoinput");

      if (videoDevices.length === 0) throw new Error("No camera found");

      // Prefer back/rear camera
      const device =
        videoDevices.find((d) => /back|rear|environment/i.test(d.label)) ??
        videoDevices[videoDevices.length - 1];

      await reader.decodeFromVideoDevice(
        device.deviceId,
        videoRef.current!,
        (result, err) => {
          if (result) onScan(result.getText());
          if (err && !(err instanceof ZXing.NotFoundException)) {
            console.warn("Decode error:", err);
          }
        },
      );

      setState("scanning");
    } catch (e: any) {
      console.error("Scanner init error:", e);
      setErrorMsg(
        e.message.includes("Permission")
          ? "Camera permission denied. Please allow camera access."
          : "Camera unavailable. Use manual input below.",
      );
      setState("error");
    }
  }, [onScan]);

  useEffect(() => {
    if (enabled) start();
    else stop();
    return stop;
  }, [enabled, start, stop]);

  return {videoRef, state, errorMsg};
}
