import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const layoutRoot = path.join(root, 'docs', 'ui', 'layouts');

const requiredLayoutIds = [
  'screen_splash',
  'screen_main_menu',
  'screen_hero_select',
  'screen_map',
  'screen_stage_intro',
  'screen_battle',
  'screen_boss_rule_card',
  'screen_route_dialogue',
  'screen_event_room',
  'screen_shop',
  'screen_inventory_modal',
  'screen_node_result',
  'screen_level_up',
  'screen_reward',
  'screen_victory_ending',
  'screen_defeat_summary',
  'screen_settings'
];

const requiredRootFields = [
  'screenId',
  'screenName',
  'canvas',
  'entryFrom',
  'exitTo',
  'purpose',
  'style',
  'codegraph',
  'fonts',
  'sections',
  'components',
  'assetPlaceholders',
  'interactions',
  'fallbackRules',
  'acceptanceCriteria'
];

const requiredComponentFields = [
  'id',
  'type',
  'assetKey',
  'fallbackAssetKey',
  'canonicalFolder',
  'expectedSourceSize',
  'runtimeRenderSize',
  'x',
  'y',
  'w',
  'h',
  'anchor',
  'fitMode',
  'scaleMode',
  'safePadding',
  'zIndex',
  'dynamicTextAllowed',
  'pixelPerfect'
];

const fitModes = new Set(['exact', 'contain', 'cover', 'nineSlice', 'tile', 'iconCenter', 'spriteAnchor', 'vfxCenter']);
const scaleModes = new Set(['none', 'integerOnly', 'fitInteger', 'uiStretchNineSlice', 'backgroundExact', 'textDynamic']);
const anchors = new Set(['topLeft', 'center', 'bottomCenter', 'gridTopLeft', 'vfxCenter']);

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function isIntegerRect(entry) {
  return ['x', 'y', 'w', 'h'].every((field) => Number.isInteger(entry[field]));
}

function validSize(value) {
  return value && Number.isInteger(value.w) && Number.isInteger(value.h) && value.w > 0 && value.h > 0;
}

function sameSize(left, right) {
  return validSize(left) && left.w === right.w && left.h === right.h;
}

function isRawAssetPath(assetKey) {
  return typeof assetKey === 'string' && (assetKey.includes('/assets/') || assetKey.startsWith('public/') || /\.(png|jpg|jpeg|webp)$/i.test(assetKey));
}

function inferredExpectedSourceSize(component) {
  const folder = String(component.canonicalFolder ?? '').toLowerCase();
  const key = String(component.assetKey ?? '').toLowerCase();
  const id = String(component.id ?? '').toLowerCase();
  const type = String(component.type ?? '');

  if (key.endsWith('__pose_sheet_2x2') || key.endsWith('__extended_sheet_2x2')) return { w: 1254, h: 1254 };
  if (folder.includes('/battle/') || id.includes('battle_background')) return { w: 1080, h: 480 };
  if (folder.includes('/puzzle/') || id.includes('puzzle_background')) return { w: 1080, h: 1056 };
  if (folder.includes('/mobile-controls/') || id.includes('controls_background')) return { w: 1080, h: 384 };
  if (folder.includes('/map/') || folder.includes('/route-scenes/') || folder.includes('/global-scenes/') || folder.includes('/story/endings/') || id.includes('background')) return { w: 1080, h: 1920 };
  if (id.includes('board_block') || folder.includes('/board-blocks/') || component.expectedSourceSize?.w === 24) {
    return type === 'iconSlot' || folder.includes('/icons/board-blocks/') ? { w: 48, h: 48 } : { w: 24, h: 24 };
  }
  if (folder.includes('/icons/map-nodes/') || folder.includes('/icons/map/')) return { w: 48, h: 48 };
  if (type === 'iconSlot' || type === 'portraitSlot' || type === 'spriteSlot' || type === 'vfxSlot' || folder.includes('/icons/') || folder.includes('/sprites/') || folder.includes('/effects/')) {
    return { w: 627, h: 627 };
  }
  return null;
}

