const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cors = require('cors');

app.use(cors());
app.use(express.json());
const words = {
  en: {
    easy: {
      animals: ['CAT', 'DOG', 'FOX'],
      technology: ['CPU', 'RAM', 'PC'],
      food: ['APPLE', 'BREAD', 'CAKE'],
      colors: ['RED', 'BLUE', 'GREEN'],
      sports: ['SOCCER', 'TENNIS', 'GOLF'],
    },
    medium: {
      animals: ['TIGER', 'LION', 'BEAR'],
      technology: ['ROBOT', 'DRONE', 'PHONE'],
      food: ['BURGER', 'PASTA', 'PIZZA'],
      colors: ['YELLOW', 'PURPLE', 'ORANGE'],
      sports: ['BASEBALL', 'CRICKET', 'HOCKEY'],
    },
    hard: {
      animals: ['ELEPHANT', 'ALLIGATOR', 'CROCODILE'],
      technology: ['MICROPROCESSOR', 'QUANTUMCOMPUTER', 'SUPERCOMPUTER'],
      food: ['LASAGNA', 'CROISSANT', 'SUSHI'],
      colors: ['TURQUOISE', 'MAGENTA', 'CHARTREUSE'],
      sports: ['TRIATHLON', 'DECATHLON', 'BADMINTON'],
    }
  },
  fr: {
    easy: {
      animals: ['CHAT', 'CHIEN', 'RENARD'],
      technology: ['CPU', 'RAM', 'PC'],
      food: ['POMME', 'PAIN', 'GATEAU'],
      colors: ['ROUGE', 'BLEU', 'VERT'],
      sports: ['FOOTBALL', 'TENNIS', 'GOLF'],
    },
    medium: {
      animals: ['TIGRE', 'LION', 'OURS'],
      technology: ['ROBOT', 'DRONE', 'TELEPHONE'],
      food: ['HAMBURGER', 'PATES', 'PIZZA'],
      colors: ['JAUNE', 'VIOLET', 'ORANGE'],
      sports: ['BASEBALL', 'CRICKET', 'HOCKEY'],
    },
    hard: {
      animals: ['ELEPHANT', 'ALLIGATOR', 'CROCODILE'],
      technology: ['MICROPROCESSEUR', 'ORDINATEURQUANTIQUE', 'SUPERORDINATEUR'],
      food: ['LASAGNE', 'CROISSANT', 'SUSHI'],
      colors: ['TURQUOISE', 'MAGENTA', 'CHARTREUSE'],
      sports: ['TRIATHLON', 'DECATHLON', 'BADMINTON'],
    }
  },
  es: {
    easy: {
      animals: ['GATO', 'PERRO', 'ZORRO'],
      technology: ['CPU', 'RAM', 'PC'],
      food: ['MANZANA', 'PAN', 'PASTEL'],
      colors: ['ROJO', 'AZUL', 'VERDE'],
      sports: ['FUTBOL', 'TENIS', 'GOLF'],
    },
    medium: {
      animals: ['TIGRE', 'LEON', 'OSO'],
      technology: ['ROBOT', 'DRON', 'TELEFONO'],
      food: ['HAMBURGUESA', 'PASTA', 'PIZZA'],
      colors: ['AMARILLO', 'VIOLETA', 'NARANJA'],
      sports: ['BEISBOL', 'CRICKET', 'HOCKEY'],
    },
    hard: {
      animals: ['ELEFANTE', 'CAIMAN', 'COCODRILO'],
      technology: ['MICROPROCESADOR', 'COMPUTADORACUANTICA', 'SUPERCOMPUTADORA'],
      food: ['LASANA', 'CROISSANT', 'SUSHI'],
      colors: ['TURQUESA', 'MAGENTA', 'CHARTREUSE'],
      sports: ['TRIATLON', 'DECATHLON', 'BADMINTON'],
    }
  },
  de: {
    easy: {
      animals: ['KATZE', 'HUND', 'FUCHS'],
      technology: ['CPU', 'RAM', 'PC'],
      food: ['APFEL', 'BROT', 'KUCHEN'],
      colors: ['ROT', 'BLAU', 'GRÜN'],
      sports: ['FUSSBALL', 'TENNIS', 'GOLF'],
    },
    medium: {
      animals: ['TIGER', 'LÖWE', 'BÄR'],
      technology: ['ROBOTER', 'DROHNE', 'TELEFON'],
      food: ['BURGER', 'PASTA', 'PIZZA'],
      colors: ['GELB', 'LILA', 'ORANGE'],
      sports: ['BASEBALL', 'CRICKET', 'HOCKEY'],
    },
    hard: {
      animals: ['ELEFANT', 'ALLIGATOR', 'KROKODIL'],
      technology: ['MIKROPROZESSOR', 'QUANTENCOMPUTER', 'SUPERCOMPUTER'],
      food: ['LASAGNE', 'CROISSANT', 'SUSHI'],
      colors: ['TÜRKIS', 'MAGENTA', 'CHARTREUSE'],
      sports: ['TRIATHLON', 'ZEHNKAMPF', 'BADMINTON'],
    }
  },
  it: {
    easy: {
      animals: ['GATTO', 'CANE', 'VOLPE'],
      technology: ['CPU', 'RAM', 'PC'],
      food: ['MELA', 'PANE', 'TORTA'],
      colors: ['ROSSO', 'BLU', 'VERDE'],
      sports: ['CALCIO', 'TENNIS', 'GOLF'],
    },
    medium: {
      animals: ['TIGRE', 'LEONE', 'ORSO'],
      technology: ['ROBOT', 'DRONE', 'TELEFONO'],
      food: ['HAMBURGER', 'PASTA', 'PIZZA'],
      colors: ['GIALLO', 'VIOLA', 'ARANCIONE'],
      sports: ['BASEBALL', 'CRICKET', 'HOCKEY'],
    },
    hard: {
      animals: ['ELEFANTE', 'ALLIGATORE', 'COCCODRILLO'],
      technology: ['MICROPROCESSORE', 'COMPUTERQUANTISTICO', 'SUPERCOMPUTER'],
      food: ['LASAGNA', 'CROISSANT', 'SUSHI'],
      colors: ['TURCHESE', 'MAGENTA', 'CHARTREUSE'],
      sports: ['TRIATHLON', 'DECATHLON', 'BADMINTON'],
    }
  },
  pt: {
    easy: {
      animals: ['GATO', 'CACHORRO', 'RAPOSA'],
      technology: ['CPU', 'RAM', 'PC'],
      food: ['MAÇÃ', 'PÃO', 'BOLO'],
      colors: ['VERMELHO', 'AZUL', 'VERDE'],
      sports: ['FUTEBOL', 'TÊNIS', 'GOLFE'],
    },
    medium: {
      animals: ['TIGRE', 'LEÃO', 'URSO'],
      technology: ['ROBOT', 'DRONE', 'TELEFONE'],
      food: ['HAMBÚRGUER', 'MASSA', 'PIZZA'],
      colors: ['AMARELO', 'ROXO', 'LARANJA'],
      sports: ['BEISEBOL', 'CRÍQUETE', 'HÓQUEI'],
    },
    hard: {
      animals: ['ELEFANTE', 'JACARÉ', 'CROCODILO'],
      technology: ['MICROPROCESSADOR', 'COMPUTADORQUÂNTICO', 'SUPERCOMPUTADOR'],
      food: ['LASANHA', 'CROISSANT', 'SUSHI'],
      colors: ['TURQUESA', 'MAGENTA', 'CHARTREUSE'],
      sports: ['TRIATLO', 'DECATHLON', 'BADMINTON'],
    }
  },
  ru: {
    easy: {
      animals: ['КОТ', 'СОБАКА', 'ЛИСА'],
      technology: ['ЦПУ', 'ОЗУ', 'ПК'],
      food: ['ЯБЛОКО', 'ХЛЕБ', 'ТОРТ'],
      colors: ['КРАСНЫЙ', 'СИНИЙ', 'ЗЕЛЕНЫЙ'],
      sports: ['ФУТБОЛ', 'ТЕННИС', 'ГОЛЬФ'],
    },
    medium: {
      animals: ['ТИГР', 'ЛЕВ', 'МЕДВЕДЬ'],
      technology: ['РОБОТ', 'ДРОН', 'ТЕЛЕФОН'],
      food: ['ГАМБУРГЕР', 'ПАСТА', 'ПИЦЦА'],
      colors: ['ЖЕЛТЫЙ', 'ФИОЛЕТОВЫЙ', 'ОРАНЖЕВЫЙ'],
      sports: ['БЕЙСБОЛ', 'КРИКЕТ', 'ХОККЕЙ'],
    },
    hard: {
      animals: ['СЛОН', 'АЛЛИГАТОР', 'КРОКОДИЛ'],
      technology: ['МИКРОПРОЦЕССОР', 'КВАНТОВЫЙКОМПЬЮТЕР', 'СУПЕРКОМПЬЮТЕР'],
      food: ['ЛАЗАНЬЯ', 'КРУАССАН', 'СУШИ'],
      colors: ['БИРЮЗОВЫЙ', 'МАГЕНТА', 'ШАРТРЕЗ'],
      sports: ['ТРИАТЛОН', 'ДЕКАФЛОН', 'БАДМИНТОН'],
    }
  },
  zh: {
    easy: {
      animals: ['猫', '狗', '狐狸'],
      technology: ['中央处理器', '随机存取存储器', '个人计算机'],
      food: ['苹果', '面包', '蛋糕'],
      colors: ['红色', '蓝色', '绿色'],
      sports: ['足球', '网球', '高尔夫'],
    },
    medium: {
      animals: ['老虎', '狮子', '熊'],
      technology: ['机器人', '无人机', '电话'],
      food: ['汉堡包', '意大利面', '披萨'],
      colors: ['黄色', '紫色', '橙色'],
      sports: ['棒球', '板球', '曲棍球'],
    },
    hard: {
      animals: ['大象', '短吻鳄', '鳄鱼'],
      technology: ['微处理器', '量子计算机', '超级计算机'],
      food: ['千层面', '牛角包', '寿司'],
      colors: ['青绿色', '洋红色', '查特酒绿色'],
      sports: ['铁人三项', '十项全能', '羽毛球'],
    }
  },
  ja: {
    easy: {
      animals: ['猫', '犬', '狐'],
      technology: ['中央処理装置', 'ランダムアクセスメモリ', 'パーソナルコンピュータ'],
      food: ['リンゴ', 'パン', 'ケーキ'],
      colors: ['赤', '青', '緑'],
      sports: ['サッカー', 'テニス', 'ゴルフ'],
    },
    medium: {
      animals: ['虎', 'ライオン', '熊'],
      technology: ['ロボット', 'ドローン', '電話'],
      food: ['ハンバーガー', 'パスタ', 'ピザ'],
      colors: ['黄色', '紫色', 'オレンジ'],
      sports: ['野球', 'クリケット', 'ホッケー'],
    },
    hard: {
      animals: ['象', 'ワニ', 'クロコダイル'],
      technology: ['マイクロプロセッサ', '量子コンピュータ', 'スーパーコンピュータ'],
      food: ['ラザニア', 'クロワッサン', '寿司'],
      colors: ['ターコイズ', 'マゼンタ', 'シャルトリューズ'],
      sports: ['トライアスロン', 'デカスロン', 'バドミントン'],
    }
  },
  ko: {
    easy: {
      animals: ['고양이', '개', '여우'],
      technology: ['중앙처리장치', '램', '개인용컴퓨터'],
      food: ['사과', '빵', '케이크'],
      colors: ['빨간색', '파란색', '초록색'],
      sports: ['축구', '테니스', '골프'],
    },
    medium: {
      animals: ['호랑이', '사자', '곰'],
      technology: ['로봇', '드론', '전화'],
      food: ['햄버거', '파스타', '피자'],
      colors: ['노란색', '보라색', '주황색'],
      sports: ['야구', '크리켓', '하키'],
    },
    hard: {
      animals: ['코끼리', '악어', '크로커다일'],
      technology: ['마이크로프로세서', '양자컴퓨터', '슈퍼컴퓨터'],
      food: ['라자냐', '크루아상', '스시'],
      colors: ['터쿼이즈', '마젠타', '샤르트뢰즈'],
      sports: ['철인3종경기', '데카슬론', '배드민턴'],
    }
  },
  ar: {
    easy: {
      animals: ['قط', 'كلب', 'ثعلب'],
      technology: ['وحدةالمعالجةالمركزية', 'ذاكرةوصولعشوائي', 'حاسوبشخصي'],
      food: ['تفاحة', 'خبز', 'كعكة'],
      colors: ['أحمر', 'أزرق', 'أخضر'],
      sports: ['كرةقدم', 'تنس', 'جولف'],
    },
    medium: {
      animals: ['نمر', 'أسد', 'دب'],
      technology: ['روبوت', 'طائرةبدونطيار', 'هاتف'],
      food: ['برجر', 'معكرونة', 'بيتزا'],
      colors: ['أصفر', 'أرجواني', 'برتقالي'],
      sports: ['بيسبول', 'كريكيت', 'هوكي'],
    },
    hard: {
      animals: ['فيل', 'تمساح', 'قرد'],
      technology: ['معالجدقيق', 'حاسوبكمي', 'حاسوبفائق'],
      food: ['لازانيا', 'كرواسون', 'سوشي'],
      colors: ['فيروزي', 'ماجنتا', 'شارتروز'],
      sports: ['ترياتلون', 'عشاري', 'ريشة'],
    }
  },
  hi: {
    easy: {
      animals: ['बिल्ली', 'कुत्ता', 'लोमड़ी'],
      technology: ['सीपीयू', 'रैम', 'पीसी'],
      food: ['सेब', 'रोटी', 'केक'],
      colors: ['लाल', 'नीला', 'हरा'],
      sports: ['फ़ुटबॉल', 'टेनिस', 'गोल्फ'],
    },
    medium: {
      animals: ['बाघ', 'सिंह', 'भालू'],
      technology: ['रोबोट', 'ड्रोन', 'फ़ोन'],
      food: ['बर्गर', 'पास्ता', 'पिज्जा'],
      colors: ['पीला', 'बैंगनी', 'संतरा'],
      sports: ['बेसबॉल', 'क्रिकेट', 'हॉकी'],
    },
    hard: {
      animals: ['हाथी', 'मगरमच्छ', 'घड़ियाल'],
      technology: ['माइक्रोप्रोसेसर', 'क्वांटमकंप्यूटर', 'सुपरकंप्यूटर'],
      food: ['लसगना', 'क्रोइसेंट', 'सुशी'],
      colors: ['फ़िरोज़ा', 'मैजेंटा', 'चार्टरेस'],
      sports: ['ट्रायथलॉन', 'डेकाथलॉन', 'बैडमिंटन'],
    }
  },
  tr: {
    easy: {
      animals: ['KEDİ', 'KÖPEK', 'TİLKİ'],
      technology: ['CPU', 'RAM', 'PC'],
      food: ['ELMA', 'EKMEK', 'PASTA'],
      colors: ['KIRMIZI', 'MAVİ', 'YEŞİL'],
      sports: ['FUTBOL', 'TENİS', 'GOLF'],
    },
    medium: {
      animals: ['KAPLAN', 'ASLAN', 'AYI'],
      technology: ['ROBOT', 'DRON', 'TELEFON'],
      food: ['HAMBURGER', 'MAKARNA', 'PİZZA'],
      colors: ['SARI', 'MOR', 'TURUNCU'],
      sports: ['BEYZBOL', 'KRİKET', 'BUZ HOKEYİ'],
    },
    hard: {
      animals: ['FİL', 'TİMSAH', 'KROKODİL'],
      technology: ['MIKROİŞLEMCİ', 'KUANTUMBİLGİSAYAR', 'SÜPERBİLGİSAYAR'],
      food: ['LAZANYA', 'KRUASAN', 'SUŞİ'],
      colors: ['TURKUAZ', 'MAGENTA', 'ŞARTRÖZ'],
      sports: ['TRİATLON', 'DEKATLON', 'BADMİNTON'],
    }
  },
  nl: {
    easy: {
      animals: ['KAT', 'HOND', 'VOS'],
      technology: ['CPU', 'RAM', 'PC'],
      food: ['APPEL', 'BROOD', 'CAKE'],
      colors: ['ROOD', 'BLAUW', 'GROEN'],
      sports: ['VOETBAL', 'TENNIS', 'GOLF'],
    },
    medium: {
      animals: ['TIJGER', 'LEEUW', 'BEER'],
      technology: ['ROBOT', 'DRONE', 'TELEFOON'],
      food: ['HAMBURGER', 'PASTA', 'PIZZA'],
      colors: ['GEEL', 'PAARS', 'ORANJE'],
      sports: ['HONKBAL', 'CRICKET', 'HOCKEY'],
    },
    hard: {
      animals: ['OLIFANT', 'ALLIGATOR', 'KROKODIL'],
      technology: ['MICROPROCESSOR', 'KWANTUMCOMPUTER', 'SUPERCOMPUTER'],
      food: ['LASAGNE', 'CROISSANT', 'SUSHI'],
      colors: ['TURQUOISE', 'MAGENTA', 'CHARTREUSE'],
      sports: ['TRIATLON', 'DEKATLON', 'BADMINTON'],
    }
  },
  sv: {
    easy: {
      animals: ['KATT', 'HUND', 'RÄV'],
      technology: ['CPU', 'RAM', 'PC'],
      food: ['ÄPPLE', 'BRÖD', 'KAKA'],
      colors: ['RÖD', 'BLÅ', 'GRÖN'],
      sports: ['FOTBOLL', 'TENNIS', 'GOLF'],
    },
    medium: {
      animals: ['TIGER', 'LEJON', 'BJÖRN'],
      technology: ['ROBOT', 'DRÖNARE', 'TELEFON'],
      food: ['HAMBURGARE', 'PASTA', 'PIZZA'],
      colors: ['GUL', 'LILA', 'ORANGE'],
      sports: ['BASEBOLL', 'CRICKET', 'HOCKEY'],
    },
    hard: {
      animals: ['ELEFANT', 'ALLIGATOR', 'KROKODIL'],
      technology: ['MIKROPROCESSOR', 'KVANTDATOR', 'SUPERDATOR'],
      food: ['LASAGNE', 'CROISSANT', 'SUSHI'],
      colors: ['TURKOS', 'MAGENTA', 'CHARTREUSE'],
      sports: ['TRIATHLON', 'DEKATLON', 'BADMINTON'],
    }
  },
  no: {
    easy: {
      animals: ['KATT', 'HUND', 'REV'],
      technology: ['CPU', 'RAM', 'PC'],
      food: ['EPLER', 'BRØD', 'KAKE'],
      colors: ['RØD', 'BLÅ', 'GRØNN'],
      sports: ['FOTBALL', 'TENNIS', 'GOLF'],
    },
    medium: {
      animals: ['TIGER', 'LØVE', 'BJØRN'],
      technology: ['ROBOT', 'DRONE', 'TELEFON'],
      food: ['HAMBURGER', 'PASTA', 'PIZZA'],
      colors: ['GUL', 'LILLA', 'ORANSJE'],
      sports: ['BASEBALL', 'CRICKET', 'HOCKEY'],
    },
    hard: {
      animals: ['ELEFANT', 'ALLIGATOR', 'KROKODILLE'],
      technology: ['MIKROPROSESSOR', 'KVANTEDATOR', 'SUPERDATOR'],
      food: ['LASAGNE', 'CROISSANT', 'SUSHI'],
      colors: ['TURKIS', 'MAGENTA', 'CHARTREUSE'],
      sports: ['TRIATHLON', 'DEKATLON', 'BADMINTON'],
    }
  },
  fi: {
    easy: {
      animals: ['KISSA', 'KOIRA', 'KETTU'],
      technology: ['CPU', 'RAM', 'PC'],
      food: ['OMENA', 'LEIPÄ', 'KAKKU'],
      colors: ['PUNAINEN', 'SININEN', 'VIHREÄ'],
      sports: ['JALKAPALLO', 'TENNIS', 'GOLF'],
    },
    medium: {
      animals: ['TIIKERI', 'LEIJONA', 'KARHU'],
      technology: ['ROBOTTI', 'DROONI', 'PUHELIN'],
      food: ['HAMPURILAINEN', 'PASTA', 'PIZZA'],
      colors: ['KELTAINEN', 'VIOLETTI', 'ORANSSI'],
      sports: ['BASEBALL', 'KRICKET', 'JÄÄKIEKKO'],
    },
    hard: {
      animals: ['NORSU', 'ALLIGAATTORI', 'KROKOTIILI'],
      technology: ['MIKROPROSESSORI', 'KVANTTITIETOKONE', 'SUPERTIETOKONE'],
      food: ['LASAGNE', 'CROISSANT', 'SUSHI'],
      colors: ['TURKOOSI', 'MAGENTA', 'CHARTREUSE'],
      sports: ['TRIATHLON', 'Kymmenottelu', 'SULKAPALLO'],
    }
  },
  pl: {
    easy: {
      animals: ['KOT', 'PIES', 'LIS'],
      technology: ['CPU', 'RAM', 'PC'],
      food: ['JABŁKO', 'CHLEB', 'CIASTO'],
      colors: ['CZERWONY', 'NIEBIESKI', 'ZIELONY'],
      sports: ['PIŁKANOŻNA', 'TENIS', 'GOLF'],
    },
    medium: {
      animals: ['TYGRYS', 'LEW', 'NIEDŹWIEDŹ'],
      technology: ['ROBOT', 'DRON', 'TELEFON'],
      food: ['HAMBURGER', 'MAKARON', 'PIZZA'],
      colors: ['ŻÓŁTY', 'FIOLETOWY', 'POMARAŃCZOWY'],
      sports: ['BASEBALL', 'KRYKIET', 'HOKEJ'],
    },
    hard: {
      animals: ['SŁOŃ', 'ALIGATOR', 'KROKODYL'],
      technology: ['MIKROPROCESOR', 'KOMPUTERKWANTOWY', 'SUPERKOMPUTER'],
      food: ['LASAGNA', 'CROISSANT', 'SUSHI'],
      colors: ['TURKUSOWY', 'MAGENTA', 'CHARTREUSE'],
      sports: ['TRIATHLON', 'DZIESIĘCIOBÓJ', 'BADMINTON'],
    }
  },
  el: {
    easy: {
      animals: ['ΓΑΤΑ', 'ΣΚΥΛΟΣ', 'ΑΛΕΠΟΥ'],
      technology: ['CPU', 'RAM', 'PC'],
      food: ['ΜΗΛΟ', 'ΨΩΜΙ', 'ΚΕΙΚ'],
      colors: ['ΚΟΚΚΙΝΟ', 'ΜΠΛΕ', 'ΠΡΑΣΙΝΟ'],
      sports: ['ΠΟΔΟΣΦΑΙΡΟ', 'ΤΕΝΙΣ', 'ΓΚΟΛΦ'],
    },
    medium: {
      animals: ['ΤΙΓΡΗΣ', 'ΛΙΟΝΤΑΡΙ', 'ΑΡΚΟΥΔΑ'],
      technology: ['ΡΟΜΠΟΤ', 'DRONE', 'ΤΗΛΕΦΩΝΟ'],
      food: ['ΧΑΜΠΟΥΡΓΚΕΡ', 'ΖΥΜΑΡΙΚΑ', 'ΠΙΤΣΑ'],
      colors: ['ΚΙΤΡΙΝΟ', 'ΜΩΒ', 'ΠΟΡΤΟΚΑΛΙ'],
      sports: ['ΜΠΕΪΖΜΠΟΛ', 'ΚΡΙΚΕΤ', 'ΧΟΚΕΪ'],
    },
    hard: {
      animals: ['ΕΛΕΦΑΝΤΑΣ', 'ΑΛΛΙΓΚΑΤΟΡΑΣ', 'ΚΡΟΚΟΔΕΙΛΟΣ'],
      technology: ['ΜΙΚΡΟΕΠΕΞΕΡΓΑΣΤΗΣ', 'ΚΒΑΝΤΙΚΟΣΥΠΟΛΟΓΙΣΤΗΣ', 'ΥΠΕΡΥΠΟΛΟΓΙΣΤΗΣ'],
      food: ['ΛΑΖΑΝΙΑ', 'ΚΡΟΥΑΣΑΝ', 'ΣΟΥΣΙ'],
      colors: ['ΤΙΡΚΟΥΑΖ', 'ΜΑΤΖΕΝΤΑ', 'CHARTREUSE'],
      sports: ['ΤΡΙΑΘΛΟ', 'ΔΕΚΑΘΛΟ', 'ΜΠΑΝΤΜΙΝΤΟΝ'],
    }
  }}

