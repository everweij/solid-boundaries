/* eslint-disable @typescript-eslint/no-explicit-any */
import { batch } from "solid-js";

type Callback<Payload> = (payload: Payload) => void;
export type UnregisterFn = () => void;
type RegisterFn<Payload> = (callback: Callback<Payload>) => UnregisterFn;

export function createGlobalObserver<Payload, T>(props: {
  init: (handler: Callback<Payload>) => T;
  connect: (subject: T) => void;
  disconnect: (subject: T) => void;
}): RegisterFn<Payload>;
export function createGlobalObserver<Payload>(props: {
  connect: (callback: Callback<Payload>) => void;
  disconnect: (callback: Callback<Payload>) => void;
}): RegisterFn<Payload>;
export function createGlobalObserver<Payload>(props: any): any {
  const callbacks: Set<Callback<Payload>> = new Set();

  const handler: Callback<Payload> = payload => {
    batch(() => {
      for (const callback of callbacks) {
        callback(payload);
      }
    });
  };

  const subject = props.init?.(handler);

  return function register(callback: Callback<Payload>) {
    if (callbacks.size === 0) {
      props.connect(subject ?? handler);
    }

    callbacks.add(callback);

    function unregister() {
      callbacks.delete(callback);

      if (callbacks.size === 0) {
        props.disconnect(subject ?? handler);
      }
    }

    return unregister;
  };
}
