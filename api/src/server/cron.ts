import { CronJob } from "cron";

export class Crontab {
  private cronJobs: CronJob[] = [];

  constructor(
  ) {}

  async init() {
    this.cronJobs = [
      new CronJob("*/1 * * * *", () => this.checkMarginFiBalance()), // Every minute
    ];

    this.cronJobs.forEach((job) => job.start());
  }

  async checkMarginFiBalance(){
    return;
  }
}
