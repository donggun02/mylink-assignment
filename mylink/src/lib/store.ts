export type Theme = 'blue' | 'dark' | 'festival';
export type Item = { id: string; type: 'link' | 'section'; title: string; url: string; icon: string; enabled: boolean };
export type Social = { id: string; title: string; url: string };
export type ProfileData = { name: string; bio: string; avatar: string; socials: Social[]; theme: Theme; items: Item[] };
export type Stats = { visitors: string[]; clicks: Record<string, number>; days: Record<string, { views: number; clicks: number }> };
export type Document = { version: 1; profile: ProfileData; stats: Stats };
export const KEY = 'mylink-document-v1';
export const initial: Document = { version: 1, profile: { name: '김동건', bio: '한양대학교 컴퓨터소프트웨어학부 김동건입니다.', avatar: '/avatar.svg', socials: [{ id: 'github', title: 'GitHub', url: 'https://github.com/donggun02' }], theme: 'blue', items: [{ id: 'section-1', type: 'section', title: '여기에서 만나요', url: '', icon: '', enabled: true }, { id: 'github-link', type: 'link', title: 'GitHub', url: 'https://github.com/donggun02', icon: '↗', enabled: true }, { id: 'school-link', type: 'link', title: '한양대학교', url: 'https://www.hanyang.ac.kr/', icon: 'H', enabled: true }] }, stats: { visitors: [], clicks: {}, days: {} } };
export const validUrl = (url: string) => { try { return ['http:', 'https:'].includes(new URL(url).protocol); } catch { return false; } };
export function validProfile(value: unknown): value is ProfileData {
 if (!value || typeof value !== 'object') return false;
 const p = value as ProfileData;
 return typeof p.name === 'string' && p.name.length <= 60 && typeof p.bio === 'string' && p.bio.length <= 300 && typeof p.avatar === 'string' && (p.avatar === '/avatar.svg' || validUrl(p.avatar) || /^data:image\/(png|jpeg|webp);base64,/.test(p.avatar)) && ['blue','dark','festival'].includes(p.theme) && Array.isArray(p.items) && p.items.length <= 100 && new Set(p.items.map(x=>x.id)).size === p.items.length && p.items.every(x=>typeof x.id==='string' && ['link','section'].includes(x.type) && typeof x.title==='string' && x.title.length<=100 && typeof x.enabled==='boolean' && typeof x.icon==='string' && x.icon.length<=8 && typeof x.url==='string' && (x.type==='section'||validUrl(x.url))) && Array.isArray(p.socials) && p.socials.length<=8 && p.socials.every(x=>typeof x.id==='string'&&typeof x.title==='string'&&x.title.length<=30&&validUrl(x.url));
}
export function readDocument(): Document {
 const raw=localStorage.getItem(KEY); if(!raw) return structuredClone(initial);
 const d=JSON.parse(raw) as Document;
 if(d.version!==1 || !validProfile(d.profile) || !d.stats || !Array.isArray(d.stats.visitors) || !d.stats.clicks || !d.stats.days) throw new Error('저장 데이터를 읽을 수 없어요. 브라우저 데이터를 확인해 주세요.');
 return d;
}
export function writeDocument(d: Document) { localStorage.setItem(KEY, JSON.stringify(d)); window.dispatchEvent(new Event('mylink-change')); }
export const today = () => { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
export function record(kind: 'view'|'click', id?: string) {
 const d=readDocument(); const day=today(); const row=d.stats.days[day]??{views:0,clicks:0};
 if(kind==='view') { let visitor=localStorage.getItem('mylink-visitor'); if(!visitor){visitor=crypto.randomUUID(); localStorage.setItem('mylink-visitor', visitor);} if(!d.stats.visitors.includes(visitor)) d.stats.visitors.push(visitor); const visitKey='mylink-view-'+day; if(sessionStorage.getItem(visitKey)) return; sessionStorage.setItem(visitKey,'1'); row.views++; }
 else if(id) { d.stats.clicks[id]=(d.stats.clicks[id]??0)+1; row.clicks++; }
 d.stats.days[day]=row; writeDocument(d);
}
