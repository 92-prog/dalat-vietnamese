export interface Phrase {
  id: string
  vi: string
  ko: string
  /** 사용 팁, 문법, 문화 설명 */
  note?: string
  /** vi에 남부식 단어를 썼을 때 북부식 대안 */
  north?: string
  /** vi에 북부식 단어를 썼을 때 남부식 대안 */
  south?: string
  /** 한자어 힌트: [베트남어 단어, '한자 한국음'] */
  hanja?: [string, string][]
}

export interface Scene {
  id: string
  title: string
  emoji: string
  intro: string
  phrases: Phrase[]
}
