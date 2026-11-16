import type { ProfileData } from '@/lib/store';
export default function PublicProfile({profile,onClick,preview=false}:{profile:ProfileData;onClick?:(id:string)=>void;preview?:boolean}){
 let linkIndex=0;
 return <div className={`public-profile theme-${profile.theme}`}><div className="public-content">
 {/* Avatar source is validated before storage or import. */}
 {/* eslint-disable-next-line @next/next/no-img-element */}
 <img className="profile-avatar" src={profile.avatar} alt={`${profile.name} 프로필`} width={96} height={96}/>
 <h1>{profile.name||'이름을 입력해 주세요'}</h1><p className="profile-bio">{profile.bio}</p>
 <div className="socials">{profile.socials.map(s=><a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" onClick={()=>{if(!preview)onClick?.('social:'+s.id)}} aria-label={`${s.title} (새 탭)`}>{s.title}</a>)}</div>
 <div className="public-links">{profile.items.filter(i=>i.enabled).map(i=>i.type==='section'?<h2 key={i.id}>{i.title}</h2>:<a key={i.id} className={`public-link ${linkIndex++===0?'featured':''}`} href={i.url} target="_blank" rel="noopener noreferrer" onClick={()=>{if(!preview)onClick?.(i.id)}}><span className="link-glyph" aria-hidden="true">{i.icon||'↗'}</span><span>{i.title}</span><span aria-hidden="true">↗</span></a>)}</div>
 {!profile.items.some(i=>i.enabled)&&<p className="muted">아직 공개된 링크가 없어요.</p>}
 <footer>mylink<span>.</span></footer></div></div>
}
