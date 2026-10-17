# AI 상황극 (다음 버전)

시장·카페·집주인과의 대화를 Claude API로 연습하고 교정받는 기능을 붙일 자리입니다.

## 붙일 때의 설계 메모
- 화면: `src/screens/Roleplay.tsx`를 새로 만들고 `App.tsx`의 `TABS`에 추가합니다.
- 장면 연결: `src/data/scenes`의 `Scene.intro`와 `phrases`를 시스템 프롬프트에 넣어, 지금 배우는 장면 안에서 대화하게 합니다.
- 교정: 사용자의 베트남어 문장마다 `{ corrected, ko, toneMistakes }` 형태로 돌려받아, 틀린 성조는 `lib/tone.ts`의 `toneOf`로 표시합니다.
- 키 관리: API 키를 브라우저 코드에 넣으면 안 됩니다. 작은 서버(예: Cloudflare Worker)를 두고 키는 서버에만 보관합니다.
