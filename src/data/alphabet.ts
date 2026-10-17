export interface Letter {
  letter: string
  sound: string
  example: string
  exampleKo: string
}

export const VOWELS: Letter[] = [
  { letter: 'a', sound: '아 (입을 크게)', example: 'ba', exampleKo: '셋' },
  { letter: 'ă', sound: '짧은 아', example: 'ăn', exampleKo: '먹다' },
  { letter: 'â', sound: '짧은 어', example: 'cân', exampleKo: '저울' },
  { letter: 'e', sound: '애 (입을 옆으로 크게)', example: 'xe', exampleKo: '차' },
  { letter: 'ê', sound: '에', example: 'đêm', exampleKo: '밤' },
  { letter: 'i / y', sound: '이', example: 'đi', exampleKo: '가다' },
  { letter: 'o', sound: '오와 어 사이 (입을 크게 벌린 오)', example: 'có', exampleKo: '있다' },
  { letter: 'ô', sound: '오 (입술을 둥글게)', example: 'cô', exampleKo: '아주머니, 선생님' },
  { letter: 'ơ', sound: '어', example: 'cơm', exampleKo: '밥' },
  { letter: 'u', sound: '우', example: 'mua', exampleKo: '사다' },
  { letter: 'ư', sound: '으', example: 'sữa', exampleKo: '우유' },
]

export const CONSONANTS: Letter[] = [
  { letter: 'b', sound: 'ㅂ (목을 울리는 b)', example: 'bạn', exampleKo: '친구' },
  { letter: 'c / k / q', sound: 'ㄲ (힘 빼고)', example: 'cà phê', exampleKo: '커피' },
  { letter: 'ch', sound: 'ㅉ', example: 'chợ', exampleKo: '시장' },
  { letter: 'd / gi', sound: '북부 ㅈ(z) · 남부 이(y)', example: 'dạ', exampleKo: '네(공손)' },
  { letter: 'đ', sound: 'ㄷ (힘 있게)', example: 'đi', exampleKo: '가다' },
  { letter: 'g / gh', sound: 'ㄱ (목을 울리며)', example: 'gà', exampleKo: '닭' },
  { letter: 'h', sound: 'ㅎ', example: 'hai', exampleKo: '둘' },
  { letter: 'kh', sound: 'ㅋ (목 안쪽을 긁듯이)', example: 'không', exampleKo: '아니다' },
  { letter: 'l', sound: 'ㄹ (영어 l)', example: 'lạnh', exampleKo: '춥다' },
  { letter: 'm', sound: 'ㅁ', example: 'mẹ', exampleKo: '엄마' },
  { letter: 'n', sound: 'ㄴ', example: 'nước', exampleKo: '물' },
  { letter: 'ng / ngh', sound: '응 (ㅇ받침 소리로 시작)', example: 'người', exampleKo: '사람' },
  { letter: 'nh', sound: '냐·녀의 ㄴ', example: 'nhà', exampleKo: '집' },
  { letter: 'ph', sound: 'f (윗니를 아랫입술에)', example: 'phở', exampleKo: '쌀국수' },
  { letter: 'r', sound: '북부 ㅈ(z) · 남부 ㄹ(r)', example: 'rau', exampleKo: '채소' },
  { letter: 's', sound: '북부 ㅆ · 남부 쉬(sh)', example: 'sáu', exampleKo: '여섯' },
  { letter: 't', sound: 'ㄸ', example: 'tôi', exampleKo: '나' },
  { letter: 'th', sound: 'ㅌ', example: 'thịt', exampleKo: '고기' },
  { letter: 'tr', sound: '북부 ㅉ · 남부 혀를 만 ㅉ', example: 'trà', exampleKo: '차(茶)' },
  { letter: 'v', sound: 'v · 남부는 이(y)처럼', example: 'vui', exampleKo: '즐겁다' },
  { letter: 'x', sound: 'ㅆ', example: 'xin', exampleKo: '청하다' },
]

export const FINALS: Letter[] = [
  { letter: '-c', sound: 'ㄱ 받침', example: 'các', exampleKo: '여러' },
  { letter: '-ch', sound: '익 (ㄱ 받침, 앞모음 이가 살짝)', example: 'sách', exampleKo: '책' },
  { letter: '-m', sound: 'ㅁ 받침', example: 'cơm', exampleKo: '밥' },
  { letter: '-n', sound: 'ㄴ 받침', example: 'ăn', exampleKo: '먹다' },
  { letter: '-ng', sound: 'ㅇ 받침 (o·u 뒤에서는 입을 다물며 ㅁ처럼)', example: 'không', exampleKo: '아니다' },
  { letter: '-nh', sound: '잉 (ㅇ 받침)', example: 'anh', exampleKo: '형, 오빠' },
  { letter: '-p', sound: 'ㅂ 받침', example: 'đẹp', exampleKo: '예쁘다' },
  { letter: '-t', sound: 'ㄷ(ㅅ) 받침', example: 'Việt', exampleKo: '베트(남)' },
]
