import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { normalizeSuiAddress } from '@mysten/sui/utils';

const client = new SuiClient({
    url: getFullnodeUrl("mainnet"),
});

const wl: string[] = [
    '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC', // Circle Native USDC
    '0x357b8be077a7c93278262c6f53e887250772c26fb28b5e16a8cddf2bec404816::ausd::AUSD'  // Agora USD
];

const denyFeat: string[] = ['deny_list', 'DenyList', 'DenyCap'];

const defaultOptions = {
	showType: true,
	showContent: true,
	showOwner: false,
	showPreviousTransaction: false,
	showStorageRebate: false,
	showDisplay: false,
};

export const isHoneyPot = async (ca: string): Promise<boolean> => {
    let isHoneyPot = false;

    if (wl.includes(ca)) {
        return isHoneyPot
    }

    const info = ca.split('::');
    const package_id = info[0] && normalizeSuiAddress(info[0]);
    const module_id = info[1];

    const res = await client.getObject({ id: package_id, options: defaultOptions });
    const bytecode = 'disassembled' in res.data!.content! ? res.data!.content.disassembled[module_id] : null;
    
    if (bytecode && typeof bytecode === 'string') {
        const regex = new RegExp(denyFeat.join('|'), 'i');
        if (regex.test(bytecode)) {
            isHoneyPot = true;
        }
    }

    return isHoneyPot
}
