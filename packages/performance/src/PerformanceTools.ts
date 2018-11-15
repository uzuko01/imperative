/*
* This program and the accompanying materials are made available under the terms of the
* Eclipse Public License v2.0 which accompanies this distribution, and is available at
* https://www.eclipse.org/legal/epl-v20.html
*
* SPDX-License-Identifier: EPL-2.0
*
* Copyright Contributors to the Zowe Project.
*
*/

// Imported for typings. This will not be reflected in the generated code.
import * as perfHooks from "perf_hooks";

interface IFunctionTimer {
    observer: perfHooks.PerformanceObserver;
    originalFunction: (...args: any[]) => any;
    totalDuration: number;
}

export class PerformanceTools {
    /**
     * This is the environmental variable that should be set to turn on
     * performance tests.
     */
    public static readonly PERF_ENV_CHECK = "IMPERATIVE_ENABLE_PERFORMANCE";

    /**
     * Private singleton reference to the PerformanceTools
     */
    private static mInstance: PerformanceTools;

    /**
     * Get the singleton PerformanceTools, create the class if necessary.
     */
    public static get instance(): PerformanceTools {
        if (PerformanceTools.mInstance == null) {
            PerformanceTools.mInstance = new PerformanceTools();
        }

        return PerformanceTools.mInstance;
    }

    private functionTimers: Map<string,IFunctionTimer> = new Map();

    /**
     * Private boolean that keeps track of if performance is enabled.
     */
    private readonly isPerfEnabled: boolean;

    /**
     * This variable holds the import from the Node JS performance hooks
     * library.
     */
    private readonly perfHooks: typeof perfHooks;

    constructor() {
        // Check if performance utilities should be enabled.
        if(
            process.env[PerformanceTools.PERF_ENV_CHECK] &&
            process.env[PerformanceTools.PERF_ENV_CHECK].toUpperCase() === "TRUE"
        ) {
            this.isPerfEnabled = true;

            // Delay the require so we don't waste resources when performance
            // isn't needed.
            this.perfHooks = require("perf_hooks");

            process.on("exit", () => {
               console.log("NODE EXIT OCCURING...PRINTING METRICS");
               console.log("-------------------------------------");
               this.outputMetrics();
            });
        } else {
            this.isPerfEnabled = false;
        }
    }

    public clearMarks(name?: string) {
        if (this.isPerfEnabled) {
            this.perfHooks.performance.clearMarks(name);
        }
    }

    public mark(name: string) {
        if (this.isPerfEnabled) {
            this.perfHooks.performance.mark(name);
        }
    }

    public measure(name: string, startMark: string, endMark: string) {
        if (this.isPerfEnabled) {
            this.perfHooks.performance.measure(name, startMark, endMark);
        }
    }

    public timerify(fn: (...args: any[]) => any, name?: string) {
        if (this.isPerfEnabled) {
            // Check if we should use the function name or the passed name for tracking.
            if (name == null) {
                name = fn.name;
            }

            // Throw an error if the timer already exists in the map.
            if (this.functionTimers.has(name)) {
                throw new (require("./errors").TimerNameConflictError)(name);
            }

            // Create the observer and store it in the map.
            const observerObject: IFunctionTimer = {
                observer: undefined,
                originalFunction: fn,
                totalDuration: 0
            };

            this.functionTimers.set(name, observerObject);

            // Create a function observer
            observerObject.observer = new this.perfHooks.PerformanceObserver((list) => {
                const entries = list.getEntriesByName(fn.name);

                for (const entry of entries) {
                    observerObject.totalDuration += entry.duration;
                }
            });

            observerObject.observer.observe({entryTypes: ["function"], buffered: true});

            // Wrap the function in a timer
            return this.perfHooks.performance.timerify(fn);
        } else {
            // If performance is not enabled, we need to return the function
            // so original code doesn't get broken.
            return fn;
        }
    }

    /**
     * This method will close an observer that was opened through the {@link PerformanceTools#timerify}
     * function.
     *
     * @todo document
     */
    public untimerify(fn: ((...args: any[]) => any), name?: string) {
        if (this.isPerfEnabled) {
            let timer = fn.name;

            // Extract the name of the function if necessary
            if (name != null) {
                timer = name;
            } else {
                // When timerifing(?) functions, node will prepend the function
                // name with timerified . This regex will strip out that name
                timer = /timerified (.*)/g.exec(timer)[1];
            }

            const timerRef = this.functionTimers.get(timer);

            if (timerRef !== undefined) {
                timerRef.observer.disconnect();
                return timerRef.originalFunction;
            } else {
                throw new (require("./errors").TimerDoesNotExistError)(timer);
            }
        } else {
            return fn;
        }
    }

    /**
     * Output raw performance metrics to a file. Should be the last call in execution.
     */
    public outputMetrics() {
        if (this.isPerfEnabled) {
            console.log(this.perfHooks.performance.nodeTiming);
            console.log(this.functionTimers);
        }
    }
}

