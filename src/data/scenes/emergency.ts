import { scene } from './build'

export default scene(
  {
    id: 'emergency',
    title: '긴급 상황',
    emoji: '🚨',
    intro: '긴급 전화: 경찰 113, 소방 114, 구급차 115. 이 장면은 소리 내어 여러 번 연습해서 입에 붙여 두세요.',
  },
  [
    [1, 'Cứu tôi với!', '살려 주세요!'],
    [2, 'Giúp tôi với!', '도와주세요!'],
    [3, 'Gọi cảnh sát!', '경찰 불러 주세요!', { hanja: [['cảnh sát', '경찰(警察)']], note: '경찰 113' }],
    [4, 'Gọi xe cấp cứu!', '구급차 불러 주세요!', { hanja: [['cấp cứu', '급구(急救)']], note: '구급차 115' }],
    [5, 'Tôi bị mất ví.', '지갑을 잃어버렸어요.'],
    [6, 'Tôi bị mất hộ chiếu.', '여권을 잃어버렸어요.', { hanja: [['hộ chiếu', '호조(護照)']] }],
    [7, 'Tôi bị móc túi.', '소매치기를 당했어요.'],
    [8, 'Tôi bị tai nạn xe máy.', '오토바이 사고가 났어요.', { hanja: [['tai nạn', '재난(災難)']] }],
    [9, 'Có người bị thương.', '다친 사람이 있어요.', { hanja: [['thương', '상(傷)']] }],
    [10, 'Cháy!', '불이야!', { note: '소방 114' }],
    [11, 'Nguy hiểm!', '위험해요!', { hanja: [['nguy hiểm', '위험(危險)']] }],
    [12, 'Cẩn thận!', '조심해요!', { hanja: [['cẩn thận', '근신(謹愼)']] }],
    [13, 'Đồn công an ở đâu?', '경찰서 어디예요?', { hanja: [['công an', '공안(公安)']] }],
    [14, 'Tôi cần liên lạc với Đại sứ quán Hàn Quốc.', '한국 대사관에 연락해야 해요.', { hanja: [['liên lạc', '연락(聯絡)'], ['Đại sứ quán', '대사관(大使館)']] }],
    [15, 'Có ai nói tiếng Anh không?', '영어 하는 사람 있어요?'],
    [16, 'Đừng đụng vào tôi!', '만지지 마세요!'],
    [17, 'Dừng lại!', '멈춰요!'],
    [18, 'Đây là địa chỉ nhà tôi.', '이게 우리 집 주소예요.', { hanja: [['địa chỉ', '지지(地址)']] }],
    [19, 'Làm ơn gọi số này giúp tôi.', '이 번호로 전화 좀 해 주세요.'],
    [20, 'Tôi không sao.', '저 괜찮아요.'],
  ],
)
