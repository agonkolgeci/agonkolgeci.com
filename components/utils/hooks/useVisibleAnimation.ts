"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/** Run decorative animation only while both the element and page are visible. */
export default function useVisibleAnimation() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref);
    const reducedMotion = useReducedMotion();
    const [pageVisible, setPageVisible] = useState(true);

    useEffect(() => {
        const update = () => setPageVisible(!document.hidden);
        update();
        document.addEventListener("visibilitychange", update);
        return () => document.removeEventListener("visibilitychange", update);
    }, []);

    return { ref, active: inView && pageVisible && !reducedMotion };
}
