import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { copy, locales, projects, services } from '../src/lib/content';
test('all interface copy has complete language coverage',()=>{
  for(const [key,value] of Object.entries(copy)) for(const l of locales){ assert.ok(value[l],`${key}.${l}`);if(Array.isArray(value.ru)) assert.equal((value[l] as string[]).length,value.ru.length); }
});
test('services and projects have complete translations, unique slugs and valid references',()=>{
  assert.equal(new Set(services.map(s=>s.slug)).size,6);assert.equal(new Set(projects.map(p=>p.slug)).size,12);
  for(const s of services){for(const l of locales){assert.ok(s.title[l]);assert.ok(s.description[l]);assert.ok(s.need[l]);assert.equal(s.items[l].length,4);}for(const slug of s.projects)assert.ok(projects.some(p=>p.slug===slug));}
  for(const p of projects){for(const l of locales)for(const k of ['title','client','task','solution','result','metric','location'] as const)assert.ok(p[k][l]);for(const image of p.images)assert.ok(existsSync(path.join(process.cwd(),'public/images',image)),image);}
});
