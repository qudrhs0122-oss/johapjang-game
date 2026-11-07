// 토스 미니앱 전용: 앱인토스 광고(loadFullScreenAd/showFullScreenAd)로 게임의 showAd를 교체합니다.
// ads.json 에 콘솔에서 발급받은 광고 그룹 ID를 넣으면 실제 광고가 나가고, 비어 있으면 '광고 준비 중(무료 지급)'으로 동작합니다.
import { loadFullScreenAd, showFullScreenAd } from '@apps-in-toss/web-framework';
import cfg from './ads.json';

const ids = { inter: cfg.interstitial || '', reward: cfg.rewarded || '' };
const ready = { inter: false, reward: false };
const supported = () => { try { return !!(loadFullScreenAd.isSupported && loadFullScreenAd.isSupported()); } catch (e) { return false; } };
const say = (m) => { try { window.toast ? window.toast(m) : null; } catch (e) {} };
const st = (ev, k) => { try { window.stat && window.stat(ev, k); } catch (e) {} };

function load(k) {
  if (!ids[k] || !supported()) return;
  try {
    loadFullScreenAd({ options: { adGroupId: ids[k] },
      onEvent: (e) => { if (e.type === 'loaded') ready[k] = true; },
      onError: () => { ready[k] = false; } });
  } catch (e) {}
}
load('inter'); load('reward');

const fallback = window.showAd;
let lastInterAt = 0;
window.showAd = function (cb, inter, tag) {
  const k = inter ? 'inter' : 'reward';
  if (!ids[k] || !supported()) return fallback(cb, inter, tag);
  if (inter) {
    if (Date.now() - lastInterAt < 180000 || !ready.inter) { cb(); return; }
    lastInterAt = Date.now();
  } else {
    st('reward_click', tag);
    if (!ready.reward) { say('광고를 준비하고 있어요. 잠시 후 다시 시도해 주세요.'); load('reward'); return; }
  }
  ready[k] = false;
  let earned = false, done = false;
  const finish = (type) => {
    if (done) return; done = true; load(k);
    if (inter) { st(type === 'dismissed' ? 'inter_shown' : 'inter_none', tag); cb(); return; }
    if (earned) { st('reward_done', tag); cb(); }
    else if (type === 'dismissed') say('광고를 끝까지 보면 혜택을 받을 수 있어요.');
    else { st('reward_nofill', tag); say('지금은 볼 수 있는 광고가 없어요. 잠시 후 다시 시도해 주세요.'); }
  };
  try {
    showFullScreenAd({ options: { adGroupId: ids[k] },
      onEvent: (e) => {
        if (e.type === 'userEarnedReward') earned = true;
        if (e.type === 'dismissed' || e.type === 'failedToShow') finish(e.type);
      },
      onError: () => finish('error') });
  } catch (e) { finish('error'); }
};
