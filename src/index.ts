import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { normalizeSuiAddress } from '@mysten/sui/utils';

const client = new SuiClient({
    url: getFullnodeUrl("mainnet"),
});

const wl: string[] = [
    '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC',     // Circle Native USDC
    '0x2053d08c1e2bd02791056171aab0fd12bd7cd7efad2ab8f6b9c8902f14df2ff2::ausd::AUSD',     // Agora USD
    '0xf16e6b723f242ec745dfd7634ad072c42d5c1d9ac9d62a39c381303eaa57693a::fdusd::FDUSD',   // FDUSD
    '0x960b531667636f39e85867775f52f6b1f220a058c4de786905bdf761e06a56bb::usdy::USDY',     // Ondo USDY
    '0x294de7579d55c110a00a7c4946e09a1b5cbeca2592fbb83fd7bfacba3cfeaf0e::drf::DRF',       // DRF
    '0x3e8e9423d80e1774a7ca128fccd8bf5f1f7753be658c5e645929037f7c819040::lbtc::LBTC',     // Lombard
    '0xb45fcfcc2cc07ce0702cc2d229621e046c906ef14d9b25e8e4d25f6e8763fef7::send::SEND'
];

const denyFeat: string[] = ['deny_list', 'DenyList', 'DenyCap', 'create_regulated_currency'];

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
