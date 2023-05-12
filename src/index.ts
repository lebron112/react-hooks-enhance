import { useStateEhance } from "./useStateEnhance";
import { useSubscription, subscribe } from "./useSubscription";
import { usePageCurrentAction } from "./usePageCurrentAction";
import { useTimerCalculagraph } from './useTimerCalculagraph';

export default {
  useStateEhance,
  useSubscription,
  usePageCurrentAction,
  useTimerCalculagraph,
  subscribe,
};

/* export const useDebounce = (fn, delay, dep = []) => {
  const { current } = useRef({ fn, timer: null });
  useEffect(() => {
    current.fn = fn;
  }, [fn]);

  return useCallback((...args) => {
    if (current.timer) {
      clearTimeout(current.timer);
    }
    current.timer = setTimeout(() => {
      current.fn.call(this, ...args);
    }, delay);
  }, dep);
};

export const useThrottle = (fn, delay, dep = []) => {
  const { current } = useRef({ fn, timer: null });
  useEffect(() => {
    current.fn = fn;
  }, [fn]);

  return useCallback((...args) => {
    if (!current.timer) {
      current.timer = setTimeout(() => {
        delete current.timer;
      }, delay);
      current.fn.call(this, ...args);
    }
  }, dep);
}; */