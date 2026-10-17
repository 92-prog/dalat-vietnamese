import { scene } from './build'

export default scene(
  {
    id: 'services',
    title: '유심·은행·환전',
    emoji: '🏦',
    intro: '유심을 살 때와 은행 계좌를 만들 때는 여권이 필요해요. 환전은 금은방(tiệm vàng)에서 하는 경우가 많고 환율도 좋은 편이에요.',
  },
  [
    [1, 'Tôi muốn mua sim điện thoại.', '휴대폰 유심을 사고 싶어요.', { hanja: [['điện thoại', '전화(電話)']] }],
    [2, 'Gói cước một tháng bao nhiêu?', '한 달 요금제가 얼마예요?'],
    [3, 'Một ngày được bao nhiêu GB?', '하루에 몇 기가예요?'],
    [4, 'Có cần hộ chiếu không?', '여권 필요해요?', { hanja: [['hộ chiếu', '호조(護照)']] }],
    [5, 'Tôi muốn nạp tiền điện thoại.', '휴대폰 요금을 충전하고 싶어요.'],
    [6, 'Đổi tiền ở đâu?', '환전 어디서 해요?'],
    [7, 'Tỷ giá hôm nay bao nhiêu?', '오늘 환율이 얼마예요?'],
    [8, 'Tôi muốn đổi đô la sang tiền Việt.', '달러를 베트남 돈으로 바꾸고 싶어요.'],
    [9, 'Tôi muốn mở tài khoản ngân hàng.', '은행 계좌를 만들고 싶어요.', { hanja: [['ngân hàng', '은행(銀行)']] }],
    [10, 'Cây ATM ở đâu?', 'ATM 어디 있어요?'],
    [11, 'Máy ATM nuốt thẻ của tôi.', 'ATM이 카드를 먹었어요.'],
    [12, 'Phí bao nhiêu?', '수수료가 얼마예요?', { hanja: [['phí', '비(費)']] }],
    [13, 'Cho tôi số tài khoản.', '계좌번호 알려 주세요.'],
    [14, 'Quét mã QR được không?', 'QR 찍어도 돼요?'],
    [15, 'Tôi chuyển khoản rồi.', '이체했어요.'],
    [16, 'Bưu điện ở đâu?', '우체국 어디예요?', { hanja: [['bưu điện', '우전(郵電)']] }],
    [17, 'Tôi muốn gửi bưu kiện về Hàn Quốc.', '한국으로 소포를 보내고 싶어요.'],
    [18, 'Wifi yếu quá.', '와이파이가 너무 약해요.'],
    [19, 'Điện thoại tôi hết pin.', '휴대폰 배터리가 다 됐어요.'],
    [20, 'Ở đây có sạc điện thoại không?', '여기 휴대폰 충전기 있어요?'],
  ],
)
