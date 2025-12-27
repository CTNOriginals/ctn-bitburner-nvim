import { Logger } from "./logging/index.ts"
import * as Worm from './hack/worm.ts'

export enum Pages {
	// Bitburner v2.6.2,
	// Hacking,
	Terminal = <any>"Terminal",
	Script_Editor = <any>"Script Editor",
	Active_Scripts = <any>"Active Scripts",
	Create_Program = <any>"Create Program",
	// Character,
	Stats = <any>"Stats",
	Factions = <any>"Factions",
	Augmentations = <any>"Augmentations",
	Hacknet = <any>"Hacknet",
	// World,
	City = <any>"City",
	Travel = <any>"Travel",
	Job = <any>"Job",
	Corporation = <any>"Corporation",
	Gang = <any>"Gang",
	IPvGO_Subnet = <any>"IPvGO Subnet",
	// Help,
	Milestones = <any>"Milestones",
	Documentation = <any>"Documentation",
	Achievements = <any>"Achievements",
	Options = <any>"Options",
}

const win = eval('window') as Window;
const doc = eval('document') as Document;

export function getElementByXPath(path: string): Node | null {
	return doc.evaluate(path, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

/** Get an HTML element by their XPath once it exists */
export async function getElementOnceAvailable(XPath: string, interval = 500, maxTries = 1000): Promise<HTMLElement | null> {
	let tryCount = 0;
	return new Promise((resolve) => {
		const intervalId = win.setInterval(() => {
			let element = getElementByXPath(XPath);
			if (element) {
				resolve(element as HTMLElement);
				win.clearInterval(intervalId);
			}
			if (maxTries > 0) {
				tryCount++;
				if (maxTries === tryCount) {
					resolve(null);
					win.clearInterval(intervalId);
					console.log(`Could not find the element by its XPAth after ${tryCount} tries\nXPath: ${XPath}`);
				}
			}
		}, interval);
	});
}

export function getActiveSidebarElement() {
	for (let i = 0; i < sidebardButtonList.length; i++) {
		const button = sidebardButtonList[i];
		if (button.classList.contains(sidebarListItemActiveClass)) {
			return button;
		}
	}
}
export function getActivePage(): Pages {
	const activeText = getActiveSidebarElement()?.textContent?.split(' ').join('_')
	return Pages[(activeText as keyof Pages ?? 0)];
}
function getTabFromText(text: string): Tabs {
	return Pages[(text.split(' ').join('_') as keyof Pages ?? 0)]
	// return Tabs[text.replace(' ', '_') as keyof Tabs];
}

enum Tabs {
	None = 'None',
	IPvGO_Subnet = 'IPvGO Subnet',
	Status = 'Status',
	History = 'History',
	How_To_Play = 'How To Play'
}

const sidebarListItemClass = 'MuiListItem-button'; //? the class on each sidebar button
const sidebarListItemActiveClass = 'css-ljlede-listitem-active';

const sidebar = await getElementOnceAvailable('/html/body/div[1]/div[2]/div[1]/div/ul', 100, 100);
const sidebardButtonList = (sidebar as HTMLElement).getElementsByClassName(sidebarListItemClass);

const tabsBarPath = '/html/body/div[1]/div[2]/div[2]/div/div[1]/div/div';

async function init() {
	const tabsBar = await getElementOnceAvailable(tabsBarPath, 100, 10);
	if (!tabsBar) return;

	let activeTab: Tabs = Tabs.None;
	while (true) {
		const selected = tabsBar.getElementsByClassName('Mui-selected');
		const selectedTab = getTabFromText(selected[0].textContent!);

		if (selectedTab.toString() !== activeTab.toString()) {
			if (selectedTab == 'IPvGO Subnet') {
				const goBaord = doc.getElementById('goGameboard');
				goBaord!.style.rotate = '90deg';
			}

			activeTab = selectedTab;
		}

		await thisNS.asleep(1000)
		if (getActivePage() != Pages.IPvGO_Subnet) {
			break;
		}
	}
}

let thisNS: NS
export async function main(ns: NS) {
	ns.disableLog('ALL')
	const logger = new Logger(ns)
	thisNS = ns
	init()

	let activePage = Pages.Terminal; //? the last know and initiated page
	while (true) {
		const page = getActivePage(); //? the actual current page

		if (activePage != page) {
			switch (page) {
				// case Pages.Gang: {
				// 	GangPage.main(fakeNS);
				// } break;
				case Pages.IPvGO_Subnet: {
					// ipvgo.init();
					init();
				} break;
				default: break;
			}

			activePage = page;
		}

		await ns.asleep(1000);
	}
}

// export async function main(ns: NS) {
// 	ns.disableLog('ALL')
// 	const logger = new Logger(ns)
//
// 	let first = true
//
// 	await Worm.ServerWorm(ns, 'home', (server) => {
// 		const ls = ns.ls(server.hostname, '.cct')
//
// 		if (ls.length == 0) {
// 			return
// 		}
//
// 		logger.log(`---- ${server.hostname} ----`)
// 		logger.log(ls.join('\n'))
//
// 		// ns.scp(ls, 'home', server.hostname)
// 		// for (const file of ls) {
// 		// 	ns.rm(file, server.hostname)
// 		// }
//
// 		logger.log(`---- ----\n\n`)
// 	}, false, false, true)
//
// 	for (const file of ns.ls('home', '.cct')) {
// 		ns.mv('home', file, 'contracts/' + file)
// 	}
// }

type TTestScript = RunningScript | RecentScript | null
function getTestScript(ns: NS): TTestScript {
	let testScript: TTestScript = null
	for (const script of ns.ps()) {
		if (!script.args.includes('--watch')) {
			continue
		}

		return ns.getRunningScript(script.pid)!
	}

	for (const script of ns.getRecentScripts().reverse()) {
		if (!script.args.includes('--watch')) {
			continue
		}
		return script
	}

	return null
}

