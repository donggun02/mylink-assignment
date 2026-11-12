import Image from "next/image";
const links = [
  { title: "GitHub", description: "코드와 프로젝트를 살펴보세요", url: "https://github.com/donggun02", icon: "↗" },
  { title: "한양대학교", description: "배움이 시작되는 곳", url: "https://www.hanyang.ac.kr/", icon: "H" },
];
export default function Profile({ variant = "bad" }: { variant?: "bad" | "neo" | "toss" }) {
  return <main className={`profile-page ${variant}`}>
    <header className="site-header"><a href="/" aria-label="MyLink 홈">mylink<span aria-hidden="true">.</span></a><span>김동건의 링크 모음</span></header>
    <div className="profile-wrap"><section className="profile-card" aria-labelledby="profile-name">
      <div className="avatar-wrap"><Image className="avatar" src="/avatar.svg" alt="김동건의 일러스트 프로필" width={120} height={120} priority /></div>
      <p className="eyebrow">반가워요</p><h1 id="profile-name">김동건</h1>
      <p className="affiliation">한양대학교 컴퓨터소프트웨어학부</p>
      <p className="bio">한양대학교 컴퓨터소프트웨어학부 김동건입니다.</p>
      <div className="divider" />
      <section className="link-section" aria-label="외부 링크"><p className="section-label">여기에서 만나요</p>
        <div className="profile-links">{links.map((link, index) => <a key={link.url} className={`profile-link ${index === 0 ? "primary" : "secondary"}`} href={link.url} target="_blank" rel="noopener noreferrer"><span className="link-icon" aria-hidden="true">{link.icon}</span><span className="link-copy"><strong>{link.title}</strong><small>{link.description}</small></span><span className="arrow" aria-hidden="true">↗</span><span className="sr-only"> (새 탭에서 열기)</span></a>)}</div>
      </section>
    </section><footer className="profile-footer">작은 연결이 새로운 시작이 되도록.<br/><span>© 2026 Donggun Kim</span></footer></div>
  </main>;
}
