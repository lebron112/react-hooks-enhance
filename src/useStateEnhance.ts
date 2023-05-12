import { useEffect, useRef, useState } from "react";

type IUseStateEhance<S extends unknown> = [S, (v: S) => void, React.MutableRefObject<S>];

/**
 * 
 * @param initValue 
 * @param refChangeAfterState 
 * @returns 
 */
export function useStateEhance<T>(initValue: T, refChangeAfterState?: boolean): IUseStateEhance<T> {
  const [state, setState] = useState<T>(initValue);
  const refBefore = useRef<T>(initValue);
  const refAfter = useRef<T>(initValue);

  useEffect(() => {
    refAfter.current = state;
  }, [state]);

  const setStateChange = (v: T): void => {
    if (refChangeAfterState) {
      refBefore.current = v;
    }
    setState(v);
  };
  return [
    state,
    setStateChange,
    refChangeAfterState ? refBefore : refAfter,
  ];
}
