export default class Stopwtach {
    interval: any
    currentSecond = 0
    currentHundredth = 0
    limit: number = 0
    onUpdateSecond: (second: number) => void = () => { }
    onUpdateTick: (hundredth: number) => void = () => { }
    finishCallback: () => void = () => { }

    public start() {
        this.interval = setInterval(() => {

            this.currentHundredth += 1
            if (this.currentHundredth >= 100) {
                this.currentSecond += 1
                this.currentHundredth = 0

                this.onUpdateSecond(this.currentSecond)
            }

            this.onUpdateTick(this.currentHundredth)

            if (this.currentSecond >= this.limit) {
                this.finishCallback()
            }
        }, 10)
    }

    public stop() {
        clearInterval(this.interval)
    }

    public reset(seconds: number) {
        this.limit = seconds
        this.currentSecond = 0
        this.currentHundredth = 0
        this.onUpdateSecond(this.currentSecond)
        this.onUpdateTick(this.currentHundredth)
    }
}

