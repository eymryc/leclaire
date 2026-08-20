/** MediaPipe / TFLite logs INFO via console.error — Next.js shows it as a red overlay. */
const NOISE =
  /tensorflow lite|xnnpack|delegate for cpu|created tensorflow|inference_feedback_manager|feedback manager has been|gpu delegate|gl_context|opencl|opengl/i;

type ConsoleFn = (...args: unknown[]) => void;

export function silenceMediapipeLogs(): () => void {
  const original = {
    error: console.error.bind(console) as ConsoleFn,
    warn: console.warn.bind(console) as ConsoleFn,
    log: console.log.bind(console) as ConsoleFn,
    info: console.info.bind(console) as ConsoleFn,
    debug: console.debug.bind(console) as ConsoleFn,
  };

  const wrap =
    (fn: ConsoleFn): ConsoleFn =>
    (...args) => {
      const text = args
        .map((a) => {
          if (typeof a === "string") return a;
          if (a instanceof Error) return a.message;
          try {
            return String(a);
          } catch {
            return "";
          }
        })
        .join(" ");
      if (NOISE.test(text)) return;
      fn(...args);
    };

  console.error = wrap(original.error);
  console.warn = wrap(original.warn);
  console.log = wrap(original.log);
  console.info = wrap(original.info);
  console.debug = wrap(original.debug);

  return () => {
    console.error = original.error;
    console.warn = original.warn;
    console.log = original.log;
    console.info = original.info;
    console.debug = original.debug;
  };
}
