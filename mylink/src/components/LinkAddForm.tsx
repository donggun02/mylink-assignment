'use client';

import { useState, type FormEvent } from 'react';
import { validUrl } from '@/lib/store';

type Props = {
  disabled: boolean;
  onAdd: (title: string, url: string) => boolean;
};

export default function LinkAddForm({ disabled, onAdd }: Props) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [validation, setValidation] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (disabled) return;
    const cleanTitle = title.trim();
    const cleanUrl = url.trim();
    if (!cleanTitle) {
      setValidation('제목을 입력해주세요');
      window.alert('제목을 입력해주세요');
      return;
    }
    if (!cleanUrl) {
      setValidation('주소를 입력해주세요');
      window.alert('주소를 입력해주세요');
      return;
    }
    if (!validUrl(cleanUrl)) {
      setValidation('올바른 주소를 입력해주세요');
      window.alert('올바른 주소를 입력해주세요');
      return;
    }
    if (onAdd(cleanTitle, cleanUrl)) {
      setValidation('');
      setTitle('');
      setUrl('');
    }
  }

  return (
    <section className="panel link-add-panel" aria-labelledby="link-add-heading">
      <h2 id="link-add-heading">링크 추가</h2>
      <form noValidate onSubmit={submit}>
        {validation && <p className="alert error" role="alert">{validation}</p>}
        <label htmlFor="new-link-title">제목</label>
        <input id="new-link-title" name="title" value={title}
          onChange={event => setTitle(event.target.value)}
          placeholder="링크 제목 입력" maxLength={100} disabled={disabled} />
        <label htmlFor="new-link-url">주소</label>
        <input id="new-link-url" name="url" type="url" value={url}
          onChange={event => setUrl(event.target.value)}
          placeholder="https://..." disabled={disabled} />
        <button className="btn add-link-submit" type="submit" disabled={disabled}>추가</button>
        {disabled && <p className="hint">최대 100개까지 등록할 수 있어요. 기존 항목을 삭제한 후 추가해 주세요.</p>}
      </form>
    </section>
  );
}
