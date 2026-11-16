'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import PublicProfile from './PublicProfile';
import {readDocument,record,validProfile,type ProfileData} from '@/lib/store';
export default function PublicView(){
 const [profile,setProfile]=useState<ProfileData|null>(null); const [message,setMessage]=useState(''); const [shared,setShared]=useState(false);
 useEffect(()=>{const load=()=>{setMessage('');try{const raw=new URLSearchParams(location.hash.slice(1)).get('profile'); if(raw){const p=JSON.parse(raw);if(!validProfile(p))throw Error('공유 주소가 올바르지 않아요.');setProfile(p);setShared(true);}else{setProfile(readDocument().profile);setShared(false);record('view');}}catch(e){setProfile(null);setMessage(e instanceof Error?e.message:'프로필을 불러올 수 없어요.');}};load();window.addEventListener('hashchange',load);return()=>window.removeEventListener('hashchange',load);},[]);
 return <><nav className="public-nav"><Link href="/">mylink.</Link><Link href="/mypage">내 페이지 편집</Link></nav>{message?<div className="load-state" role="alert">{message}<Link href="/mypage">편집기로 돌아가기</Link></div>:profile?<PublicProfile profile={profile} onClick={id=>{if(!shared)try{record('click',id)}catch{setMessage('클릭은 열렸지만 통계를 저장하지 못했어요.')}}}/>:<div className="load-state">프로필을 불러오고 있어요.</div>}<p className="public-notice">{shared?'공유 시점의 프로필이에요. 수정 내용은 새 공유 주소에 반영돼요.':'이 브라우저에 저장된 프로필이에요.'}</p></>;
}