const pastChallenges = {
  '2024-06-10': {
    en: 'REACT',
    fr: 'BONJOUR',
    es: 'HOLA',
    de: 'HALLO'
  },
  '2024-06-11': {
    en: 'HELLO',
    fr: 'MONDE',
    es: 'MUNDO',
    de: 'WELT'
  },
  '2024-06-12': {
    en: 'WORLD',
    fr: 'MONDE',
    es: 'MUNDO',
    de: 'WELT'
  },
  '2024-06-13': {
    en: 'COMPUTER',
    fr: 'ORDINATEUR',
    es: 'COMPUTADORA',
    de: 'COMPUTER'
  },
  '2024-06-14': {
    en: 'INTERNET',
    fr: 'INTERNET',
    es: 'INTERNET',
    de: 'INTERNET'
  },
  // Add more past challenges as needed
};

const userPuzzles = [
  { username: 'user1', puzzle: 'COMPUTER' },
  { username: 'user2', puzzle: 'INTERNET' },
  { username: 'user3', puzzle: 'PROGRAMMING' },
  { username: 'user4', puzzle: 'LANGUAGE' },
  { username: 'user5', puzzle: 'SOFTWARE' }
  // Add more user puzzles as needed
];

const userHints = {
  'user1': { revealLetter: 3, eliminateWrong: 2 },
  'user2': { revealLetter: 1, eliminateWrong: 3 },
  'user3': { revealLetter: 2, eliminateWrong: 2 },
  'user4': { revealLetter: 4, eliminateWrong: 1 },
  'user5': { revealLetter: 3, eliminateWrong: 3 }
  // Add more user hints as needed
};

