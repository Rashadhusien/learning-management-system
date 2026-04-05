// hooks/use-split-text.ts
"use client";

/**
 * Manual SplitText replacement — no paid GSAP plugins needed.
 * Splits an element into lines (masked slide-up) or words.
 */

export type SplitType = "lines" | "words" | "chars";

export interface SplitResult {
  inners: HTMLElement[]; // the animatable elements
  revert: () => void; // restore original innerHTML
}

export function splitText(
  el: HTMLElement,
  type: SplitType = "lines",
): SplitResult {
  const original = el.innerHTML;

  if (type === "chars") {
    const chars = el.innerText.trim().split("");
    el.innerHTML = chars
      .map((c) =>
        c === " "
          ? `<span style="display:inline-block;white-space:pre"> </span>`
          : `<span class="char-wrap" style="display:inline-block;overflow:hidden;vertical-align:bottom">
             <span class="char-inner" style="display:inline-block">${c}</span>
           </span>`,
      )
      .join("");
    return {
      inners: [...el.querySelectorAll<HTMLElement>(".char-inner")],
      revert: () => {
        el.innerHTML = original;
      },
    };
  }

  if (type === "words") {
    const words = el.innerText.trim().split(/\s+/);
    el.innerHTML = words
      .map(
        (
          w,
        ) => `<span class="word-wrap" style="display:inline-block;overflow:hidden;vertical-align:bottom;padding-bottom:.05em">
                   <span class="word-inner" style="display:inline-block">${w}</span>
                 </span>`,
      )
      .join(" ");
    return {
      inners: [...el.querySelectorAll<HTMLElement>(".word-inner")],
      revert: () => {
        el.innerHTML = original;
      },
    };
  }

  // type === "lines" — measure word Y positions to detect line breaks
  const words = el.innerText.trim().split(/\s+/);
  el.innerHTML = words
    .map(
      (w) =>
        `<span style="display:inline-block;white-space:nowrap">${w}&nbsp;</span>`,
    )
    .join("");

  const wordEls = [...el.querySelectorAll<HTMLElement>("span")];
  const lineGroups: string[][] = [];
  let currentLine: string[] = [];
  let currentY: number | null = null;

  wordEls.forEach((w) => {
    const y = w.getBoundingClientRect().top;
    if (currentY === null) currentY = y;
    if (Math.abs(y - currentY) > 4) {
      lineGroups.push(currentLine);
      currentLine = [];
      currentY = y;
    }
    currentLine.push(w.innerText.trim());
  });
  if (currentLine.length) lineGroups.push(currentLine);

  el.innerHTML = lineGroups
    .map(
      (lineWords) =>
        `<span style="display:block;overflow:hidden;padding-bottom:.08em">
         <span class="line-inner" style="display:block">${lineWords.join(" ")}</span>
       </span>`,
    )
    .join("");

  return {
    inners: [...el.querySelectorAll<HTMLElement>(".line-inner")],
    revert: () => {
      el.innerHTML = original;
    },
  };
}
