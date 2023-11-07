/**
 * VibrationProvider 클래스는 웹 애플리케이션에서 진동 기능을 제공합니다.
 * navigator.vibrate API를 사용하여 진동을 생성, 지속적인 진동을 생성 및 진동을 중지합니다.
 */
export class VibrationProvider {
    private static vibrateInterval: NodeJS.Timeout | null = null;
    private static repeatCount: number = 0;


    /**
     * 생성자 메서드입니다. VibrationProvider 클래스의 인스턴스를 생성하지 않도록 private로 설정되어 있습니다.
     */
    private constructor() { }



    /**
     * stopVibrate 메서드는 현재 진행 중인 진동을 중지합니다.
     */
    public static stopVibrate(): void {
        if (this.vibrateInterval) {
            clearInterval(this.vibrateInterval);
            this.vibrateInterval = null;
        }
        navigator.vibrate(0);
    }



    /**
     * vibrate 메서드는 주어진 기간 동안 진동을 생성합니다.
     * @param {number} duration - 진동의 기간을 밀리초 단위로 설정합니다.
     */
    public static vibrate(duration: number): void {
        this.stopVibrate();
        navigator.vibrate(duration);
    }



    /**
     * patternVibrate 메서드는 주어진 패턴으로 진동을 생성합니다.
     * @param {number[]} pattern - 진동과 정지의 패턴을 밀리초 단위로 설정합니다.
     */
    public static patternVibrate(pattern: number[]): void {
        this.stopVibrate();
        navigator.vibrate(pattern);
    }



    /**
     * sustainVibrate 메서드는 주어진 지속 시간과 간격으로 지속적인 진동을 생성합니다.
     * @param {number} duration - 각 진동의 기간을 밀리초 단위로 설정합니다.
     * @param {number} interval - 진동 간의 간격을 밀리초 단위로 설정합니다.
     * @param {number} maxDuration - 최대 지속 시간을 밀리초 단위로 설정합니다.
     */
    public static sustainVibrate(duration: number, interval: number, maxDuration: number): void {
        this.stopVibrate();
        const startTime = Date.now();
        this.vibrateInterval = setInterval(() => {
            if (Date.now() - startTime >= maxDuration) {
                this.stopVibrate();
            } else {
                navigator.vibrate(duration);
            }
        }, interval);
    }



    /**
     * repeatVibrate 메서드는 주어진 횟수만큼 진동을 생성합니다.
     * @param {number} duration - 각 진동의 기간을 밀리초 단위로 설정합니다.
     * @param {number} interval - 진동 간의 간격을 밀리초 단위로 설정합니다.
     * @param {number} repeat - 진동을 반복할 횟수를 설정합니다.
     */
    public static repeatVibrate(duration: number, interval: number, repeat: number): void {
        this.stopVibrate();
        this.repeatCount = 0;
        this.vibrateInterval = setInterval(() => {
            if (this.repeatCount >= repeat) {
                this.stopVibrate();
            } else {
                navigator.vibrate(duration);
                this.repeatCount += 1;
            }
        }, interval);
    }
}
