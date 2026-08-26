// GENERADO — no editar a mano.
// Fuente: content/clases/kurasu-NN.md
// Regenerar con: npm run clases:generate
//
// Los apuntes son la transcripción de las clases reales (Notion 日本語 | Nihongo > Clases).
// Editá el markdown y volvé a correr el script; nunca este archivo.
//
// La hoja de repaso global se quitó el 2026-08-16: el repaso ahora es por clase
// (ClassQuizScreen, armado con el vocabulario de esa clase).

import { ClassNote } from '../types/classNotes';

export const CLASS_NOTES: ClassNote[] = [
  {
    "id": "kurasu-01",
    "number": 1,
    "title": "はじめまして！ Presentación e introducción al japonés",
    "date": "2026-03-07",
    "topics": "palabras del aula, historia del idioma, sistemas de escritura, sintaxis SOV, partículas (intro), pronombres y honoríficos, presentarse, países, profesiones, hobbies, frases esenciales.",
    "sections": [
      {
        "id": "palabras-del-aula",
        "title": "Palabras del aula",
        "titleJp": "クラスのことば",
        "blocks": [
          {
            "kind": "subheading",
            "text": "Antes de la clase | クラスのまえ"
          },
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "しつれいします",
                "Shitsurei shimasu",
                "Con permiso"
              ],
              [
                "どうぞ",
                "Douzo",
                "Adelante"
              ],
              [
                "きりつ",
                "Kiritsu",
                "De pie"
              ],
              [
                "おはようございます",
                "Ohayou gozaimasu",
                "Buenos días"
              ],
              [
                "はじめましょう",
                "Hajimemashou",
                "¡Empecemos!"
              ]
            ]
          },
          {
            "kind": "subheading",
            "text": "Durante la clase | クラスちゅう"
          },
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "きゅうけいしましょう",
                "Kyuukei shimashou",
                "¡Tengamos un recreo!"
              ],
              [
                "おわりましょう",
                "Owarimashou",
                "¡Terminemos!"
              ],
              [
                "しつもんがありますか？",
                "Shitsumon ga arimasu ka?",
                "¿Alguna pregunta?"
              ],
              [
                "はい、あります。",
                "Hai, arimasu.",
                "Sí, tengo una pregunta."
              ],
              [
                "いいえ、ありません。",
                "Iie, arimasen.",
                "No, no tengo."
              ],
              [
                "すみません、しつもんです。",
                "Sumimasen, shitsumon desu.",
                "Perdón, tengo una pregunta."
              ],
              [
                "はい、どうぞ。",
                "Hai, douzo.",
                "Adelante."
              ],
              [
                "わかりましたか？",
                "Wakarimashita ka?",
                "¿Se entendió?"
              ],
              [
                "はい、わかりました。",
                "Hai, wakarimashita.",
                "Sí, entendí."
              ],
              [
                "わかりません。",
                "Wakarimasen.",
                "No entiendo."
              ],
              [
                "よんでください",
                "Yonde kudasai",
                "Lee por favor."
              ],
              [
                "きいてください",
                "Kiite kudasai",
                "Escuchen por favor."
              ],
              [
                "こたえてください",
                "Kotaete kudasai",
                "Respondan por favor."
              ],
              [
                "もういちどおねがいします",
                "Mou ichido onegaishimasu",
                "¿Podrías repetirlo?"
              ],
              [
                "しゅくだい",
                "Shukudai",
                "Tarea"
              ],
              [
                "しけん／テスト",
                "Shiken / Tesuto",
                "Examen"
              ]
            ]
          },
          {
            "kind": "subheading",
            "text": "Después de la clase | クラスのあと"
          },
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "きりつ",
                "Kiritsu",
                "De pie"
              ],
              [
                "おつかれさまでした。",
                "Otsukaresama deshita.",
                "Buen trabajo el de hoy."
              ],
              [
                "ありがとうございます。",
                "Arigatou gozaimasu.",
                "Muchas gracias."
              ],
              [
                "またらいしゅう。さようなら。",
                "Mata raishuu. Sayounara.",
                "Hasta la semana que viene. Adiós."
              ]
            ]
          }
        ]
      },
      {
        "id": "historia-del-idioma-japones",
        "title": "Historia del idioma japonés",
        "blocks": [
          {
            "kind": "text",
            "text": "Antes del período Heian (794–1185), el japonés era únicamente un idioma hablado. Con la llegada de monjes budistas chinos, Japón tomó prestados los caracteres chinos (漢字) para poder escribir."
          },
          {
            "kind": "list",
            "items": [
              "**Período Heian (794–1185):** los caracteres chinos usados solo por su sonido se simplificaron hasta convertirse en ひらがな (Hiragana). Los usados por su significado se llamaron 漢字 (Kanji).",
              "**Período Edo (1603–1868):** los caracteres angulosos se usaron para escribir sonidos de manera estructurada, dando origen al カタカナ (Katakana).",
              "**Período Meiji (1868–1912):** con la apertura a occidente entraron muchas palabras extranjeras; sus sonidos se japonizaron y se escriben en Katakana."
            ]
          }
        ]
      },
      {
        "id": "los-4-sistemas-de-escritura",
        "title": "Los 4 sistemas de escritura",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Sistema",
              "Caracteres",
              "Para qué se usa"
            ],
            "rows": [
              [
                "ひらがな Hiragana",
                "Formas redondeadas",
                "Palabras japonesas, conectores, partículas"
              ],
              [
                "カタカナ Katakana",
                "Formas angulosas",
                "Palabras extranjeras y onomatopeyas"
              ],
              [
                "漢字 Kanji",
                "Ideogramas de origen chino",
                "Sustantivos, verbos, adjetivos con significado propio"
              ],
              [
                "ローマ字 Romaji",
                "Alfabeto latino",
                "Transcribir el japonés"
              ]
            ]
          },
          {
            "kind": "note",
            "tone": "💡",
            "text": "Los Kanji tienen dos o más lecturas según contexto. Cada uno representa una idea, no un sonido."
          }
        ]
      },
      {
        "id": "sintaxis-sujeto-objeto-verbo",
        "title": "Sintaxis: Sujeto-Objeto-Verbo",
        "blocks": [
          {
            "kind": "text",
            "text": "Español: Sujeto → Verbo → Objeto. Japonés: **Sujeto → Objeto → Verbo**; el verbo siempre va al final."
          },
          {
            "kind": "quote",
            "lines": [
              "たなかさん は にほんじん です。 (Tanaka-san wa nihonjin desu.) — La señora Tanaka es japonesa.",
              "フアンくん は ともだちと きんようびに がっこうで べんきょうします。 — Juan estudia con su amigo en el colegio el viernes."
            ]
          }
        ]
      },
      {
        "id": "las-particulas",
        "title": "Las partículas",
        "blocks": [
          {
            "kind": "text",
            "text": "Reemplazan preposiciones, artículos y auxiliares del español. Van **después** de la palabra a la que refieren y ordenan la oración."
          }
        ]
      },
      {
        "id": "pronombres-personales-y-honorificos",
        "title": "Pronombres personales y honoríficos",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "わたし",
                "Watashi",
                "Yo"
              ],
              [
                "わたしたち",
                "Watashitachi",
                "Nosotros"
              ],
              [
                "あなた",
                "Anata",
                "Usted / Vos"
              ],
              [
                "あなたたち",
                "Anatatachi",
                "Ustedes"
              ]
            ]
          },
          {
            "kind": "text",
            "text": "Honoríficos (van después del apellido):"
          },
          {
            "kind": "table",
            "headers": [
              "Honorífico",
              "Uso"
            ],
            "rows": [
              [
                "～さま sama",
                "Máximo respeto. Contexto laboral formal."
              ],
              [
                "～さん san",
                "Respeto general. Personas que no conocemos."
              ],
              [
                "～くん kun",
                "Respeto moderado. Chicos/hombres de confianza."
              ],
              [
                "～ちゃん chan",
                "Muy familiar. Menores, amigas cercanas, mascotas."
              ]
            ]
          },
          {
            "kind": "note",
            "tone": "⚠️",
            "text": "Primero el apellido, luego el nombre. NUNCA usar honoríficos para uno mismo ni con あなた."
          }
        ]
      },
      {
        "id": "presentarse",
        "title": "Presentarse",
        "titleJp": "わたしは～です",
        "blocks": [
          {
            "kind": "quote",
            "lines": [
              "わたし は [nombre] です。 (Watashi wa [nombre] desu.) — Yo soy [nombre]."
            ]
          },
          {
            "kind": "list",
            "items": [
              "おなまえは？ Onamae wa? — ¿Cómo te llamás?",
              "おくには？ Okuni wa? — ¿De qué país sos?",
              "おしごとは？ Oshigoto wa? — ¿A qué te dedicás?",
              "ごしゅみは？ Go shumi wa? — ¿Cuál es tu hobby?"
            ]
          }
        ]
      },
      {
        "id": "paises",
        "title": "Países",
        "titleJp": "くに + じん",
        "blocks": [
          {
            "kind": "text",
            "text": "Nacionalidad = país + じん"
          },
          {
            "kind": "table",
            "headers": [
              "País",
              "Japonés",
              "Romaji",
              "Nacionalidad"
            ],
            "rows": [
              [
                "Japón",
                "にほん",
                "Nihon",
                "にほんじん"
              ],
              [
                "Argentina",
                "アルゼンチン",
                "Aruzenchin",
                "アルゼンチンじん"
              ],
              [
                "China",
                "ちゅうごく",
                "Chuugoku",
                "ちゅうごくじん"
              ],
              [
                "Corea",
                "かんこく",
                "Kankoku",
                "かんこくじん"
              ],
              [
                "Brasil",
                "ブラジル",
                "Burajiru",
                "ブラジルじん"
              ],
              [
                "EE.UU.",
                "アメリカ",
                "Amerika",
                "アメリカじん"
              ],
              [
                "Inglaterra",
                "イギリス",
                "Igirisu",
                "イギリスじん"
              ],
              [
                "Francia",
                "フランス",
                "Furansu",
                "フランスじん"
              ],
              [
                "España",
                "スパイン",
                "Supein",
                "スパインじん"
              ],
              [
                "Italia",
                "イタリア",
                "Itaria",
                "イタリアじん"
              ],
              [
                "Australia",
                "オーストラリア",
                "Oosutoraria",
                "オーストラリアじん"
              ],
              [
                "México",
                "メキシコ",
                "Mekishiko",
                "メキシコじん"
              ],
              [
                "Perú",
                "ペルー",
                "Peruu",
                "ペルーじん"
              ],
              [
                "Chile",
                "チリ",
                "Chiri",
                "チリじん"
              ],
              [
                "Venezuela",
                "ベネズエラ",
                "Benezuera",
                "ベネズエラじん"
              ],
              [
                "India",
                "インド",
                "Indo",
                "インドじん"
              ],
              [
                "Vietnam",
                "ベトナム",
                "Betonamu",
                "ベトナムじん"
              ]
            ]
          }
        ]
      },
      {
        "id": "profesiones",
        "title": "Profesiones",
        "titleJp": "おしごと",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "せんせい／きょうし",
                "Sensei / Kyoushi",
                "Profesor/a"
              ],
              [
                "がくせい",
                "Gakusei",
                "Alumno/a"
              ],
              [
                "かいしゃいん",
                "Kaishain",
                "Empleado de empresa"
              ],
              [
                "ぎんこういん",
                "Ginkooin",
                "Banquero/a"
              ],
              [
                "いしゃ",
                "Isha",
                "Doctor/a"
              ],
              [
                "けんきゅうしゃ",
                "Kenkyuusha",
                "Investigador/a"
              ],
              [
                "エンジニア",
                "Enjinia",
                "Ingeniero/a"
              ],
              [
                "べんごし",
                "Bengoshi",
                "Abogado/a"
              ],
              [
                "しゃいん",
                "Shain",
                "Empleado/a"
              ],
              [
                "はいゆう",
                "Haiyuu",
                "Actor/Actriz"
              ]
            ]
          }
        ]
      },
      {
        "id": "hobbies",
        "title": "Hobbies",
        "titleJp": "ごしゅみ",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "スポーツ",
                "Supootsu",
                "Deportes"
              ],
              [
                "どくしょ",
                "Dokusho",
                "Lectura"
              ],
              [
                "りょこう",
                "Ryokoo",
                "Viajes"
              ],
              [
                "え",
                "E",
                "Dibujo/Pintura"
              ],
              [
                "しゃしん",
                "Shashin",
                "Fotografía"
              ],
              [
                "えいが",
                "Eiga",
                "Películas"
              ],
              [
                "おんがく",
                "Ongaku",
                "Música"
              ],
              [
                "りょうり",
                "Ryoori",
                "Cocinar"
              ],
              [
                "ゲーム",
                "Geemu",
                "Videojuegos"
              ],
              [
                "ピアノ",
                "Piano",
                "Piano"
              ]
            ]
          }
        ]
      },
      {
        "id": "frases-esenciales",
        "title": "Frases esenciales",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "はじめまして！",
                "Hajimemashite!",
                "¡Mucho gusto! (primer encuentro)"
              ],
              [
                "わたし は ～ です。",
                "Watashi wa ~ desu.",
                "Yo soy ~."
              ],
              [
                "おなまえは？",
                "Onamae wa?",
                "¿Cómo te llamás?"
              ],
              [
                "おくには？",
                "Okuni wa?",
                "¿De qué país sos?"
              ],
              [
                "おしごとは？",
                "Oshigoto wa?",
                "¿A qué te dedicás?"
              ],
              [
                "ごしゅみは？",
                "Go shumi wa?",
                "¿Cuál es tu hobby?"
              ],
              [
                "どうぞよろしくおねがいします。",
                "Douzo yoroshiku onegai shimasu.",
                "Encantado/a (cierre formal)"
              ],
              [
                "よろしくおねがいします！",
                "Yoroshiku onegaishimasu!",
                "¡Encantado/a! (informal)"
              ]
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "kurasu-02",
    "number": 2,
    "title": "Hiragana completo, tenten, maru y partículas か・も",
    "date": "2026-03-14",
    "topics": "hiragana completo, tenten/maru, っ chiquito, combinaciones (kya kyu kyo), vocales largas, partícula か, partícula も, demostrativos この/その/あの, formal vs informal.",
    "sections": [
      {
        "id": "hiragana-variantes-sonoras",
        "title": "Hiragana — variantes sonoras",
        "blocks": [
          {
            "kind": "subheading",
            "text": "Fila KA + tenten"
          },
          {
            "kind": "text",
            "text": "か→が(ga), き→ぎ(gi), く→ぐ(gu), け→げ(ge), こ→ご(go) — K → G"
          },
          {
            "kind": "subheading",
            "text": "Fila SA + tenten"
          },
          {
            "kind": "text",
            "text": "さ→ざ(za), し→じ(ji), す→ず(zu), せ→ぜ(ze), そ→ぞ(zo) — S → Z"
          },
          {
            "kind": "subheading",
            "text": "Fila TA + tenten"
          },
          {
            "kind": "text",
            "text": "た→だ(da), ち→ぢ(ji), つ→づ(dzu), て→で(de), と→ど(do) — T → D"
          },
          {
            "kind": "subheading",
            "text": "Filas sin variantes"
          },
          {
            "kind": "table",
            "headers": [
              "Fila",
              "Sílabas"
            ],
            "rows": [
              [
                "NA",
                "な に ぬ ね の"
              ],
              [
                "MA",
                "ま み む め も"
              ],
              [
                "YA",
                "や ゆ よ"
              ],
              [
                "RA",
                "ら り る れ ろ"
              ],
              [
                "WA / N",
                "わ を ん"
              ]
            ]
          },
          {
            "kind": "subheading",
            "text": "Fila HA — tenten y maru"
          },
          {
            "kind": "table",
            "headers": [
              "Base",
              "Tenten (゛)",
              "Maru (゚)"
            ],
            "rows": [
              [
                "は ha",
                "ば ba",
                "ぱ pa"
              ],
              [
                "ひ hi",
                "び bi",
                "ぴ pi"
              ],
              [
                "ふ fu",
                "ぶ bu",
                "ぷ pu"
              ],
              [
                "へ he",
                "べ be",
                "ぺ pe"
              ],
              [
                "ほ ho",
                "ぼ bo",
                "ぽ po"
              ]
            ]
          },
          {
            "kind": "note",
            "tone": "💡",
            "text": "El tenten (゛) cambia la consonante a su versión sonora. El maru (゚) se usa solo en la fila HA para los sonidos P."
          }
        ]
      },
      {
        "id": "chiquito",
        "title": "っ Chiquito",
        "titleJp": "ちいさい「つ」",
        "blocks": [
          {
            "kind": "text",
            "text": "Duplica la consonante que le sigue; se pronuncia como una pausa/golpe."
          },
          {
            "kind": "table",
            "headers": [
              "Sin っ",
              "Con っ",
              "Español"
            ],
            "rows": [
              [
                "きて kite",
                "きって kitte",
                "Vení / Estampilla"
              ],
              [
                "おと oto",
                "おっと otto",
                "Sonido / Esposo"
              ],
              [
                "ぶか buka",
                "ぶっか bukka",
                "Subordinado / Precio"
              ]
            ]
          },
          {
            "kind": "text",
            "text": "Solo aparece antes de K, S, T, P:"
          },
          {
            "kind": "table",
            "headers": [
              "Comb.",
              "Ejemplo",
              "Significado"
            ],
            "rows": [
              [
                "っ+k",
                "にっき nikki",
                "Diario íntimo"
              ],
              [
                "っ+s",
                "ざっし zasshi",
                "Revista"
              ],
              [
                "っ+t",
                "ちょっと chotto",
                "Un momento"
              ],
              [
                "っ+p",
                "きっぷ kippu",
                "Boleto/Ticket"
              ]
            ]
          }
        ]
      },
      {
        "id": "combinaciones",
        "title": "Combinaciones",
        "titleJp": "きゃきゅきょ",
        "blocks": [
          {
            "kind": "text",
            "text": "Sílabas terminadas en い + や/ゆ/よ pequeños:"
          },
          {
            "kind": "table",
            "headers": [
              "Comb.",
              "Ejemplo",
              "Significado"
            ],
            "rows": [
              [
                "き+ょ",
                "きょうし kyoushi",
                "Profesor"
              ],
              [
                "び+ょ",
                "びょういん byouin",
                "Hospital"
              ],
              [
                "び+よ",
                "びよういん biyouin",
                "Peluquería"
              ]
            ]
          },
          {
            "kind": "note",
            "tone": "⚠️",
            "text": "びょういん (hospital) vs びよういん (peluquería): la diferencia es si la よ es chica o grande."
          }
        ]
      },
      {
        "id": "vocales-largas",
        "title": "Vocales largas",
        "blocks": [
          {
            "kind": "subheading",
            "text": "E + I → E larga"
          },
          {
            "kind": "text",
            "text": "せんせい→Sensee, きれい→Kiree, えいご→Eego, せいかつ→Seekatsu (estilo de vida)"
          },
          {
            "kind": "subheading",
            "text": "O + U → O larga"
          },
          {
            "kind": "text",
            "text": "こうこう→Kookoo (secundaria), きょうと→Kyooto, とうきょう→Tookyoo, さようなら→Sayoonara, ありがとう→Arigatoo"
          }
        ]
      },
      {
        "id": "particula-preguntas",
        "title": "Partícula か — preguntas",
        "blocks": [
          {
            "kind": "text",
            "text": "Va al final de la oración; equivale a ¿?."
          },
          {
            "kind": "quote",
            "lines": [
              "きょうこさん は がくせい ですか？ — ¿Kyouko es alumna?",
              "はい、がくせい です。 — Sí, es alumna.",
              "いいえ、がくせい じゃありません。 — No, no es alumna."
            ]
          },
          {
            "kind": "note",
            "tone": "💡",
            "text": "Si el sujeto ya está en la pregunta, no se repite en la respuesta."
          }
        ]
      },
      {
        "id": "particula-tambien-tampoco",
        "title": "Partícula も — también / tampoco",
        "blocks": [
          {
            "kind": "text",
            "text": "も reemplaza a は cuando significa \"también\" (positiva) o \"tampoco\" (negativa)."
          },
          {
            "kind": "quote",
            "lines": [
              "トビー・マグワイアさん は スパイダーマン の はいゆう です。 — Tobey Maguire es el actor de Spiderman.",
              "アンドリュー ガーフィールドさん も スパイダーマン の はいゆう です。 — Andrew Garfield también."
            ]
          },
          {
            "kind": "text",
            "text": "En preguntas con も: respuesta positiva → se mantiene も; respuesta negativa → も se reemplaza por は + じゃありません."
          }
        ]
      },
      {
        "id": "demostrativos",
        "title": "Demostrativos この・その・あの",
        "blocks": [
          {
            "kind": "text",
            "text": "Adjetivos demostrativos: siempre seguidos de un sustantivo."
          },
          {
            "kind": "table",
            "headers": [
              "Dem.",
              "Romaji",
              "Uso"
            ],
            "rows": [
              [
                "この",
                "kono",
                "Cerca del hablante"
              ],
              [
                "その",
                "sono",
                "Cerca del oyente"
              ],
              [
                "あの",
                "ano",
                "Lejos de ambos"
              ]
            ]
          },
          {
            "kind": "quote",
            "lines": [
              "この ひと は だれ ですか？ — ¿Quién es esta persona?",
              "その ひと は アルゼンチンじん で、サッカーせんしゅう です。 — Esa persona es argentina y jugadora de fútbol."
            ]
          }
        ]
      },
      {
        "id": "formal-vs-informal",
        "title": "Formal vs. Informal",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Informal",
              "Formal",
              "Significado"
            ],
            "rows": [
              [
                "ひと hito",
                "かた kata",
                "Persona"
              ],
              [
                "だれ dare",
                "どなた donata",
                "¿Quién?"
              ]
            ]
          }
        ]
      },
      {
        "id": "frases-esenciales",
        "title": "Frases esenciales",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "～さん は ～ ですか？",
                "~-san wa ~ desu ka?",
                "¿Es ~ ~?"
              ],
              [
                "はい、～ です。",
                "Hai, ~ desu.",
                "Sí, es ~."
              ],
              [
                "いいえ、～ じゃありません。",
                "Iie, ~ ja arimasen.",
                "No, no es ~."
              ],
              [
                "この ひと は だれ ですか？",
                "Kono hito wa dare desu ka?",
                "¿Quién es esta persona?"
              ],
              [
                "その かた は どなた ですか？",
                "Sono kata wa donata desu ka?",
                "¿Quién es esa persona? (formal)"
              ],
              [
                "この ひと は ～で、～です。",
                "Kono hito wa ~ de, ~ desu.",
                "Esta persona es ~ y ~."
              ]
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "kurasu-03",
    "number": 3,
    "title": "Saludos, partícula の y los números",
    "titleJp": "せいかつ・おいくつ",
    "date": "2026-03-21",
    "topics": "saludos y despedidas por momento del día, gracias y disculpas, partícula の (posesión), números 1–100, edad.",
    "sections": [
      {
        "id": "saludos",
        "title": "Saludos",
        "titleJp": "あいさつ",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español",
              "Horario"
            ],
            "rows": [
              [
                "おはよう ございます",
                "Ohayou gozaimasu",
                "¡Buenos días!",
                "6:00 – 11:30"
              ],
              [
                "こんにちは",
                "Konnichiwa",
                "¡Buenas tardes!",
                "12:00 – 19:00"
              ],
              [
                "こんばんは",
                "Konbanwa",
                "¡Buenas noches!",
                "19:00 en adelante"
              ],
              [
                "おやすみなさい",
                "Oyasuminasai",
                "¡Que descanses!",
                "Al irse a dormir"
              ]
            ]
          },
          {
            "kind": "note",
            "tone": "💡",
            "text": "は en こんにちは y こんばんは se pronuncia **wa** (excepción histórica)."
          }
        ]
      },
      {
        "id": "despedidas",
        "title": "Despedidas",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "さようなら",
                "Sayounara",
                "Adiós (formal)"
              ],
              [
                "じゃあね！",
                "Jaa ne!",
                "¡Chau! (amigable)"
              ],
              [
                "またね！",
                "Mata ne!",
                "¡Nos vemos!"
              ],
              [
                "またあした",
                "Mata ashita",
                "¡Hasta mañana!"
              ],
              [
                "またこんど",
                "Mata kondo",
                "¡Hasta la próxima!"
              ]
            ]
          }
        ]
      },
      {
        "id": "gracias-y-disculpas",
        "title": "Gracias y disculpas",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "どうも ありがとう ございます",
                "Doumo arigatou gozaimasu",
                "Gracias (muy formal)"
              ],
              [
                "どういたしまして",
                "Douitashimashite",
                "De nada"
              ],
              [
                "いいえ、いいえ",
                "Iie, iie",
                "No, no… (restar importancia)"
              ],
              [
                "すみません",
                "Sumimasen",
                "Perdón / Disculpe (también para llamar la atención)"
              ],
              [
                "ごめんなさい",
                "Gomennasai",
                "Lo siento (disculpa sincera)"
              ],
              [
                "ごめんね",
                "Gomenne",
                "¡Mildis! (informal)"
              ]
            ]
          }
        ]
      },
      {
        "id": "particula-posesion-y-relacion",
        "title": "Partícula の — posesión y relación",
        "blocks": [
          {
            "kind": "text",
            "text": "Une dos sustantivos, como nuestro \"de\". **[A] の [B] = B de A**"
          },
          {
            "kind": "quote",
            "lines": [
              "でくちゃん は U.A.こうこう の がくせい です。 — Deku es alumno de la academia U.A.",
              "ジムさん は ダンダー・ミフリン の しゃいん です。 — Jim es empleado de Dunder Mifflin.",
              "とりやまさん は ドラゴンボール の まんがか です。 — Toriyama es el mangaka de Dragon Ball."
            ]
          }
        ]
      },
      {
        "id": "numeros",
        "title": "Números",
        "titleJp": "すうじ",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Nº",
              "Kanji",
              "Hiragana",
              "Romaji"
            ],
            "rows": [
              [
                "1",
                "一",
                "いち",
                "ichi"
              ],
              [
                "2",
                "二",
                "に",
                "ni"
              ],
              [
                "3",
                "三",
                "さん",
                "san"
              ],
              [
                "4",
                "四",
                "し／よん",
                "shi / yon"
              ],
              [
                "5",
                "五",
                "ご",
                "go"
              ],
              [
                "6",
                "六",
                "ろく",
                "roku"
              ],
              [
                "7",
                "七",
                "しち／なな",
                "shichi / nana"
              ],
              [
                "8",
                "八",
                "はち",
                "hachi"
              ],
              [
                "9",
                "九",
                "きゅう",
                "kyuu"
              ],
              [
                "10",
                "十",
                "じゅう",
                "juu"
              ]
            ]
          },
          {
            "kind": "subheading",
            "text": "Números mayores: [decena] じゅう + [unidad]"
          },
          {
            "kind": "text",
            "text": "15 じゅうご · 18 じゅうはち · 27 にじゅうなな · 40 よんじゅう · 61 ろくじゅういち"
          }
        ]
      },
      {
        "id": "edad",
        "title": "Edad",
        "titleJp": "なんさい・おいくつ",
        "blocks": [
          {
            "kind": "list",
            "items": [
              "なんさい ですか？ (Nansai desu ka?) — informal",
              "おいくつ ですか？ (Oikutsu desu ka?) — formal"
            ]
          },
          {
            "kind": "text",
            "text": "Respuesta: **número + さい です。** → ３２さい です。 (San juu ni sai desu.)"
          },
          {
            "kind": "subheading",
            "text": "Excepciones fonéticas"
          },
          {
            "kind": "table",
            "headers": [
              "Caso",
              "Incorrecto",
              "Correcto",
              "Regla"
            ],
            "rows": [
              [
                "1さい",
                "いちさい",
                "いっさい issai",
                "1 antes de さい se lee いっ"
              ],
              [
                "8さい",
                "はちさい",
                "はっさい hassai",
                "8 antes de さい se lee はっ"
              ],
              [
                "10さい (y múltiplos)",
                "じゅうさい",
                "じゅっさい jussai",
                "El decimal antes de さい se lee じゅっ"
              ],
              [
                "20さい",
                "にじゅうさい",
                "はたち hatachi",
                "Excepción: los 20 años tienen palabra propia"
              ]
            ]
          },
          {
            "kind": "note",
            "tone": "💡",
            "text": "はたち es un arcaísmo del japonés antiguo; es la mayoría de edad en Japón."
          }
        ]
      },
      {
        "id": "frases-esenciales",
        "title": "Frases esenciales",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "なんさい ですか？",
                "Nansai desu ka?",
                "¿Cuántos años tenés?"
              ],
              [
                "～さい です。",
                "~ sai desu.",
                "Tengo ~ años."
              ],
              [
                "[A] の [B] です。",
                "[A] no [B] desu.",
                "Es el/la [B] de [A]."
              ]
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "kurasu-04",
    "number": 4,
    "title": "Demostrativos これ・それ・あれ y vocabulario de objetos",
    "date": "2026-03-28",
    "topics": "pronombres demostrativos これ/それ/あれ, どこから来ましたか, vocabulario de objetos cotidianos (cap. 2).",
    "sections": [
      {
        "id": "pronombres-demostrativos",
        "title": "Pronombres demostrativos",
        "titleJp": "これ・それ・あれ",
        "blocks": [
          {
            "kind": "text",
            "text": "Son **pronombres**: funcionan solos, sin sustantivo detrás."
          },
          {
            "kind": "table",
            "headers": [
              "Pronombre",
              "Romaji",
              "Uso"
            ],
            "rows": [
              [
                "これ",
                "kore",
                "Esto (cerca del hablante)"
              ],
              [
                "それ",
                "sore",
                "Eso (cerca del oyente)"
              ],
              [
                "あれ",
                "are",
                "Aquello (lejos de ambos)"
              ]
            ]
          },
          {
            "kind": "quote",
            "lines": [
              "これ は りんご です。 — Esto es una manzana.",
              "それ は なん ですか？ — ¿Qué es eso?",
              "あれ は りんご です。 — Aquello es una manzana."
            ]
          },
          {
            "kind": "note",
            "tone": "💡",
            "text": "これ/それ/あれ son **pronombres** (van solos). この/その/あの son **adjetivos** (van con sustantivo)."
          },
          {
            "kind": "text",
            "text": "これ は りんご です (esto es una manzana) vs この りんご は あまい です (esta manzana está dulce)."
          }
        ]
      },
      {
        "id": "de-donde-venis",
        "title": "¿De dónde venís?",
        "titleJp": "どこ から きましたか？",
        "blocks": [
          {
            "kind": "quote",
            "lines": [
              "どこ から きましたか？ (Doko kara kimashita ka?) — ¿De dónde venís?",
              "Palermo から きました。 — Vengo de Palermo."
            ]
          }
        ]
      },
      {
        "id": "vocabulario-de-objetos",
        "title": "Vocabulario de objetos",
        "titleJp": "だい２か の ごい",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "じしょ",
                "jisho",
                "Diccionario"
              ],
              [
                "かさ",
                "kasa",
                "Paraguas"
              ],
              [
                "ほん",
                "hon",
                "Libro"
              ],
              [
                "ボールペン",
                "boorupen",
                "Bolígrafo"
              ],
              [
                "ノート",
                "nooto",
                "Cuaderno"
              ],
              [
                "てちょう",
                "techou",
                "Agenda"
              ],
              [
                "めいし",
                "meishi",
                "Tarjeta de presentación"
              ],
              [
                "ざっし",
                "zasshi",
                "Revista"
              ],
              [
                "コンピューター",
                "konpyuutaa",
                "Computadora"
              ],
              [
                "かばん",
                "kaban",
                "Bolso/Mochila"
              ],
              [
                "かぎ",
                "kagi",
                "Llave"
              ],
              [
                "コーヒー",
                "koohii",
                "Café"
              ],
              [
                "カメラ",
                "kamera",
                "Cámara"
              ],
              [
                "テレビ",
                "terebi",
                "Televisión"
              ],
              [
                "つくえ",
                "tsukue",
                "Escritorio"
              ],
              [
                "しんぶん",
                "shinbun",
                "Diario/Periódico"
              ],
              [
                "シャープペンシル",
                "shaapupenshiru",
                "Portaminas"
              ],
              [
                "くるま",
                "kuruma",
                "Auto"
              ],
              [
                "とけい",
                "tokei",
                "Reloj"
              ],
              [
                "ラジオ",
                "rajio",
                "Radio"
              ],
              [
                "えんぴつ",
                "enpitsu",
                "Lápiz"
              ],
              [
                "いす",
                "isu",
                "Silla"
              ],
              [
                "CD",
                "shiidii",
                "CD"
              ],
              [
                "おみやげ",
                "omiyage",
                "Souvenir / Regalo típico"
              ]
            ]
          }
        ]
      },
      {
        "id": "frases-esenciales",
        "title": "Frases esenciales",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "これ は なん ですか？",
                "Kore wa nan desu ka?",
                "¿Qué es esto?"
              ],
              [
                "それ は なん ですか？",
                "Sore wa nan desu ka?",
                "¿Qué es eso?"
              ],
              [
                "あれ は なん ですか？",
                "Are wa nan desu ka?",
                "¿Qué es aquello?"
              ],
              [
                "それ は ～ ですか？",
                "Sore wa ~ desu ka?",
                "¿Eso es ~?"
              ],
              [
                "いいえ、～ じゃありません。",
                "Iie, ~ ja arimasen.",
                "No, no es ~."
              ],
              [
                "どこ から きましたか？",
                "Doko kara kimashita ka?",
                "¿De dónde venís?"
              ]
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "kurasu-05",
    "number": 5,
    "title": "¿De quién es?",
    "titleJp": "だれの, なんの y doble pregunta",
    "date": "2026-04-11",
    "topics": "doble pregunta, なんの (qué tipo), だれの (de quién), idiomas (～ご), そうです/ちがいます, pronombres vs adjetivos demostrativos.",
    "sections": [
      {
        "id": "doble-pregunta",
        "title": "Doble pregunta",
        "titleJp": "Sujeto は A ですか、B ですか？",
        "blocks": [
          {
            "kind": "text",
            "text": "Dos preguntas sobre el mismo sujeto se unen para no repetirlo:"
          },
          {
            "kind": "quote",
            "lines": [
              "それ は シャープペンシル ですか、えんぴつ ですか？ — ¿Eso es un portaminas o un lápiz?",
              "それ は 「ね」 ですか、「れ」 ですか？ — ¿Eso es \"ne\" o \"re\"?"
            ]
          }
        ]
      },
      {
        "id": "que-tipo-de",
        "title": "¿Qué tipo de...?",
        "titleJp": "なん の ～ ですか？",
        "blocks": [
          {
            "kind": "quote",
            "lines": [
              "それ は なん の かぎ ですか？ — ¿Esa llave es de qué?",
              "それ は くるま の かぎ です。 — Es la llave del auto.",
              "それ は なん の ざっし ですか？ → Anime の ざっし です。 — Revista de anime."
            ]
          }
        ]
      },
      {
        "id": "de-quien-es",
        "title": "¿De quién es?",
        "titleJp": "だれ の ～ ですか？",
        "blocks": [
          {
            "kind": "quote",
            "lines": [
              "それ は だれ の かぎ ですか？ → これ は やまださん の かぎ です。 — Es la llave de Yamada.",
              "それ は だれ の かさ ですか？ → これ は たむらさん の かさ です。 — Es el paraguas de Tamura."
            ]
          }
        ]
      },
      {
        "id": "idiomas",
        "title": "Idiomas",
        "titleJp": "くに + ご",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "País",
              "Idioma",
              "Romaji"
            ],
            "rows": [
              [
                "にほん Japón",
                "にほんご",
                "nihongo"
              ],
              [
                "ちゅうごく China",
                "ちゅうごくご",
                "chuugokugo"
              ],
              [
                "かんこく Corea",
                "かんこくご",
                "kankokugo"
              ],
              [
                "アメリカ/イギリス",
                "えいご",
                "eigo (inglés)"
              ],
              [
                "スペイン",
                "スペインご",
                "supeingo"
              ],
              [
                "イタリア",
                "イタリアご",
                "itariago"
              ],
              [
                "フランス",
                "フランスご",
                "furansugo"
              ],
              [
                "ドイツ",
                "ドイツご",
                "doitsugo"
              ]
            ]
          },
          {
            "kind": "note",
            "tone": "💡",
            "text": "ご significa \"lenguaje/habla\". Sufijo sobre el nombre del país; funciona en la mayoría de los casos."
          }
        ]
      },
      {
        "id": "confirmar-y-negar",
        "title": "Confirmar y negar",
        "titleJp": "そうです y ちがいます",
        "blocks": [
          {
            "kind": "list",
            "items": [
              "はい、そう です。 (Hai, sou desu.) — Sí, así es.",
              "いいえ、ちがいます。 (Iie, chigaimasu.) — No, no es así."
            ]
          },
          {
            "kind": "quote",
            "lines": [
              "それ は くるま の かぎ ですか？ → いいえ、ちがいます。うち の かぎ です。 — No, es la llave de mi casa."
            ]
          }
        ]
      },
      {
        "id": "pronombres-vs-adjetivos-demostrativos",
        "title": "Pronombres vs. adjetivos demostrativos",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Tipo",
              "Japonés",
              "Uso",
              "Ejemplo"
            ],
            "rows": [
              [
                "Pronombre",
                "これ / それ / あれ",
                "Van solos",
                "これ は ほん です"
              ],
              [
                "Adjetivo",
                "この / その / あの",
                "+ sustantivo obligatorio",
                "この ほん は わたし の です"
              ]
            ]
          }
        ]
      },
      {
        "id": "frases-esenciales",
        "title": "Frases esenciales",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "それ は A ですか、B ですか？",
                "Sore wa A desu ka, B desu ka?",
                "¿Eso es A o B?"
              ],
              [
                "なん の ～ ですか？",
                "Nan no ~ desu ka?",
                "¿Qué tipo de ~?"
              ],
              [
                "だれ の ～ ですか？",
                "Dare no ~ desu ka?",
                "¿De quién es el/la ~?"
              ],
              [
                "はい、そう です。",
                "Hai, sou desu.",
                "Sí, así es."
              ],
              [
                "いいえ、ちがいます。",
                "Iie, chigaimasu.",
                "No, no es así."
              ],
              [
                "それ は にほんご の ほん ですか？",
                "Sore wa nihongo no hon desu ka?",
                "¿Ese libro es en japonés?"
              ]
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "kurasu-06",
    "number": 6,
    "title": "Repaso y práctica",
    "titleJp": "これは～のです y patrones de posesión",
    "date": "2026-04-18",
    "topics": "",
    "sections": [
      {
        "id": "general",
        "title": "General",
        "blocks": [
          {
            "kind": "text",
            "text": "Clase de repaso: vocabulario del capítulo 2 y patrones de posesión con の."
          }
        ]
      },
      {
        "id": "patrones-de-posesion",
        "title": "Patrones de posesión",
        "blocks": [
          {
            "kind": "subheading",
            "text": "¿Esto es de ~? — これは～のですか？"
          },
          {
            "kind": "quote",
            "lines": [
              "これは Wanさん の ですか？ — ¿Esto es de Wan?",
              "いいえ、Wanさん の じゃ ありません。 — No, no es de Wan."
            ]
          },
          {
            "kind": "subheading",
            "text": "¿De quién es este objeto? — この～はだれのですか？"
          },
          {
            "kind": "quote",
            "lines": [
              "この かばん は だれ の ですか？ → やまださん の です。 — Es de Yamada.",
              "この カメラ は だれ の ですか？ → Santosuさん の です。",
              "この てちょう は だれ の ですか？ → Miraaさん の です。"
            ]
          }
        ]
      },
      {
        "id": "como-pronombre",
        "title": "「の」 como pronombre",
        "blocks": [
          {
            "kind": "text",
            "text": "Cuando el objeto ya es conocido, se omite el sustantivo y の queda como pronombre:"
          },
          {
            "kind": "quote",
            "lines": [
              "これ は ハリーポッター の ほん です。 — Esto es el libro de Harry Potter.",
              "この ほん は わたし の です。 — Este libro es mío (ほん se sobreentiende)."
            ]
          },
          {
            "kind": "text",
            "text": "**わたし の です** = es mío."
          }
        ]
      },
      {
        "id": "patrones-de-conversacion",
        "title": "Patrones de conversación",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Pregunta",
              "Positiva",
              "Negativa"
            ],
            "rows": [
              [
                "これは ～さん の ですか？",
                "はい、～さん の です。",
                "いいえ、～さん の じゃ ありません。"
              ],
              [
                "この ～ は だれ の ですか？",
                "～さん の です。",
                "いいえ、～さん の じゃありません。～さん の です。"
              ]
            ]
          }
        ]
      },
      {
        "id": "vocabulario-capitulo-2-repaso",
        "title": "Vocabulario capítulo 2 (repaso)",
        "blocks": [
          {
            "kind": "text",
            "text": "かさ paraguas · じしょ diccionario · ほん libro · ボールペン bolígrafo · ノート cuaderno · てちょう agenda · めいし tarjeta de presentación · ざっし revista · コンピューター computadora · かばん bolso · かぎ llave · コーヒー café · カメラ cámara · テレビ televisión · つくえ escritorio · しんぶん diario · シャープペンシル portaminas · くるま auto · とけい reloj · ラジオ radio · えんぴつ lápiz · いす silla · CD · おみやげ souvenir"
          }
        ]
      },
      {
        "id": "frases-esenciales",
        "title": "Frases esenciales",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "これは ～さん の ですか？",
                "Kore wa ~-san no desu ka?",
                "¿Esto es de ~?"
              ],
              [
                "はい、～さん の です。",
                "Hai, ~-san no desu.",
                "Sí, es de ~."
              ],
              [
                "いいえ、～さん の じゃありません。",
                "Iie, ~-san no ja arimasen.",
                "No, no es de ~."
              ],
              [
                "この ～ は だれ の ですか？",
                "Kono ~ wa dare no desu ka?",
                "¿De quién es este/a ~?"
              ],
              [
                "～さん の です。",
                "~-san no desu.",
                "Es de ~."
              ]
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "kurasu-08",
    "number": 8,
    "title": "¿Dónde está?",
    "titleJp": "ここ・そこ・あそこ y números grandes",
    "date": "2026-05-02",
    "topics": "adverbios de lugar, versiones formales こちら/そちら/あちら/どちら, vocabulario de lugares, escuelas, números grandes (100/1000/10000).",
    "sections": [
      {
        "id": "adverbios-de-lugar",
        "title": "Adverbios de lugar",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Uso"
            ],
            "rows": [
              [
                "ここ",
                "koko",
                "Aquí (cerca del hablante)"
              ],
              [
                "そこ",
                "soko",
                "Ahí (cerca del oyente)"
              ],
              [
                "あそこ",
                "asoko",
                "Allá (lejos de ambos)"
              ],
              [
                "どこ",
                "doko",
                "¿Dónde?"
              ]
            ]
          },
          {
            "kind": "subheading",
            "text": "Versiones formales"
          },
          {
            "kind": "text",
            "text": "ここ→こちら (kochira) · そこ→そちら (sochira) · あそこ→あちら (achira) · どこ→どちら (dochira)"
          }
        ]
      },
      {
        "id": "donde-esta",
        "title": "¿Dónde está?",
        "titleJp": "～は どこ ですか？",
        "blocks": [
          {
            "kind": "quote",
            "lines": [
              "ここ は じむしょ です。 — Aquí está la oficina.",
              "そこ は かいだん です。 — Ahí está la escalera.",
              "あそこ は トイレ です。 — Allá está el baño.",
              "ロビー は どこ ですか？ → ロビー は ここ です。",
              "いぬ は どこ ですか？ → いぬ は へや です。 — El perro está en la habitación."
            ]
          }
        ]
      },
      {
        "id": "vocabulario-de-lugares",
        "title": "Vocabulario de lugares",
        "blocks": [
          {
            "kind": "subheading",
            "text": "Dentro de un edificio"
          },
          {
            "kind": "text",
            "text": "じむしょ oficina · ロビー lobby · かいぎしつ sala de reuniones · エレベーター ascensor · うけつけ recepción · きょうしつ aula · しょくどう comedor · としょかん biblioteca · おくじょう terraza · トイレ baño · かいだん escalera · エスカレーター escalera mecánica · ちゅうしゃじょう estacionamiento · レストラン restaurante · きっさてん café/bar · みせ tienda · えいがかん cine"
          },
          {
            "kind": "subheading",
            "text": "En la ciudad"
          },
          {
            "kind": "text",
            "text": "デパート tienda por departamentos · びじゅつかん museo de arte · みなと puerto · かいしゃ empresa · ゆうびんきょく correo · びょういん hospital · こうえん parque/plaza · ぎんこう banco · くうこう aeropuerto · えき estación · アパート departamento · スーパー supermercado · ビル edificio · うち casa"
          },
          {
            "kind": "subheading",
            "text": "Escuelas"
          },
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "ようちえん",
                "youchien",
                "Jardín de infantes"
              ],
              [
                "しょうがっこう",
                "shougakkou",
                "Primaria"
              ],
              [
                "ちゅうがっこう",
                "chuugakkou",
                "Secundaria baja (13–15)"
              ],
              [
                "こうこう",
                "koukou",
                "Secundaria alta / bachillerato (16–18)"
              ],
              [
                "だいがく",
                "daigaku",
                "Universidad"
              ]
            ]
          },
          {
            "kind": "note",
            "tone": "💡",
            "text": "Sistema japonés: 6 años primaria, 3 secundaria baja, 3 secundaria alta; universidad 4 años."
          }
        ]
      },
      {
        "id": "numeros-grandes",
        "title": "Números grandes",
        "titleJp": "ひゃく・せん・まん",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Valor",
              "Japonés",
              "Romaji"
            ],
            "rows": [
              [
                "100",
                "ひゃく",
                "hyaku"
              ],
              [
                "1.000",
                "せん",
                "sen"
              ],
              [
                "10.000",
                "まん",
                "man"
              ]
            ]
          },
          {
            "kind": "text",
            "text": "Ejemplos: 134 ひゃくさんじゅうよん · 561 ごひゃくろくじゅういち · 1.543 せんごひゃくよんじゅうさん · 17.543 いちまんななせんごひゃくよんじゅうさん"
          },
          {
            "kind": "subheading",
            "text": "Excepciones de pronunciación"
          },
          {
            "kind": "text",
            "text": "300 さんびゃく sanbyaku · 600 ろっぴゃく roppyaku · 800 はっぴゃく happyaku · 3.000 さんぜん sanzen · 8.000 はっせん hassen"
          }
        ]
      },
      {
        "id": "frases-esenciales",
        "title": "Frases esenciales",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "ここ は ～ です。",
                "Koko wa ~ desu.",
                "Aquí está ~."
              ],
              [
                "～ は どこ ですか？",
                "~ wa doko desu ka?",
                "¿Dónde está ~?"
              ],
              [
                "～ は ここ/そこ/あそこ です。",
                "~ wa koko/soko/asoko desu.",
                "~ está aquí/ahí/allá."
              ]
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "kurasu-09",
    "number": 9,
    "title": "Precios, pisos y ¿de dónde es?",
    "titleJp": "いくら・なんがい・どこの",
    "date": "2026-05-09",
    "topics": "precios (いくら), pisos (なんがい), どちら para pertenencia, どこの para procedencia de objetos, diálogo de compras.",
    "sections": [
      {
        "id": "cuanto-cuesta",
        "title": "¿Cuánto cuesta?",
        "titleJp": "いくら",
        "blocks": [
          {
            "kind": "quote",
            "lines": [
              "～ は いくら ですか？ — ¿Cuánto cuesta ~?",
              "～ は いくらぐらい ですか？ — ¿Cuánto cuesta ~ aproximadamente?"
            ]
          },
          {
            "kind": "text",
            "text": "Monedas: 円/えん en (yen) · ドル doru (dólar) · ペソ peso"
          },
          {
            "kind": "text",
            "text": "Diálogo:"
          },
          {
            "kind": "quote",
            "lines": [
              "すみません。その ざっし は いくら ですか？ — ¿Cuánto cuesta esa revista?",
              "４８５０えん です。 (Yonsen happyaku gojuu en desu.) — 4.850 yenes."
            ]
          }
        ]
      },
      {
        "id": "en-que-piso-esta",
        "title": "¿En qué piso está?",
        "titleJp": "何階 (なんがい)",
        "blocks": [
          {
            "kind": "quote",
            "lines": [
              "～ は なんがい ですか？ — ¿En qué piso está ~?",
              "ほんや は ７かい です。 — La librería está en el piso 7."
            ]
          },
          {
            "kind": "table",
            "headers": [
              "Piso",
              "Japonés"
            ],
            "rows": [
              [
                "1er piso",
                "いっかい ikkai"
              ],
              [
                "2do piso",
                "にかい nikai"
              ],
              [
                "3er piso",
                "さんがい sangai"
              ],
              [
                "Sótano 1",
                "ちかいっかい"
              ],
              [
                "Sótano 2",
                "ちかにかい"
              ]
            ]
          }
        ]
      },
      {
        "id": "tiendas-en-un-departamento",
        "title": "Tiendas (en un departamento)",
        "blocks": [
          {
            "kind": "text",
            "text": "ほんや librería · くすりや farmacia · はなや floristería · えいがかん cine · ようふくや tienda de ropa · ぱんや panadería · ちゅうしゃじょう estacionamiento · くつや zapatería · ワインうりば sección de vinos"
          }
        ]
      },
      {
        "id": "de-donde-es-personas",
        "title": "¿De dónde es? (personas)",
        "titleJp": "どちら",
        "blocks": [
          {
            "kind": "text",
            "text": "Para lugar de pertenencia (país, empresa, universidad) se usa **どちら**, no どこ."
          },
          {
            "kind": "table",
            "headers": [
              "Pregunta",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "おくに は どちら ですか？",
                "Okuni wa dochira desu ka?",
                "¿De qué país es usted?"
              ],
              [
                "おかいしゃ は どちら ですか？",
                "Okaisha wa dochira desu ka?",
                "¿En qué empresa trabaja?"
              ],
              [
                "おだいがく は どちら ですか？",
                "Odaigaku wa dochira desu ka?",
                "¿En qué universidad estudia?"
              ],
              [
                "うち は どちら ですか？",
                "Uchi wa dochira desu ka?",
                "¿De qué parte es?"
              ]
            ]
          }
        ]
      },
      {
        "id": "de-donde-es-este-objeto",
        "title": "¿De dónde es este objeto?",
        "titleJp": "どこ の ～ ですか？",
        "blocks": [
          {
            "kind": "quote",
            "lines": [
              "それ は どこ の かばん ですか？ → これ は イタリア の かばん です。 — Cartera italiana.",
              "それ は どこ の ワイン ですか？ → フランス の ワイン です。 — Vino francés."
            ]
          },
          {
            "kind": "text",
            "text": "Sin repetir el sustantivo: それ は どこ の ですか？ → ブラジル の です。"
          }
        ]
      },
      {
        "id": "dialogo-de-compra",
        "title": "Diálogo de compra",
        "blocks": [
          {
            "kind": "quote",
            "lines": [
              "いらっしゃいませ！ — ¡Bienvenido!",
              "すみません。その ゲーム の ほん を みせて ください。 — ¿Me muestra ese libro de juegos?",
              "これですか？どうぞ。 — ¿Este? Aquí tiene.",
              "いくらですか？ → ５６０円です。 — 560 yenes.",
              "じゃ、それ を ください。 — Entonces, déme ese.",
              "かしこまりました。どうぞ。 — Entendido. Aquí tiene."
            ]
          },
          {
            "kind": "subheading",
            "text": "Frases útiles para compras"
          },
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "～ を みせて ください",
                "~ wo misete kudasai",
                "Muéstreme ~"
              ],
              [
                "～ を ください",
                "~ wo kudasai",
                "Déme ~"
              ],
              [
                "いらっしゃいませ！",
                "Irasshaimase!",
                "¡Bienvenido! (tiendas)"
              ],
              [
                "ようこそ [lugar] へ",
                "Youkoso [lugar] e",
                "Bienvenido a [lugar] (no tiendas)"
              ]
            ]
          },
          {
            "kind": "note",
            "tone": "💡",
            "text": "いらっしゃいませ en tiendas/locales; ようこそ para ciudades, eventos, escuelas."
          }
        ]
      }
    ]
  },
  {
    "id": "kurasu-10",
    "number": 10,
    "title": "Vocabulario de tiempo",
    "date": "2026",
    "topics": "días relativos al presente, semanas/meses/años, partes del día, expresiones de frecuencia まい～.",
    "sections": [
      {
        "id": "dias-relativos-al-presente-sin-particula",
        "title": "Días relativos al presente (sin partícula に)",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Kanji",
              "Hiragana",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "今日",
                "きょう",
                "kyou",
                "hoy"
              ],
              [
                "昨日",
                "きのう",
                "kinou",
                "ayer"
              ],
              [
                "明日",
                "あした",
                "ashita",
                "mañana"
              ],
              [
                "明後日",
                "あさって",
                "asatte",
                "pasado mañana"
              ],
              [
                "一昨日",
                "おととい",
                "ototoi",
                "anteayer"
              ]
            ]
          },
          {
            "kind": "quote",
            "lines": [
              "きょう は なんようび ですか？ — ¿Qué día es hoy?"
            ]
          }
        ]
      },
      {
        "id": "semanas-meses-y-anos",
        "title": "Semanas, meses y años",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Kanji",
              "Hiragana",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "今週",
                "こんしゅう",
                "konshuu",
                "esta semana"
              ],
              [
                "先週",
                "せんしゅう",
                "senshuu",
                "la semana pasada"
              ],
              [
                "来週",
                "らいしゅう",
                "raishuu",
                "la semana que viene"
              ],
              [
                "今月",
                "こんげつ",
                "kongetsu",
                "este mes"
              ],
              [
                "先月",
                "せんげつ",
                "sengetsu",
                "el mes pasado"
              ],
              [
                "来月",
                "らいげつ",
                "raigetsu",
                "el mes que viene"
              ],
              [
                "今年",
                "ことし",
                "kotoshi",
                "este año"
              ],
              [
                "去年",
                "きょねん",
                "kyonen",
                "el año pasado"
              ],
              [
                "来年",
                "らいねん",
                "rainen",
                "el año que viene"
              ]
            ]
          }
        ]
      },
      {
        "id": "partes-del-dia",
        "title": "Partes del día",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Kanji",
              "Hiragana",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "朝",
                "あさ",
                "asa",
                "mañana"
              ],
              [
                "昼",
                "ひる",
                "hiru",
                "mediodía"
              ],
              [
                "晩",
                "ばん",
                "ban",
                "tarde/noche"
              ],
              [
                "夜",
                "よる",
                "yoru",
                "noche"
              ]
            ]
          },
          {
            "kind": "text",
            "text": "Con 今:"
          },
          {
            "kind": "table",
            "headers": [
              "今朝",
              "けさ",
              "kesa",
              "esta mañana"
            ],
            "rows": [
              [
                "今晩",
                "こんばん",
                "konban",
                "esta noche (tarde)"
              ],
              [
                "今夜",
                "こんや",
                "konya",
                "esta noche"
              ]
            ]
          }
        ]
      },
      {
        "id": "frecuencia",
        "title": "Frecuencia",
        "titleJp": "まい～ (毎 = \"cada\")",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Kanji",
              "Hiragana",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "毎日",
                "まいにち",
                "mainichi",
                "todos los días"
              ],
              [
                "毎朝",
                "まいあさ",
                "maiasa",
                "todas las mañanas"
              ],
              [
                "毎晩",
                "まいばん",
                "maiban",
                "todas las noches"
              ],
              [
                "毎夜",
                "まいよ",
                "maiyo",
                "todas las noches"
              ],
              [
                "毎月",
                "まいげつ/まいつき",
                "maigetsu/maitsuki",
                "todos los meses"
              ],
              [
                "毎年",
                "まいねん",
                "mainen",
                "todos los años"
              ]
            ]
          },
          {
            "kind": "note",
            "tone": "⚠️",
            "text": "Ninguna de estas expresiones lleva に."
          },
          {
            "kind": "quote",
            "lines": [
              "まいにち べんきょう します。 — Estudio todos los días.",
              "けさ おきました。 — Me levanté esta mañana."
            ]
          }
        ]
      },
      {
        "id": "frases-esenciales",
        "title": "Frases esenciales",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "きょう は なんようび ですか？",
                "Kyou wa nanyoubi desu ka?",
                "¿Qué día es hoy?"
              ],
              [
                "きのう は なんようび でしたか？",
                "Kinou wa nanyoubi deshita ka?",
                "¿Qué día fue ayer?"
              ],
              [
                "こんしゅう べんきょう します。",
                "Konshuu benkyoushimasu.",
                "Estudio esta semana."
              ],
              [
                "まいにち はたらきます。",
                "Mainichi hatarakimasu.",
                "Trabajo todos los días."
              ],
              [
                "けさ おきませんでした。",
                "Kesa okimasendeshita.",
                "Esta mañana no me levanté."
              ]
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "kurasu-11",
    "number": 11,
    "title": "¿Qué hora es?",
    "titleJp": "いま なんじ ですか",
    "date": "2026-05-23",
    "topics": "horas (〜じ), minutos (〜ふん/ぷん), y media (〜はん), AM/PM (ごぜん/ごご), rangos con から/まで.",
    "sections": [
      {
        "id": "horas",
        "title": "Horas",
        "titleJp": "〜時 (〜ji)",
        "blocks": [
          {
            "kind": "text",
            "text": "Número + じ(時)."
          },
          {
            "kind": "table",
            "headers": [
              "Hora",
              "Hiragana",
              "¡OJO!"
            ],
            "rows": [
              [
                "1:00",
                "いちじ",
                ""
              ],
              [
                "2:00",
                "にじ",
                ""
              ],
              [
                "3:00",
                "さんじ",
                ""
              ],
              [
                "4:00",
                "**よじ**",
                "✗ よんじ"
              ],
              [
                "5:00",
                "ごじ",
                ""
              ],
              [
                "6:00",
                "ろくじ",
                ""
              ],
              [
                "7:00",
                "**しちじ**",
                "✗ ななじ"
              ],
              [
                "8:00",
                "はちじ",
                ""
              ],
              [
                "9:00",
                "**くじ**",
                "✗ きゅうじ"
              ],
              [
                "10:00",
                "じゅうじ",
                ""
              ],
              [
                "11:00",
                "じゅういちじ",
                ""
              ],
              [
                "12:00",
                "じゅうにじ",
                ""
              ]
            ]
          },
          {
            "kind": "note",
            "tone": "⚠️",
            "text": "Tres excepciones: よじ (4), しちじ (7), くじ (9)."
          }
        ]
      },
      {
        "id": "minutos",
        "title": "Minutos",
        "titleJp": "〜分 (〜fun/〜pun)",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Minutos",
              "Lectura"
            ],
            "rows": [
              [
                "1, 2, 3, 4",
                "いっぷん、にふん、さんぷん、よんぷん"
              ],
              [
                "5, 6",
                "ごふん、ろっぷん"
              ],
              [
                "7, 8",
                "ななふん、はっぷん"
              ],
              [
                "9, 10",
                "きゅうふん、じゅっぷん"
              ],
              [
                "13, 28, 36",
                "じゅうさんぷん、にじゅうはっぷん、さんじゅうろっぷん"
              ]
            ]
          },
          {
            "kind": "quote",
            "lines": [
              "３時５分 さんじごふん · ６時１５分 ろくじじゅうごふん · ２時２０分 にじにじゅっぷん · ４時４１分 よじよんじゅういっぷん"
            ]
          }
        ]
      },
      {
        "id": "y-media",
        "title": "Y media",
        "titleJp": "〜半 (〜han)",
        "blocks": [
          {
            "kind": "text",
            "text": "Hora + はん."
          },
          {
            "kind": "quote",
            "lines": [
              "９時半 くじはん — 9 y media · ２時半 にじはん — 2 y media",
              "いま １１時半 です。 — Son las 11 y media."
            ]
          }
        ]
      },
      {
        "id": "am-y-pm",
        "title": "AM y PM",
        "titleJp": "ごぜん / ごご",
        "blocks": [
          {
            "kind": "text",
            "text": "Van antes de la hora. ごぜん(午前)=AM · ごご(午後)=PM"
          },
          {
            "kind": "quote",
            "lines": [
              "ごぜん いちじ じゅうごふん — 1:15 AM · ごご はちじ — 8:00 PM",
              "いま ごぜん １時５０分 です。 — Es la 1:50 AM."
            ]
          }
        ]
      },
      {
        "id": "desde-hasta",
        "title": "Desde / Hasta",
        "titleJp": "から / まで",
        "blocks": [
          {
            "kind": "text",
            "text": "から = desde · まで = hasta. Se usan con horas y días."
          },
          {
            "kind": "quote",
            "lines": [
              "パンやは ごぜん１１じから ごご９じまで です。 — La panadería abre de 11 AM a 9 PM.",
              "ぎんこう は なんじから なんじまで ですか？ → ９じから ３じまで です。"
            ]
          }
        ]
      },
      {
        "id": "frases-esenciales",
        "title": "Frases esenciales",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "いま なんじ ですか？",
                "Ima nanji desu ka?",
                "¿Qué hora es ahora?"
              ],
              [
                "いま ３時半 です。",
                "Ima sanji han desu.",
                "Son las 3 y media."
              ],
              [
                "ごぜん ９じ です。",
                "Gozen 9ji desu.",
                "Son las 9 AM."
              ],
              [
                "ごご ６じ です。",
                "Gogo 6ji desu.",
                "Son las 6 PM."
              ],
              [
                "なんじから なんじまで ですか？",
                "Nanji kara nanji made desu ka?",
                "¿De qué hora a qué hora?"
              ],
              [
                "９じから ５じまで です。",
                "9ji kara 5ji made desu.",
                "De las 9 a las 5."
              ]
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "kurasu-12",
    "number": 12,
    "title": "Días de la semana, meses y el pasado de です",
    "date": "2026-05-30",
    "topics": "días de la semana (kanji y origen), pasado de です (でした/じゃありませんでした), meses (〜がつ), años (〜ねん).",
    "sections": [
      {
        "id": "dias-de-la-semana",
        "title": "Días de la semana",
        "titleJp": "漢字とようび",
        "blocks": [
          {
            "kind": "text",
            "text": "Basados en los cinco elementos clásicos + Sol y Luna."
          },
          {
            "kind": "table",
            "headers": [
              "Día",
              "Kanji",
              "Hiragana",
              "Elemento"
            ],
            "rows": [
              [
                "Lunes",
                "月曜日",
                "げつようび",
                "月 Luna"
              ],
              [
                "Martes",
                "火曜日",
                "かようび",
                "火 Fuego"
              ],
              [
                "Miércoles",
                "水曜日",
                "すいようび",
                "水 Agua"
              ],
              [
                "Jueves",
                "木曜日",
                "もくようび",
                "木 Árbol"
              ],
              [
                "Viernes",
                "金曜日",
                "きんようび",
                "金 Oro"
              ],
              [
                "Sábado",
                "土曜日",
                "どようび",
                "土 Suelo"
              ],
              [
                "Domingo",
                "日曜日",
                "にちようび",
                "日 Sol/Día"
              ]
            ]
          },
          {
            "kind": "quote",
            "lines": [
              "きょう は なんようび ですか？ → きょう は すいようび です。 — Hoy es miércoles."
            ]
          }
        ]
      },
      {
        "id": "pasado-de",
        "title": "Pasado de です",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Tiempo",
              "Positivo",
              "Negativo"
            ],
            "rows": [
              [
                "Presente",
                "です",
                "じゃありません"
              ],
              [
                "Pasado",
                "**でした**",
                "**じゃありませんでした**"
              ]
            ]
          },
          {
            "kind": "quote",
            "lines": [
              "きのう は きんようび でした。 — Ayer fue viernes.",
              "おととい は げつようび じゃありませんでした。 — Anteayer no fue lunes.",
              "きのう は なんようび でしたか？ — ¿Qué día fue ayer?"
            ]
          }
        ]
      },
      {
        "id": "meses",
        "title": "Meses",
        "titleJp": "〜月 (〜がつ)",
        "blocks": [
          {
            "kind": "text",
            "text": "Número + がつ. Sin nombres especiales. 1月 いちがつ · 2月 にがつ · 3月 さんがつ · 4月 **しがつ** · 5月 ごがつ · 6月 ろくがつ · 7月 なながつ · 8月 はちがつ · 9月 **くがつ** · 10月 じゅうがつ · 11月 じゅういちがつ · 12月 じゅうにがつ"
          },
          {
            "kind": "quote",
            "lines": [
              "こんげつ は ８がつ です。 — Este mes es agosto.",
              "らいげつ は なんがつ ですか？ — ¿Qué mes es el que viene?",
              "なつ は なんがつから なんがつまで ですか？ → １２がつから ３がつまで です。"
            ]
          }
        ]
      },
      {
        "id": "anos",
        "title": "Años",
        "titleJp": "〜年 (〜ねん)",
        "blocks": [
          {
            "kind": "text",
            "text": "Número + ねん."
          },
          {
            "kind": "quote",
            "lines": [
              "ことし は ２０２６ねん です。 — Este año es 2026.",
              "きょねん は ２０２５ねん でした。 — El año pasado fue 2025.",
              "とうきょうオリンピック は ２０２０ねん でした。 — Las Olimpíadas de Tokio fueron en 2020."
            ]
          }
        ]
      },
      {
        "id": "frases-esenciales",
        "title": "Frases esenciales",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "きょう は なんようび ですか？",
                "Kyou wa nanyoubi desu ka?",
                "¿Qué día es hoy?"
              ],
              [
                "きのう は なんようび でしたか？",
                "Kinou wa nanyoubi deshita ka?",
                "¿Qué día fue ayer?"
              ],
              [
                "こんげつ は なんがつ ですか？",
                "Kongetsu wa nangatsu desu ka?",
                "¿Qué mes es este mes?"
              ],
              [
                "ことし は なんねん ですか？",
                "Kotoshi wa nannen desu ka?",
                "¿Qué año es este año?"
              ],
              [
                "やすみ は なんようびから なんようびまで ですか？",
                "Yasumi wa nanyoubi kara nanyoubi made desu ka?",
                "¿El descanso es de qué día a qué día?"
              ]
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "kurasu-13",
    "number": 13,
    "title": "Verbos del だい4か, partícula に y から～まで",
    "date": "2026-06-06",
    "topics": "conjugación formal de verbos nuevos, partícula に (horas exactas), から～まで, はじまります, vocabulario de tiempo, número de teléfono, diálogo del libro.",
    "sections": [
      {
        "id": "conjugacion-formal-estilo",
        "title": "Conjugación formal (estilo ます)",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Tiempo",
              "Forma",
              "Terminación"
            ],
            "rows": [
              [
                "Presente positivo",
                "します",
                "～ます"
              ],
              [
                "Presente negativo",
                "しません",
                "～ません"
              ],
              [
                "Pasado positivo",
                "しました",
                "～ました"
              ],
              [
                "Pasado negativo",
                "しませんでした",
                "～ませんでした"
              ]
            ]
          }
        ]
      },
      {
        "id": "verbos-del-4",
        "title": "Verbos del だい4か",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Verbo",
              "Significado",
              "Ejemplo"
            ],
            "rows": [
              [
                "おきる (okiru)",
                "levantarse",
                "８じ に おきます。— Me levanto a las 8."
              ],
              [
                "べんきょうする",
                "estudiar",
                "まいにち べんきょう します。— Estudio todos los días."
              ],
              [
                "はたらく",
                "trabajar",
                "げつようび から きんようび まで はたらきます。— Trabajo de lunes a viernes."
              ],
              [
                "ねる",
                "dormir",
                "１１じ に ねます。— Me duermo a las 11."
              ],
              [
                "おわる",
                "terminar",
                "しごと は ６じはん に おわります。— El trabajo termina a las 6:30."
              ],
              [
                "やすむ",
                "descansar",
                "にちようび に やすみます。— Descanso el domingo."
              ]
            ]
          },
          {
            "kind": "text",
            "text": "(Cada uno conjuga: ～ます / ～ません / ～ました / ～ませんでした)"
          }
        ]
      },
      {
        "id": "particula-horas-exactas",
        "title": "Partícula に — horas exactas",
        "blocks": [
          {
            "kind": "text",
            "text": "**[hora] に + [verbo]**"
          },
          {
            "kind": "quote",
            "lines": [
              "８じ に おきます。 · ６じはん に おわります。",
              "なんじ に おきますか？ — ¿A qué hora te levantás?"
            ]
          },
          {
            "kind": "note",
            "tone": "⚠️",
            "text": "に NO se usa con まいにち, きのう, きょう, あした."
          }
        ]
      },
      {
        "id": "rango",
        "title": "から / まで — rango",
        "blocks": [
          {
            "kind": "text",
            "text": "**[inicio] から [fin] まで [verbo]**"
          },
          {
            "kind": "quote",
            "lines": [
              "げつようび から きんようび まで はたらきます。 — De lunes a viernes.",
              "９じ から ６じ まで はたらきます。 — De 9 a 6.",
              "かいぎ は ４じ から はじまります。 — La reunión empieza a las 4."
            ]
          }
        ]
      },
      {
        "id": "verbo-nuevo",
        "title": "Verbo nuevo: はじまります",
        "blocks": [
          {
            "kind": "text",
            "text": "\"Empieza/comienza\" (algo empieza solo, sin agente): clases, reuniones, películas."
          },
          {
            "kind": "quote",
            "lines": [
              "くらす は ６じ に おわります。 — La clase termina a las 6."
            ]
          }
        ]
      },
      {
        "id": "vocabulario-de-tiempo-sin",
        "title": "Vocabulario de tiempo (sin に)",
        "blocks": [
          {
            "kind": "text",
            "text": "まいにち todos los días · まいあさ todas las mañanas · まいばん todas las noches · けさ esta mañana · きのう ayer · きょう hoy · あした mañana · おととい anteayer · あさって pasado mañana · ごぜん AM"
          },
          {
            "kind": "quote",
            "lines": [
              "まいにち ９じ から ６じ まで はたらきます。",
              "きのう の ばん べんきょう しました。 — Estudié anoche."
            ]
          }
        ]
      },
      {
        "id": "numero-de-telefono",
        "title": "Número de teléfono",
        "titleJp": "でんわばんごう",
        "blocks": [
          {
            "kind": "quote",
            "lines": [
              "[lugar] の でんわばんごう は なんばん ですか？ — ¿Cuál es el teléfono de [lugar]?"
            ]
          },
          {
            "kind": "text",
            "text": "Se lee dígito por dígito, separado con の:"
          },
          {
            "kind": "quote",
            "lines": [
              "０９０ の １２３４ の ５６７８ です。"
            ]
          },
          {
            "kind": "text",
            "text": "Celular = けいたいでんわ / けいたい."
          }
        ]
      },
      {
        "id": "dialogo",
        "title": "Diálogo: そちらは何時までですか",
        "blocks": [
          {
            "kind": "quote",
            "lines": [
              "ミラー: すみません、「あすか」の でんわばんごう は なんばん ですか。",
              "佐藤: 「あすか」ですか。５２７５ の ２７２５ です。",
              "店の人: はい、「あすか」です。",
              "ミラー: すみません。そちらは なんじ まで ですか。",
              "店の人: １０じ まで です。",
              "ミラー: やすみ は なんようび ですか。",
              "店の人: にちようび です。"
            ]
          },
          {
            "kind": "text",
            "text": "そちら = forma educada de \"ustedes / ese lugar\" (llamadas formales)."
          }
        ]
      },
      {
        "id": "frases-esenciales",
        "title": "Frases esenciales",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "なんじ に おきますか？",
                "Nanji ni okimasu ka?",
                "¿A qué hora te levantás?"
              ],
              [
                "なんじ から なんじ まで はたらきますか？",
                "Nanji kara nanji made hatarakimasu ka?",
                "¿De qué hora a qué hora trabajás?"
              ],
              [
                "げつようび から きんようび まで です。",
                "Getsuyoubi kara kin'youbi made desu.",
                "Es de lunes a viernes."
              ],
              [
                "やすみ は なんようび ですか？",
                "Yasumi wa nanyoubi desu ka?",
                "¿Qué día es el día libre?"
              ],
              [
                "そちらは なんじ まで ですか？",
                "Sochira wa nanji made desu ka?",
                "¿Hasta qué hora están abiertos?"
              ],
              [
                "でんわばんごう は なんばん ですか？",
                "Denwa bangou wa nanban desu ka?",
                "¿Cuál es el número de teléfono?"
              ]
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "kurasu-14",
    "number": 14,
    "title": "Grupos de verbos",
    "titleJp": "どうし の グループ",
    "date": "2026-06-13",
    "topics": "los 3 grupos de verbos, formas じしょ形 / ます形 / ました形, conjugación positiva y negativa, verbos compuestos con する.",
    "sections": [
      {
        "id": "informacion-general",
        "title": "Información general",
        "blocks": [
          {
            "kind": "list",
            "items": [
              "\"Verbo\" = どうし (動詞). Siempre va al final de la oración.",
              "No cambian por persona, número ni género.",
              "Solo dos tiempos: pasado y no-pasado.",
              "Se dividen en 3 grupos según su conjugación."
            ]
          }
        ]
      },
      {
        "id": "las-tres-formas",
        "title": "Las tres formas",
        "titleJp": "三つの形",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Nombre",
              "Descripción",
              "Equivalente"
            ],
            "rows": [
              [
                "じしょ形",
                "Forma diccionario / infinitivo",
                "hablar, correr"
              ],
              [
                "ます形",
                "No-pasado formal",
                "hablo, corro"
              ],
              [
                "ました形",
                "Pasado formal",
                "hablé, corrí"
              ]
            ]
          },
          {
            "kind": "text",
            "text": "Todo verbo en じしょ形 termina en vocal U: る、く、ぐ、す、む、ぬ、ぶ、つ、う."
          }
        ]
      },
      {
        "id": "grupo-2",
        "title": "Grupo 2",
        "titleJp": "にグループ — terminan en ERU/IRU",
        "blocks": [
          {
            "kind": "text",
            "text": "Regla: se elimina る y se agrega ます/ません/ました/ませんでした."
          },
          {
            "kind": "table",
            "headers": [
              "Infinitivo",
              "Significado",
              "ます(+)",
              "ます(−)",
              "ました(+)",
              "ました(−)"
            ],
            "rows": [
              [
                "おきる",
                "levantarse",
                "おきます",
                "おきません",
                "おきました",
                "おきませんでした"
              ],
              [
                "ねる",
                "dormir",
                "ねます",
                "ねません",
                "ねました",
                "ねませんでした"
              ],
              [
                "たべる",
                "comer",
                "たべます",
                "たべません",
                "たべました",
                "たべませんでした"
              ],
              [
                "みる",
                "mirar",
                "みます",
                "みません",
                "みました",
                "みませんでした"
              ],
              [
                "きる",
                "vestir",
                "きます",
                "きません",
                "きました",
                "きませんでした"
              ],
              [
                "あける",
                "abrir",
                "あけます",
                "あけません",
                "あけました",
                "あけませんでした"
              ],
              [
                "おしえる",
                "enseñar",
                "おしえます",
                "おしえません",
                "おしえました",
                "おしえませんでした"
              ]
            ]
          }
        ]
      },
      {
        "id": "grupo-1",
        "title": "Grupo 1",
        "titleJp": "いちグループ — terminan en う/つ/る/く/ぐ/す/ぬ/む/ぶ",
        "blocks": [
          {
            "kind": "text",
            "text": "Regla: la sílaba final U cambia a I + ます etc. (く→き、ぐ→ぎ、す→し、つ→ち、む→み、ぬ→に、ぶ→び、う→い、る→り)"
          },
          {
            "kind": "table",
            "headers": [
              "Infinitivo",
              "Significado",
              "ます(+)",
              "ます(−)",
              "ました(+)",
              "ました(−)"
            ],
            "rows": [
              [
                "はたらく",
                "trabajar",
                "はたらきます",
                "はたらきません",
                "はたらきました",
                "はたらきませんでした"
              ],
              [
                "おわる",
                "terminar",
                "おわります",
                "おわりません",
                "おわりました",
                "おわりませんでした"
              ],
              [
                "やすむ",
                "descansar",
                "やすみます",
                "やすみません",
                "やすみました",
                "やすみませんでした"
              ],
              [
                "うたう",
                "cantar",
                "うたいます",
                "うたいません",
                "うたいました",
                "うたいませんでした"
              ],
              [
                "まつ",
                "esperar",
                "まちます",
                "まちません",
                "まちました",
                "まちませんでした"
              ],
              [
                "かく",
                "escribir",
                "かきます",
                "かきません",
                "かきました",
                "かきませんでした"
              ],
              [
                "およぐ",
                "nadar",
                "およぎます",
                "およぎません",
                "およぎました",
                "およぎませんでした"
              ],
              [
                "はなす",
                "hablar",
                "はなします",
                "はなしません",
                "はなしました",
                "はなしませんでした"
              ],
              [
                "きく",
                "escuchar",
                "ききます",
                "ききません",
                "ききました",
                "ききませんでした"
              ],
              [
                "のむ",
                "beber",
                "のみます",
                "のみません",
                "のみました",
                "のみませんでした"
              ],
              [
                "あそぶ",
                "jugar",
                "あそびます",
                "あそびません",
                "あそびました",
                "あそびませんでした"
              ]
            ]
          }
        ]
      },
      {
        "id": "grupo-3",
        "title": "Grupo 3",
        "titleJp": "さんグループ — irregulares",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Infinitivo",
              "Significado",
              "ます(+)",
              "ます(−)",
              "ました(+)",
              "ました(−)"
            ],
            "rows": [
              [
                "する",
                "hacer",
                "します",
                "しません",
                "しました",
                "しませんでした"
              ],
              [
                "くる",
                "venir",
                "きます",
                "きません",
                "きました",
                "きませんでした"
              ]
            ]
          },
          {
            "kind": "text",
            "text": "する + sustantivo = verbos compuestos: べんきょうする estudiar · しゅくだいする hacer la tarea · そうじする limpiar · でんわする llamar por teléfono · ゲームする jugar videojuegos · テニスする jugar al tenis"
          }
        ]
      },
      {
        "id": "como-identificar-el-grupo",
        "title": "¿Cómo identificar el grupo?",
        "blocks": [
          {
            "kind": "text",
            "text": "1. ¿Termina en ERU o IRU? → Sí: Grupo 2 2. ¿Es する o くる? → Sí: Grupo 3 3. Si no: Grupo 1"
          }
        ]
      },
      {
        "id": "frases-esenciales",
        "title": "Frases esenciales",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "まいにち はたらきます。",
                "Mainichi hatarakimasu.",
                "Trabajo todos los días."
              ],
              [
                "きのう べんきょうしました。",
                "Kinou benkyou shimashita.",
                "Ayer estudié."
              ],
              [
                "あした きません。",
                "Ashita kimasen.",
                "Mañana no vengo."
              ],
              [
                "どようびと にちようびは やすみました。",
                "Doyoubi to nichiyoubi wa yasumimashita.",
                "Descansé sábado y domingo."
              ],
              [
                "ゲームしませんでした。",
                "Geemu shimasendeshita.",
                "No jugué videojuegos."
              ]
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "kurasu-15",
    "number": 15,
    "title": "Días del mes, いつ y verbos de movimiento",
    "date": "2026-06-27",
    "topics": "lecturas especiales de los días del mes, いつ (¿cuándo?), fechas especiales, cumpleaños, verbos いく/くる/かえる, partícula へ.",
    "sections": [
      {
        "id": "dias-del-mes",
        "title": "Días del mes",
        "titleJp": "日 (ka / nichi)",
        "blocks": [
          {
            "kind": "text",
            "text": "Del 1 al 10 (y algunos más) son irregulares; desde el 11 casi todos son número + にち."
          },
          {
            "kind": "table",
            "headers": [
              "Día",
              "Kanji",
              "Lectura",
              "Nota"
            ],
            "rows": [
              [
                "1",
                "１日",
                "ついたち",
                "irregular"
              ],
              [
                "2",
                "２日",
                "ふつか",
                "irregular"
              ],
              [
                "3",
                "３日",
                "みっか",
                "irregular"
              ],
              [
                "4",
                "４日",
                "よっか",
                "irregular"
              ],
              [
                "5",
                "５日",
                "いつか",
                "irregular"
              ],
              [
                "6",
                "６日",
                "むいか",
                "irregular"
              ],
              [
                "7",
                "７日",
                "なのか",
                "irregular"
              ],
              [
                "8",
                "８日",
                "ようか",
                "irregular"
              ],
              [
                "9",
                "９日",
                "ここのか",
                "irregular"
              ],
              [
                "10",
                "１０日",
                "とおか",
                "irregular"
              ],
              [
                "14",
                "１４日",
                "じゅうよっか",
                "⚠️ よっか, no よんにち"
              ],
              [
                "20",
                "２０日",
                "はつか",
                "irregular"
              ],
              [
                "24",
                "２４日",
                "にじゅうよっか",
                "⚠️ よっか"
              ]
            ]
          },
          {
            "kind": "note",
            "tone": "⚠️",
            "text": "El 4 y el 14 siempre usan よっか, nunca よんにち."
          }
        ]
      },
      {
        "id": "cuando",
        "title": "¿Cuándo?",
        "titleJp": "いつ",
        "blocks": [
          {
            "kind": "quote",
            "lines": [
              "[cosa] は いつ ですか？ — ¿Cuándo es [cosa]?",
              "Respuesta: [mes]がつ [día]にち です。",
              "おたんじょうび は いつ ですか？ → たんじょうび は １２がつ １８にち です。"
            ]
          }
        ]
      },
      {
        "id": "fechas-especiales",
        "title": "Fechas especiales",
        "titleJp": "とくべつな ひ",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Evento",
              "Fecha",
              "En japonés"
            ],
            "rows": [
              [
                "クリスマス Navidad",
                "24 de diciembre",
                "１２がつ ２４にち"
              ],
              [
                "San Valentín",
                "14 de febrero",
                "２がつ １４にち"
              ],
              [
                "White Day",
                "14 de marzo",
                "３がつ １４にち"
              ],
              [
                "Día del niño (Argentina)",
                "18 de agosto",
                "８がつ １８にち"
              ],
              [
                "こどもの日 (Japón)",
                "5 de mayo",
                "５がつ ５にち"
              ],
              [
                "ひなまつり",
                "3 de marzo",
                "３がつ ３にち"
              ]
            ]
          },
          {
            "kind": "text",
            "text": "こどもの日: se celebra con carpas de tela こいのぼり (fuerza y éxito). ひなまつり: festival de las muñecas, salud para las niñas."
          }
        ]
      },
      {
        "id": "cumpleanos",
        "title": "Cumpleaños",
        "titleJp": "たんじょうび",
        "blocks": [
          {
            "kind": "list",
            "items": [
              "たんじょうび (casual) · おたんじょうび (formal, con お)"
            ]
          },
          {
            "kind": "quote",
            "lines": [
              "おたんじょうび は いつ ですか？ · なんがつ なんにち ですか？",
              "たんじょうび は ８がつ ２にち です。 — Mi cumpleaños es el 2 de agosto."
            ]
          }
        ]
      },
      {
        "id": "verbos-de-movimiento",
        "title": "Verbos de movimiento",
        "blocks": [
          {
            "kind": "text",
            "text": "Se usan con へ o に para el destino: [persona] は [lugar] へ/に [verbo]"
          },
          {
            "kind": "subheading",
            "text": "いく (ir) — Grupo 1"
          },
          {
            "kind": "text",
            "text": "いきます / いきません / いきました / いきませんでした"
          },
          {
            "kind": "quote",
            "lines": [
              "わたし は がっこう へ いきます。 — Voy a la escuela."
            ]
          },
          {
            "kind": "subheading",
            "text": "くる (venir) — Grupo 3 (irregular)"
          },
          {
            "kind": "text",
            "text": "きます / きません / きました / きませんでした"
          },
          {
            "kind": "quote",
            "lines": [
              "たなかくん は がっこう へ きます。 — Tanaka viene a la escuela."
            ]
          },
          {
            "kind": "subheading",
            "text": "かえる (regresar) — Grupo 1"
          },
          {
            "kind": "text",
            "text": "かえります / かえりません / かえりました / かえりませんでした"
          },
          {
            "kind": "quote",
            "lines": [
              "わたし は うち へ かえります。 — Regreso a casa."
            ]
          }
        ]
      },
      {
        "id": "particula-se-lee-e-direccion",
        "title": "Partícula へ (se lee \"e\") — dirección",
        "blocks": [
          {
            "kind": "text",
            "text": "へ = dirección (\"hacia\") · に = destino específico (\"a\"). Con verbos de movimiento suelen ser intercambiables."
          },
          {
            "kind": "quote",
            "lines": [
              "がっこう へ いきます。 / がっこう に いきます。"
            ]
          }
        ]
      },
      {
        "id": "frases-esenciales",
        "title": "Frases esenciales",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "おたんじょうび は いつ ですか？",
                "Otanjoubi wa itsu desu ka?",
                "¿Cuándo es tu cumpleaños?"
              ],
              [
                "たんじょうび は ３がつ ふつか です。",
                "Tanjoubi wa sangatsu futsuka desu.",
                "Mi cumpleaños es el 2 de marzo."
              ],
              [
                "なんがつ なんにち ですか？",
                "Nangatsu nannichi desu ka?",
                "¿Qué mes y qué día?"
              ],
              [
                "わたし は うち へ かえります。",
                "Watashi wa uchi e kaerimasu.",
                "Regreso a casa."
              ],
              [
                "きのう がっこう へ いきました。",
                "Kinou gakkou e ikimashita.",
                "Ayer fui a la escuela."
              ],
              [
                "いつ かえりますか？",
                "Itsu kaerimasu ka?",
                "¿Cuándo volvés?"
              ]
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "kurasu-16",
    "number": 16,
    "title": "¿Cómo y con quién vas?",
    "titleJp": "〜で・〜と・どこへも",
    "date": "2026-07-04",
    "topics": "repaso de へ いきます, かえります + から, どこ（へ）も con verbo negativo, expresiones de tiempo, medios de transporte con で, なんで, compañía con と, ひとりで, だれと, la oración completa.",
    "sections": [
      {
        "id": "repaso-de-la-tarea",
        "title": "Repaso de la tarea",
        "titleJp": "しゅくだい",
        "blocks": [
          {
            "kind": "text",
            "text": "Corrección de la página １２１, con la estructura [lugar] へ いきます."
          },
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "ゆうびんきょく へ いきます。",
                "Yuubinkyoku e ikimasu.",
                "Voy al correo."
              ],
              [
                "デパート へ いきます。",
                "Depaato e ikimasu.",
                "Voy a la tienda por departamentos."
              ],
              [
                "ぎんこう へ いきます。",
                "Ginkou e ikimasu.",
                "Voy al banco."
              ],
              [
                "びじゅつかん へ いきます。",
                "Bijutsukan e ikimasu.",
                "Voy al museo de arte."
              ]
            ]
          }
        ]
      },
      {
        "id": "regresar",
        "title": "Regresar",
        "titleJp": "かえります",
        "blocks": [
          {
            "kind": "text",
            "text": "かえる／かえります es volver al lugar al que uno pertenece: la casa, el país, la ciudad. El destino se marca con へ o に, igual que con いきます."
          },
          {
            "kind": "quote",
            "lines": [
              "[persona] は [lugar] へ/に かえります。",
              "メッシ は アルゼンチン へ かえります。 — Messi regresa a Argentina."
            ]
          },
          {
            "kind": "text",
            "text": "Para decir desde dónde vuelve se usa から."
          },
          {
            "kind": "quote",
            "lines": [
              "[origen] から [destino] へ かえります。",
              "メッシ は にほん から アルゼンチン へ かえります。 — Messi regresa de Japón a Argentina."
            ]
          }
        ]
      },
      {
        "id": "a-donde-vas",
        "title": "¿A dónde vas?",
        "titleJp": "どこ へ いきますか",
        "blocks": [
          {
            "kind": "text",
            "text": "Para preguntar el destino se usa どこ + へ／に."
          },
          {
            "kind": "quote",
            "lines": [
              "[persona]さん、どこ へ いきますか？ — ¿A dónde vas?"
            ]
          },
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "わたし は かいしゃ へ いきます。",
                "Watashi wa kaisha e ikimasu.",
                "Voy a la empresa."
              ],
              [
                "わたし は デパート へ いきます。",
                "Watashi wa depaato e ikimasu.",
                "Voy a la tienda."
              ],
              [
                "わたし は スーパー へ いきます。",
                "Watashi wa suupaa e ikimasu.",
                "Voy al supermercado."
              ],
              [
                "わたし は としょかん へ いきます。",
                "Watashi wa toshokan e ikimasu.",
                "Voy a la biblioteca."
              ]
            ]
          }
        ]
      },
      {
        "id": "no-voy-a-ningun-lado",
        "title": "No voy a ningún lado",
        "titleJp": "どこ（へ）も",
        "blocks": [
          {
            "kind": "text",
            "text": "Cuando no vamos a ninguna parte se usa どこ（へ）も y el verbo va en negativo."
          },
          {
            "kind": "quote",
            "lines": [
              "ぎんこう へ いきません。 — No voy al banco.",
              "デパート へ いきません。 — No voy a la tienda.",
              "つまり、どこ[へ]も いきません。 — O sea, no voy a ningún lado."
            ]
          },
          {
            "kind": "note",
            "tone": "⚠️",
            "text": "Siempre que uses どこ（へ）も, el verbo tiene que estar en negativo. Nunca どこへも いきます."
          },
          {
            "kind": "text",
            "text": "つまり (tsumari) significa \"o sea\", \"es decir\": sirve para resumir lo que venías diciendo."
          }
        ]
      },
      {
        "id": "cuando",
        "title": "¿Cuándo?",
        "titleJp": "expresiones de tiempo",
        "blocks": [
          {
            "kind": "text",
            "text": "Van al principio de la oración y definen si el verbo va en ます (no-pasado) o ました (pasado)."
          },
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "おととい",
                "ototoi",
                "anteayer"
              ],
              [
                "きのう",
                "kinou",
                "ayer"
              ],
              [
                "けさ",
                "kesa",
                "esta mañana"
              ],
              [
                "いま",
                "ima",
                "ahora"
              ],
              [
                "あした",
                "ashita",
                "mañana"
              ],
              [
                "せんしゅう",
                "senshuu",
                "la semana pasada"
              ],
              [
                "らいしゅう",
                "raishuu",
                "la semana que viene"
              ],
              [
                "せんげつ",
                "sengetsu",
                "el mes pasado"
              ],
              [
                "らいげつ",
                "raigetsu",
                "el mes que viene"
              ],
              [
                "きょねん",
                "kyonen",
                "el año pasado"
              ],
              [
                "まいにち",
                "mainichi",
                "todos los días"
              ]
            ]
          },
          {
            "kind": "quote",
            "lines": [
              "きのう デパート へ いきました。 — Ayer fui a la tienda.",
              "せんげつ ぎんこう へ いきました。 — El mes pasado fui al banco.",
              "らいしゅう びじゅつかん へ いきます。 — La semana que viene voy al museo.",
              "せんしゅう の にちようび、どこ へ いきましたか？ → おきなわ へ いきました。"
            ]
          }
        ]
      },
      {
        "id": "como",
        "title": "¿Cómo?",
        "titleJp": "medios de transporte + で",
        "blocks": [
          {
            "kind": "text",
            "text": "El medio de transporte se marca con で (\"en\" / \"por medio de\")."
          },
          {
            "kind": "quote",
            "lines": [
              "[persona] は [transporte] で [lugar] へ いきます。"
            ]
          },
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "ひこうき",
                "hikouki",
                "avión"
              ],
              [
                "しんかんせん",
                "shinkansen",
                "tren bala"
              ],
              [
                "でんしゃ",
                "densha",
                "tren"
              ],
              [
                "ちかてつ",
                "chikatetsu",
                "subte"
              ],
              [
                "バス",
                "basu",
                "colectivo"
              ],
              [
                "タクシー",
                "takushii",
                "taxi"
              ],
              [
                "くるま",
                "kuruma",
                "auto"
              ],
              [
                "じてんしゃ",
                "jitensha",
                "bicicleta"
              ],
              [
                "ふね",
                "fune",
                "barco"
              ],
              [
                "あるいて",
                "aruite",
                "caminando / a pie"
              ]
            ]
          },
          {
            "kind": "quote",
            "lines": [
              "わたし は じてんしゃ で がっこう へ いきます。 — Voy a la escuela en bicicleta.",
              "わたし は バス で うち へ かえります。 — Vuelvo a casa en colectivo."
            ]
          },
          {
            "kind": "note",
            "tone": "⚠️",
            "text": "あるいて es la excepción y NO lleva で. Se dice あるいて かえりました, nunca あるいてで."
          },
          {
            "kind": "quote",
            "lines": [
              "きのう あるいて かえりました。 — Ayer volví caminando."
            ]
          }
        ]
      },
      {
        "id": "en-que-vas",
        "title": "¿En qué vas?",
        "titleJp": "なん で いきますか",
        "blocks": [
          {
            "kind": "quote",
            "lines": [
              "[persona]さん は なん で [lugar] へ いきますか？ — ¿En qué va [persona] a [lugar]?",
              "たなかさん は なん で かいしゃ へ いきますか？ → くるま で いきます。"
            ]
          }
        ]
      },
      {
        "id": "con-quien",
        "title": "¿Con quién?",
        "titleJp": "〜と / ひとりで",
        "blocks": [
          {
            "kind": "text",
            "text": "La compañía se marca con と (\"con\")."
          },
          {
            "kind": "quote",
            "lines": [
              "[persona] は [compañía] と [lugar] へ いきます。"
            ]
          },
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "ともだち",
                "tomodachi",
                "amigo/a"
              ],
              [
                "かぞく",
                "kazoku",
                "familia"
              ],
              [
                "かれし",
                "kareshi",
                "novio"
              ],
              [
                "かのじょ",
                "kanojo",
                "novia"
              ],
              [
                "ひとり",
                "hitori",
                "una sola persona / solo"
              ]
            ]
          },
          {
            "kind": "quote",
            "lines": [
              "うさぎちゃん は かれし と とうきょう へ いきます。 — Usagi va a Tokio con su novio.",
              "まもるちゃん は かのじょ と とうきょう へ いきます。 — Mamoru va a Tokio con su novia."
            ]
          },
          {
            "kind": "note",
            "tone": "⚠️",
            "text": "Cuando vas solo/a no se usa と sino ひとり で."
          },
          {
            "kind": "quote",
            "lines": [
              "ジョン・トラボルタさん は ひとり で きょうしつ へ きました。 — John Travolta vino solo al aula."
            ]
          },
          {
            "kind": "text",
            "text": "Para preguntar con quién se usa だれ と."
          },
          {
            "kind": "quote",
            "lines": [
              "ホーマーさん は だれ と スプリングフィールド へ かえりますか？ → かぞく と かえります。",
              "スポンジ・ボブさん は だれ と ビキニタウン へ かえりますか？ → ともだち と かえります。"
            ]
          }
        ]
      },
      {
        "id": "la-oracion-completa",
        "title": "La oración completa",
        "titleJp": "orden de los componentes",
        "blocks": [
          {
            "kind": "text",
            "text": "El orden es siempre el mismo y el verbo queda al final."
          },
          {
            "kind": "quote",
            "lines": [
              "[persona] は [tiempo] [compañía] と [transporte] で [lugar] へ [verbo]"
            ]
          },
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "ルフィちゃん は まいにち ともだち と ふね で ほっかいどう へ いきます。",
                "Rufi-chan wa mainichi tomodachi to fune de Hokkaidou e ikimasu.",
                "Luffy va todos los días a Hokkaido en barco con sus amigos."
              ],
              [
                "たんじろくん は ６じ に ともだち と でんしゃ で おおさかじょう へ いきます。",
                "Tanjirou-kun wa rokuji ni tomodachi to densha de Oosakajou e ikimasu.",
                "Tanjiro va al castillo de Osaka a las 6 en tren con sus amigos."
              ],
              [
                "トトロ は いま ひとり で ねこバス で もり へ いきます。",
                "Totoro wa ima hitori de nekobasu de mori e ikimasu.",
                "Totoro va ahora solo al bosque en el gatobús."
              ],
              [
                "ききちゃん は あさ ９じ から ごご ４じ まで ジジ と ほうき で きょうと へ いきます。",
                "Kiki-chan wa asa kuji kara gogo yoji made Jiji to houki de Kyouto e ikimasu.",
                "Kiki va a Kioto en escoba con Jiji, de 9 a 16."
              ],
              [
                "さつきちゃん は いま めいちゃん と ねこバス で いなか から しちこくやまびょういん まで いきます。",
                "Satsuki-chan wa ima Mei-chan to nekobasu de inaka kara Shichikokuyama byouin made ikimasu.",
                "Satsuki va ahora con Mei, en el gatobús, del campo al hospital de Shichikokuyama."
              ]
            ]
          },
          {
            "kind": "text",
            "text": "から〜まで también funciona con lugares, no solo con horas y días: marca el tramo de origen a destino."
          },
          {
            "kind": "note",
            "tone": "📝",
            "text": "Tarea: みんな の にほんご — ４３ページ、もんだい ３ と ４."
          }
        ]
      },
      {
        "id": "frases-esenciales",
        "title": "Frases esenciales",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "どこ へ いきますか？",
                "Doko e ikimasu ka?",
                "¿A dónde vas?"
              ],
              [
                "どこ[へ]も いきません。",
                "Doko[e]mo ikimasen.",
                "No voy a ningún lado."
              ],
              [
                "なん で いきますか？",
                "Nan de ikimasu ka?",
                "¿En qué vas?"
              ],
              [
                "でんしゃ で いきます。",
                "Densha de ikimasu.",
                "Voy en tren."
              ],
              [
                "あるいて かえりました。",
                "Aruite kaerimashita.",
                "Volví caminando."
              ],
              [
                "だれ と いきますか？",
                "Dare to ikimasu ka?",
                "¿Con quién vas?"
              ],
              [
                "ともだち と いきます。",
                "Tomodachi to ikimasu.",
                "Voy con un amigo."
              ],
              [
                "ひとり で いきます。",
                "Hitori de ikimasu.",
                "Voy solo/a."
              ],
              [
                "きのう どこ へ いきましたか？",
                "Kinou doko e ikimashita ka?",
                "¿A dónde fuiste ayer?"
              ],
              [
                "にほん から アルゼンチン へ かえります。",
                "Nihon kara Aruzenchin e kaerimasu.",
                "Vuelvo de Japón a Argentina."
              ]
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "kurasu-17",
    "number": 17,
    "title": "Repaso general y la estación",
    "titleJp": "なんばんせん・とっきゅう・きゅうこう・ふつう",
    "date": "2026-08-08",
    "topics": "juego de repaso (ことば, じょし, いつ？どこ？, ぶんぽう), qué partícula va con cada palabra, かいわ p.46, どういたしまして, つぎ の, なんばんせん, los tres tipos de tren.",
    "sections": [
      {
        "id": "el-tablero-de-repaso",
        "title": "El tablero de repaso",
        "titleJp": "ことば・じょし・いつ？どこ？・ぶんぽう",
        "blocks": [
          {
            "kind": "text",
            "text": "Clase de repaso general: un juego de tablero con cuatro categorías y cinco niveles (200 a 1000円) que barrió todo lo visto hasta acá."
          },
          {
            "kind": "subheading",
            "text": "ことば — vocabulario"
          },
          {
            "kind": "table",
            "headers": [
              "Consigna",
              "Respuesta"
            ],
            "rows": [
              [
                "200円 — \"profesor\" は にほんご で？",
                "せんせい"
              ],
              [
                "400円 — なかま じゃない ことば は？（ぎんこう・がっこう・でんしゃ・かいしゃ）",
                "でんしゃ — las otras tres son lugares"
              ],
              [
                "600円 — \"empleado de empresa\", \"estudiante\", \"doctor\"",
                "かいしゃいん、がくせい、いしゃ"
              ],
              [
                "800円 — \"Trabajé hasta las 4 de la tarde\"",
                "わたし は よじ まで はたらきました。"
              ],
              [
                "1000円 — seis medios de transporte en 10 segundos",
                "でんしゃ・タクシー・ちかてつ・じてんしゃ・しんかんせん・ひこうき・バス・ふね"
              ]
            ]
          },
          {
            "kind": "subheading",
            "text": "じょし — partículas"
          },
          {
            "kind": "table",
            "headers": [
              "Consigna",
              "Respuesta"
            ],
            "rows": [
              [
                "200円 — わたし（　）マリア です。",
                "は"
              ],
              [
                "400円 — それ は Ford（　）くるま です。",
                "の"
              ],
              [
                "600円 — わたし は ７じ（　）おきます。",
                "に"
              ],
              [
                "800円 — わたし ともだち（　）にほん（　）いきます。",
                "と ・ へ"
              ],
              [
                "1000円 — わたし（　）ともだち（　）６じ（　）でんしゃ（　）とうきょう（　）いきます。",
                "は ・ と ・ に ・ で ・ へ"
              ]
            ]
          },
          {
            "kind": "note",
            "tone": "💡",
            "text": "La de 1000円 es la oración completa del だい5か entera: tema は · compañía と · hora に · transporte で · lugar へ. Si te sale esa, te sale todo el capítulo."
          },
          {
            "kind": "subheading",
            "text": "いつ？どこ？ — tiempo y lugar"
          },
          {
            "kind": "table",
            "headers": [
              "Consigna",
              "Respuesta"
            ],
            "rows": [
              [
                "200円 — \"¿Dónde está el baño?\"",
                "トイレ は どこ ですか？"
              ],
              [
                "400円 — いま、なんじ ですか？",
                "１２じ です。"
              ],
              [
                "600円 — \"Estudio de 9 a 11\"",
                "くじ から じゅういちじ まで べんきょう します。"
              ],
              [
                "800円 — hacer la pregunta para \"にちようび いきます\"",
                "いつ いきますか？"
              ],
              [
                "1000円 — \"Ayer fui a Buenos Aires con mi mamá en tren\"",
                "きのう、ブエノスアイレス へ おかあさん と でんしゃ で いきました。"
              ]
            ]
          },
          {
            "kind": "subheading",
            "text": "ぶんぽう — gramática"
          },
          {
            "kind": "table",
            "headers": [
              "Consigna",
              "Respuesta"
            ],
            "rows": [
              [
                "200円 — マリアさん は がくせい ＿＿＿。",
                "です"
              ],
              [
                "400円 — ＿＿＿ほん は わたし の です。",
                "この"
              ],
              [
                "600円 — \"まいにち ６じ に おきます\" en pasado",
                "きのう ６じ に おきました。"
              ],
              [
                "800円 — \"El libro de María está en el aula\"",
                "マリアさん の ほん は きょうしつ です。"
              ]
            ]
          },
          {
            "kind": "text",
            "text": "La de 1000円 era encontrar las partículas mal puestas."
          },
          {
            "kind": "quote",
            "lines": [
              "❌ きのうに８じでおきます。 — mal",
              "✅ きのう、８じ に おきました。 — Ayer me levanté a las 8.",
              "❌ ともだちへ がっこうで バスに いきました。 — mal",
              "✅ ともだち と がっこう へ バス で いきました。 — Fui a la escuela en colectivo con un amigo."
            ]
          },
          {
            "kind": "note",
            "tone": "⚠️",
            "text": "Los errores del ejercicio son los tres clásicos: きのう no lleva に y la hora exacta sí; la compañía va con と, no con へ; el transporte va con で, no con に."
          }
        ]
      },
      {
        "id": "que-particula-va",
        "title": "¿Qué partícula va?",
        "titleJp": "el segundo juego",
        "blocks": [
          {
            "kind": "text",
            "text": "Segunda ronda: cada carta mostraba una palabra y había que decir con qué partícula entra en 〜いきます."
          },
          {
            "kind": "table",
            "headers": [
              "Palabra",
              "Partícula",
              "Por qué"
            ],
            "rows": [
              [
                "ひろしま・しんじゅくえき・コンビニ・スーパー",
                "へ",
                "destino"
              ],
              [
                "しんかんせん・でんしゃ",
                "で",
                "medio de transporte"
              ],
              [
                "さとうさん・れいこさん",
                "と",
                "compañía"
              ],
              [
                "どようび・７じはん",
                "に",
                "día y hora exactos"
              ],
              [
                "ひとり",
                "で",
                "ir solo es ひとり で, nunca ひとり と"
              ],
              [
                "あるいて",
                "—",
                "no lleva で"
              ],
              [
                "まいにち・あした",
                "—",
                "no llevan に"
              ]
            ]
          },
          {
            "kind": "note",
            "tone": "⚠️",
            "text": "Las tres últimas filas son las trampas de siempre: あるいて sin で, ひとり con で, y まいにち／あした sin に."
          }
        ]
      },
      {
        "id": "seccion-3",
        "title": "かいわ",
        "titleJp": "p. 46 — 会話のことば",
        "blocks": [
          {
            "kind": "text",
            "text": "Las dos que se usan todo el tiempo y van juntas."
          },
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "ありがとう ございます",
                "arigatou gozaimasu",
                "muchas gracias"
              ],
              [
                "どういたしまして",
                "douitashimashite",
                "de nada"
              ],
              [
                "こうしえん",
                "koushien",
                "el estadio Koshien"
              ]
            ]
          }
        ]
      },
      {
        "id": "el-siguiente",
        "title": "El siguiente…",
        "titleJp": "つぎ の",
        "blocks": [
          {
            "kind": "text",
            "text": "つぎ es \"lo que viene después\". Se engancha con の al sustantivo."
          },
          {
            "kind": "quote",
            "lines": [
              "つぎ の [cosa] — el/la próximo/a [cosa]"
            ]
          },
          {
            "kind": "quote",
            "lines": [
              "つぎ の なつやすみ は イタリア へ いきます。 — Las próximas vacaciones de verano voy a Italia.",
              "つぎ の でんしゃ は ２じはん に きます。 — El próximo tren llega a las 2 y media.",
              "つぎ の クリスマス は きんようび です。 — La próxima Navidad cae viernes."
            ]
          }
        ]
      },
      {
        "id": "en-la-estacion",
        "title": "En la estación",
        "titleJp": "なんばんせん ですか",
        "blocks": [
          {
            "kind": "text",
            "text": "En Japón los andenes se numeran y el número es la información clave: por el mismo andén pasan varios servicios distintos."
          },
          {
            "kind": "quote",
            "lines": [
              "[destino] は なんばんせん ですか？ — ¿De qué andén sale [destino]?"
            ]
          },
          {
            "kind": "quote",
            "lines": [
              "しらかわ は なんばんせん ですか？ — ¿De qué andén sale el de Shirakawa?",
              "４ばんせん です。 — Del andén 4."
            ]
          }
        ]
      },
      {
        "id": "los-tres-tipos-de-tren",
        "title": "Los tres tipos de tren",
        "titleJp": "とっきゅう・きゅうこう・ふつう",
        "blocks": [
          {
            "kind": "text",
            "text": "Antes de subirte mirá qué tipo de servicio es: con el mismo boleto y la misma vía, uno para en tu estación y el otro pasa de largo."
          },
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "とっきゅう",
                "tokkyuu",
                "expreso limitado — para en muy pocas estaciones"
              ],
              [
                "きゅうこう",
                "kyuukou",
                "expreso — para en algunas"
              ],
              [
                "ふつう",
                "futsuu",
                "normal — para en todas"
              ]
            ]
          },
          {
            "kind": "note",
            "tone": "📝",
            "text": "Tarea: みんな の にほんご — かいわ p. 46 y 練習C p. 50."
          }
        ]
      },
      {
        "id": "frases-esenciales",
        "title": "Frases esenciales",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "どういたしまして。",
                "Douitashimashite.",
                "De nada."
              ],
              [
                "つぎ の でんしゃ は ２じはん に きます。",
                "Tsugi no densha wa niji han ni kimasu.",
                "El próximo tren llega a las 2 y media."
              ],
              [
                "なんばんせん ですか？",
                "Nanbansen desu ka?",
                "¿De qué andén es?"
              ],
              [
                "４ばんせん です。",
                "Yonbansen desu.",
                "Es el andén 4."
              ],
              [
                "きのう、８じ に おきました。",
                "Kinou, hachiji ni okimashita.",
                "Ayer me levanté a las 8."
              ],
              [
                "ともだち と がっこう へ バス で いきました。",
                "Tomodachi to gakkou e basu de ikimashita.",
                "Fui a la escuela en colectivo con un amigo."
              ],
              [
                "くじ から じゅういちじ まで べんきょう します。",
                "Kuji kara juuichiji made benkyou shimasu.",
                "Estudio de 9 a 11."
              ]
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "kurasu-18",
    "number": 18,
    "title": "Práctica del だい5か",
    "titleJp": "なんで・だれと・いつ・〜から きました",
    "date": "2026-08-15",
    "topics": "repaso de なんで y だれと, las cuatro casillas へ・で・と・に, 〜から きました, cada palabra en su pregunta, 練習C con どこも いきません, おみやげ, おくに は どちら ですか, comprensión auditiva.",
    "sections": [
      {
        "id": "repaso-de-la-tarea",
        "title": "Repaso de la tarea",
        "titleJp": "しゅくだい",
        "blocks": [
          {
            "kind": "text",
            "text": "No hubo gramática nueva: la pusimos a trabajar. La primera parte era なんで + el medio de transporte con で."
          },
          {
            "kind": "quote",
            "lines": [
              "なんで がっこう へ いきますか？ — ¿En qué vas a la escuela?",
              "じてんしゃ で いきます。 — Voy en bicicleta.",
              "なんで とうきょう へ いきますか？ — ¿En qué vas a Tokio?",
              "ひこうき で いきます。 — Voy en avión.",
              "なんで きゅうしゅう へ いきますか？ — ¿En qué vas a Kyushu?",
              "ふね で いきます。 — Voy en barco.",
              "なんで えき へ いきますか？ — ¿En qué vas a la estación?",
              "あるいて いきます。 — Voy caminando."
            ]
          },
          {
            "kind": "note",
            "tone": "⚠️",
            "text": "あるいて no lleva で. Es la única del grupo que se planta sola."
          },
          {
            "kind": "text",
            "text": "La segunda parte era だれと + la compañía con と."
          },
          {
            "kind": "quote",
            "lines": [
              "だれ と びじゅつかん へ いきますか？ — ¿Con quién vas al museo?",
              "かのじょ と いきます。 — Voy con mi novia.",
              "だれ と ひろしま へ いきますか？ — ¿Con quién vas a Hiroshima?",
              "かいしゃ の ひと と いきます。 — Voy con gente de la empresa.",
              "だれ と ほっかいどう へ いきますか？ — ¿Con quién vas a Hokkaido?",
              "かぞく と いきます。 — Voy con mi familia.",
              "だれ と フランス へ いきますか？ — ¿Con quién vas a Francia?",
              "ひとり で いきます。 — Voy solo/a."
            ]
          }
        ]
      },
      {
        "id": "las-cuatro-casillas",
        "title": "Las cuatro casillas",
        "titleJp": "へ・で・と・に",
        "blocks": [
          {
            "kind": "text",
            "text": "El ejercicio de かいておぼえる P. 18 arma la misma oración cuatro veces, cambiando qué casilla se completa. Es la mejor forma de ver que cada partícula contesta una pregunta distinta."
          },
          {
            "kind": "quote",
            "lines": [
              "[persona] は [lugar] へ / [transporte] で / [compañía] と / [tiempo] に いきます。"
            ]
          },
          {
            "kind": "text",
            "text": "En el dibujo, グプタさん viaja a Hiroshima el sábado, en tren bala, con さとうさん."
          },
          {
            "kind": "quote",
            "lines": [
              "ひろしま へ いきます。 — Voy a Hiroshima.",
              "しんかんせん で いきます。 — Voy en tren bala.",
              "さとうさん と いきます。 — Voy con Sato.",
              "どようび に いきます。 — Voy el sábado."
            ]
          }
        ]
      },
      {
        "id": "vine-de",
        "title": "Vine de…",
        "titleJp": "〜から きました",
        "blocks": [
          {
            "kind": "text",
            "text": "Para decir de dónde viniste se usa から con きます. Es la misma から de から〜まで, pero acá marca el origen del viaje."
          },
          {
            "kind": "quote",
            "lines": [
              "[origen] から きました。 — Vine de [origen]."
            ]
          },
          {
            "kind": "text",
            "text": "En la segunda mitad del ejercicio, グプタさん llegó de la India, solo, en avión, en septiembre."
          },
          {
            "kind": "quote",
            "lines": [
              "インド から きました。 — Vine de la India.",
              "ひこうき で きました。 — Vine en avión.",
              "ひとり で きました。 — Vine solo.",
              "９がつ に きました。 — Vine en septiembre."
            ]
          },
          {
            "kind": "note",
            "tone": "⚠️",
            "text": "ひとりで ya trae su partícula adentro, así que no se le agrega nada. Por eso en el libro esa casilla figura con una ×."
          }
        ]
      },
      {
        "id": "cada-palabra-en-su-pregunta",
        "title": "Cada palabra en su pregunta",
        "titleJp": "ことばの整理",
        "blocks": [
          {
            "kind": "text",
            "text": "El ejercicio de P. 19 era repartir un montón de palabras sueltas según qué pregunta contestan. Sirve como radiografía de todo el だい5か."
          },
          {
            "kind": "table",
            "headers": [
              "Pregunta",
              "Palabras que la contestan"
            ],
            "rows": [
              [
                "なんじ に いきますか。",
                "９じ・１２じ"
              ],
              [
                "なんで いきますか。",
                "でんしゃ・じてんしゃ・ちかてつ・ひこうき・あるいて"
              ],
              [
                "だれ と いきますか。",
                "ワンさん・かぞく・せんせい・ともだち・ひとりで"
              ],
              [
                "どこ へ いきますか。",
                "ぎんこう・えき・ゆうびんきょく・がっこう・スーパー"
              ],
              [
                "いつ いきますか。",
                "あした・きのう・せんしゅう・まいにち・こんばん"
              ]
            ]
          },
          {
            "kind": "note",
            "tone": "💡",
            "text": "あるいて y ひとりで entran igual en su columna aunque no lleven la partícula del grupo. Son las dos excepciones que ya conocés, y contestan la pregunta lo mismo."
          }
        ]
      },
      {
        "id": "y-vos-a-donde-vas",
        "title": "¿Y vos, a dónde vas?",
        "titleJp": "練習C",
        "blocks": [
          {
            "kind": "text",
            "text": "El primer diálogo de la página 45 junta どこへ いきます con どこも いきません."
          },
          {
            "kind": "quote",
            "lines": [
              "あした は にちようび ですね。 — Mañana es domingo, ¿no?",
              "あ、そう ですね。 — Ah, sí, es cierto.",
              "わたし は おおさかじょう へ いきます。タワポンさん は？ — Yo voy al castillo de Osaka. ¿Y vos, Tawapon?",
              "どこも いきません。べんきょう します。 — No voy a ningún lado. Voy a estudiar."
            ]
          },
          {
            "kind": "note",
            "tone": "💡",
            "text": "〜さんは？ es la forma corta de devolver la pregunta. No hace falta repetirla entera: con el tema y は alcanza."
          }
        ]
      },
      {
        "id": "un-regalo-del-viaje",
        "title": "Un regalo del viaje",
        "titleJp": "おみやげ",
        "blocks": [
          {
            "kind": "text",
            "text": "El segundo diálogo es el de volver de viaje y traer una おみやげ: el recuerdo típico del lugar, que en Japón se comparte sí o sí con la oficina y la familia."
          },
          {
            "kind": "quote",
            "lines": [
              "せんしゅう とうきょう へ いきました。これ、おみやげ です。どうぞ。 — La semana pasada fui a Tokio. Esto es un souvenir. Tomá.",
              "ありがとう ございます。ひとり で いきましたか。 — Muchas gracias. ¿Fuiste solo?",
              "いいえ、ともだち と いきました。 — No, fui con un amigo.",
              "なんで いきましたか。 — ¿En qué fuiste?",
              "バス で いきました。 — Fui en colectivo."
            ]
          }
        ]
      },
      {
        "id": "de-que-pais-sos",
        "title": "¿De qué país sos?",
        "titleJp": "おくに は どちら ですか",
        "blocks": [
          {
            "kind": "text",
            "text": "El tercer diálogo usa la forma formal de preguntar el país: どちら en vez de どこ, y おくに con el お de cortesía."
          },
          {
            "kind": "quote",
            "lines": [
              "おくに は どちら ですか。 — ¿De qué país es usted?",
              "アメリカ です。 — De Estados Unidos.",
              "そう ですか。いつ にほん へ きましたか。 — Ah, ¿sí? ¿Cuándo vino a Japón?",
              "きょねん の ９がつ に きました。 — Vine en septiembre del año pasado."
            ]
          },
          {
            "kind": "note",
            "tone": "⚠️",
            "text": "きょねん の ９がつ lleva の porque el año enmarca al mes. Y el に va al final de todo el bloque de fecha, no en el medio."
          }
        ]
      },
      {
        "id": "comprension-auditiva",
        "title": "Comprensión auditiva",
        "titleJp": "ちょうかい タスク",
        "blocks": [
          {
            "kind": "text",
            "text": "La segunda mitad de la clase fue escuchar. Cada tarea entrena una de las preguntas del だい5か."
          },
          {
            "kind": "table",
            "headers": [
              "Tarea",
              "Qué había que sacar"
            ],
            "rows": [
              [
                "どこ へ いきましたか。",
                "El lugar: としょかん, うち, ゆうびんきょく, びょういん, びじゅつかん"
              ],
              [
                "がくせい は なんで いきますか。",
                "El transporte de cada tramo: ひこうき, バス, しんかんせん, でんしゃ, ふね, あるいて"
              ],
              [
                "いつ いきますか。",
                "La fecha en el calendario de ２がつ"
              ],
              [
                "ミラーさん の せいかつ は どんな せいかつ ですか。",
                "Horarios, transporte y compañía, todo junto"
              ],
              [
                "たんじょうび は いつ ですか。",
                "がつ + にち de cada persona"
              ]
            ]
          },
          {
            "kind": "text",
            "text": "Dos palabras nuevas que aparecieron acá:"
          },
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "せいかつ",
                "seikatsu",
                "vida (la rutina de alguien)"
              ],
              [
                "どんな",
                "donna",
                "¿qué tipo de…?"
              ]
            ]
          },
          {
            "kind": "note",
            "tone": "📝",
            "text": "Tarea: みんな の にほんご — ４４ページ ５・６・７・８, ４６ページ ４, ４７ページ ５ と ６."
          }
        ]
      },
      {
        "id": "frases-esenciales",
        "title": "Frases esenciales",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "インド から きました。",
                "Indo kara kimashita.",
                "Vine de la India."
              ],
              [
                "いつ にほん へ きましたか？",
                "Itsu Nihon e kimashita ka?",
                "¿Cuándo viniste a Japón?"
              ],
              [
                "きょねん の ９がつ に きました。",
                "Kyonen no kugatsu ni kimashita.",
                "Vine en septiembre del año pasado."
              ],
              [
                "おくに は どちら ですか？",
                "Okuni wa dochira desu ka?",
                "¿De qué país es usted?"
              ],
              [
                "これ、おみやげ です。どうぞ。",
                "Kore, omiyage desu. Douzo.",
                "Esto es un souvenir. Tomá."
              ],
              [
                "どこも いきません。",
                "Doko mo ikimasen.",
                "No voy a ningún lado."
              ],
              [
                "かいしゃ の ひと と いきます。",
                "Kaisha no hito to ikimasu.",
                "Voy con gente de la empresa."
              ],
              [
                "ひとり で きました。",
                "Hitori de kimashita.",
                "Vine solo/a."
              ]
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "kurasu-19",
    "number": 19,
    "title": "La partícula を y los verbos del だい6か",
    "date": "2026-08-22",
    "topics": "repaso de いつ・だれと・なんで, las palabras que preguntan, la partícula を y el objeto directo, たべます・のみます・みます・ききます・よみます・かきます・かいます・とります・すいます, comida, bebidas, medios, lectura, sustantivo + (を) します.",
    "sections": [
      {
        "id": "repaso-de-la-tarea",
        "title": "Repaso de la tarea",
        "titleJp": "しゅくだい",
        "blocks": [
          {
            "kind": "text",
            "text": "La página 44 era practicar いつ con fechas, y だれと・なんで・なんじに en pasado."
          },
          {
            "kind": "quote",
            "lines": [
              "いつ さくらだいがく へ いきますか？ — ¿Cuándo vas a la universidad Sakura?",
              "９がつ １４にち に いきます。 — Voy el 14 de septiembre.",
              "いつ ひろしま へ いきますか？ — ¿Cuándo vas a Hiroshima?",
              "らいげつ いきます。 — Voy el mes que viene.",
              "だれ と にほん へ きましたか？ — ¿Con quién viniste a Japón?",
              "ひとり で きました。 — Vine solo.",
              "まいあさ なんで かいしゃ へ いきますか？ — ¿En qué vas a la empresa todas las mañanas?",
              "バス と でんしゃ で いきます。 — Voy en colectivo y tren."
            ]
          },
          {
            "kind": "note",
            "tone": "⚠️",
            "text": "らいげつ, らいしゅう y こんしゅう no llevan に; ９がつ１４にち sí. La regla es la de siempre: solo las fechas y horas exactas llevan に."
          },
          {
            "kind": "note",
            "tone": "💡",
            "text": "Cuando combinás dos transportes, と une los dos sustantivos y で va una sola vez al final: バス と でんしゃ で."
          }
        ]
      },
      {
        "id": "las-palabras-que-preguntan",
        "title": "Las palabras que preguntan",
        "titleJp": "ぎもんし",
        "blocks": [
          {
            "kind": "text",
            "text": "La página 46 era completar el hueco con la pregunta correcta. Este es el juego completo hasta ahora."
          },
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "いつ",
                "itsu",
                "¿cuándo?"
              ],
              [
                "だれ",
                "dare",
                "¿quién?"
              ],
              [
                "どこ",
                "doko",
                "¿dónde? / ¿a dónde?"
              ],
              [
                "いくら",
                "ikura",
                "¿cuánto cuesta?"
              ],
              [
                "なん",
                "nan",
                "¿qué? / ¿en qué? (con で)"
              ],
              [
                "なんじ",
                "nanji",
                "¿a qué hora?"
              ],
              [
                "なんがつ",
                "nangatsu",
                "¿qué mes?"
              ],
              [
                "なんにち",
                "nannichi",
                "¿qué día del mes?"
              ]
            ]
          },
          {
            "kind": "text",
            "text": "Y la página 47 era al revés: dada la oración, poner la partícula."
          },
          {
            "kind": "quote",
            "lines": [
              "ことし の ４がつ に アメリカ へ きました。 — Vine a Estados Unidos en abril de este año.",
              "まいにち でんしゃ で かいしゃ へ いきます。 — Todos los días voy a la empresa en tren.",
              "けさ わたし は まつもとさん と ここ へ きました。 — Esta mañana vine acá con Matsumoto.",
              "おととい どこ も いきません でした。 — Anteayer no fui a ningún lado."
            ]
          }
        ]
      },
      {
        "id": "la-particula",
        "title": "La partícula を",
        "blocks": [
          {
            "kind": "text",
            "text": "を marca el objeto directo de la oración: la cosa que recibe la acción."
          },
          {
            "kind": "note",
            "tone": "⚠️",
            "text": "を se lee \"o\", no \"wo\". Se escribe distinto de お porque es partícula, igual que は se lee \"wa\" y へ se lee \"e\"."
          },
          {
            "kind": "text",
            "text": "La forma de darse cuenta de que hace falta un objeto directo es preguntarle \"¿qué?\" al verbo. \"Yamada come\" queda coja: falta información."
          },
          {
            "kind": "quote",
            "lines": [
              "やまださん は ケーキ を たべます。 — Yamada come una torta."
            ]
          },
          {
            "kind": "text",
            "text": "Todo verbo que necesita un objeto directo para entenderse del todo es un verbo transitivo. Los nueve de esta clase lo son."
          },
          {
            "kind": "quote",
            "lines": [
              "[persona] は [cosa] を [verbo]。"
            ]
          }
        ]
      },
      {
        "id": "las-cuatro-formas",
        "title": "Las cuatro formas",
        "titleJp": "los verbos del だい6か",
        "blocks": [
          {
            "kind": "text",
            "text": "Se conjugan con las reglas de grupo que ya vimos: たべる y みる son grupo 2 (se les cae る), する es grupo 3, y el resto es grupo 1 (la U final pasa a I)."
          },
          {
            "kind": "table",
            "headers": [
              "Infinitivo",
              "Significado",
              "ます(+)",
              "ます(−)",
              "ました(+)",
              "ました(−)"
            ],
            "rows": [
              [
                "たべる",
                "comer",
                "たべます",
                "たべません",
                "たべました",
                "たべませんでした"
              ],
              [
                "のむ",
                "beber",
                "のみます",
                "のみません",
                "のみました",
                "のみませんでした"
              ],
              [
                "みる",
                "ver / mirar",
                "みます",
                "みません",
                "みました",
                "みませんでした"
              ],
              [
                "きく",
                "escuchar",
                "ききます",
                "ききません",
                "ききました",
                "ききませんでした"
              ],
              [
                "よむ",
                "leer",
                "よみます",
                "よみません",
                "よみました",
                "よみませんでした"
              ],
              [
                "かく",
                "escribir",
                "かきます",
                "かきません",
                "かきました",
                "かきませんでした"
              ],
              [
                "かう",
                "comprar",
                "かいます",
                "かいません",
                "かいました",
                "かいませんでした"
              ],
              [
                "とる",
                "sacar una foto",
                "とります",
                "とりません",
                "とりました",
                "とりませんでした"
              ],
              [
                "すう",
                "inhalar / fumar",
                "すいます",
                "すいません",
                "すいました",
                "すいませんでした"
              ],
              [
                "する",
                "hacer",
                "します",
                "しません",
                "しました",
                "しませんでした"
              ]
            ]
          },
          {
            "kind": "note",
            "tone": "⚠️",
            "text": "とる termina en る pero es grupo 1, no 2. Por eso hace とります y no とます."
          }
        ]
      },
      {
        "id": "comer",
        "title": "Comer",
        "titleJp": "たべます",
        "blocks": [
          {
            "kind": "quote",
            "lines": [
              "りんご を たべます。 — Como una manzana.",
              "パン を たべます。 — Como pan."
            ]
          },
          {
            "kind": "text",
            "text": "ごはん es arroz cocido, pero también \"comida\" en general. Pegado a un momento del día arma las tres comidas."
          },
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "ごはん",
                "gohan",
                "arroz cocido / comida"
              ],
              [
                "あさごはん",
                "asagohan",
                "desayuno"
              ],
              [
                "ひるごはん",
                "hirugohan",
                "almuerzo"
              ],
              [
                "ばんごはん",
                "bangohan",
                "cena"
              ],
              [
                "パン",
                "pan",
                "pan"
              ],
              [
                "たまご",
                "tamago",
                "huevo"
              ],
              [
                "にく",
                "niku",
                "carne"
              ],
              [
                "ぎゅうにく",
                "gyuuniku",
                "carne de vaca"
              ],
              [
                "ぶたにく",
                "butaniku",
                "carne de cerdo"
              ],
              [
                "とりにく",
                "toriniku",
                "pollo"
              ],
              [
                "さかな",
                "sakana",
                "pescado"
              ],
              [
                "やさい",
                "yasai",
                "verduras"
              ],
              [
                "くだもの",
                "kudamono",
                "frutas"
              ]
            ]
          },
          {
            "kind": "note",
            "tone": "💡",
            "text": "Las carnes se arman igual que las comidas: el animal + にく. ぎゅう (vaca), ぶた (cerdo), とり (pájaro/pollo)."
          },
          {
            "kind": "subheading",
            "text": "くだもの — frutas"
          },
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "りんご",
                "ringo",
                "manzana"
              ],
              [
                "バナナ",
                "banana",
                "banana"
              ],
              [
                "みかん",
                "mikan",
                "mandarina"
              ],
              [
                "いちご",
                "ichigo",
                "frutilla"
              ],
              [
                "もも",
                "momo",
                "durazno"
              ],
              [
                "かき",
                "kaki",
                "caqui"
              ],
              [
                "ぶどう",
                "budou",
                "uva"
              ],
              [
                "すいか",
                "suika",
                "sandía"
              ],
              [
                "メロン",
                "meron",
                "melón"
              ],
              [
                "なし",
                "nashi",
                "pera japonesa"
              ],
              [
                "さくらんぼ",
                "sakuranbo",
                "cereza"
              ]
            ]
          },
          {
            "kind": "subheading",
            "text": "やさい — verduras"
          },
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "トマト",
                "tomato",
                "tomate"
              ],
              [
                "たまねぎ",
                "tamanegi",
                "cebolla"
              ],
              [
                "にんじん",
                "ninjin",
                "zanahoria"
              ],
              [
                "きゅうり",
                "kyuuri",
                "pepino"
              ],
              [
                "キャベツ",
                "kyabetsu",
                "repollo"
              ],
              [
                "はくさい",
                "hakusai",
                "repollo chino"
              ],
              [
                "ほうれんそう",
                "hourensou",
                "espinaca"
              ],
              [
                "だいこん",
                "daikon",
                "rábano japonés"
              ]
            ]
          },
          {
            "kind": "quote",
            "lines": [
              "あなた は なに を たべますか？ — ¿Vos qué comés?",
              "わたし は さかな を たべます。 — Yo como pescado."
            ]
          }
        ]
      },
      {
        "id": "beber",
        "title": "Beber",
        "titleJp": "のみます",
        "blocks": [
          {
            "kind": "quote",
            "lines": [
              "みず を のみます。 — Tomo agua.",
              "コーヒー を のみます。 — Tomo café."
            ]
          },
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "みず",
                "mizu",
                "agua"
              ],
              [
                "おちゃ",
                "ocha",
                "té verde"
              ],
              [
                "こうちゃ",
                "koucha",
                "té negro"
              ],
              [
                "ぎゅうにゅう",
                "gyuunyuu",
                "leche"
              ],
              [
                "ジュース",
                "juusu",
                "jugo"
              ],
              [
                "コーヒー",
                "koohii",
                "café"
              ],
              [
                "ビール",
                "biiru",
                "cerveza"
              ],
              [
                "おさけ",
                "osake",
                "sake / bebida alcohólica"
              ],
              [
                "ワイン",
                "wain",
                "vino"
              ]
            ]
          },
          {
            "kind": "note",
            "tone": "💡",
            "text": "おさけ con お es cualquier bebida alcohólica; sin お suele ser el sake de arroz. El お de cortesía también aparece en おちゃ y おはなし."
          },
          {
            "kind": "quote",
            "lines": [
              "あなた は なに を のみますか？ — ¿Vos qué tomás?"
            ]
          }
        ]
      },
      {
        "id": "ver",
        "title": "Ver",
        "titleJp": "みます",
        "blocks": [
          {
            "kind": "quote",
            "lines": [
              "DVD を みます。 — Miro un DVD."
            ]
          },
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "テレビ",
                "terebi",
                "televisión"
              ],
              [
                "えいが",
                "eiga",
                "película"
              ],
              [
                "ばんぐみ",
                "bangumi",
                "programa de TV"
              ],
              [
                "アニメ",
                "anime",
                "anime"
              ],
              [
                "ドラマ",
                "dorama",
                "serie / novela"
              ],
              [
                "ネットフリックス",
                "nettofurikkusu",
                "Netflix"
              ],
              [
                "ユーチューブ",
                "yuuchuubu",
                "YouTube"
              ],
              [
                "どうが",
                "douga",
                "video"
              ],
              [
                "ビデオ",
                "bideo",
                "video"
              ]
            ]
          },
          {
            "kind": "quote",
            "lines": [
              "あなた は なに を みますか？ — ¿Vos qué mirás?"
            ]
          }
        ]
      },
      {
        "id": "escuchar",
        "title": "Escuchar",
        "titleJp": "ききます",
        "blocks": [
          {
            "kind": "quote",
            "lines": [
              "CD を ききます。 — Escucho un CD."
            ]
          },
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "おんがく",
                "ongaku",
                "música"
              ],
              [
                "ラジオ",
                "rajio",
                "radio"
              ],
              [
                "スポティファイ",
                "supotifai",
                "Spotify"
              ],
              [
                "ニュース",
                "nyuusu",
                "noticias"
              ],
              [
                "おはなし",
                "ohanashi",
                "historia / lo que alguien cuenta"
              ],
              [
                "うわさ",
                "uwasa",
                "chisme / rumor"
              ]
            ]
          },
          {
            "kind": "quote",
            "lines": [
              "あなた は なに を ききますか？ — ¿Vos qué escuchás?"
            ]
          }
        ]
      },
      {
        "id": "leer-y-escribir",
        "title": "Leer y escribir",
        "titleJp": "よみます・かきます",
        "blocks": [
          {
            "kind": "quote",
            "lines": [
              "ほん を よみます。 — Leo un libro.",
              "ほん を かきます。 — Escribo un libro."
            ]
          },
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "てがみ",
                "tegami",
                "carta"
              ],
              [
                "レポート",
                "repooto",
                "informe"
              ],
              [
                "メール",
                "meeru",
                "mail"
              ],
              [
                "メッセージ",
                "messeeji",
                "mensaje"
              ],
              [
                "しんぶん",
                "shinbun",
                "diario / periódico"
              ],
              [
                "しょうせつ",
                "shousetsu",
                "novela"
              ],
              [
                "まんが",
                "manga",
                "manga"
              ],
              [
                "え",
                "e",
                "dibujo / pintura"
              ]
            ]
          },
          {
            "kind": "note",
            "tone": "💡",
            "text": "え va con かきます, no con つくります: un dibujo en japonés se \"escribe\"."
          },
          {
            "kind": "quote",
            "lines": [
              "あなた は なに を よみますか？ — ¿Vos qué leés?",
              "あなた は なに を かきますか？ — ¿Vos qué escribís?"
            ]
          }
        ]
      },
      {
        "id": "comprar-sacar-y-fumar",
        "title": "Comprar, sacar y fumar",
        "titleJp": "かいます・とります・すいます",
        "blocks": [
          {
            "kind": "text",
            "text": "Tres verbos más que se enganchan con を, cada uno con su objeto típico."
          },
          {
            "kind": "quote",
            "lines": [
              "じしょ を かいます。 — Compro un diccionario.",
              "しゃしん を とります。 — Saco una foto.",
              "ビデオ を とります。 — Grabo un video.",
              "タバコ を すいます。 — Fumo."
            ]
          },
          {
            "kind": "note",
            "tone": "💡",
            "text": "とる es \"tomar\" en el sentido de capturar: sirve para しゃしん, ビデオ y どうが. Y すう es literalmente \"inhalar\": fumar es タバコ を すいます."
          }
        ]
      },
      {
        "id": "sustantivo",
        "title": "Sustantivo + (を) します",
        "blocks": [
          {
            "kind": "text",
            "text": "El verbo する convierte sustantivos en acciones. La を va entre paréntesis porque en el habla cotidiana se saltea muy seguido."
          },
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "べんきょう します",
                "benkyou shimasu",
                "estudiar"
              ],
              [
                "しゅくだい します",
                "shukudai shimasu",
                "hacer la tarea"
              ],
              [
                "さんぽ します",
                "sanpo shimasu",
                "dar un paseo"
              ],
              [
                "でんわ します",
                "denwa shimasu",
                "hacer una llamada"
              ],
              [
                "かいもの します",
                "kaimono shimasu",
                "hacer las compras"
              ],
              [
                "せんたく します",
                "sentaku shimasu",
                "lavar la ropa"
              ],
              [
                "そうじ します",
                "souji shimasu",
                "limpiar"
              ]
            ]
          },
          {
            "kind": "text",
            "text": "También funciona con palabras extranjeras."
          },
          {
            "kind": "quote",
            "lines": [
              "サッカー を します。 — Juego al fútbol.",
              "テニス を します。 — Juego al tenis.",
              "ビデオゲーム を します。 — Juego videojuegos.",
              "パーティー を します。 — Hago una fiesta."
            ]
          },
          {
            "kind": "text",
            "text": "Y con onomatopeyas, que en japonés son palabras de pleno derecho."
          },
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "ドキドキ します",
                "dokidoki shimasu",
                "latir fuerte el corazón (nervios, amor, ansiedad)"
              ],
              [
                "ニコニコ します",
                "nikoniko shimasu",
                "sonreír"
              ],
              [
                "ワクワク します",
                "wakuwaku shimasu",
                "estar entusiasmado"
              ],
              [
                "キラキラ します",
                "kirakira shimasu",
                "brillar"
              ]
            ]
          },
          {
            "kind": "note",
            "tone": "📝",
            "text": "Tarea: みんな の にほんご — ５１ページ １ と ２ と ３."
          }
        ]
      },
      {
        "id": "frases-esenciales",
        "title": "Frases esenciales",
        "blocks": [
          {
            "kind": "table",
            "headers": [
              "Japonés",
              "Romaji",
              "Español"
            ],
            "rows": [
              [
                "なに を たべますか？",
                "Nani o tabemasu ka?",
                "¿Qué comés?"
              ],
              [
                "あさごはん を たべました。",
                "Asagohan o tabemashita.",
                "Desayuné."
              ],
              [
                "おちゃ を のみます。",
                "Ocha o nomimasu.",
                "Tomo té verde."
              ],
              [
                "ビール を のみません。",
                "Biiru o nomimasen.",
                "No tomo cerveza."
              ],
              [
                "えいが を みます。",
                "Eiga o mimasu.",
                "Miro una película."
              ],
              [
                "おんがく を ききます。",
                "Ongaku o kikimasu.",
                "Escucho música."
              ],
              [
                "しんぶん を よみましたか？",
                "Shinbun o yomimashita ka?",
                "¿Leíste el diario?"
              ],
              [
                "しゃしん を とります。",
                "Shashin o torimasu.",
                "Saco una foto."
              ],
              [
                "しゅくだい を します。",
                "Shukudai o shimasu.",
                "Hago la tarea."
              ],
              [
                "タバコ を すいません。",
                "Tabako o suimasen.",
                "No fumo."
              ]
            ]
          }
        ]
      }
    ]
  }
];
