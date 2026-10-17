import { scene } from './build'

export default scene(
  {
    id: 'grocery',
    title: '장보기·마트',
    emoji: '🛒',
    intro: '생활용품 이름을 알아 두면 마트에서 헤매지 않아요. 남부·달랏에서는 돼지를 heo, 생수를 nước suối라고 해요.',
  },
  [
    [1, 'Siêu thị ở đâu?', '마트 어디예요?', { hanja: [['siêu thị', '초시(超市)']] }],
    [2, 'Ở đây có bán gạo không?', '여기 쌀 팔아요?'],
    [3, 'Trứng gà', '달걀'],
    [4, 'Thịt heo', '돼지고기', { north: 'Thịt lợn' }],
    [5, 'Thịt bò', '소고기'],
    [6, 'Thịt gà', '닭고기'],
    [7, 'Cá', '생선'],
    [8, 'Rau', '채소'],
    [9, 'Nước mắm', '느억맘 (생선 소스)'],
    [10, 'Nước suối', '생수', { north: 'Nước lọc' }],
    [11, 'Giấy vệ sinh', '휴지', { hanja: [['vệ sinh', '위생(衛生)']] }],
    [12, 'Bột giặt', '가루 세제'],
    [13, 'Kem đánh răng', '치약'],
    [14, 'Dầu gội', '샴푸'],
    [15, 'Cái này còn hạn sử dụng không?', '이거 유통기한 남았어요?', { hanja: [['hạn', '한(限)'], ['sử dụng', '사용(使用)']] }],
    [16, 'Cho tôi một cái túi.', '봉투 하나 주세요.'],
    [17, 'Quầy tính tiền ở đâu?', '계산대 어디예요?'],
    [18, 'Có giảm giá không?', '할인해요?', { hanja: [['giảm giá', '감가(減價)']] }],
    [19, 'Tôi đang tìm dầu ăn.', '식용유 찾고 있어요.'],
    [20, 'Ở kệ nào?', '어느 선반에 있어요?'],
    [21, 'Có giao hàng tận nhà không?', '집까지 배달돼요?'],
  ],
)
