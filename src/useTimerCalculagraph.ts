import { useCallback, useEffect, useRef } from "react";
import Timer from "./tools/timer";

export type TUseTimerCalculagraph = {
  start: () => void;
  destory: () => void;
  pause: () => void;
  resume: () => void;
  getDuration: () => number | null | undefined;
};

/** hooks 内使用的计时器 */
export function useTimerCalculagraph(): TUseTimerCalculagraph {
  const timer = useRef<Timer | null>();
  const duration = useRef<number | undefined | null>(0);

  const destory = useCallback(() => {
    timer.current = null;
  }, []);

  useEffect(() => {
    timer.current = new Timer();
    return () => {
      if (timer.current) {
        timer.current.pause();
        duration.current = timer.current.getDuration();
        destory();
      }
    };
  }, []);

  return {
    start: () => {
      const t = timer.current?.getDuration();
      duration.current = t;
      timer.current && timer.current.start();
    },
    destory,
    pause: () => {
      timer.current && timer.current.pause();
    },

    resume: () => {
      timer.current && timer.current.resume();
    },
    getDuration: () => {
      if (timer.current) {
        const t = timer.current.getDuration();
        duration.current = t;
        return t;
      }
      return duration.current;
    }
  };
}
