import { useNavigate } from "react-router-dom";
import { Compass, House, ArrowLeft } from "lucide-react";

function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div>
      <main className="relative isolate flex min-h-screen overflow-hidden bg-gray-950 px-5 py-8 text-gray-100 sm:px-8 lg:px-12">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,rgba(79,70,229,0.2),transparent_32%),radial-gradient(circle_at_86%_82%,rgba(14,116,144,0.16),transparent_28%)]" />
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-30 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-size-[42px_42px] mask-[linear-gradient(to_bottom,black,transparent_78%)]" />

        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col">
          <header className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="group inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-gray-200 transition hover:text-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-700 bg-gray-900/80 text-indigo-300 transition group-hover:border-indigo-400/60 group-hover:bg-gray-800">
                <Compass size={19} strokeWidth={1.8} />
              </span>
              ClassFlow
            </button>
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-gray-500">
              Error 404
            </span>
          </header>

          <section className="flex flex-1 items-center py-16 sm:py-20">
            <div className="grid w-full items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,0.72fr)] lg:gap-20">
              <div className="max-w-2xl">
                <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.9)]" />
                  Route not found
                </p>
                <h1 className="font-heading text-[clamp(4.75rem,16vw,10rem)] font-extrabold leading-[0.82] tracking-[-0.06em] text-white">
                  404
                </h1>
                <h2 className="mt-8 max-w-xl font-heading text-3xl font-bold tracking-tight text-gray-100 sm:text-5xl">
                  This page drifted off the schedule.
                </h2>
                <p className="mt-5 max-w-lg text-base leading-7 text-gray-400 sm:text-lg">
                  The address may be outdated, or the page may have moved.
                  Let&apos;s get you back to a useful place in ClassFlow.
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white shadow-lg shadow-indigo-950/30 transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 focus:ring-offset-gray-950"
                  >
                    <House size={17} strokeWidth={2} />
                    Return home
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-900/70 px-5 text-sm font-bold text-gray-200 transition hover:border-gray-500 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 focus:ring-offset-gray-950"
                  >
                    <ArrowLeft size={17} strokeWidth={2} />
                    Go back
                  </button>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-sm lg:ml-auto">
                <div className="absolute -inset-5 rounded-4xl border border-cyan-300/10" />
                <div className="absolute -inset-10 rounded-[2.5rem] border border-indigo-300/10" />
                <div className="relative overflow-hidden rounded-[1.75rem] border border-gray-700/80 bg-gray-900/80 p-5 shadow-2xl shadow-black/30 backdrop-blur sm:p-6">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                    <span className="font-mono text-xs text-gray-500">
                      NAVIGATION_LOG
                    </span>
                    <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-amber-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                      Unresolved
                    </span>
                  </div>
                  <div className="py-10 text-center">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-indigo-300/30 bg-indigo-400/10 text-indigo-200 shadow-[0_0_45px_rgba(99,102,241,0.18)]">
                      <Compass size={46} strokeWidth={1.25} />
                    </div>
                    <p className="mt-7 font-mono text-xs leading-6 text-gray-500">
                      signal lost at current address
                      <br />
                      recalibration recommended
                    </p>
                  </div>
                  <div className="flex items-center gap-2 border-t border-gray-800 pt-4 font-mono text-[10px] uppercase tracking-widest text-gray-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                    ClassFlow / system route
                  </div>
                </div>
              </div>
            </div>
          </section>

          <footer className="flex items-center justify-between border-t border-gray-800/80 pt-5 text-xs text-gray-600">
            <span>ClassFlow workspace</span>
            <span>Keep moving forward</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default PageNotFound;
