import { scene } from './build'

export default scene(
  {
    id: 'housing',
    title: '집 구하기·월세 계약',
    emoji: '🏠',
    intro: '달랏은 밤에 15도 아래로 내려가기도 해서 온수기를 꼭 확인하세요. 외국인은 거주지 등록(tạm trú)을 해야 하는데, 보통 집주인이 도와줘요.',
  },
  [
    [1, 'Tôi muốn thuê nhà.', '집을 빌리고 싶어요.'],
    [2, 'Tôi đang tìm phòng cho thuê.', '월세 방을 찾고 있어요.', { hanja: [['phòng', '방(房)']] }],
    [3, 'Giá thuê một tháng bao nhiêu?', '월세가 한 달에 얼마예요?', { hanja: [['giá', '가(價)']] }],
    [4, 'Có bao gồm điện nước không?', '전기·수도 요금 포함이에요?', { hanja: [['điện', '전(電)']] }],
    [5, 'Tiền điện tính thế nào?', '전기료는 어떻게 계산해요?', { note: '집주인이 kWh당 단가를 정해서 받는 경우가 많아요. 단가를 꼭 물어보세요.' }],
    [6, 'Tiền cọc bao nhiêu?', '보증금 얼마예요?'],
    [7, 'Hợp đồng bao lâu?', '계약 기간이 얼마예요?', { hanja: [['hợp đồng', '합동(合同)']] }],
    [8, 'Tôi xem phòng được không?', '방 좀 봐도 돼요?'],
    [9, 'Có máy nước nóng không?', '온수기 있어요?', { note: '달랏에서는 꼭 확인하세요!' }],
    [10, 'Có máy giặt không?', '세탁기 있어요?'],
    [11, 'Có chỗ để xe máy không?', '오토바이 세울 곳 있어요?'],
    [12, 'Có nội thất không?', '가구 있어요?', { hanja: [['nội thất', '내실(內室)']] }],
    [13, 'Phòng có cửa sổ không?', '방에 창문 있어요?'],
    [14, 'Ở đây có yên tĩnh không?', '여기 조용해요?', { hanja: [['yên tĩnh', '안정(安靜)']] }],
    [15, 'Khi nào tôi dọn vào được?', '언제 이사 들어올 수 있어요?'],
    [16, 'Trả tiền nhà vào ngày nào?', '월세는 며칠에 내요?'],
    [17, 'Có cần đăng ký tạm trú không?', '거주지 등록이 필요해요?', { hanja: [['đăng ký', '등기(登記)'], ['tạm trú', '잠주(暫住)']] }],
    [18, 'Bồn cầu bị nghẹt.', '변기가 막혔어요.'],
    [19, 'Máy nước nóng bị hư.', '온수기가 고장 났어요.', { north: 'hỏng (hư 대신)' }],
    [20, 'Đèn không sáng.', '불이 안 켜져요.'],
    [21, 'Thuê lâu thì có giảm giá không?', '오래 살면 깎아 줘요?', { hanja: [['giảm giá', '감가(減價)']] }],
  ],
)