const userAchievements = {
  'user1': ['First win', '10 games played'],
  'user2': ['First win', '5 games played'],
  'user3': ['First win', '20 games played', 'High score'],
  'user4': ['First win', '15 games played', 'Fastest time'],
  'user5': ['First win', '10 games played', 'Most words guessed']
  // Add more user achievements as needed
};





const geolocationWords = {
  'New York': 'SKYSCRAPER',
  'Paris': 'EIFFEL',
  'Tokyo': 'SHINJUKU',
  'London': 'BIGBEN',
  'Berlin': 'BRANDENBURG',
  'Sydney': 'OPERA',
  'Moscow': 'KREMLIN',
  'Rome': 'COLOSSEUM',
  'Cairo': 'PYRAMID',
  'Beijing': 'FORBIDDEN'
  // Add more locations as needed
};


const wordPacks = {
  animals: ['TIGER', 'LION', 'ELEPHANT', 'GIRAFFE', 'MONKEY'],
  technology: ['COMPUTER', 'SMARTPHONE', 'ROBOT', 'DRONE', 'TABLET'],
  food: ['PIZZA', 'BURGER', 'SUSHI', 'PASTA', 'SALAD'],
  countries: ['FRANCE', 'GERMANY', 'ITALY', 'SPAIN', 'CANADA'],
  colors: ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE'],
  sports: ['SOCCER', 'BASKETBALL', 'BASEBALL', 'TENNIS', 'CRICKET']
  // Add more packs as needed
};
const difficultyLevels = {
  easy: ['CAT', 'DOG', 'SUN'],
  medium: ['ELEPHANT', 'GIRAFFE', 'ROBOT'],
  hard: ['MICROPROCESSOR', 'QUANTUM', 'SCHRODINGER'],
};


