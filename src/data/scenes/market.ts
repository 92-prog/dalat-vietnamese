import { scene } from './build'

export default scene(
  {
    id: 'market',
    title: '시장·야시장 흥정',
    emoji: '🍓',
    intro: '시장에서는 값을 깎는 게 자연스러워요. 판매자가 나보다 나이 많은 여자면 chị/cô, 나를 em/con으로 낮추면 친근하게 들려요. 달랏 시장은 딸기·꽃·채소로 유명해요.',
  },
  [
    [1, 'Cái này bao nhiêu?', '이거 얼마예요?'],
    [2, 'Một ký bao nhiêu?', '1킬로에 얼마예요?', { north: 'Một cân bao nhiêu?' }],
    [3, 'Mắc quá!', '너무 비싸요!', { north: 'Đắt quá!' }],
    [4, 'Bớt chút đi.', '좀 깎아 주세요.'],
    [5, 'Bớt cho em đi chị.', '언니, 좀 깎아 주세요.', { note: '판매자가 나보다 나이 많은 여자일 때.' }],
    [6, 'Năm chục được không?', '5만 동에 돼요?', { note: 'chục = 10. 시장에서는 "năm chục"이 5만 동이에요.' }],
    [7, 'Tôi chỉ xem thôi.', '그냥 구경하는 거예요.'],
    [8, 'Cho tôi nửa ký.', '반 킬로 주세요.', { north: 'nửa cân' }],
    [9, 'Dâu tây', '딸기', { note: '달랏 특산품이에요.' }],
    [10, 'Cái này có tươi không?', '이거 신선해요?'],
    [11, 'Có ngọt không?', '달아요?'],
    [12, 'Lấy cái này.', '이걸로 할게요.'],
    [13, 'Có cái nhỏ hơn không?', '더 작은 거 있어요?'],
    [14, 'Có màu khác không?', '다른 색 있어요?'],
    [15, 'Tôi lấy hai cái.', '두 개 살게요.'],
    [16, 'Thôi, cảm ơn.', '됐어요, 고마워요.', { note: '흥정이 안 될 때 이렇게 말하고 돌아서면 값을 깎아 주기도 해요.' }],
    [17, 'Chợ Đà Lạt ở đâu?', '달랏 시장 어디예요?'],
    [18, 'Chợ đêm mấy giờ mở cửa?', '야시장 몇 시에 열어요?'],
    [19, 'Có túi không?', '봉지 있어요?'],
    [20, 'Rau này là rau gì?', '이건 무슨 채소예요?'],
    [21, 'Trái này ăn sao?', '이 과일 어떻게 먹어요?', { north: 'Quả này ăn thế nào?' }],
    [22, 'Một bó hoa bao nhiêu?', '꽃 한 다발에 얼마예요?', { note: '달랏은 "꽃의 도시"예요.' }],
  ],
)
