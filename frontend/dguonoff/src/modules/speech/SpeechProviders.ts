


/**
 * SpeechOutputProvider 클래스는 speechSynthesis API를 사용하여 텍스트를 음성으로 변환하며,
 * 시스템에 설치된 음성 목록을 관리합니다.
 */
export class SpeechOutputProvider {
    private static voices: SpeechSynthesisVoice[] | null = null;


    /**
     * 생성자 메서드입니다. SpeechOutputProvider 클래스의 인스턴스를 생성하지 않도록 private로 설정되어 있습니다.
     */
    private constructor() { }



    /**
     * populateVoiceList 메서드는 시스템에 설치된 음성 목록을 가져와서 정렬합니다.
     * 이 메서드는 voiceschanged 이벤트가 발생하면 호출됩니다.
     * @returns {Promise<SpeechSynthesisVoice[]>} 정렬된 음성 목록을 반환합니다.
     */
    private static async populateVoiceList(): Promise<SpeechSynthesisVoice[]> {
        return new Promise((resolve) => {
            const synth = window.speechSynthesis;

            // voiceschanged 이벤트가 발생하면 음성 목록을 가져와서 정렬
            synth.onvoiceschanged = () => {
                const voices = synth.getVoices().sort((a, b) => {
                    const aname = a.name.toUpperCase();
                    const bname = b.name.toUpperCase();
                    if (aname < bname) return -1;
                    else if (aname === bname) return 0;
                    else return +1;
                });

                resolve(voices);  // 정렬된 음성 목록을 반환
            };

            // 만약 음성 목록이 이미 사용 가능하면, 이벤트를 기다리지 않고 목록을 바로 반환
            if (synth.getVoices().length !== 0) {
                synth.onvoiceschanged = null;  // 이벤트 핸들러를 제거
                resolve(synth.getVoices());
            }
        });
    }



    /**
     * getVoices 메서드는 이미 준비된 음성 목록을 반환하거나,
     * 음성 목록이 아직 준비되지 않았다면 populateVoiceList 메서드를 호출하여 준비합니다.
     * @returns {Promise<SpeechSynthesisVoice[]>} 음성 목록을 반환합니다.
     */
    private static async getVoices(): Promise<SpeechSynthesisVoice[]> {
        if (!this.voices) {
            this.voices = await this.populateVoiceList();
        }
        return this.voices;
    }



    /**
     * clearSpeak 메서드는 현재 음성을 중지하고 모든 대기 중인 음성을 제거합니다.
     */
    public static clearSpeak(): void {
        const synth = window.speechSynthesis;

        if (synth.speaking) {
            synth.cancel();
        }
    }



    /**
     * speak 메서드는 주어진 텍스트를 읽습니다.
     * 프로미스를 반환하여 음성이 완전히 읽힐 때까지 기다리게 할 수 있습니다.
     * @param {string} textToRead - 읽을 텍스트입니다.
     */
    public static async speak(textToRead: string): Promise<void> {
        const synth = window.speechSynthesis;

        if (textToRead !== "") {
            const voices = await this.getVoices();  // 음성 목록을 가져옴
            const utterThis = new SpeechSynthesisUtterance(textToRead);
            utterThis.voice = voices.find(voice => voice.lang === 'ko-KR') || voices[0];
            utterThis.pitch = 1;
            utterThis.rate = 1;

            // 현재 말하고 있는 경우, 그것을 중지
            if (synth.speaking) {
                synth.cancel();
            }

            return new Promise<void>((resolve) => {
                utterThis.onend = () => resolve();
                synth.speak(utterThis);
            });
        }
    }

}







/**
 * SpeechInputProvider 클래스는 SpeechRecognition API를 사용하여 음성 인식을 제공합니다.
 */
export class SpeechInputProvider {
    private static recognition: SpeechRecognition | null = null;


    /**
     * 생성자 메서드입니다. SpeechInputProvider 클래스의 인스턴스를 생성하지 않도록 private로 설정되어 있습니다.
     */
    private constructor() { }



    /**
     * initializeRecognition 메서드는 SpeechRecognition 객체를 초기화합니다.
     * 이 메서드는 음성 인식을 지원하지 않는 브라우저에서는 오류를 출력합니다.
     */
    private static initializeRecognition(): void {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = true;  // 연속적인 음성 인식을 사용
            this.recognition.interimResults = true;  // 중간 결과를 반환
        } else {
            console.error('Speech recognition not supported in this browser.');
        }
    }



    /**
    * startRecognition 메서드는 음성 인식을 시작합니다.
    * 인식된 음성 텍스트는 지정된 콜백 함수에 전달됩니다.
    * @param {Function} onResult - 인식된 텍스트를 처리하는 콜백 함수입니다.
    */
    public static startRecognition(onResult: (result: string) => void): void {
        if (!this.recognition) {
            this.initializeRecognition();
        }
        if (this.recognition) {
            this.recognition.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0])
                    .map(result => result.transcript)
                    .join('');
                onResult(transcript);  // 결과를 반환하는 콜백 함수 호출
            };
            this.recognition.start();
        }
    }



    /**
     * stopRecognition 메서드는 현재 진행 중인 음성 인식을 중지합니다.
     */
    public static stopRecognition(): void {
        if (this.recognition) {
            this.recognition.stop();
        }
    }
}
