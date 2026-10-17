import { scene } from './build'

export default scene(
  {
    id: 'motorbike',
    title: '오토바이 렌트·주유',
    emoji: '⛽',
    intro: '달랏은 언덕이 많아 오토바이가 가장 흔한 교통수단이에요. 스쿠터(xe tay ga)가 타기 쉬워요. 헬멧은 꼭 쓰세요.',
  },
  [
    [1, 'Tôi muốn thuê xe máy.', '오토바이를 빌리고 싶어요.'],
    [2, 'Thuê một ngày bao nhiêu?', '하루 빌리는 데 얼마예요?'],
    [3, 'Thuê một tháng bao nhiêu?', '한 달 빌리는 데 얼마예요?'],
    [4, 'Có xe tay ga không?', '스쿠터 있어요?', { note: 'xe tay ga = 스쿠터(자동), xe số = 기어 있는 오토바이.' }],
    [5, 'Có cần đặt cọc không?', '보증금 필요해요?'],
    [6, 'Có mũ bảo hiểm không?', '헬멧 있어요?', { hanja: [['bảo hiểm', '보험(保險)']], note: '헬멧을 "보험 모자"라고 불러요.' }],
    [7, 'Cây xăng ở đâu?', '주유소 어디예요?'],
    [8, 'Đổ đầy bình.', '가득 넣어 주세요.'],
    [9, 'Đổ năm chục.', '5만 동어치 넣어 주세요.'],
    [10, 'Xe tôi bị hư.', '제 오토바이가 고장 났어요.', { north: 'hỏng (hư 대신)' }],
    [11, 'Xe bị thủng lốp.', '타이어가 펑크 났어요.'],
    [12, 'Gần đây có tiệm sửa xe không?', '근처에 오토바이 수리점 있어요?'],
    [13, 'Sửa mất bao lâu?', '고치는 데 얼마나 걸려요?'],
    [14, 'Gửi xe ở đâu?', '오토바이 어디에 맡겨요?', { note: '가게·시장 앞에서 돈을 내고 오토바이를 맡기는 걸 gửi xe라고 해요.' }],
    [15, 'Giữ xe bao nhiêu tiền?', '주차비 얼마예요?'],
    [16, 'Đường này dốc quá.', '이 길 너무 가팔라요.'],
    [17, 'Trời mưa, đường trơn.', '비가 와서 길이 미끄러워요.'],
    [18, 'Tôi có bằng lái quốc tế.', '국제 운전면허증 있어요.', { hanja: [['quốc tế', '국제(國際)']], note: '베트남에서 쓸 수 있는 면허 조건은 출국 전에 꼭 확인하세요.' }],
    [19, 'Xe hết xăng rồi.', '기름이 떨어졌어요.'],
    [20, 'Cho tôi xem giấy tờ xe.', '오토바이 서류 보여 주세요.'],
  ],
)
