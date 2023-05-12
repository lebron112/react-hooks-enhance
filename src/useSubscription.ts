import { useEffect, useRef } from "react";

export const subscribe = () => {
  let topics: {
    [msg: string]:
    {
      token: string;
      func: (...arg: any) => any,
    }[]
  } = {};

  let offlineStack: {
    [msg: string]: Array<any>;
  } = {};

  let subUid = -1;
  const q = {

    publish: (topic: string, args: any) => {
      if (!topics[topic]) {
        offlineStack[topic] = [];
        offlineStack[topic].push(args);
        return;
      }
      const subs = topics[topic];
      let len = subs.length;
      while (len--) {
        subs[len].func(topic, args);
      }
      return this;
    },

    subscribe: (topic: string, func: (...arg: any) => any) => {
      const token = (++subUid).toString();
      if (offlineStack[topic]?.length) {
        topics[topic].push({ token, func });
        offlineStack[topic].forEach(args => {
          func(args);
        });
        offlineStack[topic] = [];
      }
      topics[topic] = topics[topic] ? topics[topic] : [];

      topics[topic].push({ token, func });
      return token;
    },

    clear: (topic?: string) => {
      if (topic) {
        topics[topic] = [];
        offlineStack[topic] = [];
      } else {
        topics = {};
        offlineStack = {};
      }
    },
  };
  return q;
};

/** 发布订阅  异步等待 */
export const useSubscription = () => {
  const sub = useRef(subscribe());
  const hash = useRef(new Map());
  useEffect(() => {
    () => {
      sub.current.clear();
      hash.current.clear();
    };
  }, []);

  return {
    publish: (key: string, value?: string) => {
      hash.current.set(key, value);
      sub.current.publish(key, value);
    },
    waitSubcribe: async (key: string) => {
      return await new Promise((resolve, reject) => {
        if (hash.current.has(key)) {
          resolve(true);
        }
        sub.current.subscribe(key, () => {
          resolve(true);
        });
      });
    },
  };
};
