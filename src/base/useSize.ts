import { useRef } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

export type CallbackRefParam = HTMLElement | null;

export function useSizeWithElRef(
  callback: (e: HTMLElement) => void,
  enabled = true,
) {
  const ref = useRef<CallbackRefParam>(null);
  const observer = new ResizeObserver((entries: any) => {
    const element = entries[0].target as HTMLElement;
    // Revert the RAF below - it causes a blink in the upward scrolling fix
    // See e2e/chat example
    // Avoid Resize loop limit exceeded error
    // https://github.com/edunad/react-virtuoso/commit/581d4558f2994adea375291b76fe59605556c08f
    // requestAnimationFrame(() => {
    //
    // if display: none, the element won't have an offsetParent
    // measuring it at this mode is not going to work
    // https://stackoverflow.com/a/21696585/1009797
    if (element.offsetParent !== null) {
      callback(element);
    }
    // })
  });

  const callbackRef = (elRef: CallbackRefParam) => {
    if (elRef && enabled) {
      observer.observe(elRef);
      ref.current = elRef;
    } else {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
      ref.current = null;
    }
  };
  return { ref, callbackRef };
}

export default function useSize(
  callback: (e: HTMLElement) => void,
  enabled = true,
) {
  return useSizeWithElRef(callback, enabled).callbackRef;
}

/**
 * resize大小监听器
 * @param callback
 * @param enabled
 * @returns
 */
export function resizeObserver(
  callback: (e: HTMLElement) => void,
  enabled: boolean = true,
) {
  const observer = new ResizeObserver((entries: any) => {
    const element = entries[0].target as HTMLElement;
    // Revert the RAF below - it causes a blink in the upward scrolling fix
    // See e2e/chat example
    // Avoid Resize loop limit exceeded error
    // https://github.com/edunad/react-virtuoso/commit/581d4558f2994adea375291b76fe59605556c08f
    // requestAnimationFrame(() => {
    //
    // if display: none, the element won't have an offsetParent
    // measuring it at this mode is not going to work
    // https://stackoverflow.com/a/21696585/1009797
    if (element.offsetParent !== null) {
      callback(element);
    }
    // })
  });

  let ref: any = null;
  const callbackRef = (elRef: CallbackRefParam) => {
    if (elRef && enabled) {
      observer.observe(elRef);
      ref = elRef;
    } else {
      if (ref) {
        observer.unobserve(ref);
      }
      ref = null;
    }
  };

  const dispose = () => {
    if (ref) {
      observer.unobserve(ref);
    }
    ref = null;
  };
  return { callbackRef, dispose };
}
