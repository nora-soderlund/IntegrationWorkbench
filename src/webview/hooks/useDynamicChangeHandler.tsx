import { FormEvent, FormEventHandler, useCallback, useState } from "react";

export default function useDynamicChangeHandler(onChangeCallback: (value: string) => void, timeout: number = 3000) {
  const [ timer, setTimer ] = useState<NodeJS.Timeout | null>(null);

  return useCallback((event: string | FormEvent<HTMLElement> | Event) => {
    if(timer) {
      clearTimeout(timer);
    }

    setTimer(
      setTimeout(() => {
        setTimer(null);

        if(typeof event === "string") {
          onChangeCallback(event);
        }
        else {
          const target = event.target as HTMLInputElement;

          onChangeCallback(target.value);
        }
      }, timeout)
    );
  }, [ timer ]);
}