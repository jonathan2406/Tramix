import { useEffect, useState } from "react";

type SelectionPosition = {
  x: number;
  y: number;
};

type UseTextSelectionOptions = {
  disabled?: boolean;
  minLength?: number;
};

function isSelectionIgnored(selection: Selection) {
  const nodes = [selection.anchorNode, selection.focusNode].filter(Boolean);
  return nodes.some((node) => {
    const element = node instanceof HTMLElement ? node : node?.parentElement;
    return element?.closest("[data-visual-sign-ignore]");
  });
}

export function useTextSelection({ disabled = false, minLength = 2 }: UseTextSelectionOptions = {}) {
  const [selectionText, setSelectionText] = useState("");
  const [position, setPosition] = useState<SelectionPosition | null>(null);

  useEffect(() => {
    if (disabled) {
      setSelectionText("");
      setPosition(null);
      return;
    }

    const updateSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
        setSelectionText("");
        setPosition(null);
        return;
      }

      const text = selection.toString().trim();
      if (!text || text.length < minLength || isSelectionIgnored(selection)) {
        setSelectionText("");
        setPosition(null);
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      if (!rect || (rect.width === 0 && rect.height === 0)) {
        setSelectionText("");
        setPosition(null);
        return;
      }

      const buttonWidth = 180;
      const buttonHeight = 44;
      const padding = 12;

      const x = Math.min(Math.max(rect.left, padding), window.innerWidth - buttonWidth - padding);
      const y = Math.min(Math.max(rect.bottom + 8, padding), window.innerHeight - buttonHeight - padding);

      setSelectionText(text);
      setPosition({ x, y });
    };

    const scheduleUpdate = () => window.requestAnimationFrame(updateSelection);

    document.addEventListener("selectionchange", scheduleUpdate);
    document.addEventListener("mouseup", scheduleUpdate);
    document.addEventListener("keyup", scheduleUpdate);
    window.addEventListener("scroll", scheduleUpdate, true);
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      document.removeEventListener("selectionchange", scheduleUpdate);
      document.removeEventListener("mouseup", scheduleUpdate);
      document.removeEventListener("keyup", scheduleUpdate);
      window.removeEventListener("scroll", scheduleUpdate, true);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [disabled, minLength]);

  const clearSelection = () => {
    if (typeof window === "undefined") return;
    window.getSelection()?.removeAllRanges();
  };

  return {
    selectionText,
    position,
    clearSelection,
  };
}