const stories = [
  {
    id: 1,
    title: 'Mystery in the Mansion',
    parts: [
      { part: 1, word: 'MANSION', story: 'You arrive at an old mansion. What will you do?' },
      { part: 2, word: 'DOOR', story: 'You find a mysterious door. What will you do?' },
      { part: 3, word: 'KEY', story: 'You find a key under the doormat. Where will it lead?' },
      { part: 4, word: 'STAIRCASE', story: 'You see a grand staircase. Will you go up or explore more?' },
      { part: 5, word: 'ATTIC', story: 'You find an attic with old, dusty boxes. What will you do?' },
      { part: 6, word: 'PORTRAIT', story: 'You see an old portrait of a woman. She looks familiar. Who is she?' },
      { part: 7, word: 'JOURNAL', story: 'You find a journal with cryptic entries. What does it mean?' },
      { part: 8, word: 'SECRET', story: 'You discover a secret passage behind the bookshelf. Where does it lead?' },
      { part: 9, word: 'GARDEN', story: 'You exit into a neglected garden. What will you explore first?' },
      { part: 10, word: 'FOUNTAIN', story: 'In the garden, you see an old fountain. Is there something hidden?' },
      { part: 11, word: 'CELLAR', story: 'You find a hidden cellar door. Will you go down?' },
      { part: 12, word: 'CHEST', story: 'In the cellar, you discover an old chest. What’s inside?' },
      { part: 13, word: 'MAP', story: 'The chest contains a map. Where does it lead?' },
      { part: 14, word: 'CRYPT', story: 'The map points to a crypt. What will you find there?' },
      { part: 15, word: 'CANDLE', story: 'You light a candle to see better in the dark crypt. What’s next?' },
      { part: 16, word: 'STATUE', story: 'You see a statue with a hidden compartment. What’s inside?' },
      { part: 17, word: 'RIDDLE', story: 'The compartment contains a riddle. Can you solve it?' },
      { part: 18, word: 'TREASURE', story: 'You solve the riddle and find a hidden treasure. What will you do?' },
      { part: 19, word: 'ESCAPE', story: 'You need to find a way to escape the mansion with the treasure.' },
      { part: 20, word: 'CONCLUSION', story: 'You successfully escape with the treasure. What will you do next?' }
    ],
  },
  {
    id: 2,
    title: 'Space Adventure',
    parts: [
      { part: 1, word: 'SPACESHIP', story: 'You board your spaceship for a new adventure. What’s your destination?' },
      { part: 2, word: 'ASTEROID', story: 'You encounter an asteroid field. How will you navigate it?' },
      { part: 3, word: 'ALIEN', story: 'You meet an alien who needs your help. What will you do?' },
      { part: 4, word: 'PLANET', story: 'You land on an unknown planet. What will you explore first?' },
      { part: 5, word: 'CAVE', story: 'You find a cave with strange markings. What do they mean?' },
      { part: 6, word: 'ROBOT', story: 'A friendly robot offers to guide you. Will you follow it?' },
      { part: 7, word: 'LAB', story: 'You discover a hidden lab. What experiments were conducted here?' },
      { part: 8, word: 'CRYSTAL', story: 'A glowing crystal catches your eye. What powers does it hold?' },
      { part: 9, word: 'TRANSLATOR', story: 'The robot gives you a translator. What new knowledge will you gain?' },
      { part: 10, word: 'FOREST', story: 'You enter an alien forest. What creatures will you encounter?' },
      { part: 11, word: 'RIVER', story: 'A river blocks your path. How will you cross it?' },
      { part: 12, word: 'VILLAGE', story: 'You find a village of friendly aliens. How can they help you?' },
      { part: 13, word: 'WISDOM', story: 'The village elder shares ancient wisdom. What will you learn?' },
      { part: 14, word: 'PORTAL', story: 'You discover a portal to another world. Will you step through?' },
      { part: 15, word: 'ENERGY', story: 'The portal requires energy. How will you power it?' },
      { part: 16, word: 'ALLY', story: 'An unexpected ally offers assistance. Will you accept their help?' },
      { part: 17, word: 'BATTLE', story: 'You face a great battle. How will you prepare?' },
      { part: 18, word: 'VICTORY', story: 'You achieve victory. What’s your next move?' },
      { part: 19, word: 'HOME', story: 'You head back home. What have you brought with you?' },
      { part: 20, word: 'LEGEND', story: 'Your adventure becomes legend. What tales will be told?' }
    ],
  },
  {
    id: 3,
    title: 'Underwater Quest',
    parts: [
      { part: 1, word: 'SUBMARINE', story: 'You board a submarine to explore the deep ocean. What’s your mission?' },
      { part: 2, word: 'CORAL', story: 'You find a beautiful coral reef. What secrets does it hold?' },
      { part: 3, word: 'SHIPWRECK', story: 'You discover an ancient shipwreck. What treasures lie inside?' },
      { part: 4, word: 'DOLPHIN', story: 'A dolphin approaches your submarine. Will you follow it?' },
      { part: 5, word: 'CAVE', story: 'The dolphin leads you to an underwater cave. What will you find inside?' },
      { part: 6, word: 'PEARL', story: 'You find a giant pearl. What will you do with it?' },
      { part: 7, word: 'SHARK', story: 'A shark blocks your path. How will you get past it?' },
      { part: 8, word: 'TRENCH', story: 'You descend into a deep trench. What mysteries await you?' },
      { part: 9, word: 'ALIEN', story: 'You encounter an alien underwater base. What’s their purpose?' },
      { part: 10, word: 'CRYSTAL', story: 'The aliens show you a powerful crystal. What does it do?' },
      { part: 11, word: 'VORTEX', story: 'A vortex appears. Will you enter it?' },
      { part: 12, word: 'ATLANTIS', story: 'You find the lost city of Atlantis. What will you explore first?' },
      { part: 13, word: 'TEMPLE', story: 'You enter an ancient temple. What secrets does it hold?' },
      { part: 14, word: 'GUARDIAN', story: 'A guardian protects the temple. How will you get past it?' },
      { part: 15, word: 'SCROLL', story: 'You find an ancient scroll. What knowledge does it contain?' },
      { part: 16, word: 'TREASURE', story: 'The scroll leads you to a hidden treasure. What will you do with it?' },
      { part: 17, word: 'ESCAPE', story: 'You need to find a way to escape with the treasure.' },
      { part: 18, word: 'SUBMARINE', story: 'You return to your submarine. What’s your next destination?' },
      { part: 19, word: 'PORT', story: 'You arrive at a hidden port. What will you do next?' },
      { part: 20, word: 'CONCLUSION', story: 'You complete your underwater quest. What will you do next?' }
    ],
  },
  {
    id: 4,
    title: 'Ancient Egypt',
    parts: [
      { part: 1, word: 'PYRAMID', story: 'You arrive in ancient Egypt. What will you explore first?' },
      { part: 2, word: 'SPHINX', story: 'You see the Great Sphinx. What secrets does it hold?' },
      { part: 3, word: 'PHARAOH', story: 'You learn about a powerful Pharaoh. What mysteries surround him?' },
      { part: 4, word: 'TOMB', story: 'You find the entrance to a hidden tomb. What’s inside?' },
      { part: 5, word: 'MUMMY', story: 'You encounter a mummy. What will you do?' },
      { part: 6, word: 'SCARAB', story: 'A scarab beetle appears. What significance does it have?' },
      { part: 7, word: 'OBELISK', story: 'You see a towering obelisk. What does it represent?' },
      { part: 8, word: 'TEMPLE', story: 'You enter a grand temple. What rituals are performed here?' },
      { part: 9, word: 'HIEROGLYPH', story: 'You discover hieroglyphs on the temple walls. What do they mean?' },
      { part: 10, word: 'PAPYRUS', story: 'You find an ancient papyrus scroll. What knowledge does it contain?' },
      { part: 11, word: 'ANKH', story: 'You see an ankh symbol. What does it signify?' },
      { part: 12, word: 'SARCOPHAGUS', story: 'You open a sarcophagus. What will you find inside?' },
      { part: 13, word: 'JEWELS', story: 'The sarcophagus contains jewels. What will you do with them?' },
      { part: 14, word: 'CURSE', story: 'You hear about a curse. How will you avoid it?' },
      { part: 15, word: 'LABYRINTH', story: 'You enter a labyrinth. How will you navigate it?' },
      { part: 16, word: 'TRAP', story: 'You encounter a trap. How will you escape?' },
      { part: 17, word: 'GUARD', story: 'A guard appears. How will you deal with him?' },
      { part: 18, word: 'TREASURE', story: 'You find a hidden treasure. What will you do with it?' },
      { part: 19, word: 'ESCAPE', story: 'You need to escape with the treasure. How will you do it?' },
      { part: 20, word: 'LEGACY', story: 'You return to the present. What will be your legacy?' }
    ],
  },
  {
    id: 5,
    title: 'Medieval Quest',
    parts: [
      { part: 1, word: 'CASTLE', story: 'You arrive at a medieval castle. What will you explore first?' },
      { part: 2, word: 'KNIGHT', story: 'You meet a knight. What quest will he send you on?' },
      { part: 3, word: 'DRAGON', story: 'You hear about a dragon. Will you seek it out?' },
      { part: 4, word: 'TREASURE', story: 'You learn about a hidden treasure. How will you find it?' },
      { part: 5, word: 'FOREST', story: 'You enter a dark forest. What dangers will you face?' },
      { part: 6, word: 'WIZARD', story: 'A wizard offers to help you. Will you accept his help?' },
      { part: 7, word: 'SPELL', story: 'The wizard teaches you a spell. How will you use it?' },
      { part: 8, word: 'GOBLIN', story: 'You encounter a goblin. What will you do?' },
      { part: 9, word: 'CAVE', story: 'You find a cave. What secrets does it hold?' },
      { part: 10, word: 'SWORD', story: 'You find a magical sword. How will you use it?' },
      { part: 11, word: 'BATTLE', story: 'You prepare for battle. How will you strategize?' },
      { part: 12, word: 'VICTORY', story: 'You achieve victory. What will you do next?' },
      { part: 13, word: 'KING', story: 'You meet the king. What reward will he give you?' },
      { part: 14, word: 'FEAST', story: 'You attend a grand feast. What stories will be told?' },
      { part: 15, word: 'JOURNEY', story: 'You begin a new journey. Where will it take you?' },
      { part: 16, word: 'CASTLE', story: 'You return to the castle. What will you do next?' },
      { part: 17, word: 'ALLIANCE', story: 'You form an alliance. How will it benefit you?' },
      { part: 18, word: 'ENEMY', story: 'An enemy threatens your land. How will you defend it?' },
      { part: 19, word: 'PEACE', story: 'You negotiate peace. How will you secure it?' },
      { part: 20, word: 'LEGEND', story: 'Your quest becomes legend. What tales will be told?' }
    ],
  },
  {
    id: 6,
    title: 'Time Traveler',
    parts: [
      { part: 1, word: 'MACHINE', story: 'You build a time machine. What era will you visit first?' },
      { part: 2, word: 'DINOSAUR', story: 'You arrive in the age of dinosaurs. What will you explore?' },
      { part: 3, word: 'CAVEMAN', story: 'You meet a caveman. What will you learn from him?' },
      { part: 4, word: 'PYRAMID', story: 'You travel to ancient Egypt. What will you explore first?' },
      { part: 5, word: 'GLADIATOR', story: 'You arrive in ancient Rome. Will you watch a gladiator fight?' },
      { part: 6, word: 'KNIGHT', story: 'You travel to medieval times. What quest will you undertake?' },
      { part: 7, word: 'EXPLORER', story: 'You meet an explorer. What journey will you join?' },
      { part: 8, word: 'REVOLUTION', story: 'You witness a revolution. What role will you play?' },
      { part: 9, word: 'INVENTOR', story: 'You meet a famous inventor. What will you learn from him?' },
      { part: 10, word: 'WORLDWAR', story: 'You arrive during a world war. How will you navigate this time?' },
      { part: 11, word: 'ASTRONAUT', story: 'You travel to the future. Will you become an astronaut?' },
      { part: 12, word: 'ROBOT', story: 'You meet a robot. What will it teach you?' },
      { part: 13, word: 'SPACE', story: 'You travel to outer space. What will you explore?' },
      { part: 14, word: 'ALIEN', story: 'You encounter an alien species. What will you learn from them?' },
      { part: 15, word: 'COLONY', story: 'You join a space colony. What challenges will you face?' },
      { part: 16, word: 'RESEARCH', story: 'You conduct research in a futuristic lab. What will you discover?' },
      { part: 17, word: 'CURE', story: 'You find a cure for a future disease. How will you use it?' },
      { part: 18, word: 'RETURN', story: 'You decide to return to your own time. What will you bring back?' },
      { part: 19, word: 'CHANGE', story: 'You see how your journey has changed history. What will you do next?' },
      { part: 20, word: 'LEGEND', story: 'Your time travels become legend. What tales will be told?' }
    ],
  },
  {
    id: 7,
    title: 'Jungle Expedition',
    parts: [
      { part: 1, word: 'JUNGLE', story: 'You arrive in a dense jungle. What will you explore first?' },
      { part: 2, word: 'RIVER', story: 'You find a river. Will you follow it?' },
      { part: 3, word: 'MONKEY', story: 'A monkey appears. What will you learn from it?' },
      { part: 4, word: 'TEMPLE', story: 'You discover an ancient temple. What secrets does it hold?' },
      { part: 5, word: 'TRAP', story: 'You encounter a trap. How will you escape?' },
      { part: 6, word: 'MAP', story: 'You find a map. Where does it lead?' },
      { part: 7, word: 'TREASURE', story: 'The map leads to a treasure. How will you find it?' },
      { part: 8, word: 'TIGER', story: 'A tiger blocks your path. What will you do?' },
      { part: 9, word: 'CAVE', story: 'You find a hidden cave. What’s inside?' },
      { part: 10, word: 'GEM', story: 'You discover a rare gem. What will you do with it?' },
      { part: 11, word: 'TRIBE', story: 'You meet a local tribe. What will you learn from them?' },
      { part: 12, word: 'RITUAL', story: 'You witness a ritual. What is its significance?' },
      { part: 13, word: 'STORM', story: 'A storm approaches. How will you find shelter?' },
      { part: 14, word: 'ALLIGATOR', story: 'You encounter an alligator. How will you get past it?' },
      { part: 15, word: 'MEDICINE', story: 'You find a plant with medicinal properties. How will you use it?' },
      { part: 16, word: 'HUNT', story: 'You join a hunt. What will you catch?' },
      { part: 17, word: 'FIRE', story: 'You build a fire. What stories will be told?' },
      { part: 18, word: 'ESCAPE', story: 'You need to escape the jungle. How will you do it?' },
      { part: 19, word: 'RETURN', story: 'You return to civilization. What will you bring back?' },
      { part: 20, word: 'LEGEND', story: 'Your jungle expedition becomes legend. What tales will be told?' }
    ],
  },
  {
    id: 8,
    title: 'Desert Adventure',
    parts: [
      { part: 1, word: 'DESERT', story: 'You arrive in a vast desert. What will you explore first?' },
      { part: 2, word: 'OASIS', story: 'You find an oasis. Will you rest here?' },
      { part: 3, word: 'CAMEL', story: 'You find a camel. Will you ride it?' },
      { part: 4, word: 'DUNE', story: 'You see a massive dune. Will you climb it?' },
      { part: 5, word: 'RUINS', story: 'You discover ancient ruins. What secrets do they hold?' },
      { part: 6, word: 'SANDSTORM', story: 'A sandstorm approaches. How will you find shelter?' },
      { part: 7, word: 'TREASURE', story: 'You hear about a hidden treasure. How will you find it?' },
      { part: 8, word: 'MAP', story: 'You find a map. Where does it lead?' },
      { part: 9, word: 'SCORPION', story: 'A scorpion blocks your path. What will you do?' },
      { part: 10, word: 'TEMPLE', story: 'You discover an ancient temple. What rituals are performed here?' },
      { part: 11, word: 'GENIE', story: 'You find a genie’s lamp. What wish will you make?' },
      { part: 12, word: 'MARKET', story: 'You visit a bustling market. What will you buy?' },
      { part: 13, word: 'CARAVAN', story: 'You join a caravan. Where will it take you?' },
      { part: 14, word: 'MIRAGE', story: 'You see a mirage. Is it real or an illusion?' },
      { part: 15, word: 'WELL', story: 'You find a well. Will you draw water from it?' },
      { part: 16, word: 'NOMAD', story: 'You meet a nomad. What stories will he tell?' },
      { part: 17, word: 'ESCAPE', story: 'You need to escape the desert. How will you do it?' },
      { part: 18, word: 'RETURN', story: 'You return to civilization. What will you bring back?' },
      { part: 19, word: 'JOURNEY', story: 'You begin a new journey. Where will it take you?' },
      { part: 20, word: 'LEGEND', story: 'Your desert adventure becomes legend. What tales will be told?' }
    ],
  },
  {
    id: 9,
    title: 'Arctic Expedition',
    parts: [
      { part: 1, word: 'ICEBERG', story: 'You arrive in the Arctic. What will you explore first?' },
      { part: 2, word: 'POLARBEAR', story: 'You see a polar bear. How will you keep safe?' },
      { part: 3, word: 'IGLOO', story: 'You find an igloo. Will you take shelter inside?' },
      { part: 4, word: 'AURORA', story: 'You witness the Northern Lights. What will you do next?' },
      { part: 5, word: 'GLACIER', story: 'You see a massive glacier. Will you explore it?' },
      { part: 6, word: 'SEAL', story: 'A seal appears. What will you learn from it?' },
      { part: 7, word: 'CAVE', story: 'You find an ice cave. What secrets does it hold?' },
      { part: 8, word: 'PENGUIN', story: 'You see a penguin colony. What will you observe?' },
      { part: 9, word: 'EXPEDITION', story: 'You join an expedition. What will you discover?' },
      { part: 10, word: 'STORM', story: 'A storm approaches. How will you find shelter?' },
      { part: 11, word: 'SLED', story: 'You find a sled. Will you use it?' },
      { part: 12, word: 'FIRE', story: 'You build a fire. What stories will be told?' },
      { part: 13, word: 'ICEBERG', story: 'You see a drifting iceberg. Will you explore it?' },
      { part: 14, word: 'RESEARCH', story: 'You conduct research. What will you discover?' },
      { part: 15, word: 'SCIENTIST', story: 'You meet a scientist. What will you learn from him?' },
      { part: 16, word: 'BASE', story: 'You find a research base. What will you do there?' },
      { part: 17, word: 'ESCAPE', story: 'You need to escape the Arctic. How will you do it?' },
      { part: 18, word: 'RETURN', story: 'You return to civilization. What will you bring back?' },
      { part: 19, word: 'JOURNEY', story: 'You begin a new journey. Where will it take you?' },
      { part: 20, word: 'LEGEND', story: 'Your Arctic expedition becomes legend. What tales will be told?' }
    ],
  },
  {
    id: 10,
    title: 'Haunted House',
    parts: [
      { part: 1, word: 'GHOST', story: 'You arrive at a haunted house. What will you explore first?' },
      { part: 2, word: 'DOOR', story: 'You find a creaking door. Will you open it?' },
      { part: 3, word: 'SHADOW', story: 'A shadowy figure appears. What will you do?' },
      { part: 4, word: 'WHISPER', story: 'You hear whispers. Where are they coming from?' },
      { part: 5, word: 'MIRROR', story: 'You see a mirror. What will you see in it?' },
      { part: 6, word: 'PORTRAIT', story: 'A portrait’s eyes seem to follow you. What will you do?' },
      { part: 7, word: 'BOOK', story: 'You find an old book. What secrets does it hold?' },
      { part: 8, word: 'STAIRS', story: 'You see a staircase. Will you go up or down?' },
      { part: 9, word: 'ATTIC', story: 'You enter the attic. What will you find?' },
      { part: 10, word: 'BASEMENT', story: 'You go to the basement. What’s hidden there?' },
      { part: 11, word: 'CRYPT', story: 'You find a crypt. Will you enter it?' },
      { part: 12, word: 'CANDLE', story: 'You light a candle. What will you explore next?' },
      { part: 13, word: 'WHISPER', story: 'You hear whispers. What will you do?' },
      { part: 14, word: 'TRAPDOOR', story: 'You find a trapdoor. Will you open it?' },
      { part: 15, word: 'SECRET', story: 'You discover a secret room. What’s inside?' },
      { part: 16, word: 'DIARY', story: 'You find a diary. What does it reveal?' },
      { part: 17, word: 'ESCAPE', story: 'You need to escape the haunted house. How will you do it?' },
      { part: 18, word: 'GHOST', story: 'A ghost blocks your path. What will you do?' },
      { part: 19, word: 'LIGHT', story: 'You see a light. Will you follow it?' },
      { part: 20, word: 'CONCLUSION', story: 'You escape the haunted house. What will you do next?' }
    ],
  },
  // Add more stories as needed
];



