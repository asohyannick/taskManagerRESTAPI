let requestCount = 0;
let startTime = null;
let timerStarted = false;
const trackIncomingRequest = (req, res, next) => {
    if (!timerStarted) {
        timerStarted = true;
        startTime = new Date();
        setInterval(() => {
            if (startTime) {
                const currentTime = new Date();
                const elapsedTime = (currentTime.getTime() - startTime.getTime()) / (1000 *
                    60);
                console.log(`Requests received in the last ${elapsedTime.toFixed(2)} minutes: 
${requestCount}`);
                requestCount = 0;
                startTime = new Date();
            }
        }, 60 * 1000);
    }
    requestCount++;
    next();
};
export default trackIncomingRequest;
//# sourceMappingURL=timerMiddleware.timer.js.map