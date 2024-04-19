const { default: axios } = require("axios");
const moment = require("moment");
const readlineAsync = require("readline-sync");
var cron = require('node-cron');
require('dotenv').config();

const address = process.env.ADDRESS;
const idTelegram = process.env.ID_TELEGRAM;

sendTele(address)

let previousBalance = 0;


async function sendTele(address) {
    const hari = new Date();
    const hari_ini = moment(hari).format("DD-MM-YYYY hh:mm:ss");
    const cekWallet = await axios.get(`https://node.wdym.wtf/api/wdym/nodes/${address}/token`);
    const formattedTotalReward = Number(cekWallet.data.totalReward.toFixed(4));

    // Hitung selisih balance
    const balanceChange = formattedTotalReward - previousBalance;
    const balanceChangeMessage = balanceChange >= 0 ? `(+${balanceChange.toFixed(4)})` : `(${balanceChange.toFixed(4)})`;

    // Update balance sebelumnya dengan nilai terbaru
    previousBalance = formattedTotalReward;

    // Format pesan menggunakan Markdown untuk bold
    const message = `*Update:* ${hari_ini}\n*Balance:* ${formattedTotalReward} $WDYM ${balanceChangeMessage}`;

    try {
        // Perhatikan penambahan parameter parse_mode=Markdown
        const response = await axios.get(`https://api.telegram.org/bot6726659163:AAGoqsKmiNrVskYkwLuJ9gYSYKkPwJHwPqE/sendMessage?chat_id=${idTelegram}&text=${encodeURIComponent(message)}&parse_mode=Markdown`);
        console.log(`Update Balance  ${formattedTotalReward} $WDYM, Change: ${balanceChangeMessage}`)
    } catch (error) {
        console.log(error);
    }
}

cron.schedule('0 0 */1 * * *', () => {
    sendTele(address);
});