function validateLayout(file, expectedScreenId) {
  const errors = [];
  let layout;
  try {
    layout = readJson(file);
  } catch (error) {
    return [`${path.relative(root, file)}: invalid JSON: ${error.message}`];
  }

  requiredRootFields.forEach((field) => {
    if (!(field in layout)) errors.push(`${layout.screenId ?? expectedScreenId}: missing root field ${field}`);
  });
  if (layout.screenId !== expectedScreenId) errors.push(`${expectedScreenId}: screenId mismatch ${layout.screenId}`);
  if (layout.canvas?.width !== 1080 || layout.canvas?.height !== 1920 || layout.canvas?.orientation !== 'portrait') {
    errors.push(`${expectedScreenId}: canvas must be 1080x1920 portrait`);
  }
  if (!Array.isArray(layout.sections)) {
    errors.push(`${expectedScreenId}: sections must be an array`);
  } else {
    layout.sections.forEach((section) => {
      if (!isIntegerRect(section)) errors.push(`${expectedScreenId}/${section.id}: section x/y/w/h must be integer pixels`);
    });
  }
  if (!Array.isArray(layout.components)) {
    errors.push(`${expectedScreenId}: components must be an array`);
  } else {
    layout.components.forEach((component) => {
      requiredComponentFields.forEach((field) => {
        if (!(field in component)) errors.push(`${expectedScreenId}/${component.id ?? 'unknown'}: missing component field ${field}`);
      });
      if (!isIntegerRect(component)) errors.push(`${expectedScreenId}/${component.id}: component x/y/w/h must be integer pixels`);
      if (!validSize(component.expectedSourceSize)) errors.push(`${expectedScreenId}/${component.id}: expectedSourceSize must have positive integer w/h`);
      if (!validSize(component.runtimeRenderSize)) errors.push(`${expectedScreenId}/${component.id}: runtimeRenderSize must have positive integer w/h`);
      if (typeof component.assetKey !== 'string' || component.assetKey.length === 0) errors.push(`${expectedScreenId}/${component.id}: assetKey must be non-empty`);
      if (typeof component.fallbackAssetKey !== 'string' || component.fallbackAssetKey.length === 0) errors.push(`${expectedScreenId}/${component.id}: fallbackAssetKey must be non-empty`);
      if (typeof component.canonicalFolder !== 'string' || component.canonicalFolder.length === 0) errors.push(`${expectedScreenId}/${component.id}: canonicalFolder must be non-empty`);
      if (isRawAssetPath(component.assetKey)) errors.push(`${expectedScreenId}/${component.id}: assetKey must be a key, not a raw public/assets path`);
      if (isRawAssetPath(component.fallbackAssetKey)) errors.push(`${expectedScreenId}/${component.id}: fallbackAssetKey must be a key, not a raw public/assets path`);
      if (!fitModes.has(component.fitMode)) errors.push(`${expectedScreenId}/${component.id}: unsupported fitMode ${component.fitMode}`);
      if (!scaleModes.has(component.scaleMode)) errors.push(`${expectedScreenId}/${component.id}: unsupported scaleMode ${component.scaleMode}`);
      if (!anchors.has(component.anchor)) errors.push(`${expectedScreenId}/${component.id}: unsupported anchor ${component.anchor}`);
      if (typeof component.safePadding !== 'number') errors.push(`${expectedScreenId}/${component.id}: safePadding must be numeric`);
      if (typeof component.zIndex !== 'number') errors.push(`${expectedScreenId}/${component.id}: zIndex must be numeric`);
      if (typeof component.dynamicTextAllowed !== 'boolean') errors.push(`${expectedScreenId}/${component.id}: dynamicTextAllowed must be boolean`);
      if (!component.pixelPerfect || component.pixelPerfect.integerCoordinates !== true || component.pixelPerfect.antiAliasing !== false || component.pixelPerfect.roundPixels !== true) {
        errors.push(`${expectedScreenId}/${component.id}: pixelPerfect flags must preserve integer nearest/pixelated rendering`);
      }
      if (component.pixelPerfect && !['nearest', 'pixelated'].includes(component.pixelPerfect.filtering)) {
        errors.push(`${expectedScreenId}/${component.id}: pixelPerfect.filtering must be nearest or pixelated`);
      }
      const inferredSize = inferredExpectedSourceSize(component);
      if (inferredSize && validSize(component.expectedSourceSize) && !sameSize(component.expectedSourceSize, inferredSize)) {
        errors.push(`${expectedScreenId}/${component.id}: expectedSourceSize ${component.expectedSourceSize.w}x${component.expectedSourceSize.h} does not match inferred ${inferredSize.w}x${inferredSize.h}`);
      }
    });
  }

  if (expectedScreenId === 'screen_battle') {
    const expectedSections = new Map([
      ['combat', '0,0,1080,480'],
      ['puzzle', '0,480,1080,1056'],
      ['controls', '0,1536,1080,384']
    ]);
    const requiredSections = [];
    expectedSections.forEach((rect, sectionId) => {
      const section = layout.sections?.find((entry) => entry.id === sectionId);
      if (!section || `${section.x},${section.y},${section.w},${section.h}` !== rect) {
        errors.push(`screen_battle/${sectionId}: expected exact section ${rect}`);
      } else {
        requiredSections.push(section);
      }
    });
    for (let i = 0; i < requiredSections.length; i += 1) {
      for (let j = i + 1; j < requiredSections.length; j += 1) {
        const a = requiredSections[i];
        const b = requiredSections[j];
        const overlaps = a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
        if (overlaps) errors.push(`screen_battle/${a.id}+${b.id}: sections must not overlap`);
      }
    }

    const combat = layout.sections?.find((entry) => entry.id === 'combat');
    const combatComponentIds = new Set(combat?.components ?? []);
    const requiredCombatComponents = new Map([
      ['header', ['battle_header_panel']],
      ['hero sprite slot', ['hero_sprite_slot']],
      ['hero stat cluster', ['hero_stat_cluster']],
      ['enemy sprite slot', ['enemy_sprite_slot']],
      ['enemy stat cluster', ['enemy_stat_cluster']],
      ['vfx lane', ['vfx_lane_center']],
      ['monster stack', ['monster_stack_chip']],
      ['event log', ['event_log_strip']]
    ]);
    requiredCombatComponents.forEach((ids, label) => {
      if (!ids.some((id) => combatComponentIds.has(id))) {
        errors.push(`screen_battle/combat: missing required UI-5 ${label} component (${ids.join(' or ')})`);
      }
    });

    const combatBounds = { x: 0, y: 0, w: 1080, h: 480 };
    const combatComponents = layout.components?.filter((component) => combatComponentIds.has(component.id)) ?? [];
    combatComponents.forEach((component) => {
      const inside =
        component.x >= combatBounds.x &&
        component.y >= combatBounds.y &&
        component.x + component.w <= combatBounds.x + combatBounds.w &&
        component.y + component.h <= combatBounds.y + combatBounds.h;
      if (!inside) {
        errors.push(`screen_battle/${component.id}: combat component must stay within x0 y0 w1080 h480`);
      }
      if (component.y + component.h > 480) {
        errors.push(`screen_battle/${component.id}: combat component extends into puzzle section`);
      }
    });
    ['event_log_strip', 'monster_stack_chip'].forEach((id) => {
      const component = layout.components?.find((entry) => entry.id === id);
      if (component && component.y + component.h > 480) {
        errors.push(`screen_battle/${id}: must stay fully inside combat section`);
      }
    });
  }

  return errors;
}

const errors = [];
requiredLayoutIds.forEach((screenId) => {
  const file = path.join(layoutRoot, `${screenId}.layout.json`);
  if (!fs.existsSync(file)) {
    errors.push(`${path.relative(root, file)}: missing required layout file`);
    return;
  }
  errors.push(...validateLayout(file, screenId));
});

if (errors.length > 0) {
  console.error(`UI layout validation failed with ${errors.length} error(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`UI layout validation passed (${requiredLayoutIds.length} layout specs).`);
