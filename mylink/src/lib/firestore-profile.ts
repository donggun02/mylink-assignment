import { collection, doc, getDocFromServer, getDocsFromServer, serverTimestamp, writeBatch } from 'firebase/firestore';
import { database } from './firebase';
import { initial, validProfile, type Item, type ProfileData } from './store';

const owner = 'anonymous';

export async function loadRemoteProfile(): Promise<ProfileData> {
  const db = database();
  const [user, links] = await Promise.all([
    getDocFromServer(doc(db, 'users', owner)),
    getDocsFromServer(collection(db, 'users', owner, 'links')),
  ]);
  const metadata = user.exists() ? user.data().profile : undefined;
  const ordered = links.docs.map(snapshot => ({ ...snapshot.data(), id: snapshot.id } as Item & { order: number }));
  ordered.sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.id.localeCompare(b.id));
  const items: Item[] = ordered.map(item => ({
    id: item.id,
    type: item.type ?? 'link',
    title: item.title,
    url: item.url ?? '',
    icon: item.icon ?? '↗',
    enabled: item.enabled ?? true,
  }));
  const profile: ProfileData = { ...initial.profile, ...(metadata ?? {}), items };
  if (!validProfile(profile)) throw new Error('서버의 프로필 데이터 형식이 올바르지 않아요.');
  return profile;
}

export async function saveRemoteProfile(before: ProfileData, after: ProfileData): Promise<void> {
  if (!validProfile(after) || after.items.some(item => !/^[a-zA-Z0-9_-]{1,128}$/.test(item.id))) {
    throw new Error('저장할 프로필 데이터가 올바르지 않아요.');
  }
  const db = database();
  const batch = writeBatch(db);
  const { items, ...metadata } = after;
  const { items: previousItems, ...previousMetadata } = before;
  if (new TextEncoder().encode(JSON.stringify(metadata)).byteLength > 900_000) {
    throw new Error('프로필 데이터가 너무 커요. 더 작은 이미지를 사용해 주세요.');
  }
  if (JSON.stringify(metadata) !== JSON.stringify(previousMetadata)) {
    batch.set(doc(db, 'users', owner), { profile: metadata, updatedAt: serverTimestamp() }, { merge: true });
  }
  const previous = new Map(previousItems.map((item, order) => [item.id, { ...item, order }]));
  for (const [order, item] of items.entries()) {
    const data = { ...item, order };
    if (JSON.stringify(previous.get(item.id)) !== JSON.stringify(data)) {
      const timestamps = previous.has(item.id)
        ? { updatedAt: serverTimestamp() }
        : { createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
      batch.set(doc(db, 'users', owner, 'links', item.id), { ...data, ...timestamps }, { merge: true });
    }
    previous.delete(item.id);
  }
  for (const id of previous.keys()) batch.delete(doc(db, 'users', owner, 'links', id));
  await batch.commit();
}

export function cloudError(error: unknown): string {
  const code = error && typeof error === 'object' && 'code' in error ? String(error.code) : '';
  if (code.includes('permission-denied')) return 'Firestore 접근이 거부됐어요. 데이터베이스 생성과 테스트 규칙의 만료일을 확인해 주세요.';
  if (code.includes('unavailable')) return 'Firestore 서버에 연결하지 못했어요. 인터넷 연결을 확인한 뒤 다시 시도해 주세요.';
  if (code.includes('invalid-argument') || code.includes('api-key')) return 'Firebase 웹 앱 설정값을 확인해 주세요.';
  return error instanceof Error ? error.message : '클라우드 연결 중 문제가 생겼어요.';
}
