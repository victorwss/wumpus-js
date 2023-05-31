"use strict";

function mainLoop(tickInterval, actionCallback, drawCallback) {
    let now = new Date().getTime();
    let lag = 0;
    let tickCount = 0n;

    function cycle() {
        const before = now;
        now = new Date().getTime();
        const elapsed = now - before;
        lag += elapsed;
        if (tickInterval > lag) return;

        while (lag >= tickInterval) {
            lag -= tickInterval;
            tickCount++;
            actionCallback(tickCount);
        }

        drawCallback(tickCount);
    }

    async function loop() {
        function frame() {
            return new Promise((resolve, reject) => {
                requestAnimationFrame(() => {
                    cycle();
                    resolve(1);
                });
            });
        }
        while (true) {
            await frame();
        }
    }

    loop();
}