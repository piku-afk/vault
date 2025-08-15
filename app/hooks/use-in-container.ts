import { useEffect, useRef, useState } from "react";

export function useInContainer(containerName: string) {
  const [isInContainer, setIsInContainer] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const checkContainer = () => {
      if (!ref.current) return;

      // Walk up the DOM tree to find a container with the specified name
      let element = ref.current.parentElement;
      while (element) {
        const computedStyle = getComputedStyle(element);
        if (computedStyle.containerName === containerName) {
          setIsInContainer(true);
          return;
        }
        element = element.parentElement;
      }
      setIsInContainer(false);
    };

    checkContainer();
  }, [containerName]);

  return { isInContainer, ref };
}
