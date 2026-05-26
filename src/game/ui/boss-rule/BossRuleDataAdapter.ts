import { contentRegistry } from '../../systems/ContentRegistry';
import type { BossRuleCardEntry } from '../../systems/BossRuleSystem';
import type { StageEntry } from '../../systems/StageSystem';

export type BossRuleViewModel = {
  bossId: string;
  bossName: string;
  title: string;
  description: string;
  rules: string[];
  warning: string;
  bossIconAssetKey: string;
  ruleIconAssetKey: string;
  arenaBackgroundAssetKey: string;
};

export function buildBossRuleViewModel(stage: StageEntry | null, card: BossRuleCardEntry | null): BossRuleViewModel {
  const bossId = stage?.bossId ?? card?.bossId ?? 'mon_boss_cupcake_slime_king';
  const bossSlug = bossId.replace(/^mon_/, '');
  const monster = contentRegistry.getMonster(bossId) as { name?: string; iconKey?: string } | null;

  return {
    bossId,
    bossName: monster?.name ?? card?.name ?? 'Festival Boss',
    title: card?.title ?? 'Boss Rule Card',
    description: card?.description ?? 'A boss mechanic is warming up. Watch the board and adapt.',
    rules: card?.phaseRules?.slice(0, 3).map((rule) => `Phase ${rule.phase}: ${rule.effect}${rule.playerTip ? ` Tip: ${rule.playerTip}` : ''}`) ?? [],
    warning: 'Boss rules apply during this battle.',
    bossIconAssetKey: monster?.iconKey ?? `ico_${bossSlug}`,
    ruleIconAssetKey: `ico_boss_rule_${bossSlug}`,
    arenaBackgroundAssetKey: `bg_boss_${bossSlug.replace(/^boss_/, '')}_arena`
  };
}
