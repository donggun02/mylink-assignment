'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PublicProfile from './PublicProfile';
import { readDocument, record, validProfile, type ProfileData } from '@/lib/store';
import { firebaseConfigured } from '@/lib/firebase';
import { cloudError, loadRemoteProfile } from '@/lib/firestore-profile';

export default function PublicView() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [message, setMessage] = useState('');
  const [shared, setShared] = useState(false);
  const [trackingError, setTrackingError] = useState('');

  useEffect(() => {
    let generation = 0;
    let alive = true;
    const load = async () => {
      const current = ++generation;
      setMessage(''); setProfile(null);
      try {
        const raw = new URLSearchParams(location.hash.slice(1)).get('profile');
        let next: ProfileData;
        if (raw) {
          const parsed: unknown = JSON.parse(raw);
          if (!validProfile(parsed)) throw new Error('공유 주소가 올바르지 않아요.');
          next = parsed;
        } else {
          next = firebaseConfigured ? await loadRemoteProfile() : readDocument().profile;
        }
        if (!alive || current !== generation) return;
        setProfile(next); setShared(Boolean(raw));
        if (!raw) {
          try { record('view'); } catch { setTrackingError('방문 통계를 이 브라우저에 저장하지 못했어요.'); }
        }
      } catch (error) {
        if (alive && current === generation) setMessage(cloudError(error));
      }
    };
    void load();
    const change = () => void load();
    window.addEventListener('hashchange', change);
    return () => { alive = false; window.removeEventListener('hashchange', change); };
  }, []);

  return <>
    <nav className="public-nav"><Link href="/">mylink.</Link><Link href="/mypage">내 페이지 편집</Link></nav>
    {message ? <div className="load-state" role="alert">{message}<Link href="/mypage">편집기로 돌아가기</Link></div>
      : profile ? <PublicProfile profile={profile} onClick={id => {
        if (!shared) try { record('click', id); } catch { setTrackingError('링크는 열렸지만 클릭 통계를 저장하지 못했어요.'); }
      }} /> : <div className="load-state">프로필을 불러오고 있어요.</div>}
    <p className="public-notice">{shared ? '공유 시점의 프로필이에요. 수정 내용은 새 공유 주소에 반영돼요.'
      : firebaseConfigured ? '서버에 저장된 프로필이에요. 현재는 공동 테스트 공간이에요.' : '이 브라우저에 저장된 프로필이에요.'}</p>
    {trackingError && <p className="public-notice" role="status">{trackingError}</p>}
  </>;
}
