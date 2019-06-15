import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as util from 'util';

export class Utils {
    /**
     * Calculate ideal salt rounds for server processing power.
     * @param cost - initial salt rounds
     */
    public static calculateIdealSaltRounds(cost: number) {
        const start = process.hrtime();
        bcrypt.hashSync('microbenchmark', cost);
        const end = process.hrtime(start);
        const execTimeMs = end[1] / 1000000;
        if (execTimeMs < 250) {
            Utils.calculateIdealSaltRounds(++cost);
        } else {
            process.env.BCRYPT_SALT_ROUNDS = cost.toString(10);
        }
    }

    public static getSecret(secretName: string): string {
      try {
        return fs.readFileSync(util.format("/run/secrets/%s", secretName), "utf8").trim();
      } catch(err) {
        return '';
      }
    }
}
