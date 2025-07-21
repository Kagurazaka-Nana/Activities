import { ActivityType } from 'premid'

const presence = new Presence({
  clientId: '1396557019728842853',
})
const browsingTimestamp = Math.floor(Date.now() / 1000)

enum ActivityAssets {
  Logo = 'https://i.imgur.com/OUMPrEw.png',
}

presence.on('UpdateData', async () => {
  const presenceData: PresenceData = {
    largeImageKey: ActivityAssets.Logo,
    type: ActivityType.Playing,
    startTimestamp: browsingTimestamp,
    details: 'Viewing other pages',
    // smallImageKey: Assets.Play,
  }

  const curPath = document.location.pathname

  // Exacting XP field
  const ps = document.querySelectorAll('div.tooltip-box > div.tooltip.bg-image-blue p');
  let currentXP, maxXP
  const xpBar = Array.from(ps).find(p => p.textContent?.includes('XP'));
  if (xpBar) {
    const xpText = (xpBar.textContent ?? '').trim()
    // 用正则提取数字部分
    const match = xpText.match(/(\d+)\s*\/\s*(\d+)/)
    if (match) {
      currentXP = Number.parseInt(match[1] ?? '-1', 10);
      maxXP = Number.parseInt(match[2] ?? '-1', 10);
    }
  }

  // Exacting role & level
  let role, level
  const container = document.querySelector('div.arcuata');
  if (container) {
    role = container.querySelector('p.font-bold')?.textContent?.trim();
    const levelText = container.querySelector('p.text-gray-400')?.textContent?.trim();
    const levelMatch = levelText?.match(/Level (\d+)/);
    level = levelMatch ? Number.parseInt(levelMatch[1] ?? '-1', 10) : null;
  }

  const username = (await presence.getSetting('username')).toString()
  const hasUsernameInSetting = !!username
  if(curPath.includes('dashboard')) {
    const stateText = `${hasUsernameInSetting ? username : 'Unknow User'} · ${currentXP} / ${maxXP} XP · ${role} · Level ${level}`
    presenceData.details = 'On the Dashboard'
    presenceData.state = stateText
  }

  presence.setActivity(presenceData)
})