// Route to get a daily word
app.get('/daily', (req, res) => {
  const lang = req.query.lang || 'en';
  const word = dailyWords[lang][Math.floor(Math.random() * dailyWords[lang].length)];
  res.json({ word });
});

app.get('/word', (req, res) => {
  const { lang, difficulty, pack } = req.query;

  if (!words[lang] || !words[lang][difficulty] || !words[lang][difficulty][pack]) {
    return res.status(400).json({ error: 'Invalid parameters' });
  }

  const wordList = words[lang][difficulty][pack];
  const word = wordList[Math.floor(Math.random() * wordList.length)];
  res.json({ word });
});

app.get('/wordDetails', async (req, res) => {
  const { word, lang } = req.query;
  try {
    const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/${lang}/${word}`);
    const wordData = response.data[0];
    const details = {
      definition: wordData.meanings[0].definitions[0].definition,
      conjugations: "N/A", // Replace with actual conjugation data if available
      synonyms: wordData.meanings[0].synonyms.join(', ')
    };
    res.json(details);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch word details' });
  }
});
// Route to handle hint usage
app.post('/useHint', (req, res) => {
  const { username, hintType } = req.body;

  if (!username || !hintType) {
    return res.status(400).json({ success: false, message: 'Username and hintType are required' });
  }

  if (!userHints[username]) {
    userHints[username] = { revealLetter: 3, eliminateWrong: 3 }; // Example default hint counts
  }

  if (userHints[username][hintType] > 0) {
    userHints[username][hintType]--;
    res.json({ success: true, hintsLeft: userHints[username][hintType] });
  } else {
    res.json({ success: false, message: 'No hints left' });
  }
});

// Route to create a user-generated puzzle
app.post('/createPuzzle', (req, res) => {
  const { username, puzzle } = req.body;
  userPuzzles.push({ username, puzzle });
  res.json({ success: true });
});

// Route to get user-generated puzzles
app.get('/userPuzzles', (req, res) => {
  res.json(userPuzzles);
});

// Route to handle leaderboard updates
app.post('/leaderboard', (req, res) => {
  const { username, score } = req.body;
  if (!leaderboard[username]) leaderboard[username] = 0;
  leaderboard[username] += score;
  res.json({ success: true });
});

// Route to get leaderboard
app.get('/leaderboard', (req, res) => {
  res.json(leaderboard);
});

// Route to get past challenges
app.get('/pastChallenges', (req, res) => {
  res.json(pastChallenges);
});

// Route to handle achievements
app.post('/achievement', (req, res) => {
  const { username, achievement } = req.body;
  if (!userAchievements[username]) userAchievements[username] = [];
  userAchievements[username].push(achievement);
  res.json({ success: true });
});

// Route to get user achievements
app.get('/achievements', (req, res) => {
  const { username } = req.query;
  res.json(userAchievements[username] || []);
});

// Route to get story parts
app.get('/story', (req, res) => {
  const { id, part } = req.query;
  const story = stories.find(story => story.id === parseInt(id));
  const storyPart = story.parts.find(p => p.part === parseInt(part));
  res.json(storyPart);
});

// Route to get word packs
app.get('/wordPack', (req, res) => {
  const { pack } = req.query;
  res.json(wordPacks[pack] || []);
});

// Route to handle user profile creation/updating
const userProfiles = {};

app.post('/profile', (req, res) => {
  const { username, profile } = req.body;
  userProfiles[username] = profile;
  res.json({ success: true });
});

// Route to get user profile
app.get('/profile', (req, res) => {
  const { username } = req.query;
  res.json(userProfiles[username] || {});
});

// Route to get word details (definitions, conjugations, synonyms)
app.get('/wordDetails', (req, res) => {
  const lang = req.query.lang || 'en';
  const word = req.query.word;
  // Here you would integrate with a dictionary API to get the word details
  // For simplicity, returning a dummy response
  res.json({
    word: word,
    definition: `Definition of ${word} in ${lang}`,
    conjugations: `Conjugations of ${word} in ${lang}`,
    synonyms: `Synonyms of ${word} in ${lang}`
  });
});

// WebSocket for real-time multiplayer

let games = {};

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  socket.on('joinGame', ({ username, lang }) => {
    socket.join(lang);

    if (!games[lang]) {
      games[lang] = {
        players: {},
        word: words[lang][Math.floor(Math.random() * words[lang].length)]
      };
    }

    games[lang].players[socket.id] = { username, score: 0 };

    io.to(lang).emit('gameUpdate', games[lang]);
  });

  socket.on('makeGuess', ({ guess, lang }) => {
    const game = games[lang];
    if (game && guess.toUpperCase() === game.word) {
      game.players[socket.id].score += 1;
      game.word = words[lang][Math.floor(Math.random() * words[lang].length)];
      io.to(lang).emit('gameUpdate', game);
    } else {
      socket.emit('guessFeedback', 'Incorrect guess. Try again!');
    }
  });

  socket.on('disconnect', () => {
    for (const lang in games) {
      delete games[lang].players[socket.id];
      io.to(lang).emit('gameUpdate', games[lang]);
    }
    console.log('user disconnected:', socket.id);
  });
});

http.listen(3001, () => {
  console.log('listening on *:3000');
});